import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Callback quando o utilizador clica num link do email (fluxo antigo).
 * Com o template OTP correto, o login faz-se em /auth/verify-mfa com o código de 6 dígitos.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createServerSupabaseClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const email = searchParams.get("email") ?? "";
  const params = new URLSearchParams();
  if (email) params.set("email", email);
  params.set("error", "link_invalid");
  return NextResponse.redirect(`${origin}/auth/verify-mfa?${params.toString()}`);
}
