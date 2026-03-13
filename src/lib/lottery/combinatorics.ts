export function generateCombinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = generateCombinations(rest, k - 1).map((combo) => [
    first,
    ...combo,
  ]);
  const withoutFirst = generateCombinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

export function validateInput(
  selected: number[],
  fixed: number[]
): string | null {
  if (selected.length < 15) {
    return "Selecione pelo menos 15 números";
  }
  if (fixed.length >= 15) {
    return "Você não pode fixar 15 ou mais números";
  }
  if (fixed.length >= selected.length) {
    return "Números fixos não podem igualar ou exceder o total selecionado";
  }
  const variableCount = selected.length - fixed.length;
  const variableSlotsNeeded = 15 - fixed.length;
  if (variableCount < variableSlotsNeeded) {
    return "Números variáveis insuficientes para completar um bilhete";
  }
  return null;
}

export function generateDesdobramento(
  selected: number[],
  fixed: number[]
): number[][] {
  const error = validateInput(selected, fixed);
  if (error) throw new Error(error);

  const variable = selected.filter((n) => !fixed.includes(n));
  const variableSlots = 15 - fixed.length;
  const variableCombos = generateCombinations(variable, variableSlots);

  return variableCombos.map((combo) =>
    [...fixed, ...combo].sort((a, b) => a - b)
  );
}

function countCommonElements(a: number[], b: number[]): number {
  return a.filter((x) => b.includes(x)).length;
}

export function generateFechamento(
  selected: number[],
  fixed: number[],
  guarantee: number
): number[][] {
  const error = validateInput(selected, fixed);
  if (error) throw new Error(error);

  const variable = selected.filter((n) => !fixed.includes(n));
  const variableSlots = 15 - fixed.length;
  let pool = generateCombinations(variable, variableSlots);
  const guaranteeVariable = guarantee - fixed.length;

  const result: number[][] = [];

  while (pool.length > 0) {
    const picked = pool[0];
    result.push(picked);
    pool = pool.filter(
      (combo) => countCommonElements(combo, picked) < guaranteeVariable
    );
  }

  return result.map((combo) => [...fixed, ...combo].sort((a, b) => a - b));
}

function combinationCount(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

export function countPreview(
  n: number,
  fixedCount: number,
  strategy: "full" | "fechamento",
  guarantee?: number
): number {
  const fixed = Array.from({ length: fixedCount }, (_, i) => i + 1);
  const selected = Array.from({ length: n }, (_, i) => i + 1);

  if (strategy === "full") {
    const variableSlots = 15 - fixedCount;
    const variableCount = n - fixedCount;
    return combinationCount(variableCount, variableSlots);
  } else {
    if (!guarantee) return 0;
    const tickets = generateFechamento(selected, fixed, guarantee);
    return tickets.length;
  }
}
