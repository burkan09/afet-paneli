import { describe, it, expect } from "vitest";
import {
  magnitudeCounts,
  cumulativeCounts,
  fitGutenbergRichter,
  expectedCount,
} from "../gutenberg";

function syntheticCatalog(b = 1, base = 10000) {
  const pts = [];
  for (let m = 4.5; m <= 7.5; m += 0.5) {
    const n = Math.round(base * Math.pow(10, -b * (m - 4.5)));
    for (let i = 0; i < n; i++) pts.push([0, 0, m, 0, 10]);
  }
  return pts;
}

describe("magnitudeCounts", () => {
  it("büyüklüğe göre kovalara ayırır", () => {
    const counts = magnitudeCounts([
      [0, 0, 4.6, 0, 0],
      [0, 0, 4.9, 0, 0],
      [0, 0, 5.2, 0, 0],
    ]);
    expect(counts[0]).toEqual({ mag: 4.5, count: 2 });
    expect(counts[1]).toEqual({ mag: 5, count: 1 });
  });

  it("eşik altını eler", () => {
    expect(magnitudeCounts([[0, 0, 3.0, 0, 0]])).toHaveLength(0);
  });
});

describe("cumulativeCounts", () => {
  it("birikimli sayım azalan olmalı", () => {
    const cum = cumulativeCounts([
      { mag: 4.5, count: 100 },
      { mag: 5, count: 10 },
      { mag: 5.5, count: 1 },
    ]);
    expect(cum[0].n).toBe(111);
    expect(cum[1].n).toBe(11);
    expect(cum[2].n).toBe(1);
  });
});

describe("fitGutenbergRichter", () => {
  it("sentetik veride b değerini geri bulur", () => {
    const fit = fitGutenbergRichter(
      cumulativeCounts(magnitudeCounts(syntheticCatalog(1)))
    );
    expect(fit.b).toBeGreaterThan(0.9);
    expect(fit.b).toBeLessThan(1.1);
    expect(fit.r2).toBeGreaterThan(0.98);
  });

  it("farklı b değerini de yakalar", () => {
    const fit = fitGutenbergRichter(
      cumulativeCounts(magnitudeCounts(syntheticCatalog(1.4)))
    );
    expect(fit.b).toBeGreaterThan(1.3);
    expect(fit.b).toBeLessThan(1.5);
  });

  it("yetersiz veride null döner", () => {
    expect(fitGutenbergRichter([{ mag: 5, n: 1, logN: 0 }])).toBeNull();
  });
});

describe("expectedCount", () => {
  it("her büyüklük biriminde ~10 kat azalır", () => {
    const fit = { a: 4, b: 1 };
    const oran = expectedCount(fit, 5) / expectedCount(fit, 6);
    expect(oran).toBeCloseTo(10, 5);
  });
});