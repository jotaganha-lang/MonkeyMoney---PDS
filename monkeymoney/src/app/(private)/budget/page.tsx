"use client";

import { useEffect, useState } from "react";
import { currency } from "@/lib/utils";

type BudgetCategory = {
  id: string;
  name: string;
  icon: string;
  limit: number;
  spent: number;
};

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: "alimentacao", name: "Alimentação", icon: "🛒", limit: 300, spent: 0 },
  { id: "transportes", name: "Transportes", icon: "🚌", limit: 100, spent: 0 },
  { id: "lazer", name: "Lazer", icon: "🎮", limit: 100, spent: 0 },
  { id: "saude", name: "Saúde", icon: "💊", limit: 50, spent: 0 },
  { id: "educacao", name: "Educação", icon: "📚", limit: 80, spent: 0 },
  { id: "vestuario", name: "Vestuário", icon: "👕", limit: 60, spent: 0 },
];

const STORAGE_KEY = "mm_budget";

function load(): BudgetCategory[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") ?? DEFAULT_CATEGORIES; }
  catch { return DEFAULT_CATEGORIES; }
}
function save(data: BudgetCategory[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

export default function BudgetPage() {
  const [cats, setCats] = useState<BudgetCategory[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [spendId, setSpendId] = useState<string | null>(null);
  const [spendAmount, setSpendAmount] = useState("");
  const [editLimit, setEditLimit] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", icon: "💰", limit: "" });

  useEffect(() => { setCats(load()); }, []);

  function updateCats(updated: BudgetCategory[]) { setCats(updated); save(updated); }

  function addSpend(id: string) {
    const amount = parseFloat(spendAmount);
    if (!amount || amount <= 0) return;
    updateCats(cats.map((c) => c.id === id ? { ...c, spent: c.spent + amount } : c));
    setSpendId(null);
    setSpendAmount("");
  }

  function saveLimit(id: string) {
    const limit = parseFloat(editLimit);
    if (!limit || limit <= 0) return;
    updateCats(cats.map((c) => c.id === id ? { ...c, limit } : c));
    setEditId(null);
    setEditLimit("");
  }

  function resetMonth() {
    updateCats(cats.map((c) => ({ ...c, spent: 0 })));
  }

  function addCategory() {
    if (!newCat.name || !newCat.limit) return;
    const cat: BudgetCategory = {
      id: crypto.randomUUID(),
      name: newCat.name,
      icon: newCat.icon || "💰",
      limit: parseFloat(newCat.limit),
      spent: 0,
    };
    updateCats([...cats, cat]);
    setNewCat({ name: "", icon: "💰", limit: "" });
    setShowAddForm(false);
  }

  function removeCategory(id: string) {
    updateCats(cats.filter((c) => c.id !== id));
  }

  const totalLimit = cats.reduce((s, c) => s + c.limit, 0);
  const totalSpent = cats.reduce((s, c) => s + c.spent, 0);
  const totalPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orçamento Mensal</h1>
          <p className="text-sm text-slate-500">Define limites por categoria e controla os gastos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetMonth} className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            Reiniciar mês
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="rounded-xl bg-teal-700 px-4 py-1.5 text-sm font-bold text-white hover:bg-teal-600 transition">
            + Categoria
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Limite total", value: currency(totalLimit), color: "text-slate-700" },
          { label: "Gasto até agora", value: currency(totalSpent), color: totalPct > 80 ? "text-red-600" : "text-slate-700" },
          { label: "Disponível", value: currency(Math.max(0, totalLimit - totalSpent)), color: "text-green-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-center">
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`mt-1 text-xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Add category form */}
      {showAddForm && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
          <h2 className="font-bold text-teal-800 mb-3">Nova categoria</h2>
          <div className="flex flex-wrap gap-3">
            <input placeholder="Emoji (ex: 🎵)" value={newCat.icon}
              onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
              className="w-20 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-lg focus:border-teal-400 focus:outline-none" />
            <input placeholder="Nome da categoria" value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-teal-400 focus:outline-none" />
            <input type="number" placeholder="Limite (€)" value={newCat.limit}
              onChange={(e) => setNewCat({ ...newCat, limit: e.target.value })}
              className="w-32 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-teal-400 focus:outline-none" />
            <button onClick={addCategory} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-600">Adicionar</button>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="grid gap-3 sm:grid-cols-2">
        {cats.map((cat) => {
          const pct = cat.limit > 0 ? Math.min(100, Math.round((cat.spent / cat.limit) * 100)) : 0;
          const isWarning = pct >= 80 && pct < 100;
          const isOver = pct >= 100;

          return (
            <article key={cat.id} className={`rounded-2xl border bg-white p-5 shadow-sm transition ${isOver ? "border-red-300" : isWarning ? "border-orange-300" : "border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <p className="font-bold text-slate-900">{cat.name}</p>
                    <p className="text-xs text-slate-500">{currency(cat.spent)} / {currency(cat.limit)}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isOver ? "bg-red-100 text-red-700" : isWarning ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"}`}>
                  {pct}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-2.5 rounded-full bg-slate-100">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${isOver ? "bg-red-500" : isWarning ? "bg-orange-400" : "bg-teal-600"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {(isWarning || isOver) && (
                <p className={`mt-2 text-xs font-medium ${isOver ? "text-red-600" : "text-orange-600"}`}>
                  {isOver ? "⚠️ Limite ultrapassado!" : "⚡ Estás a aproximar-te do limite"}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {spendId === cat.id ? (
                  <>
                    <input type="number" placeholder="€" value={spendAmount}
                      onChange={(e) => setSpendAmount(e.target.value)}
                      className="w-28 rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:border-teal-400 focus:outline-none" />
                    <button onClick={() => addSpend(cat.id)} className="rounded-xl bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-600">OK</button>
                    <button onClick={() => setSpendId(null)} className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm text-slate-600">✕</button>
                  </>
                ) : editId === cat.id ? (
                  <>
                    <input type="number" placeholder="Novo limite €" value={editLimit}
                      onChange={(e) => setEditLimit(e.target.value)}
                      className="w-36 rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:border-teal-400 focus:outline-none" />
                    <button onClick={() => saveLimit(cat.id)} className="rounded-xl bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-600">Guardar</button>
                    <button onClick={() => setEditId(null)} className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm text-slate-600">✕</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setSpendId(cat.id)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
                      + Registar gasto
                    </button>
                    <button onClick={() => { setEditId(cat.id); setEditLimit(String(cat.limit)); }} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
                      ✏️ Limite
                    </button>
                    <button onClick={() => removeCategory(cat.id)} className="ml-auto rounded-xl border border-red-100 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition">
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
