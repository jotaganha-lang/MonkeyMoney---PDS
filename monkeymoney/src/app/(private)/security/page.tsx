"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SecurityPage() {
  const supabase = createClient();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("mfa_enabled")
        .eq("id", user.id)
        .single();

      setMfaEnabled(profile?.mfa_enabled ?? false);
      setLoading(false);
    }
    load();
  }, []);

  async function toggleMfa() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const newValue = !mfaEnabled;
    const { error } = await supabase
      .from("profiles")
      .update({ mfa_enabled: newValue })
      .eq("id", user.id);

    if (error) {
      toast.error("Erro ao guardar. Certifica-te que executaste o SQL no Supabase.");
    } else {
      setMfaEnabled(newValue);
      toast.success(newValue ? "MFA ativado! No próximo login receberás um código por email." : "MFA desativado.");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Segurança</h1>

      {/* MFA Card */}
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900">Verificação em dois passos (MFA)</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quando ativado, cada login exige um código de 6 dígitos enviado para <strong>{userEmail || "o teu email"}</strong>.
              O código expira em 15 minutos.
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${mfaEnabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
            {loading ? "..." : mfaEnabled ? "Ativo" : "Inativo"}
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Como funciona</p>
          <ol className="space-y-1 text-sm text-slate-600 list-decimal list-inside">
            <li>Fazes login com email e password normalmente</li>
            <li>Recebemos automaticamente um código único para o teu email</li>
            <li>Introduzes o código de 6 dígitos (válido 15 min)</li>
            <li>Acedes à conta em segurança 🔒</li>
          </ol>
        </div>

        <button
          onClick={toggleMfa}
          disabled={loading || saving}
          className={`mt-5 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition ${
            mfaEnabled
              ? "bg-red-500 hover:bg-red-400"
              : "bg-teal-700 hover:bg-teal-600"
          } disabled:opacity-50`}
        >
          {saving ? "A guardar..." : mfaEnabled ? "Desativar MFA" : "Ativar MFA"}
        </button>
      </article>

      {/* Password info */}
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Alterar password</h2>
        <p className="mt-1 text-sm text-slate-500">
          Para alterar a tua password, utiliza a opção "Esqueci-me da password" na página de login.
          Receberás um email com instruções.
        </p>
        <a
          href="/auth/forgot-password"
          className="mt-4 inline-block rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Ir para redefinição de password →
        </a>
      </article>

      {/* Tips */}
      <article className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
        <h2 className="font-bold text-teal-800">💡 Dicas de segurança</h2>
        <ul className="mt-2 space-y-1 text-sm text-teal-700">
          <li>• Usa uma password única e forte (mínimo 12 caracteres)</li>
          <li>• Ativa sempre o MFA em contas financeiras</li>
          <li>• Nunca partilhes a tua password com ninguém</li>
          <li>• Fecha sempre a sessão em dispositivos partilhados</li>
        </ul>
      </article>
    </div>
  );
}
