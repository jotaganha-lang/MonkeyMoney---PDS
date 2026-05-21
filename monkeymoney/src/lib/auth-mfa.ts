import type { SupabaseClient } from "@supabase/supabase-js";

/** Comprimento do OTP no Supabase (Auth → Email → OTP length: 6 ou 8). */
export const EMAIL_OTP_LENGTH = Number(process.env.NEXT_PUBLIC_EMAIL_OTP_LENGTH) || 8;

/**
 * Envia código MFA por email (6 ou 8 dígitos, conforme o projeto Supabase).
 * O template "Magic Link" no Supabase deve usar {{ .Token }} e NÃO {{ .ConfirmationURL }}.
 * Ver: supabase/email-template-mfa-otp.html
 */
export async function sendMfaOtpEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      // Sem emailRedirectTo → com template correto, o email traz só o código de 6 dígitos.
    },
  });

  return { error: error ? new Error(error.message) : null };
}
