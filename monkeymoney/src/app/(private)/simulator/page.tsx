"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { currency } from "@/lib/utils";

export default function SimulatorPage() {
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(100);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    const result = [];
    let balance = initial;
    for (let y = 0; y <= years; y++) {
      result.push({
        year: `Ano ${y}`,
        Poupança: Math.round(balance),
        Investido: Math.round(initial + monthly * 12 * y),
      });
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + rate / 100 / 12) + monthly;
      }
    }
    return result;
  }, [initial, monthly, rate, years]);

  const finalBalance = data[data.length - 1]?.Poupança ?? 0;
  const totalInvested = initial + monthly * 12 * years;
  const totalInterest = finalBalance - totalInvested;

  function Slider({ label, value, min, max, step, onChange, format }: {
    label: string; value: number; min: number; max: number; step: number;
    onChange: (v: number) => void; format: (v: number) => string;
  }) {
    return (
      <div>
        <div className="flex justify-between text-sm">
          <span className="font-medium text-slate-700">{label}</span>
          <span className="font-bold text-teal-700">{format(value)}</span>
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-1 w-full accent-teal-600"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>{format(min)}</span><span>{format(max)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Simulador de Poupança</h1>
        <p className="mt-1 text-sm text-slate-500">
          Descobre o impacto dos juros compostos. Ajusta os valores e vê o crescimento em tempo real.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="font-bold text-slate-900">Parâmetros</h2>
          <Slider
            label="Capital inicial"
            value={initial} min={0} max={50000} step={500}
            onChange={setInitial}
            format={(v) => currency(v)}
          />
          <Slider
            label="Contribuição mensal"
            value={monthly} min={0} max={2000} step={25}
            onChange={setMonthly}
            format={(v) => currency(v)}
          />
          <Slider
            label="Taxa de juro anual"
            value={rate} min={1} max={20} step={0.5}
            onChange={setRate}
            format={(v) => `${v}%`}
          />
          <Slider
            label="Período"
            value={years} min={1} max={40} step={1}
            onChange={setYears}
            format={(v) => `${v} anos`}
          />
        </div>

        {/* Results + Chart */}
        <div className="space-y-4 lg:col-span-2">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Valor final", value: currency(finalBalance), color: "text-teal-700" },
              { label: "Total investido", value: currency(totalInvested), color: "text-slate-700" },
              { label: "Juros ganhos", value: currency(Math.max(0, totalInterest)), color: "text-green-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-center">
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`mt-1 text-xl font-black ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4">Crescimento ao longo do tempo</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={Math.floor(years / 5)} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => currency(Number(v) || 0)} />
                  <Area type="monotone" dataKey="Poupança" stroke="#0f766e" fill="#99f6e4" strokeWidth={2} />
                  <Area type="monotone" dataKey="Investido" stroke="#94a3b8" fill="#f1f5f9" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-teal-400" /> Valor com juros</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-slate-300" /> Apenas o que investiste</span>
            </div>
          </div>

          {/* Educational note */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
            <p className="font-semibold">💡 O poder dos juros compostos</p>
            <p className="mt-1">
              Com apenas {currency(monthly)}/mês durante {years} anos a {rate}%/ano, os juros representam{" "}
              <strong>{Math.round((totalInterest / Math.max(1, finalBalance)) * 100)}%</strong> do valor final.
              Quanto mais cedo começares, maior o impacto!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
