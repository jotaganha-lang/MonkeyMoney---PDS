"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadTransactions,
  loadTransactionsLocal,
  persistTransactions,
  type Transaction,
} from "@/lib/transaction-storage";
import { useAuth } from "@/hooks/use-auth";

export function useTransactions() {
  const { user, loading: authLoading, supabase } = useAuth();
  const userId = user?.id ?? null;
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    if (authLoading) return;
    const data = userId
      ? await loadTransactions(supabase, userId)
      : loadTransactionsLocal(null);
    setTxs(data);
    setReady(true);
  }, [authLoading, supabase, userId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key?.startsWith("mm_transactions")) return;
      reload();
    };
    const onFocus = () => reload();

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [reload]);

  const save = useCallback(
    async (next: Transaction[]) => {
      setTxs(next);
      await persistTransactions(supabase, userId, next);
    },
    [supabase, userId],
  );

  return { txs, setTxs: save, ready, reload, authLoading };
}
