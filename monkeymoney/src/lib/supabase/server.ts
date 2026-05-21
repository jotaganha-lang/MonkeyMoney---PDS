import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url.includes("placeholder") || !key || key.includes("placeholder")) {
    console.error(
      "⚠️ ERRO DE CONFIGURAÇÃO SUPABASE (SERVER):\n" +
      "O URL ou a Anon Key do Supabase não foram carregados corretamente!\n" +
      "Por favor, verifica se o ficheiro '.env.local' está configurado e se REINICIASTE o servidor (Ctrl+C e 'npm run dev')."
    );
  }

  return createServerClient(
    url ?? "https://placeholder.supabase.co",
    key ?? "public-anon-key-placeholder",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}
