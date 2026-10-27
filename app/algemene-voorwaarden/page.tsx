import type { Metadata } from "next";
import JuridischePagina from "@/components/juridische-pagina";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: "De algemene voorwaarden van MOS-X: offertes, uitvoering van de werken, facturatie en betaling, opzegging en bevoegde rechtbank.",
  alternates: { canonical: "/algemene-voorwaarden" },
};

export default function AlgemeneVoorwaarden() {
  return (
    <JuridischePagina
      titel="Algemene voorwaarden"
      intro="Duidelijke afspraken vooraf. Deze voorwaarden gelden voor alle offertes en werken van MOS-X."
      bijgewerkt="27 oktober 2026"
    >
      <h2>Artikel 1: Toepassingsgebied</h2>
      <p>
        1.1 Behoudens andersluidende schriftelijke overeenkomst wordt de rechtsverhouding tussen partijen geregeld door deze
        algemene voorwaarden, die essentieel zijn voor onze toestemming voor de overeenkomst. Deze voorwaarden hebben aldus
        voorrang op de eigen voorwaarden van de klant.
      </p>

      <h2>Artikel 2: Offertes</h2>
      <p>
        2.1 Onze offertes zijn louter indicatief en vrijblijvend en vervallen indien zij niet binnen 14 kalenderdagen werden
        aanvaard door de klant. Offertes krijgen pas rechtsgeldigheid als overeenkomst door ondertekening van de offerte door de
        klant én door ons. Wij behouden ons bovendien het recht voor om bepaalde opdrachten zonder opgave van reden te weigeren.
      </p>

      <h2>Artikel 3: Uitvoering van de werkzaamheden</h2>
      <p>3.1 De werf dient toegankelijk en vrij te zijn van alle obstakels.</p>
      <p>3.2 Eventuele herstellingen of extra werken in regie worden aangerekend aan €55 per uur per persoon, exclusief materiaalkosten.</p>
      <p>3.3 Tijdens het verwijderen van het mos is er een risico dat er stukken van de betonpan of kunstlei meekomen.</p>
      <p>3.4 Zonder coating geeft MOS-X geen garantie op het esthetische aspect.</p>
      <p>
        3.5 Wij kunnen nooit verantwoordelijk gesteld worden voor schade aan of door derden, evenmin als voor onvermijdelijke
        schade ten gevolge van de werken. MOS-X is niet verantwoordelijk voor eventuele schade.
      </p>
      <p>
        3.6 De werken worden altijd uitgevoerd volgens de regels van de kunst, maar houden gezien de aard van het werk geen
        resultaatsverbintenis in.
      </p>
      <p>
        3.7 Leverings- en afwerkingstermijnen zijn steeds louter informatief of indicatief gegeven en vormen nooit een grond tot
        verbreking of schadevergoeding.
      </p>
      <p>
        3.8 Bij niet starten door toedoen van de klant, of bij het niet verwittigen ten minste 24 uur voor de aanvang van de
        werken, wordt een forfait van €750 aangerekend.
      </p>
      <p>
        3.9 Verborgen gebreken (leidingen, afvoeren, …) moeten bij het opstarten van de werf door de klant aangeduid worden.
        MOS-X is niet verantwoordelijk voor eventuele schade hieraan.
      </p>
      <p>
        3.10 Indien de overeenkomst slechts gedeeltelijk kan uitgevoerd worden, zal een gedeelte van de overeengekomen prijs
        worden gefactureerd in verhouding tot de werkelijk uitgevoerde werken.
      </p>

      <h2>Artikel 4: Facturatie en betalingen</h2>
      <p>
        4.1 De prijszetting gebeurt aan de hand van een eenheidsprijs per m². Deze eenheidsprijs wordt vermenigvuldigd met de
        vermoedelijke hoeveelheid. Indien enkel een totaalprijs wordt vermeld, bedraagt de eenheidsprijs de totaalprijs gedeeld
        door de vermelde vermoedelijke hoeveelheid. De definitieve opmeting gebeurt na uitvoering van de werken. Indien uit de
        opmeting blijkt dat de werkelijke hoeveelheid meer bedraagt dan de vermoedelijke hoeveelheid, zal het verschil worden
        bijgefactureerd tegen dezelfde eenheidsprijs per m².
      </p>
      <p>
        4.2 De betalingstermijn bedraagt 14 dagen, tenzij onderling schriftelijk een andere termijn werd afgesproken. Bij
        niet-betaling of niet-volledige betaling van de prijs op de vervaldag wordt het openstaande gedeelte van de factuur van
        rechtswege en zonder ingebrekestelling vermeerderd met een interest van 1% per maand, met als minimum de wettelijke
        interesten. Ingeval van gehele of gedeeltelijke niet-betaling van de schuld op de vervaldag zonder ernstige redenen
        wordt, na vergeefse ingebrekestelling, het openstaande bedrag van rechtswege verhoogd met 12%, met een minimum van €200
        en een maximum van €2.000 per factuur, ten titel van conventioneel strafbeding als forfaitaire schadevergoeding, zelfs
        bij het toekennen van termijnen van respijt. Dit wegens buitengerechtelijke kosten en zonder dat dit afdoet aan ons
        recht op interesten en ons recht om een hogere schade te bewijzen.
      </p>

      <h2>Artikel 5: Opzegging van het contract</h2>
      <p>
        5.1 Binnen de 14 kalenderdagen, te rekenen vanaf de dag die volgt op de ondertekening van dit contract, heeft de
        particulier het recht om zonder kosten van zijn aankoop af te zien, op voorwaarde dat hij de verkoper hiervan bij een
        per post aangetekende brief op de hoogte brengt. Elk beding waarbij de particulier aan dit recht zou verzaken, is nietig.
        Wat betreft het in acht nemen van de termijn, is het voldoende dat de kennisgeving wordt verstuurd vóór het verstrijken
        van deze termijn. Deze clausule is niet van toepassing voor btw-plichtigen.
      </p>

      <h2>Artikel 6: Bevoegdheid en toepasselijk recht</h2>
      <p>
        Het Belgische recht is van toepassing op alle geschillen die verband houden met of die voortvloeien uit onze
        aanbiedingen en/of overeenkomsten. In geval van geschillen of betwisting zijn enkel de rechtbanken van het gerechtelijk
        arrondissement van onze maatschappelijke zetel bevoegd.
      </p>
    </JuridischePagina>
  );
}
