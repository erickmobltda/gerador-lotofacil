import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/users/$userId")({
  component: UserDetailPage,
});

function UserDetailPage() {
  const { userId } = Route.useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalhe do Usuário</h1>
      <p className="text-muted-foreground">ID: {userId}</p>
    </div>
  );
}
