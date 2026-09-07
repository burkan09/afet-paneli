import { describe, it, expect } from "vitest";
import { normalizeUsgsCollection, normalizeEonetCollection } from "../normalize";

const usgsOrnek = {
  features: [
    {
      id: "us7000abcd",
      geometry: { coordinates: [139.7, 35.6, 42.5] },
      properties: {
        mag: 5.4,
        place: "near Tokyo",
        time: 1757000000000,
        alert: "green",
        url: "https://example.org/x",
      },
    },
    {
      id: "bozuk",
      geometry: { coordinates: [1, 2, 3] },
      properties: { mag: null },
    },
  ],
};

describe("normalizeUsgsCollection", () => {
  it("koordinat sırasını doğru çevirir", () => {
    const [e] = normalizeUsgsCollection(usgsOrnek);
    expect(e.lon).toBe(139.7);
    expect(e.lat).toBe(35.6);
    expect(e.depth).toBe(42.5);
  });

  it("eksik büyüklüklü kayıtları eler", () => {
    expect(normalizeUsgsCollection(usgsOrnek)).toHaveLength(1);
  });

  it("etki skoru hesaplar", () => {
    const [e] = normalizeUsgsCollection(usgsOrnek);
    expect(e.impactScore).toBeGreaterThan(0);
  });

  it("kimliğe kaynak öneki ekler", () => {
    const [e] = normalizeUsgsCollection(usgsOrnek);
    expect(e.id).toBe("usgs_us7000abcd");
  });

  it("boş girdide çökmez", () => {
    expect(normalizeUsgsCollection({})).toEqual([]);
    expect(normalizeUsgsCollection(null)).toEqual([]);
  });
});

describe("normalizeEonetCollection", () => {
  it("son geometriyi kullanır", () => {
    const sonuc = normalizeEonetCollection({
      events: [
        {
          id: "EONET_1",
          title: "Wildfire",
          categories: [{ id: "wildfires" }],
          geometry: [
            { type: "Point", coordinates: [10, 20], date: "2026-09-01" },
            { type: "Point", coordinates: [11, 21], date: "2026-09-05" },
          ],
          sources: [],
        },
      ],
    });
    expect(sonuc[0].lon).toBe(11);
    expect(sonuc[0].type).toBe("wildfire");
  });

  it("geometrisiz olayları atlar", () => {
    const sonuc = normalizeEonetCollection({
      events: [{ id: "x", title: "y", categories: [], geometry: [] }],
    });
    expect(sonuc).toHaveLength(0);
  });
});