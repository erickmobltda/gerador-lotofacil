import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>
      <p className="text-muted-foreground">Configurações do usuário.</p>
    </div>
  );
}
