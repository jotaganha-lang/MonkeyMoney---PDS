"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().min(2),
  username: z.string().min(3),
  country: z.string().min(2),
  currency: z.string().min(3).max(3),
});

export default function ProfilePage() {
  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "Utilizador MonkeyMoney",
      username: "monkeyuser",
      country: "Portugal",
      currency: "EUR",
    },
  });

  return (
    <div className="rounded-lg border bg-white p-4">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <form onSubmit={handleSubmit(() => toast.success("Perfil atualizado."))} className="mt-4 space-y-2">
        <input {...register("fullName")} className="w-full rounded-md border p-2" placeholder="Nome" />
        <input {...register("username")} className="w-full rounded-md border p-2" placeholder="Username" />
        <input {...register("country")} className="w-full rounded-md border p-2" placeholder="Pais" />
        <input {...register("currency")} className="w-full rounded-md border p-2" placeholder="Moeda" />
        <button className="rounded-md bg-teal-700 px-4 py-2 text-white">Guardar perfil</button>
      </form>
    </div>
  );
}
