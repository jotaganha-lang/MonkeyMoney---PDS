import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard financeiro</h1>
      <p className="text-slate-600">
        Resumo de saldo, receitas, despesas, metas e evolucao mensal.
      </p>
      <DashboardOverview />
    </div>
  );
}
