import { describe, it, expect } from "vitest";
import {
  generateCombinations,
  validateInput,
  generateDesdobramento,
  generateFechamento,
  countPreview,
} from "./combinatorics";

describe("generateCombinations", () => {
  it("should return C(4,2) = 6 combinations", () => {
    const result = generateCombinations([1, 2, 3, 4], 2);
    expect(result).toHaveLength(6);
  });

  it("should return empty for k > n", () => {
    const result = generateCombinations([1, 2], 3);
    expect(result).toHaveLength(0);
  });
});

describe("validateInput", () => {
  it("should return error when less than 15 numbers selected", () => {
    const error = validateInput([1, 2, 3], []);
    expect(error).toBeTruthy();
    expect(error).toContain("15");
  });

  it("should return error when 15 or more numbers fixed", () => {
    const selected = Array.from({ length: 16 }, (_, i) => i + 1);
    const fixed = Array.from({ length: 15 }, (_, i) => i + 1);
    const error = validateInput(selected, fixed);
    expect(error).toBeTruthy();
  });

  it("should return null for valid input", () => {
    const selected = Array.from({ length: 17 }, (_, i) => i + 1);
    const fixed = [1, 2, 3];
    expect(validateInput(selected, fixed)).toBeNull();
  });
});

describe("generateDesdobramento", () => {
  it("Scenario A: 17 selected, 13 fixed → 6 tickets", () => {
    const selected = Array.from({ length: 17 }, (_, i) => i + 1);
    const fixed = Array.from({ length: 13 }, (_, i) => i + 1);
    const tickets = generateDesdobramento(selected, fixed);
    expect(tickets).toHaveLength(6);
    tickets.forEach((ticket) => {
      expect(ticket).toHaveLength(15);
      fixed.forEach((f) => expect(ticket).toContain(f));
    });
  });

  it("should generate 136 tickets for 17 selected, 0 fixed", () => {
    const selected = Array.from({ length: 17 }, (_, i) => i + 1);
    const tickets = generateDesdobramento(selected, []);
    expect(tickets).toHaveLength(136); // C(17,15) = 136
  });

  it("Scenario C: should throw for less than 15 selected", () => {
    expect(() => generateDesdobramento([1, 2, 3], [])).toThrow();
  });

  it("Scenario C2: should throw for 15 fixed numbers", () => {
    const selected = Array.from({ length: 16 }, (_, i) => i + 1);
    const fixed = Array.from({ length: 15 }, (_, i) => i + 1);
    expect(() => generateDesdobramento(selected, fixed)).toThrow();
  });
});

describe("generateFechamento", () => {
  it("Scenario B: 17 selected, 0 fixed, guarantee=14 → ≤20 tickets", () => {
    const selected = Array.from({ length: 17 }, (_, i) => i + 1);
    const tickets = generateFechamento(selected, [], 14);
    expect(tickets.length).toBeGreaterThan(0);
    expect(tickets.length).toBeLessThanOrEqual(20);
    tickets.forEach((ticket) => {
      expect(ticket).toHaveLength(15);
    });
  });

  it("should cover all variable combos with guarantee", () => {
    const selected = Array.from({ length: 17 }, (_, i) => i + 1);
    const allPossible = generateCombinations(selected, 15);
    const result = generateFechamento(selected, [], 14);

    for (const possible of allPossible) {
      const covered = result.some(
        (ticket) => countCommonInTest(ticket, possible) >= 14
      );
      expect(covered).toBe(true);
    }
  });

  it("should throw for invalid input", () => {
    expect(() => generateFechamento([1, 2, 3], [], 14)).toThrow();
  });
});

function countCommonInTest(a: number[], b: number[]): number {
  return a.filter((x) => b.includes(x)).length;
}

describe("countPreview", () => {
  it("should return 6 for full strategy with 17 numbers and 13 fixed", () => {
    expect(countPreview(17, 13, "full")).toBe(6);
  });

  it("should return 136 for full strategy with 17 numbers and 0 fixed", () => {
    expect(countPreview(17, 0, "full")).toBe(136);
  });

  it("should return ≤20 for fechamento 17 numbers, 0 fixed, guarantee=14", () => {
    const count = countPreview(17, 0, "fechamento", 14);
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(20);
  });
});
