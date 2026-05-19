"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const EXPIRY_MINUTES = 15;

function VerifyMfaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const supabase = createClient();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_MINUTES * 60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isExpired = secondsLeft === 0;

  function handleInput(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    const token = code.join("");
    if (token.length !== 6) { toast.error("Introduz os 6 dígitos."); return; }
    if (!email) { toast.error("Email em falta. Volta ao login."); return; }
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (error) {
      toast.error("Código inválido ou expirado. Tenta novamente.");
      setCode(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    } else {
      toast.success("Verificação concluída! Bem-vindo de volta.");
      router.push("/dashboard");
    }
    setVerifying(false);
  }

  async function handleResend() {
    if (!email) return;
    setResending(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    if (error) {
      toast.error("Erro ao reenviar. Tenta mais tarde.");
    } else {
      setSecondsLeft(EXPIRY_MINUTES * 60);
      setCode(["", "", "", "", "", ""]);
      toast.success("Novo código enviado para o teu email!");
    }
    setResending(false);
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <span className="text-5xl">🔐</span>
        <h1 className="mt-4 text-2xl font-black text-white">Verificação em dois passos</h1>
        <p className="mt-2 text-sm text-slate-400">
          Código enviado para<br />
          <span className="font-semibold text-teal-400">{email || "o teu email"}</span>
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm shadow-2xl">
        <div className={`mb-6 text-center text-sm font-medium ${isExpired ? "text-red-400" : "text-slate-400"}`}>
          {isExpired ? "⏰ Código expirado — reenviar para continuar" : (
            <>Expira em <span className="font-bold text-white">{minutes}:{seconds.toString().padStart(2, "0")}</span></>
          )}
        </div>

        <div className="flex justify-center gap-3">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={isExpired}
              className="h-14 w-12 rounded-xl border border-white/20 bg-white/10 text-center text-xl font-bold text-white focus:border-teal-400 focus:outline-none disabled:opacity-40 transition"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={verifying || isExpired || code.join("").length < 6}
          className="mt-6 w-full rounded-xl bg-teal-500 py-3 font-bold text-white transition hover:bg-teal-400 disabled:opacity-50"
        >
          {verifying ? "A verificar..." : "Verificar código"}
        </button>

        <div className="mt-4 text-center">
          <button onClick={handleResend} disabled={resending} className="text-sm text-slate-400 hover:text-white transition disabled:opacity-50">
            {resending ? "A enviar..." : "Não recebi o código — reenviar"}
          </button>
        </div>
        <div className="mt-4 text-center">
          <a href="/auth/login" className="text-xs text-slate-500 hover:text-slate-300 transition">← Voltar ao login</a>
        </div>
      </div>
    </div>
  );
}

export default function VerifyMfaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-4">
      <Suspense fallback={<div className="text-white">A carregar...</div>}>
        <VerifyMfaForm />
      </Suspense>
    </div>
  );
}
