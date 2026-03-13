import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookMarked, Trash2, Plus, Calendar, Ticket } from "lucide-react";
import { toast } from "sonner";
import { listSavedTickets, deleteSavedTicket } from "@/lib/db/queries/saved-tickets";
import { useSession } from "@/hooks/auth-hooks";
import { PageHeader } from "@/components/page-header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/dashboard/saved/")({
  component: SavedPage,
});

function SavedPage() {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["saved-tickets", session?.user.id],
    queryFn: () => listSavedTickets(session!.user.id),
    enabled: !!session,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSavedTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-tickets"] });
      toast.success("Combinação excluída");
    },
    onError: () => {
      toast.error("Erro ao excluir combinação");
    },
  });

  function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    if (confirm("Tem certeza que deseja excluir esta combinação?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div>
      <PageHeader
        title="Combinações Salvas"
        description="Suas combinações geradas e salvas"
      >
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova combinação
        </Link>
      </PageHeader>

      <div className="p-6">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="text-center py-20">
            <BookMarked className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma combinação salva</h3>
            <p className="text-muted-foreground mb-6">
              Gere sua primeira combinação e salve para acessar depois
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Criar combinação
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                to="/dashboard/saved/$id"
                params={{ id: ticket.id }}
                className="group bg-white dark:bg-card rounded-xl border hover:border-purple-300 hover:shadow-md transition-all p-4 block"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{ticket.name}</h3>
                  </div>
                  <button
                    onClick={(e) => handleDelete(ticket.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Ticket className="h-3.5 w-3.5" />
                    {ticket.ticket_count.toLocaleString("pt-BR")} bilhetes
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                      {ticket.strategy === "full" ? "Desdobramento" : `Fechamento ${ticket.guarantee}pts`}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(ticket.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
