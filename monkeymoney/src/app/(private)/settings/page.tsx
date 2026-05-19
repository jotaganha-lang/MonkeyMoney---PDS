export default function SettingsPage() {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h1 className="text-2xl font-bold">Definicoes</h1>
      <div className="mt-4 space-y-3 text-sm text-slate-700">
        <label className="flex items-center justify-between rounded-md border p-3">
          <span>Receber notificacoes por email</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className="flex items-center justify-between rounded-md border p-3">
          <span>Mostrar dicas rapidas no dashboard</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
    </div>
  );
}
