import { describe, it, expect } from "vitest";
import { applyFilters, computeStats, countByType } from "../filter";

const ornek = [
  {
    id: "1",
    type: "earthquake",
    title: "Near Tokyo, Japan",
    magnitude: 6.2,
    depth: 30,
    impactScore: 65,
  },
  {
    id: "2",
    type: "earthquake",
    title: "Off coast of Chile",
    magnitude: 3.1,
    depth: 10,
    impactScore: 26,
  },
  {
    id: "3",
    type: "wildfire",
    title: "California Fire",
    magnitude: null,
    depth: null,
    impactScore: 40,
  },
];

const bos = { minMag: 0, search: "", types: null, minImpact: null };

describe("applyFilters", () => {
  it("filtre yoksa hepsini döndürür", () => {
    expect(applyFilters(ornek, bos)).toHaveLength(3);
  });

  it("büyüklük filtresi sadece depremlere uygulanır", () => {
    const sonuc = applyFilters(ornek, { ...bos, minMag: 5 });
    expect(sonuc.map((e) => e.id)).toEqual(["1", "3"]);
  });

  it("aramada büyük-küçük harf farkı yoktur", () => {
    expect(applyFilters(ornek, { ...bos, search: "JAPAN" })).toHaveLength(1);
  });

  it("tür filtresi çalışır", () => {
    const sonuc = applyFilters(ornek, { ...bos, types: ["wildfire"] });
    expect(sonuc[0].id).toBe("3");
  });

  it("etki skoru eşiği uygular", () => {
    expect(applyFilters(ornek, { ...bos, minImpact: 50 })).toHaveLength(1);
  });
});

describe("computeStats", () => {
  it("boş listede çökmez", () => {
    const s = computeStats([]);
    expect(s.count).toBe(0);
    expect(s.max).toBe("—");
  });

  it("deprem ve toplam sayıyı ayırır", () => {
    const s = computeStats(ornek);
    expect(s.count).toBe(3);
    expect(s.quakes).toBe(2);
    expect(s.max).toBe("6.2");
  });
});

describe("countByType", () => {
  it("türlere göre sayar", () => {
    expect(countByType(ornek)).toEqual({ earthquake: 2, wildfire: 1 });
  });
});