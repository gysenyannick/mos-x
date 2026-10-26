/** De coatingkleuren die we aanbieden, met een benadering van de kleur op het staal. */
export const DAKKLEUREN = [
  { id: "zwart", naam: "Zwart", hex: "#262722", en: "deep black (close to RAL 9005), with a soft satin sheen" },
  { id: "antraciet", naam: "Antraciet", hex: "#393F3D", en: "anthracite grey (close to RAL 7016): a very dark charcoal grey with a slight cool green-blue undertone, clearly darker than slate grey but visibly lighter than black" },
  { id: "bruin", naam: "Bruin", hex: "#3E2C26", en: "dark chocolate brown (close to RAL 8019)" },
  { id: "aubergine", naam: "Aubergine", hex: "#432A26", en: "aubergine: a very dark reddish brown, darker and more purple-red than chocolate brown" },
  { id: "rood", naam: "Rood", hex: "#6C2B22", en: "deep oxide red (close to RAL 3009), the classic red of clay roof tiles" },
  { id: "terra", naam: "Terra", hex: "#7F3D1F", en: "terracotta (close to RAL 8004): a warm orange-red copper brown" },
  { id: "fondant", naam: "Fondant", hex: "#726054", en: "fondant: a warm greyish taupe brown, medium-dark" },
] as const;

export type DakkleurId = (typeof DAKKLEUREN)[number]["id"];
