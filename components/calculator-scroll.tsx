"use client";

import { useEffect } from "react";

/**
 * Sitebrede click-handler voor alle CTA's die naar de richtprijscalculator wijzen.
 *
 * Waarom: die links wijzen naar `/#calculator`. Staat die hash al in de URL, dan
 * negeert de browser een volgende klik op dezelfde hash en gebeurt er niets.
 * Deze handler doet de scroll zelf, zodat élke klik opnieuw naar de calculator
 * scrollt — ongeacht wat er in de URL staat.
 *
 * Eén listener op document dekt alle CTA's (homepage, navbar, footer, dienst- en
 * regiopagina's) en werkt automatisch mee voor CTA's die later worden toegevoegd.
 *
 * Vanaf een andere pagina wordt niets onderschept: dan handelt de bestaande
 * Next-routing de navigatie naar homepage + calculator gewoon af.
 */
export default function CalculatorScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Laat modifier-klikken (nieuw tabblad, download, …) met rust.
      //
      // Let op: hier bewust NIET op e.defaultPrevented controleren. Next's <Link>
      // roept preventDefault() aan in zijn eigen handler, die via React's
      // root-container eerder afgaat dan deze listener op document. Zo'n check
      // zou dus precies bij alle Link-CTA's afhaken — de bug die we oplossen.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href !== "#calculator" && href !== "/#calculator") return;

      // Alleen op de homepage zelf afhandelen; elders moet er eerst genavigeerd worden.
      if (window.location.pathname !== "/") return;

      const target = document.getElementById("calculator");
      if (!target) return;

      e.preventDefault();

      // De sectie draagt zelf scroll-margin-top, zodat de sticky navbar
      // de calculator niet afdekt.
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Hash bijwerken zonder extra sprong en zonder de history vol te zetten.
      if (window.location.hash !== "#calculator") {
        window.history.replaceState(null, "", "#calculator");
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
