import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { NumberGrid } from "@/components/lottery/NumberGrid";
import { ConfigPanel } from "@/components/lottery/ConfigPanel";
import { TicketResults } from "@/components/lottery/TicketResults";
import {
  validateInput,
  generateDesdobramento,
  generateFechamento,
  countPreview,
} from "@/lib/lottery/combinatorics";
import { useSession } from "@/hooks/auth-hooks";
import { createSavedTicket } from "@/lib/db/queries/saved-tickets";

export const Route = createFileRoute("/dashboard/")({
  component: GeneratorPage,
});

function GeneratorPage() {
  const { session } = useSession();
  const navigate = useNavigate();

  // Number selection state
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
  const [fixedNumbers, setFixedNumbers] = useState<Set<number>>(new Set());

  // Config state
  const [strategy, setStrategy] = useState<"full" | "fechamento">("full");
  const [guarantee, setGuarantee] = useState<number>(14);

  // Generation state
  const [tickets, setTickets] = useState<number[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleSelected = useCallback((n: number) => {
    setSelectedNumbers((prev) => {
      const next = new Set(prev);
      if (next.has(n)) {
        next.delete(n);
        // If was fixed, remove from fixed too
        setFixedNumbers((f) => {
          const nf = new Set(f);
          nf.delete(n);
          return nf;
        });
      } else {
        next.add(n);
      }
      return next;
    });
  }, []);

  const handleToggleFixed = useCallback((n: number) => {
    setFixedNumbers((prev) => {
      const next = new Set(prev);
      if (next.has(n)) {
        next.delete(n);
      } else {
        next.add(n);
        // Auto-select
        setSelectedNumbers((s) => {
          const ns = new Set(s);
          ns.add(n);
          return ns;
        });
      }
      return next;
    });
  }, []);

  const selectedArr = useMemo(() => Array.from(selectedNumbers).sort((a, b) => a - b), [selectedNumbers]);
  const fixedArr = useMemo(() => Array.from(fixedNumbers).sort((a, b) => a - b), [fixedNumbers]);

  const validationError = useMemo(
    () => validateInput(selectedArr, fixedArr),
    [selectedArr, fixedArr]
  );

  const ticketPreview = useMemo(() => {
    if (validationError) return 0;
    try {
      return countPreview(selectedArr.length, fixedArr.length, strategy, strategy === "fechamento" ? guarantee : undefined);
    } catch {
      return 0;
    }
  }, [selectedArr, fixedArr, strategy, guarantee, validationError]);

  async function handleGenerate() {
    if (validationError) return;
    setIsGenerating(true);
    // Use setTimeout to avoid blocking UI for large computations
    setTimeout(() => {
      try {
        let result: number[][];
        if (strategy === "full") {
          result = generateDesdobramento(selectedArr, fixedArr);
        } else {
          result = generateFechamento(selectedArr, fixedArr, guarantee);
        }
        setTickets(result);
        toast.success(`${result.length} bilhete(s) gerado(s) com sucesso!`);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erro ao gerar bilhetes");
      } finally {
        setIsGenerating(false);
      }
    }, 10);
  }

  async function handleSave() {
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    if (tickets.length === 0) return;

    setIsSaving(true);
    try {
      const name = `${selectedArr.length} números - ${new Date().toLocaleDateString("pt-BR")}`;
      await createSavedTicket(session.user.id, {
        name,
        numbers_selected: selectedArr,
        fixed_numbers: fixedArr,
        strategy,
        guarantee: strategy === "fechamento" ? guarantee : null,
        tickets,
        ticket_count: tickets.length,
      });
      toast.success("Combinação salva com sucesso!");
    } catch (e) {
      toast.error("Erro ao salvar combinação");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerador de Bilhetes</h1>
        <p className="text-muted-foreground">
          Selecione seus números e configure a estratégia de geração
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr,320px] gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-card rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">Seus Números (01–25)</h2>
            <NumberGrid
              selectedNumbers={selectedNumbers}
              fixedNumbers={fixedNumbers}
              onToggleSelected={handleToggleSelected}
              onToggleFixed={handleToggleFixed}
            />
          </div>

          {tickets.length > 0 && (
            <div className="bg-white dark:bg-card rounded-xl border p-6">
              <h2 className="text-lg font-semibold mb-4">Resultados</h2>
              <TicketResults
                tickets={tickets}
                selectedNumbers={selectedArr}
                fixedNumbers={fixedArr}
                strategy={strategy}
                guarantee={strategy === "fechamento" ? guarantee : undefined}
                onSave={handleSave}
                isSaving={isSaving}
                isAuthenticated={!!session}
              />
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-6 self-start">
          <div className="bg-white dark:bg-card rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">Configuração</h2>
            <ConfigPanel
              selectedCount={selectedNumbers.size}
              fixedCount={fixedNumbers.size}
              strategy={strategy}
              guarantee={guarantee}
              ticketPreview={ticketPreview}
              validationError={validationError}
              onStrategyChange={setStrategy}
              onGuaranteeChange={setGuarantee}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
