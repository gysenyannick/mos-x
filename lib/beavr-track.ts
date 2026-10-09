/**
 * Meten hoe bezoekers de calculator gebruiken, voor de statistieken in Beavr.
 * Enkel tellingen (geopend, gestart, stap, verstuurd): geen cookies, geen persoonsgegevens.
 * Elke gebeurtenis telt één keer per bezoek. Gaat er iets mis, dan merkt de bezoeker niets.
 */
type BeavrEvent = "view" | "start" | "step" | "lead";

export function trackBeavr(e: BeavrEvent, n?: number, step?: string): void {
  try {
    const key = `bv-ev:${e}:${n ?? ""}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // privévenster zonder sessionStorage: gewoon meten
  }
  const body = JSON.stringify({ e, n, step });
  try {
    if (navigator.sendBeacon && navigator.sendBeacon("/api/beavr-event", new Blob([body], { type: "application/json" }))) return;
  } catch {
    // val terug op fetch
  }
  fetch("/api/beavr-event", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
}
