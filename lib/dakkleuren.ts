/** De coatingkleuren die we aanbieden, met een benadering van de kleur op het staal. */
export const DAKKLEUREN = [
  { id: "zwart", naam: "Zwart", hex: "#262722", en: "black" },
  { id: "antraciet", naam: "Antraciet", hex: "#393F3D", en: "anthracite grey" },
  { id: "bruin", naam: "Bruin", hex: "#3E2C26", en: "dark brown" },
  { id: "aubergine", naam: "Aubergine", hex: "#432A26", en: "aubergine (very dark reddish brown)" },
  { id: "rood", naam: "Rood", hex: "#6C2B22", en: "red (classic deep tile red)" },
  { id: "terra", naam: "Terra", hex: "#7F3D1F", en: "terracotta (warm orange-red)" },
  { id: "fondant", naam: "Fondant", hex: "#726054", en: "fondant (warm greyish taupe brown)" },
] as const;

export type DakkleurId = (typeof DAKKLEUREN)[number]["id"];
