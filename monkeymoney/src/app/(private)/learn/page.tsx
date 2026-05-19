"use client";

import { useState } from "react";
import { financialTips, categoryLabels, categoryColors, type Category } from "@/lib/learn-data";

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories: Array<Category | "all"> = ["all", "orcamento", "poupanca", "investimento", "divida", "impostos"];
  const filtered = activeCategory === "all" ? financialTips : financialTips.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Área Educativa</h1>
        <p className="mt-1 text-slate-500">12 artigos sobre finanças pessoais — clica para ler</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-teal-700 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-teal-400 hover:text-teal-700"
            }`}
          >
            {cat === "all" ? "Todos" : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((tip) => (
          <article
            key={tip.id}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl">{tip.icon}</span>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${categoryColors[tip.category]}`}>
                    {categoryLabels[tip.category]}
                  </span>
                  <span className="text-xs text-slate-400">{tip.readTime} min leitura</span>
                </div>
              </div>
              <h2 className="mt-3 font-bold text-slate-900">{tip.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{tip.summary}</p>

              <button
                onClick={() => setExpanded(expanded === tip.id ? null : tip.id)}
                className="mt-3 text-sm font-medium text-teal-700 hover:text-teal-600 transition"
              >
                {expanded === tip.id ? "▲ Fechar" : "▼ Ler artigo"}
              </button>
            </div>

            {expanded === tip.id && (
              <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                  {tip.content}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-8">Nenhum artigo nesta categoria.</p>
      )}
    </div>
  );
}
