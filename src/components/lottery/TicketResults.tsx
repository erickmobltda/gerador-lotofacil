import { Download, Save } from "lucide-react";

interface TicketResultsProps {
  tickets: number[][];
  selectedNumbers: number[];
  fixedNumbers: number[];
  strategy: "full" | "fechamento";
  guarantee?: number;
  onSave: () => void;
  isSaving: boolean;
  isAuthenticated: boolean;
}

export function TicketResults({
  tickets,
  selectedNumbers,
  fixedNumbers,
  strategy,
  guarantee,
  onSave,
  isSaving,
  isAuthenticated,
}: TicketResultsProps) {
  if (tickets.length === 0) return null;

  const cost = tickets.length * 3;

  function handleDownload() {
    const header = [
      "Gerador Lotofácil",
      `Estratégia: ${strategy === "full" ? "Desdobramento Completo" : `Fechamento (garantia ${guarantee} pts)`}`,
      `Números selecionados: ${selectedNumbers.join(", ")}`,
      fixedNumbers.length > 0 ? `Números fixos: ${fixedNumbers.join(", ")}` : null,
      `Total de bilhetes: ${tickets.length}`,
      `Custo estimado: R$ ${cost.toFixed(2).replace(".", ",")}`,
      "",
      "Bilhetes:",
      "",
    ]
      .filter(Boolean)
      .join("\n");

    const ticketLines = tickets
      .map(
        (t, i) =>
          `${String(i + 1).padStart(3, " ")}. ${t.map((n) => String(n).padStart(2, "0")).join("  ")}`
      )
      .join("\n");

    const content = header + ticketLines;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lotofacil_${tickets.length}_bilhetes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
        <div>
          <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
            {tickets.length.toLocaleString("pt-BR")}
          </div>
          <div className="text-sm text-muted-foreground">bilhetes gerados</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold">
            R$ {cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-muted-foreground">custo estimado (R$ 3,00/jogo)</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 border border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-purple-700 dark:text-purple-300 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="h-4 w-4" />
          Baixar TXT
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Salvando..." : isAuthenticated ? "Salvar Combinação" : "Login para salvar"}
        </button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <div className="p-3 bg-muted/50 border-b text-xs text-muted-foreground font-medium">
          Lista de bilhetes
        </div>
        <div className="max-h-96 overflow-y-auto divide-y">
          {tickets.map((ticket, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/30 text-sm">
              <span className="text-muted-foreground w-8 text-right font-mono">
                {String(i + 1).padStart(3, "0")}.
              </span>
              <div className="flex gap-1 flex-wrap">
                {ticket.map((n) => (
                  <span
                    key={n}
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      fixedNumbers.includes(n)
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                    }`}
                  >
                    {String(n).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
