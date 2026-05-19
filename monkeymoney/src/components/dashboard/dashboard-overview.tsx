"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { currency } from "@/lib/utils";
import Link from "next/link";

type Tx = { id: string; title: string; type: "income" | "expense"; amount: number; category: string; date: string };

export function DashboardOverview() {
  const [txs, setTxs] = useState<Tx[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mm_transactions");
      if (stored) setTxs(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const totalIncome = txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Build monthly chart data from transactions
  const monthlyMap: Record<string, { income: number; expense: number }> = {};
  txs.forEach((t) => {
    const month = t.date?.slice(0, 7) ?? "";
    if (!monthlyMap[month]) monthlyMap[month] = { income: 0, expense: 0 };
    if (t.type === "income") monthlyMap[month].income += t.amount;
    else monthlyMap[month].expense += t.amount;
  });
  const chartData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, v]) => ({
      month: new Date(month + "-01").toLocaleDateString("pt-PT", { month: "short" }),
      Receitas: v.income,
      Despesas: v.expense,
    }));

  const recent = [...txs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const isEmpty = txs.length === 0;

  return (
    <section className="space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Saldo total", value: currency(balance), color: balance >= 0 ? "text-teal-700" : "text-red-600" },
          { label: "Receitas", value: currency(totalIncome), color: "text-green-700" },
          { label: "Despesas", value: currency(totalExpense), color: "text-red-600" },
          { label: "Movimentos", value: `${txs.length}`, color: "text-slate-700" },
        ].map(({ label, value, color }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className={`mt-2 text-2xl font-black ${color}`}>{value}</p>
          </article>
        ))}
      </div>

      {isEmpty ? (
        /* Empty state */
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <span className="text-5xl">💸</span>
          <h2 className="mt-4 text-xl font-bold text-slate-700">Ainda não há movimentos</h2>
          <p className="mt-2 text-sm text-slate-500">
            Adiciona a tua primeira receita ou despesa para começar a acompanhar as tuas finanças.
          </p>
          <Link
            href="/transactions"
            className="mt-5 inline-block rounded-xl bg-teal-700 px-6 py-2.5 font-bold text-white hover:bg-teal-600 transition"
          >
            Adicionar primeiro movimento →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Chart */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h3 className="font-bold text-slate-900">Evolução mensal</h3>
            {chartData.length > 0 ? (
              <div className="mt-3 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: any) => currency(Number(v) || 0)} />
                    <Area type="monotone" dataKey="Receitas" stroke="#16a34a" fill="#bbf7d0" strokeWidth={2} />
                    <Area type="monotone" dataKey="Despesas" stroke="#dc2626" fill="#fecaca" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">Adiciona movimentos para ver o gráfico.</p>
            )}
          </article>

          {/* Recent */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">Últimas transações</h3>
            <div className="mt-3 space-y-2">
              {recent.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{tx.title}</p>
                    <p className="text-xs text-slate-400">{tx.category}</p>
                  </div>
                  <p className={`text-sm font-bold ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>
                    {tx.type === "income" ? "+" : "-"}{currency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/transactions" className="mt-3 block text-center text-xs font-medium text-teal-700 hover:text-teal-600">
              Ver todos →
            </Link>
          </article>
        </div>
      )}
    </section>
  );
}
