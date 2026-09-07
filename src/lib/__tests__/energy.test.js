import { describe, it, expect } from "vitest";
import { energyJoules, energyComparison, totalEnergy } from "../energy";

describe("energyJoules", () => {
  it("bir birim büyüklük artışı enerjiyi ~32 kat artırır", () => {
    const oran = energyJoules(6) / energyJoules(5);
    expect(oran).toBeGreaterThan(31);
    expect(oran).toBeLessThan(32.5);
  });

  it("iki birim artış ~1000 kat demektir", () => {
    const oran = energyJoules(7) / energyJoules(5);
    expect(oran).toBeGreaterThan(990);
    expect(oran).toBeLessThan(1010);
  });

  it("formülü doğru uygular", () => {
    expect(Math.log10(energyJoules(5))).toBeCloseTo(12.3, 5);
  });
});

describe("energyComparison", () => {
  it("büyüklüğe göre uygun birimi seçer", () => {
    expect(energyComparison(energyJoules(3))).toMatch(/kg|ton/);
    expect(energyComparison(energyJoules(6))).toMatch(/kiloton/);
    expect(energyComparison(energyJoules(9))).toMatch(/megaton/);
  });
});

describe("totalEnergy", () => {
  it("boş listede sıfır döner", () => {
    expect(totalEnergy([])).toBe(0);
  });

  it("tek büyük deprem birçok küçüğü bastırır", () => {
    const kucukler = Array.from({ length: 100 }, () => ({ magnitude: 4 }));
    const buyuk = [{ magnitude: 7 }];
    expect(totalEnergy(buyuk)).toBeGreaterThan(totalEnergy(kucukler));
  });
});