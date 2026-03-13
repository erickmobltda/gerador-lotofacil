import { Zap, Trophy } from "lucide-react";

interface ConfigPanelProps {
  selectedCount: number;
  fixedCount: number;
  strategy: "full" | "fechamento";
  guarantee: number;
  ticketPreview: number;
  validationError: string | null;
  onStrategyChange: (s: "full" | "fechamento") => void;
  onGuaranteeChange: (g: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ConfigPanel({
  selectedCount,
  fixedCount,
  strategy,
  guarantee,
  ticketPreview,
  validationError,
  onStrategyChange,
  onGuaranteeChange,
  onGenerate,
  isGenerating,
}: ConfigPanelProps) {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-muted/50 rounded-lg text-sm">
        <span className="font-medium">{selectedCount} números</span> selecionados
        {fixedCount > 0 && (
          <>
            , <span className="font-medium text-green-600">{fixedCount} fixos</span>
          </>
        )}
      </div>

      {validationError && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {validationError}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Estratégia</label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => onStrategyChange("full")}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors ${
              strategy === "full"
                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                : "border-border hover:border-purple-200"
            }`}
          >
            <Zap
              className={`h-5 w-5 ${strategy === "full" ? "text-purple-500" : "text-muted-foreground"}`}
            />
            <div>
              <div className="font-medium text-sm">Desdobramento Completo</div>
              <div className="text-xs text-muted-foreground">Todos os bilhetes possíveis</div>
            </div>
          </button>
          <button
            onClick={() => onStrategyChange("fechamento")}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors ${
              strategy === "fechamento"
                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                : "border-border hover:border-purple-200"
            }`}
          >
            <Trophy
              className={`h-5 w-5 ${strategy === "fechamento" ? "text-purple-500" : "text-muted-foreground"}`}
            />
            <div>
              <div className="font-medium text-sm">Fechamento (Reduzido)</div>
              <div className="text-xs text-muted-foreground">Menos bilhetes com garantia mínima</div>
            </div>
          </button>
        </div>
      </div>

      {strategy === "fechamento" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Garantia mínima</label>
          <select
            value={guarantee}
            onChange={(e) => onGuaranteeChange(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 bg-background text-sm"
          >
            <option value={12}>Garantia de 12 pontos</option>
            <option value={13}>Garantia de 13 pontos</option>
            <option value={14}>Garantia de 14 pontos</option>
          </select>
        </div>
      )}

      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
        <div className="text-xs text-muted-foreground mb-1">Estimativa de bilhetes</div>
        <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
          {ticketPreview > 0 ? ticketPreview.toLocaleString("pt-BR") : "—"}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={!!validationError || isGenerating || ticketPreview === 0}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Gerando...
          </>
        ) : (
          "Gerar Bilhetes"
        )}
      </button>
    </div>
  );
}
