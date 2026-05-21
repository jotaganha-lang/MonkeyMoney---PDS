"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currency } from "@/lib/utils";
import { useTransactions } from "@/hooks/use-transactions";
import type { Transaction } from "@/lib/transaction-storage";

const schema = z.object({
  title: z.string().min(2, "Mínimo 2 caracteres"),
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Valor deve ser positivo"),
  category: z.string().min(1, "Escolhe uma categoria"),
  paymentMethod: z.string().min(1),
  date: z.string().min(1),
  description: z.string().optional(),
});

type Tx = Transaction;

const EXPENSE_CATEGORIES = ["Alimentação", "Transportes", "Lazer", "Saúde", "Educação", "Vestuário", "Habitação", "Subscrições", "Outros"];
const INCOME_CATEGORIES = ["Salário", "Bolsa", "Mesada", "Freelance", "Investimentos", "Outros"];

export default function TransactionsPage() {
  const { txs: rows, setTxs: saveRows } = useTransactions();
  const [filterType, setFilterType] = useState("all");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { type: "expense", date: new Date().toISOString().slice(0, 10) },
  });

  const txType = watch("type");

  const onSubmit = async (values: z.infer<typeof schema>) => {
    let updated: Tx[];
    if (editingId) {
      updated = rows.map((r) => (r.id === editingId ? { ...r, ...values } : r));
      setEditingId(null);
    } else {
      updated = [{ ...values, id: crypto.randomUUID() }, ...rows];
    }
    await saveRows(updated);
    reset({ type: values.type, date: values.date });
    setShowForm(false);
  };

  const filtered = useMemo(
    () => rows.filter(
      (r) => (filterType === "all" || r.type === filterType) &&
        r.title.toLowerCase().includes(query.toLowerCase()),
    ),
    [rows, filterType, query],
  );

  async function deleteRow(id: string) {
    const updated = rows.filter((r) => r.id !== id);
    await saveRows(updated);
  }

  function startEdit(r: Tx) {
    setEditingId(r.id);
    setShowForm(true);
    setValue("title", r.title);
    setValue("type", r.type);
    setValue("amount", r.amount);
    setValue("category", r.category);
    setValue("paymentMethod", r.paymentMethod);
    setValue("date", r.date);
    setValue("description", r.description ?? "");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Movimentos financeiros</h1>
          <p className="text-sm text-slate-500">Regista receitas e despesas</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); reset({ type: "expense", date: new Date().toISOString().slice(0, 10) }); }}
          className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-600 transition"
        >
          + Novo movimento
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
          <h2 className="font-bold text-teal-800 mb-3">{editingId ? "Editar movimento" : "Novo movimento"}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input {...register("title")} placeholder="Título (ex: Supermercado)" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-400 focus:outline-none" />
            <select {...register("type")} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-400 focus:outline-none">
              <option value="expense">💸 Despesa</option>
              <option value="income">💰 Receita</option>
            </select>
            <input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} placeholder="Valor (€)" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-400 focus:outline-none" />
            <select {...register("category")} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-400 focus:outline-none">
              <option value="">Seleciona categoria</option>
              {(txType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select {...register("paymentMethod")} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-400 focus:outline-none">
              <option value="">Método de pagamento</option>
              <option value="Multibanco">Multibanco</option>
              <option value="Cartão de crédito">Cartão de crédito</option>
              <option value="Numerário">Numerário</option>
              <option value="Transferência">Transferência</option>
              <option value="MB Way">MB Way</option>
            </select>
            <input type="date" {...register("date")} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-400 focus:outline-none" />
            <textarea {...register("description")} placeholder="Notas (opcional)" rows={2} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-400 focus:outline-none sm:col-span-2 lg:col-span-3" />
            {Object.values(errors)[0] && (
              <p className="sm:col-span-2 lg:col-span-3 text-sm text-red-600">
                {String(Object.values(errors)[0]?.message ?? "Preenche todos os campos obrigatórios.")}
              </p>
            )}
            <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
              <button type="submit" className="rounded-xl bg-teal-700 px-5 py-2.5 font-bold text-white hover:bg-teal-600 transition">
                {editingId ? "Atualizar" : "Guardar"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-600 hover:bg-slate-50 transition">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Pesquisar..."
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-teal-400 focus:outline-none"
        />
        {["all", "income", "expense"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${filterType === t ? "bg-teal-700 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-teal-400"}`}
          >
            {t === "all" ? "Todos" : t === "income" ? "Receitas" : "Despesas"}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl">💸</span>
            <p className="mt-3 font-medium text-slate-600">Nenhum movimento encontrado.</p>
            <p className="text-sm text-slate-400">Clica em "+ Novo movimento" para começar.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-lg ${r.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                    {r.type === "income" ? "💰" : "💸"}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{r.title}</p>
                    <p className="text-xs text-slate-400">{r.category} · {r.date} · {r.paymentMethod}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-bold ${r.type === "income" ? "text-green-600" : "text-red-500"}`}>
                    {r.type === "income" ? "+" : "-"}{currency(r.amount)}
                  </p>
                  <button onClick={() => startEdit(r)} className="text-xs text-slate-400 hover:text-teal-700 transition">✏️</button>
                  <button onClick={() => deleteRow(r.id)} className="text-xs text-slate-400 hover:text-red-500 transition">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
