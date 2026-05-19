import { notFound } from "next/navigation";
import { financialTips } from "@/lib/learn-data";

export default async function TipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tip = financialTips.find((t) => t.id === id);

  if (!tip) {
    notFound();
  }

  return (
    <article className="rounded-lg border bg-white p-6">
      <h1 className="text-2xl font-bold">{tip.title}</h1>
      <p className="mt-4 leading-7 text-slate-700">{tip.content}</p>
    </article>
  );
}
