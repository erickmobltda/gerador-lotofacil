import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Painel Admin</h1>
      <p className="text-muted-foreground">Bem-vindo ao painel administrativo.</p>
    </div>
  );
}
