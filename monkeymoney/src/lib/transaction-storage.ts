import type { SupabaseClient } from "@supabase/supabase-js";

export type Transaction = {
  id: string;
  title: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  paymentMethod: string;
  date: string;
  description?: string;
};

const LEGACY_KEY = "mm_transactions";

function localKey(userId: string | null): string {
  return userId ? `${LEGACY_KEY}_${userId}` : LEGACY_KEY;
}

type StoredMeta = { category: string; notes: string };

function encodeDescription(category: string, notes?: string): string | null {
  const payload: StoredMeta = { category, notes: notes?.trim() ?? "" };
  if (!payload.notes && !payload.category) return null;
  return JSON.stringify(payload);
}

function decodeDescription(raw: string | null | undefined): StoredMeta {
  if (!raw) return { category: "Outros", notes: "" };
  try {
    const parsed = JSON.parse(raw) as Partial<StoredMeta>;
    if (typeof parsed.category === "string") {
      return { category: parsed.category, notes: parsed.notes ?? "" };
    }
  } catch {
    /* legacy plain-text description */
  }
  return { category: "Outros", notes: raw };
}

export function loadTransactionsLocal(userId: string | null): Transaction[] {
  if (typeof window === "undefined") return [];

  const key = localKey(userId);
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as Transaction[];
  } catch {
    /* ignore */
  }

  // Migrate data saved before per-user keys existed
  if (userId) {
    try {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy) as Transaction[];
        localStorage.setItem(key, legacy);
        localStorage.removeItem(LEGACY_KEY);
        return parsed;
      }
    } catch {
      /* ignore */
    }
  }

  return [];
}

export function saveTransactionsLocal(userId: string | null, txs: Transaction[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(localKey(userId), JSON.stringify(txs));
}

export async function loadTransactionsFromSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("id, type, amount, title, description, transaction_date, payment_method")
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const meta = decodeDescription(row.description);
    return {
      id: row.id,
      title: row.title,
      type: row.type as Transaction["type"],
      amount: Number(row.amount),
      category: meta.category,
      paymentMethod: row.payment_method ?? "",
      date: row.transaction_date,
      description: meta.notes || undefined,
    };
  });
}

export async function syncTransactionsToSupabase(
  supabase: SupabaseClient,
  userId: string,
  txs: Transaction[],
): Promise<void> {
  const { data: existing, error: fetchError } = await supabase
    .from("transactions")
    .select("id")
    .eq("user_id", userId);

  if (fetchError) return;

  const existingIds = new Set((existing ?? []).map((r) => r.id));
  const nextIds = new Set(txs.map((t) => t.id));

  const toDelete = [...existingIds].filter((id) => !nextIds.has(id));
  if (toDelete.length > 0) {
    await supabase.from("transactions").delete().eq("user_id", userId).in("id", toDelete);
  }

  if (txs.length === 0) return;

  const rows = txs.map((tx) => ({
    id: tx.id,
    user_id: userId,
    type: tx.type,
    amount: tx.amount,
    title: tx.title,
    description: encodeDescription(tx.category, tx.description),
    transaction_date: tx.date,
    payment_method: tx.paymentMethod,
  }));

  await supabase.from("transactions").upsert(rows, { onConflict: "id" });
}

export async function loadTransactions(
  supabase: SupabaseClient,
  userId: string | null,
): Promise<Transaction[]> {
  const local = loadTransactionsLocal(userId);

  if (!userId) return local;

  try {
    const remote = await loadTransactionsFromSupabase(supabase, userId);
    if (remote.length > 0) {
      saveTransactionsLocal(userId, remote);
      return remote;
    }
    if (local.length > 0) {
      await syncTransactionsToSupabase(supabase, userId, local);
      return local;
    }
    return [];
  } catch {
    return local;
  }
}

export async function persistTransactions(
  supabase: SupabaseClient,
  userId: string | null,
  txs: Transaction[],
): Promise<void> {
  saveTransactionsLocal(userId, txs);
  if (!userId) return;
  try {
    await syncTransactionsToSupabase(supabase, userId, txs);
  } catch {
    /* keep local copy even if remote sync fails */
  }
}
