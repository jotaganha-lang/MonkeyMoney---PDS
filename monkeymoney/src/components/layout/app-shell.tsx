"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/transactions", label: "Movimentos", icon: "💸" },
  { href: "/goals", label: "Metas", icon: "🎯" },
  { href: "/budget", label: "Orçamento", icon: "📋" },
  { href: "/simulator", label: "Simulador", icon: "🧮" },
  { href: "/learn", label: "Aprender", icon: "📚" },
  { href: "/quiz", label: "Quiz", icon: "🏆" },
  { href: "/profile", label: "Perfil", icon: "👤" },
  { href: "/security", label: "Segurança", icon: "🔒" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão terminada com sucesso.");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-900">
              Monkey<span className="text-teal-600">Money</span>
            </span>
          </Link>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-5 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="md:sticky md:top-20 md:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <nav className="space-y-0.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    pathname === link.href
                      ? "bg-teal-700 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Credits */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-center text-xs text-slate-400 leading-relaxed">
                Criado por<br />
                <span className="text-teal-600 font-medium">João Andrade n.º13</span><br />
                <span className="text-teal-600 font-medium">Julien Manolico n.º14</span><br />
                <span className="text-teal-600 font-medium">Lucas Uchôa n.º16</span><br />
                <span className="font-semibold text-slate-500">Turma 12.ºP</span>
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
