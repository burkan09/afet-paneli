import { describe, it, expect } from "vitest";
import {
  magnitudeToImpact,
  alertToImpact,
  computeImpact,
  impactLabel,
} from "../impact";

describe("magnitudeToImpact", () => {
  it("büyüklüğü 0-100 aralığına sıkıştırır", () => {
    expect(magnitudeToImpact(1)).toBe(0);
    expect(magnitudeToImpact(9)).toBe(100);
  });

  it("büyük deprem daha yüksek skor alır", () => {
    expect(magnitudeToImpact(7)).toBeGreaterThan(magnitudeToImpact(5));
  });

  it("aralık dışı değerleri kırpar", () => {
    expect(magnitudeToImpact(-2)).toBe(0);
    expect(magnitudeToImpact(12)).toBe(100);
  });

  it("veri yoksa sıfır döner", () => {
    expect(magnitudeToImpact(null)).toBe(0);
  });
});

describe("alertToImpact", () => {
  it("uyarı seviyelerini sıralı puanlar", () => {
    expect(alertToImpact("green")).toBeLessThan(alertToImpact("orange"));
    expect(alertToImpact("orange")).toBeLessThan(alertToImpact("red"));
  });

  it("büyük harfe duyarsızdır", () => {
    expect(alertToImpact("RED")).toBe(alertToImpact("red"));
  });

  it("bilinmeyen seviyede sıfır döner", () => {
    expect(alertToImpact("mor")).toBe(0);
    expect(alertToImpact(null)).toBe(0);
  });
});

describe("computeImpact", () => {
  it("büyüklük ve uyarıdan yüksek olanı seçer", () => {
    const score = computeImpact({
      type: "earthquake",
      magnitude: 3,
      alertLevel: "red",
    });
    expect(score).toBe(90);
  });

  it("büyüklük yoksa uyarı seviyesini kullanır", () => {
    expect(
      computeImpact({ type: "flood", magnitude: null, alertLevel: "orange" })
    ).toBe(60);
  });

  it("hiçbiri yoksa tipe göre varsayılan verir", () => {
    const tsunami = computeImpact({ type: "tsunami" });
    const wildfire = computeImpact({ type: "wildfire" });
    expect(tsunami).toBeGreaterThan(wildfire);
  });

  it("bilinmeyen tip için de sayı döner", () => {
    expect(typeof computeImpact({ type: "meteor" })).toBe("number");
  });
});

describe("impactLabel", () => {
  it("skorla etiket tutarlıdır", () => {
    expect(impactLabel(90)).toBe("Çok yüksek");
    expect(impactLabel(10)).toBe("Düşük");
  });
});