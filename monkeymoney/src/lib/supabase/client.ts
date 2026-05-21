"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url.includes("placeholder") || !key || key.includes("placeholder")) {
    console.error(
      "⚠️ ERRO DE CONFIGURAÇÃO SUPABASE:\n" +
      "O URL ou a Anon Key do Supabase não foram carregados corretamente!\n" +
      "Por favor, verifica se o ficheiro '.env.local' está configurado e se REINICIASTE o servidor (Ctrl+C e 'npm run dev')."
    );
  }

  return createBrowserClient(
    url ?? "https://placeholder.supabase.co",
    key ?? "public-anon-key-placeholder",
  );
}
