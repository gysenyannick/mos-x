import { describe, expect, it } from "vitest";
import type { Klant, Verwijzing } from "./types";
import type { Actie } from "./store";
import { binnenMosGarantie, controle12, mosGarantieTot, volgendeControle } from "./onderhoud";
import {
  actieVoorKlant, beloningMag, beloningTransactie, campagneMarge, campagneStaat, controleerVerwijzing,
  refRegels, tegoedOverzicht, voegTransactieToe,
} from "./voordeel";

function klant(x: Partial<Klant> = {}): Klant {
  return {
    id: "k1", voornaam: "Marie", achternaam: "Demo", telefoon: "0470 11 22 33", email: "", adres: "Demostraat 1, 2200 Herentals",
    dienst: "Dakreiniging", fase: "nazorg", afspraken: [], fotos: [], documenten: [],
    garantie: { mosvrijJaren: 2, coatingJaren: 0, vanaf: "2026-01-10" }, log: [], aangemaakt: "", bijgewerkt: "", ...x,
  };
}
const buur = (x: Partial<Verwijzing> = {}): Verwijzing => ({ id: "v1", datum: "2026-03-01T10:00:00Z", naam: "Jos Buur", telefoon: "0470 99 88 77", adres: "Demostraat 3, 2200 Herentals", status: "nieuw", ...x });
const regels = refRegels({ refBeloning: 50, refMinOpdracht: 500, refMaxPerKlant: 2 });

describe("garantie en onderhoud", () => {
  it("onderhoud wordt pas aangeraden als de mosgarantie afloopt", () => {
    const k = klant();
    expect(mosGarantieTot(k)).toBe("2028-01-10");
    expect(volgendeControle(k)?.datum).toBe("2028-01-10");
    expect(binnenMosGarantie(k, "2027-06-01")).toBe(true);
  });
  it("de gratis controle valt 12 maanden na de oplevering", () => {
    const k = klant({ inspecties: [{ id: "i", datum: "2027-01-15", soort: "12maanden", bevindingen: "ok" }] });
    expect(controle12(k)).toEqual({ datum: "2027-01-10", gedaan: "2027-01-15" });
  });
  it("een datum van Yannick gaat voor", () => {
    expect(volgendeControle(klant({ volgendeControle: "2027-09-01" }))?.datum).toBe("2027-09-01");
  });
});

describe("onderhoudstegoed", () => {
  it("dezelfde beloning kan maar één keer toegekend worden", () => {
    const k = klant();
    const t = beloningTransactie(buur({ status: "uitgevoerd", betaald: true }), regels, "t1", "2026-04-01T10:00:00Z");
    expect(voegTransactieToe(k, t)).toBe(true);
    expect(voegTransactieToe(k, { ...t, id: "t2" })).toBe(false);
    expect(tegoedOverzicht(k, "2026-04-02").saldo).toBe(50);
  });
  it("gebruik en vervallen tegoed worden juist verrekend", () => {
    const k = klant({
      tegoed: [
        { id: "a", datum: "2026-01-01T00:00:00Z", soort: "toegekend", bedrag: 50, omschrijving: "", vervaltOp: "2026-06-30", door: "yannick" },
        { id: "b", datum: "2026-02-01T00:00:00Z", soort: "toegekend", bedrag: 50, omschrijving: "", door: "yannick" },
        { id: "c", datum: "2026-03-01T00:00:00Z", soort: "gebruikt", bedrag: -30, omschrijving: "", door: "yannick" },
      ],
    });
    expect(tegoedOverzicht(k, "2026-05-01").saldo).toBe(70);
    const later = tegoedOverzicht(k, "2026-07-01");
    expect(later.vervallen).toBe(20);
    expect(later.saldo).toBe(50);
  });
});

describe("burenvoordeel", () => {
  it("geen beloning zolang niet uitgevoerd en betaald", () => {
    const k = klant();
    expect(beloningMag(k, buur({ status: "bevestigd", opdrachtWaarde: 900 }), regels).mag).toBe(false);
    expect(beloningMag(k, buur({ status: "uitgevoerd", opdrachtWaarde: 900 }), regels).mag).toBe(false);
    expect(beloningMag(k, buur({ status: "uitgevoerd", betaald: true, opdrachtWaarde: 900 }), regels).mag).toBe(true);
  });
  it("respecteert de minimumwaarde en het maximum", () => {
    const k = klant();
    expect(beloningMag(k, buur({ status: "uitgevoerd", betaald: true, opdrachtWaarde: 200 }), regels).mag).toBe(false);
    voegTransactieToe(k, beloningTransactie(buur({ id: "x1" }), regels, "a", "2026-01-01T00:00:00Z"));
    voegTransactieToe(k, beloningTransactie(buur({ id: "x2" }), regels, "b", "2026-01-01T00:00:00Z"));
    expect(beloningMag(k, buur({ status: "uitgevoerd", betaald: true, opdrachtWaarde: 900 }), regels).mag).toBe(false);
  });
  it("blokkeert zelfdoorverwijzing en dubbele doorverwijzing", () => {
    const k = klant({ verwijzingen: [buur()] });
    expect(controleerVerwijzing(k, { telefoon: "+32 470 11 22 33", adres: "" }, [k]).some((c) => c.startsWith("Blokkeert"))).toBe(true);
    expect(controleerVerwijzing(k, { telefoon: "0470998877", adres: "" }, [k]).some((c) => c.startsWith("Blokkeert"))).toBe(true);
    expect(controleerVerwijzing(k, { telefoon: "0470 55 55 55", adres: "Andere 9, 2440 Geel" }, [k])).toEqual([]);
  });
});

describe("acties", () => {
  const basis: Actie = { id: "a", titel: "Najaarscheck", tekst: "", type: "seizoen", status: "actief", nagekeken: true, geldigTot: "2026-11-30" };
  it("verdwijnt vanzelf na de einddatum en bij pauze", () => {
    expect(campagneStaat(basis, 0, "2026-11-30")).toBe("actief");
    expect(campagneStaat(basis, 0, "2026-12-01")).toBe("afgelopen");
    expect(campagneStaat({ ...basis, status: "gepauzeerd" }, 0, "2026-11-01")).toBe("gepauzeerd");
    expect(campagneStaat({ ...basis, maxAanvragen: 3 }, 3, "2026-11-01")).toBe("volzet");
  });
  it("enkel voor klanten in de juiste regio en fase", () => {
    const k = klant();
    expect(actieVoorKlant({ ...basis, postcodes: ["2200"] }, k, 0, "2026-11-01")).toBe(true);
    expect(actieVoorKlant({ ...basis, postcodes: ["2440"] }, k, 0, "2026-11-01")).toBe(false);
    expect(actieVoorKlant({ ...basis, fases: ["gepland"] }, k, 0, "2026-11-01")).toBe(false);
    expect(actieVoorKlant({ ...basis, nagekeken: false }, k, 0, "2026-11-01")).toBe(false);
  });
  it("toont geen verzonnen marge als kosten ontbreken", () => {
    expect(campagneMarge({ ...basis, opdrachtWaarde: 300 })).toBeNull();
    expect(campagneMarge({ ...basis, opdrachtWaarde: 300, kosten: 120, korting: 30, verplaatsing: 20 }, 50)).toEqual({ marge: 80, procent: 30 });
  });
});
