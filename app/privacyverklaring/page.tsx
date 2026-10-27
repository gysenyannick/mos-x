import type { Metadata } from "next";
import JuridischePagina from "@/components/juridische-pagina";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: "Hoe MOS-X omgaat met je persoonsgegevens: welke gegevens we verzamelen, waarom, hoe lang we ze bewaren en welke rechten je hebt.",
  alternates: { canonical: "/privacyverklaring" },
};

export default function Privacyverklaring() {
  return (
    <JuridischePagina
      titel="Privacyverklaring"
      intro="We gaan zorgvuldig om met je gegevens. Hier lees je welke gegevens we verzamelen, waarom we dat doen en welke rechten je hebt."
      bijgewerkt="27 oktober 2026"
    >
      <h2>Wie is verantwoordelijk?</h2>
      <p>
        MOS-X, met ondernemingsnummer BE0805.594.502 en hoofdzetel aan het Bovenpad 100, 2280 Grobbendonk, is verantwoordelijk voor de
        verwerking van je persoonsgegevens via deze website en bij de uitvoering van onze diensten. We volgen de Algemene
        Verordening Gegevensbescherming (AVG of GDPR) en de Belgische privacywetgeving.
      </p>

      <h2>Welke gegevens verzamelen we?</h2>
      <ul>
        <li><b>Contact en aanvragen:</b> je naam, e-mailadres, telefoonnummer, adres of postcode, de dienst waarvoor je interesse hebt en je bericht, wanneer je een plaatsbezoek, richtprijs of contact aanvraagt.</li>
        <li><b>Dakkleur-tool:</b> je voornaam, e-mailadres, telefoonnummer en de foto van je woning die je uploadt.</li>
        <li><b>Klanten:</b> de gegevens die nodig zijn om de werken voor te bereiden, uit te voeren en op te volgen, zoals het werfadres, afspraken, foto&apos;s van je dak voor en na de werken, offertes, facturen en garantiegegevens. Die vind je ook terug in je persoonlijke klantenzone.</li>
        <li><b>Communicatie:</b> berichten die je ons stuurt via e-mail, telefoon of WhatsApp.</li>
        <li><b>Technische gegevens:</b> je IP-adres, enkel om misbruik van onze formulieren en de dakkleur-tool te beperken.</li>
      </ul>

      <h2>Waarom gebruiken we je gegevens?</h2>
      <ul>
        <li>Om je aanvraag te beantwoorden, een plaatsbezoek in te plannen en je een prijs te bezorgen (stappen vóór een overeenkomst).</li>
        <li>Om de werken uit te voeren, te factureren en de garantie op te volgen (uitvoering van de overeenkomst).</li>
        <li>Om te voldoen aan wettelijke verplichtingen, zoals onze boekhouding (wettelijke verplichting).</li>
        <li>Om je aanvraag op te volgen, onze website te beveiligen en onze dienstverlening te verbeteren (gerechtvaardigd belang).</li>
      </ul>
      <p>We verkopen je gegevens nooit en gebruiken ze niet voor reclame van anderen.</p>

      <h2>De dakkleur-tool</h2>
      <p>
        Met de dakkleur-tool zie je hoe je dak eruitziet in een nieuwe kleur. Daarvoor sturen we je foto naar Google (Gemini), dat
        het voorbeeld maakt. We bewaren je foto niet op onze website. Het resultaat sturen we per e-mail naar jou en naar MOS-X,
        zodat we je kunnen helpen bij je keuze. Je voornaam, e-mailadres en telefoonnummer gebruiken we om je het resultaat te
        bezorgen en je aanvraag op te volgen.
      </p>

      <h2>Met wie delen we je gegevens?</h2>
      <p>We delen je gegevens alleen met partners die ons helpen onze diensten te leveren, en enkel voor zover dat nodig is:</p>
      <ul>
        <li>Vercel, voor het hosten van de website;</li>
        <li>Resend, voor het versturen van e-mails;</li>
        <li>Upstash, voor de veilige opslag van gegevens van de website en de klantenzone;</li>
        <li>Google, voor de dakkleur-tool, de kaart op onze contactpagina en onze Google-reviews;</li>
        <li>Trustindex, voor het tonen van onze reviews;</li>
        <li>Beavr, ons systeem voor het opvolgen van aanvragen en klanten;</li>
        <li>onze boekhouder, en overheden wanneer de wet dat vereist.</li>
      </ul>
      <p>
        Sommige van deze partners zijn gevestigd buiten de Europese Economische Ruimte. In dat geval gebeurt de doorgifte op basis
        van de modelcontractbepalingen van de Europese Commissie of een gelijkwaardige wettelijke waarborg.
      </p>

      <h2>Hoe lang bewaren we je gegevens?</h2>
      <ul>
        <li>Aanvragen die niet tot een opdracht leiden, bewaren we maximaal 2 jaar.</li>
        <li>Klantgegevens bewaren we zolang de garantie loopt, en daarna zolang de wet ons verplicht, zoals 7 jaar voor de boekhouding.</li>
        <li>Je IP-adres bewaren we maximaal 48 uur. Je e-mailadres in de teller van de dakkleur-tool bewaren we maximaal 90 dagen.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Wij plaatsen geen cookies om je te volgen of voor reclame. De website onthoudt enkel lokaal in je browser wat je in de
        dakkleur-tool invulde, zodat je dat niet opnieuw hoeft te doen. De kaart van Google Maps op de contactpagina en de
        reviewwidget van Trustindex kunnen wel eigen cookies plaatsen. Daarvoor gelden de privacyregels van Google en Trustindex.
      </p>

      <h2>Je rechten</h2>
      <p>
        Je hebt het recht om je gegevens in te kijken, te laten verbeteren of verwijderen, de verwerking te laten beperken, je
        gegevens over te dragen en bezwaar te maken tegen de verwerking. Stuur hiervoor een e-mail naar{" "}
        <a href="mailto:info@mos-x.be">info@mos-x.be</a>. We antwoorden binnen een maand.
      </p>
      <p>
        Ben je niet tevreden over hoe we met je gegevens omgaan? Dan kun je een klacht indienen bij de
        Gegevensbeschermingsautoriteit, Drukpersstraat 35, 1000 Brussel,{" "}
        <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer">www.gegevensbeschermingsautoriteit.be</a>.
      </p>

      <h2>Beveiliging</h2>
      <p>
        We beschermen je gegevens met passende technische en organisatorische maatregelen. De website werkt via een beveiligde
        verbinding en je klantenzone is enkel bereikbaar via je persoonlijke link.
      </p>

      <h2>Wijzigingen</h2>
      <p>We kunnen deze privacyverklaring aanpassen. De meest recente versie vind je altijd op deze pagina.</p>
    </JuridischePagina>
  );
}
