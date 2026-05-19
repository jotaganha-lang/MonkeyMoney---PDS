"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const schema = z
  .object({
    fullName: z.string().min(2, "Nome obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo de 8 caracteres"),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "As passwords não coincidem",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { full_name: values.fullName } },
    });

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Conta criada! Verifica o email para confirmar.");
    reset();
    router.push("/auth/login");
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
              <p className="mt-2 text-sm font-medium text-slate-400">Cria a tua conta e começa a poupar.</p>
            </div>
          </Link>
        </div>

        <div className="glass-card overflow-hidden rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-300">Nome completo</label>
              <input
                {...register("fullName")}
                placeholder="O teu nome"
                className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-3.5 text-white placeholder-slate-600 transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none"
              />
              {errors.fullName && <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.fullName.message}</p>}
            </div>
            
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-300">Email</label>
              <input
                {...register("email")}
                placeholder="o.teu@email.com"
                className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-3.5 text-white placeholder-slate-600 transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none"
              />
              {errors.email && <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-300">Password</label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-3.5 text-white placeholder-slate-600 transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none"
              />
              {errors.password && <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-300">Confirmar password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-3.5 text-white placeholder-slate-600 transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none"
              />
              {errors.confirmPassword && <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.confirmPassword.message}</p>}
            </div>

            <button
              disabled={isSubmitting}
              className="mt-4 w-full rounded-2xl bg-emerald-500 py-4 text-lg font-black text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] disabled:opacity-50"
            >
              {isSubmitting ? "A criar conta..." : "Criar conta gratuita"}
            </button>

            <p className="mt-6 text-center text-sm font-medium text-slate-400">
              Já tens conta?{" "}
              <Link href="/auth/login" className="font-bold text-white hover:text-emerald-400 transition-colors">
                Fazer login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
�P
        </p>
      </div>
    </div>
  );
}
