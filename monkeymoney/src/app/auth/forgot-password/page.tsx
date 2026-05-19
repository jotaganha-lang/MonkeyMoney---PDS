"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Introduz o teu email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // ✅ Corrected: redirects to the actual password-reset page, not login
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white">
            Monkey<span className="text-teal-400">Money</span>
          </h1>
          <p className="mt-2 text-slate-400">Recuperação de password</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          {sent ? (
            /* Success state */
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10 text-3xl">
                📬
              </div>
              <h2 className="text-lg font-bold text-white">Email enviado!</h2>
              <p className="text-sm text-slate-400">
                Enviámos um link de recuperação para{" "}
                <span className="font-semibold text-teal-400">{email}</span>.
                Verifica a tua caixa de entrada (e a pasta de spam).
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-2 text-sm text-slate-500 underline transition hover:text-slate-300"
              >
                Reenviar para outro email
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={sendRecovery} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Email da tua conta
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="o.teu@email.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-slate-500 transition focus:border-teal-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-teal-500 py-3 font-bold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-400 hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? "A enviar…" : "Enviar link de recuperação"}
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
