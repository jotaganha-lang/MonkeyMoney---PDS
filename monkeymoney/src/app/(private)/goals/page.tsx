"use client";

import { useEffect, useState } from "react";
import { currency } from "@/lib/utils";

type Goal = {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  status: "active" | "paused" | "completed";
};

const STORAGE_KEY = "mm_goals";

function loadGoals(): Goal[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}
function saveGoals(g: Goal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(g));
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", target: "", deposit: "" });
  const [depositId, setDepositId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => { setGoals(loadGoals()); }, []);

  function addGoal() {
    if (!form.title || !form.target) return;
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      target: parseFloat(form.target),
      current: 0,
      status: "active",
    };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    saveGoals(updated);
    setForm({ title: "", description: "", target: "", deposit: "" });
    setShowForm(false);
  }

  function deposit(id: string, amount: number) {
    const updated = goals.map((g) => {
      if (g.id !== id) return g;
      const newCurrent = Math.min(g.target, g.current + amount);
      return { ...g, current: newCurrent, status: newCurrent >= g.target ? "completed" as const : g.status };
    });
    setGoals(updated);
    saveGoals(updated);
    setDepositId(null);
    setDepositAmount("");
  }

  function deleteGoal(id: string) {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  }

  const statusLabel: Record<string, string> = { active: "Ativa", paused: "Pausada", completed: "Concluída ✓" };
  const statusColor: Record<string, string> = {
    active: "bg-teal-100 text-teal-700",
    paused: "bg-slate-100 text-slate-500",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Metas de poupança</h1>
          <p className="text-sm text-slate-500">Define objetivos e acompanha o progresso</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-600 transition"
        >
          + Nova meta
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
          <h2 className="font-bold text-teal-800 mb-3">Nova meta de poupança</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Nome da meta (ex: Computador novo)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-teal-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Valor objetivo (€)"
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-teal-400 focus:outline-none"
            />
            <input
              placeholder="Descrição (opcional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-teal-400 focus:outline-none sm:col-span-2"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={addGoal} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-600">
              Criar meta
            </button>
            <button onClick={() => setShowForm(false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {goals.length === 0 && !showForm && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <span className="text-5xl">🎯</span>
          <h2 className="mt-4 text-lg font-bold text-slate-700">Ainda não tens metas</h2>
          <p className="mt-2 text-sm text-slate-500">Cria a tua primeira meta de poupança e começa a acompanhar o teu progresso!</p>
          <button onClick={() => setShowForm(true)} className="mt-5 rounded-xl bg-teal-700 px-6 py-2.5 font-bold text-white hover:bg-teal-600 transition">
            Criar primeira meta
          </button>
        </div>
      )}

      {/* Goals list */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
          return (
            <article key={goal.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900">{goal.title}</h2>
                  {goal.description && <p className="text-sm text-slate-500">{goal.description}</p>}
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[goal.status]}`}>
                  {statusLabel[goal.status]}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                  <span>{currency(goal.current)} poupados</span>
                  <span>Meta: {currency(goal.target)} ({progress}%)</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${goal.status === "completed" ? "bg-green-500" : "bg-teal-600"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {goal.status !== "completed" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {depositId === goal.id ? (
                    <>
                      <input
                        type="number"
                        placeholder="Valor a depositar (€)"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm w-44 focus:border-teal-400 focus:outline-none"
                      />
                      <button
                        onClick={() => deposit(goal.id, parseFloat(depositAmount) || 0)}
                        className="rounded-xl bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-600"
                      >
                        Confirmar
                      </button>
                      <button onClick={() => setDepositId(null)} className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm text-slate-600">
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDepositId(goal.id)}
                      className="rounded-xl border border-teal-300 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-100 transition"
                    >
                      + Adicionar poupança
                    </button>
                  )}
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="ml-auto rounded-xl border border-red-200 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
