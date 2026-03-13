import { cn } from "@/lib/utils";

interface NumberGridProps {
  selectedNumbers: Set<number>;
  fixedNumbers: Set<number>;
  onToggleSelected: (n: number) => void;
  onToggleFixed: (n: number) => void;
}

export function NumberGrid({
  selectedNumbers,
  fixedNumbers,
  onToggleSelected,
  onToggleFixed,
}: NumberGridProps) {
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1);

  function handleClick(n: number) {
    onToggleSelected(n);
  }

  function handleDoubleClick(n: number, e: React.MouseEvent) {
    e.preventDefault();
    onToggleFixed(n);
  }

  function handleContextMenu(n: number, e: React.MouseEvent) {
    e.preventDefault();
    onToggleFixed(n);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2">
        {numbers.map((n) => {
          const isFixed = fixedNumbers.has(n);
          const isSelected = selectedNumbers.has(n);

          return (
            <button
              key={n}
              onClick={() => handleClick(n)}
              onDoubleClick={(e) => handleDoubleClick(n, e)}
              onContextMenu={(e) => handleContextMenu(n, e)}
              className={cn(
                "w-full aspect-square rounded-lg text-sm font-bold transition-all duration-150 select-none",
                "border-2 hover:scale-105 active:scale-95",
                isFixed
                  ? "bg-green-500 border-green-600 text-white shadow-md"
                  : isSelected
                  ? "bg-purple-500 border-purple-600 text-white shadow-md"
                  : "bg-white dark:bg-card border-border text-foreground hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20"
              )}
            >
              {String(n).padStart(2, "0")}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>
          <span className="font-semibold text-purple-600">{selectedNumbers.size}</span> selecionado(s)
        </span>
        <span>
          <span className="font-semibold text-green-600">{fixedNumbers.size}</span> fixo(s)
        </span>
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-purple-500" />
          <span>Clique para selecionar</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>Clique duplo ou botão direito para fixar</span>
        </div>
      </div>
    </div>
  );
}
