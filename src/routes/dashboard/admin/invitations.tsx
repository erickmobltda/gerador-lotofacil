import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/invitations")({
  component: InvitationsPage,
});

function InvitationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Convites</h1>
      <p className="text-muted-foreground">Gerenciamento de convites.</p>
    </div>
  );
}
