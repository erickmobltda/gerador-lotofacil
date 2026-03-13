import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Configurações do Sistema</h1>
    </div>
  );
}
