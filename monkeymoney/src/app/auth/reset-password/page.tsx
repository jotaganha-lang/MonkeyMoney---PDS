"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when the user arrives via the email link
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("A password deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As passwords não coincidem.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error("Erro ao atualizar a password: " + error.message);
      return;
    }
    toast.success("Password atualizada com sucesso!");
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white">
            Monkey<span className="text-teal-400">Money</span>
          </h1>
          <p className="mt-2 text-slate-400">Define a tua nova password</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          {!isReady ? (
            /* Waiting for recovery token */
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10 text-3xl">
                🔑
              </div>
              <p className="text-slate-300 font-medium">
                A verificar o link de recuperação…
              </p>
              <p className="text-sm text-slate-500">
                Se esta mensagem persistir, o link pode ter expirado ou já foi
                utilizado.
              </p>
              <Link
                href="/auth/forgot-password"
                className="mt-2 inline-block rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-teal-400"
              >
                Solicitar novo link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Nova password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-slate-500 transition focus:border-teal-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Confirmar password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-slate-500 transition focus:border-teal-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-teal-500 py-3 font-bold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-400 hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? "A guardar…" : "Atualizar password"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-slate-400">
          <Link
            href="/auth/login"
            className="text-teal-400 transition hover:text-teal-300"
          >
            ← Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}
