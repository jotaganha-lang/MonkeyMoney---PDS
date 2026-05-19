import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen premium-gradient selection:bg-emerald-500/30">
      {/* Nav */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white p-1">
            <Image src="/logo.png" alt="MonkeyMoney" fill className="object-contain" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">
            Monkey<span className="text-emerald-400">Money</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95"
          >
            Criar conta
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-8 pt-12 pb-32">
        <div className="relative grid items-center gap-16 lg:grid-cols-2">
          {/* Left Column */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Educação Financeira de Próxima Geração
            </div>
            
            <h1 className="mt-8 text-6xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-7xl">
              Domina o teu <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                futuro financeiro.
              </span>
            </h1>
            
            <p className="mt-8 max-w-lg text-xl leading-relaxed text-slate-400">
              A MonkeyMoney é a plataforma definitiva para jovens aprenderem a gerir, 
              poupar e investir com inteligência. Simples, poderosa e gratuita.
            </p>
            
            <div className="mt-12 flex flex-wrap gap-6">
              <Link
                href="/auth/register"
                className="group relative flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-bold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]"
              >
                Começar agora
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
              >
                Ver Dashboard
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-12">
              {[
                { label: "Conteúdos", value: "12+" },
                { label: "Quiz Questions", value: "15+" },
                { label: "Ferramentas", value: "8+" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-bold text-white">{s.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="absolute -inset-10 bg-emerald-500/20 blur-[120px] rounded-full"></div>
            <div className="glass-card relative overflow-hidden rounded-[40px] p-8">
              <div className="relative h-[480px] w-full">
                <Image
                  src="/logo.png"
                  alt="MonkeyMoney Platform"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Floating Element 1 */}
              <div className="absolute top-10 right-10 animate-bounce transition-all duration-1000">
                <div className="glass-card rounded-2xl px-6 py-4">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-tight">Poupança Mensal</p>
                  <p className="text-2xl font-black text-white">+€420.00</p>
                </div>
              </div>

              {/* Floating Element 2 */}
              <div className="absolute bottom-10 left-10 delay-300">
                <div className="glass-card rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <p className="text-sm font-semibold text-white">Literacia Nível 5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-40">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white">Tudo o que precisas para crescer.</h2>
            <p className="mt-4 text-slate-400">Ferramentas desenhadas para a nova geração de investidores.</p>
          </div>
          
          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "📊", title: "Smart Dashboard", desc: "Controlo total sobre as tuas finanças em tempo real." },
              { icon: "📈", title: "Simulador Pro", desc: "Visualiza o poder dos juros compostos com precisão." },
              { icon: "🎯", title: "Metas Dinâmicas", desc: "Alcança os teus objetivos com trackers inteligentes." },
              { icon: "🎓", title: "Academia", desc: "Aprende com especialistas em artigos simplificados." },
            ].map((f) => (
              <div key={f.title} className="glass-card group relative overflow-hidden rounded-3xl p-8 transition-all hover:-translate-y-2">
                <div className="absolute -right-4 -top-4 text-6xl opacity-10 transition-transform group-hover:scale-125">{f.icon}</div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl">{f.icon}</div>
                <h3 className="text-xl font-bold text-white">{f.title}</h3>
                <p className="mt-4 leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-white p-1">
                  <Image src="/logo.png" alt="MonkeyMoney" fill className="object-contain" />
                </div>
                <span className="text-xl font-bold text-white">MonkeyMoney</span>
              </div>
              <p className="mt-4 text-sm text-slate-500">Transformando a literacia financeira em Portugal.</p>
            </div>
            
            <div className="text-center lg:text-right">
              <p className="text-sm font-medium text-slate-400">
                Criado por <span className="text-emerald-400">João, Julien & Lucas</span>
              </p>
              <p className="mt-1 text-xs text-slate-600">Turma 12.ºP · Projeto PDS 2026</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
