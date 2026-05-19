"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo de 8 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const { data, error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      toast.error("Email ou password incorretos.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("mfa_enabled")
      .eq("id", data.user.id)
      .single();

    if (profile?.mfa_enabled) {
      await supabase.auth.signOut();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: { shouldCreateUser: false },
      });

      if (otpError) {
        toast.error("Erro ao enviar código. Tenta novamente.");
        return;
      }

      toast.success("Código enviado para o teu email! Tens 15 minutos.");
      router.push(`/auth/verify-mfa?email=${encodeURIComponent(values.email)}`);
      return;
    }

    toast.success("Login efetuado com sucesso!");
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center premium-gradient p-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white p-2 shadow-xl">
              <Image src="/logo.png" alt="MonkeyMoney" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white">
                Monkey<span className="text-emerald-400">Money</span>
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-400">Bem-vindo de volta à tua liberdade.</p>
            </div>
          </Link>
        </div>
        
        <div className="glass-card overflow-hidden rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold tracking-wide text-slate-300">Email</label>
              <input
                {...register("email")}
                placeholder="o.teu@email.com"
                className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-white placeholder-slate-600 transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none"
              />
              {errors.email && <p className="mt-2 text-xs font-medium text-rose-400">{errors.email.message}</p>}
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label className="mb-2 block text-sm font-bold tracking-wide text-slate-300">Password</label>
                <Link href="/auth/forgot-password" rounded-lg className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Esqueceste-te?
                </Link>
              </div>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-white placeholder-slate-600 transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none"
              />
              {errors.password && <p className="mt-2 text-xs font-medium text-rose-400">{errors.password.message}</p>}
            </div>

            <button
              disabled={isSubmitting}
              className="group relative w-full overflow-hidden rounded-2xl bg-emerald-500 py-4 text-lg font-black text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] disabled:opacity-50"
            >
              <span className="relative z-10">{isSubmitting ? "A autenticar..." : "Entrar na conta"}</span>
            </button>

            <div className="text-center">
              <p className="text-sm font-medium text-slate-400">
                Não tens conta?{" "}
                <Link href="/auth/register" className="font-bold text-white hover:text-emerald-400 transition-colors">
                  Cria uma aqui
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
