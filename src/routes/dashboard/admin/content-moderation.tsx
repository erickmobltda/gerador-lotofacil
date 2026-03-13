import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/content-moderation")({
  component: ContentModerationPage,
});

function ContentModerationPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Moderação de Conteúdo</h1>
    </div>
  );
}
