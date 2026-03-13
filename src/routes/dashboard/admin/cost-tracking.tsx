import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/cost-tracking")({
  component: CostTrackingPage,
});

function CostTrackingPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rastreamento de Custos</h1>
    </div>
  );
}
