import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getSavedTicket, deleteSavedTicket } from "@/lib/db/queries/saved-tickets";
import { TicketResults } from "@/components/lottery/TicketResults";
import { PageHeader } from "@/components/page-header";
import { useSession } from "@/hooks/auth-hooks";

export const Route = createFileRoute("/dashboard/saved/$id")({
  component: SavedDetailPage,
});

function SavedDetailPage() {
  const { id } = Route.useParams();
  const { session } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: saved, isLoading } = useQuery({
    queryKey: ["saved-ticket", id],
    queryFn: () => getSavedTicket(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSavedTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-tickets"] });
      toast.success("Combinação excluída");
      navigate({ to: "/dashboard/saved" });
    },
    onError: () => toast.error("Erro ao excluir"),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 bg-muted/50 rounded animate-pulse mb-4" />
        <div className="h-64 bg-muted/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!saved) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Combinação não encontrada</p>
        <Link to="/dashboard/saved" className="text-purple-600 hover:underline mt-2 inline-block">
          Voltar às combinações salvas
        </Link>
      </div>
    );
  }

  const tickets = saved.tickets as number[][];

  return (
    <div>
      <PageHeader title={saved.name}>
        <button
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="flex items-center gap-2 text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg text-sm transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </button>
      </PageHeader>

      <div className="p-6 max-w-4xl">
        <Link
          to="/dashboard/saved"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar às combinações salvas
        </Link>

        <div className="mb-4 flex gap-3 text-sm text-muted-foreground">
          <span>
            Números: <strong>{saved.numbers_selected.join(", ")}</strong>
          </span>
          {saved.fixed_numbers.length > 0 && (
            <span>
              Fixos: <strong className="text-green-600">{saved.fixed_numbers.join(", ")}</strong>
            </span>
          )}
        </div>

        <TicketResults
          tickets={tickets}
          selectedNumbers={saved.numbers_selected}
          fixedNumbers={saved.fixed_numbers}
          strategy={saved.strategy as "full" | "fechamento"}
          guarantee={saved.guarantee ?? undefined}
          onSave={() => {}}
          isSaving={false}
          isAuthenticated={!!session}
        />
      </div>
    </div>
  );
}
