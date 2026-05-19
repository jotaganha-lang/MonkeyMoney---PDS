"use client";

import { useState } from "react";

type Question = {
  id: string;
  category: "basico" | "poupanca" | "investimento";
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const categoryLabels = { basico: "Básico", poupanca: "Poupança", investimento: "Investimento" };
const categoryColors = {
  basico: "bg-blue-100 text-blue-700",
  poupanca: "bg-teal-100 text-teal-700",
  investimento: "bg-purple-100 text-purple-700",
};

const questions: Question[] = [
  // Básico
  {
    id: "1", category: "basico",
    question: "O que é uma reserva de emergência?",
    options: ["Dinheiro para férias", "Fundo para imprevistos", "Investimento de risco alto", "Crédito fácil do banco"],
    correct: 1,
    explanation: "A reserva de emergência cobre despesas inesperadas (perda de emprego, saúde) sem recorrer a dívida. Deve cobrir 3-6 meses de despesas.",
  },
  {
    id: "2", category: "basico",
    question: "Qual a diferença entre necessidade e desejo?",
    options: ["Não existe diferença", "Necessidade é sempre luxo", "Necessidade é essencial, desejo é opcional", "Desejo é obrigatório"],
    correct: 2,
    explanation: "Necessidade é algo essencial à sobrevivência (comida, habitação, saúde). Desejo melhora a vida mas não é estritamente necessário.",
  },
  {
    id: "3", category: "basico",
    question: "O que significa inflação?",
    options: ["Aumento do valor do dinheiro", "Diminuição dos preços", "Aumento geral dos preços", "Redução do desemprego"],
    correct: 2,
    explanation: "A inflação é o aumento geral e contínuo dos preços, o que significa que o poder de compra do dinheiro diminui ao longo do tempo.",
  },
  {
    id: "4", category: "basico",
    question: "O que é um orçamento mensal?",
    options: ["Lista de desejos", "Plano de receitas e despesas", "Estratégia de investimento", "Relatório fiscal anual"],
    correct: 1,
    explanation: "Um orçamento mensal é um plano que organiza as tuas receitas e despesas, ajudando a controlar o dinheiro e a poupar.",
  },
  {
    id: "5", category: "basico",
    question: "Na regra dos 50/30/20, os 20% destinam-se a:",
    options: ["Lazer e entretenimento", "Habitação e transportes", "Poupança e pagamento de dívidas", "Alimentação e saúde"],
    correct: 2,
    explanation: "Na regra 50/30/20: 50% para necessidades, 30% para desejos e 20% para poupança e pagamento de dívidas.",
  },
  // Poupança
  {
    id: "6", category: "poupanca",
    question: "Quanto tempo deve cobrir uma reserva de emergência ideal?",
    options: ["1 semana", "1 mês", "3 a 6 meses", "2 anos"],
    correct: 2,
    explanation: "A reserva de emergência ideal deve cobrir entre 3 e 6 meses de despesas essenciais, garantindo estabilidade em situações de crise.",
  },
  {
    id: "7", category: "poupanca",
    question: "O que são juros compostos?",
    options: ["Juros só sobre o capital inicial", "Juros que crescem linearmente", "Juros sobre capital + juros acumulados", "Taxa fixa sem variação"],
    correct: 2,
    explanation: "Juros compostos calculam-se sobre o capital inicial E os juros já acumulados, criando crescimento exponencial ao longo do tempo.",
  },
  {
    id: "8", category: "poupanca",
    question: "O que significa 'pagar-te a ti próprio primeiro'?",
    options: ["Gastar antes de pagar contas", "Poupar automaticamente antes de gastar", "Pagar dívidas em último", "Comprar o que queres primeiro"],
    correct: 1,
    explanation: "Significa transferir automaticamente para poupança assim que recebes o salário, antes de qualquer outra despesa.",
  },
  {
    id: "9", category: "poupanca",
    question: "Qual o melhor momento para começar a poupar?",
    options: ["Quando ganharmos mais", "Após os 40 anos", "O mais cedo possível", "Apenas na reforma"],
    correct: 2,
    explanation: "Graças aos juros compostos, quanto mais cedo começares, maior o crescimento. Mesmo pequenas quantias fazem grande diferença décadas depois.",
  },
  {
    id: "10", category: "poupanca",
    question: "Onde deve ser guardada a reserva de emergência?",
    options: ["Em investimentos de alto risco", "Em conta corrente normal", "Em conta poupança separada e acessível", "Em cash em casa"],
    correct: 2,
    explanation: "A reserva de emergência deve estar numa conta poupança separada (para não gastar por impulso) com fácil acesso em caso de necessidade.",
  },
  // Investimento
  {
    id: "11", category: "investimento",
    question: "O que é um ETF?",
    options: ["Um tipo de cartão de crédito", "Fundo que replica um índice de mercado", "Conta poupança do estado", "Empréstimo bancário especial"],
    correct: 1,
    explanation: "ETF (Exchange-Traded Fund) é um fundo que replica um índice (ex: S&P 500), oferecendo diversificação automática a baixo custo.",
  },
  {
    id: "12", category: "investimento",
    question: "Qual a diferença principal entre ações e obrigações?",
    options: ["Não há diferença", "Ações têm mais risco e potencial de retorno", "Obrigações têm maior retorno", "Ações são mais seguras"],
    correct: 1,
    explanation: "Ações representam partes de empresas (maior risco, maior retorno potencial). Obrigações são empréstimos ao Estado/empresa (menor risco, retorno mais estável).",
  },
  {
    id: "13", category: "investimento",
    question: "O que é diversificação de investimentos?",
    options: ["Investir tudo numa empresa de sucesso", "Guardar dinheiro em vários bancos", "Distribuir investimentos por vários ativos", "Reinvestir todos os lucros"],
    correct: 2,
    explanation: "Diversificação significa distribuir o investimento por diferentes ativos, setores e geografias para reduzir o risco total.",
  },
  {
    id: "14", category: "investimento",
    question: "Antes de investir, o que deves ter garantido?",
    options: ["Um carro novo", "A reserva de emergência constituída", "Uma conta em bolsa aberta", "Cartão de crédito disponível"],
    correct: 1,
    explanation: "A reserva de emergência é a base. Sem ela, podes ser forçado a vender investimentos em mau momento para cobrir imprevistos.",
  },
  {
    id: "15", category: "investimento",
    question: "Se investires 1.000€ a 7%/ano, quanto terás em 30 anos (juros compostos)?",
    options: ["2.100€", "4.500€", "7.612€", "15.000€"],
    correct: 2,
    explanation: "Com juros compostos a 7%/ano, 1.000€ tornam-se ~7.612€ em 30 anos. É o poder do tempo + reinvestimento dos juros!",
  },
];

type Phase = "category" | "quiz" | "result";

export default function QuizPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("category");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const filtered = selectedCategory
    ? questions.filter((q) => q.category === selectedCategory)
    : questions;

  const current = filtered[currentIndex];
  const total = filtered.length;
  const score = filtered.filter((q) => answers[q.id] === q.correct).length;
  const percentage = Math.round((score / total) * 100);

  const grade =
    percentage >= 80 ? { label: "Especialista 🏆", color: "text-yellow-600" }
    : percentage >= 60 ? { label: "Intermédio ⭐", color: "text-teal-600" }
    : { label: "Iniciante 📚", color: "text-blue-600" };

  function handleSelect(index: number) {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setAnswers((prev) => ({ ...prev, [current.id]: index }));
    setShowExplanation(true);
  }

  function handleNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      setPhase("result");
    }
  }

  function restart() {
    setPhase("category");
    setSelectedCategory(null);
    setCurrentIndex(0);
    setAnswers({});
    setShowExplanation(false);
    setSelectedAnswer(null);
  }

  if (phase === "category") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quiz de Literacia Financeira</h1>
          <p className="mt-1 text-slate-500">Testa os teus conhecimentos — 15 perguntas em 3 categorias</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => { setSelectedCategory(null); setPhase("quiz"); }}
            className="rounded-2xl border-2 border-teal-600 bg-teal-50 p-6 text-left transition hover:bg-teal-100"
          >
            <span className="text-4xl">🎯</span>
            <h2 className="mt-3 text-lg font-bold text-teal-800">Todas as categorias</h2>
            <p className="mt-1 text-sm text-teal-600">15 perguntas · Básico + Poupança + Investimento</p>
          </button>
          {(["basico", "poupanca", "investimento"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPhase("quiz"); }}
              className="rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition hover:border-teal-400 hover:bg-teal-50"
            >
              <span className="text-4xl">{cat === "basico" ? "📖" : cat === "poupanca" ? "🐷" : "📈"}</span>
              <h2 className="mt-3 text-lg font-bold text-slate-800">{categoryLabels[cat]}</h2>
              <p className="mt-1 text-sm text-slate-500">5 perguntas · apenas esta categoria</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <h1 className="text-2xl font-bold">Resultado Final</h1>
        <div className="rounded-2xl border-2 border-teal-200 bg-teal-50 p-8">
          <p className="text-6xl font-black text-teal-700">{score}/{total}</p>
          <p className="mt-2 text-2xl font-bold text-slate-700">{percentage}%</p>
          <p className={`mt-3 text-xl font-bold ${grade.color}`}>{grade.label}</p>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          {percentage >= 80 && <p>Excelente! Tens uma base sólida de literacia financeira. 🎉</p>}
          {percentage >= 60 && percentage < 80 && <p>Bom trabalho! Há ainda espaço para melhorar. Estuda mais na secção Aprender.</p>}
          {percentage < 60 && <p>Não desanimes! Visita a secção Aprender para reforçar os teus conhecimentos. 💪</p>}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={restart} className="rounded-lg bg-teal-700 px-6 py-2 font-medium text-white hover:bg-teal-600">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Quiz phase
  const progressPct = ((currentIndex) / total) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Quiz</h1>
        <span className="text-sm text-slate-500">Pergunta {currentIndex + 1} de {total}</span>
      </div>
      {/* Progress */}
      <div className="h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-teal-600 transition-all duration-500" style={{ width: `${progressPct}%` }} />
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${categoryColors[current.category]}`}>
          {categoryLabels[current.category]}
        </span>
        <h2 className="mt-3 text-lg font-semibold text-slate-900">{current.question}</h2>
        <div className="mt-4 space-y-2">
          {current.options.map((option, index) => {
            let cls = "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-sm transition ";
            if (!showExplanation) {
              cls += selectedAnswer === index ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-teal-300 hover:bg-slate-50";
            } else if (index === current.correct) {
              cls += "border-green-500 bg-green-50";
            } else if (index === selectedAnswer && selectedAnswer !== current.correct) {
              cls += "border-red-400 bg-red-50";
            } else {
              cls += "border-slate-200 opacity-50";
            }
            return (
              <label key={option} className={cls} onClick={() => handleSelect(index)}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-current text-xs font-bold">
                  {showExplanation && index === current.correct ? "✓" : showExplanation && index === selectedAnswer ? "✗" : String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </label>
            );
          })}
        </div>
        {showExplanation && (
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 border border-slate-200">
            <p className="font-semibold mb-1">💡 Explicação:</p>
            <p>{current.explanation}</p>
          </div>
        )}
        {showExplanation && (
          <button onClick={handleNext} className="mt-4 w-full rounded-xl bg-teal-700 py-2.5 font-medium text-white hover:bg-teal-600">
            {currentIndex < total - 1 ? "Próxima pergunta →" : "Ver resultado"}
          </button>
        )}
      </article>
    </div>
  );
}
