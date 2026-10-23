import Link from "next/link";
import { Camera, Plug, Settings, Tag } from "lucide-react";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { getInstellingen } from "@/lib/klantenzone/store";
import { EXTRAS } from "@/lib/klantenzone/types";
import { bewaarInstellingen } from "../actions";
import DienstFotos from "@/components/klantenzone/dienst-fotos";
import kz from "@/components/klantenzone/kz.module.css";

const VOORBEELD = `{
  "externId": "OFF-2026-035",
  "klant": { "voornaam": "Jan", "achternaam": "Peeters",
             "telefoon": "0470 12 34 56", "adres": "Kerkstraat 12, 2440 Geel",
             "dienst": "Dakreiniging en dakcoating" },
  "afspraken": [{ "titel": "Start werken", "start": "2026-10-23T08:00", "duurMin": 480 }],
  "werken": [{ "naam": "Dakreiniging", "datum": "2026-10-23" }],
  "documenten": [{ "type": "offerte", "titel": "Offerte", "url": "https://...", "bedrag": 4850 }]
}`;

export default async function Instellingen() {
  if (!(await isBeheerder())) return null;
  const i = await getInstellingen();
  const koppelingAan = !!process.env.KLANTENZONE_API_KEY;

  return (
    <>
      <div className={kz.dashKop}><h1 className={kz.dashTitel}>Instellingen</h1></div>

      {/* Foto's bij de diensten */}
      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Camera size={18} /> Foto&apos;s bij de diensten</h2></div>
        <p className={kz.sub} style={{ marginTop: 0, marginBottom: 14 }}>Klanten zien deze foto naast elke dienst bij &quot;Diensten&quot;. Kies liefst een foto van je eigen werk.</p>
        <DienstFotos diensten={[
          { id: "onderhoud", naam: "Onderhoud", foto: i.dienstFotos?.onderhoud ?? "/images/Antimos%20op%20dak.jpg", eigen: !!i.dienstFotos?.onderhoud },
          ...EXTRAS.map((x) => ({ id: x.id, naam: x.naam, foto: i.dienstFotos?.[x.id] ?? x.foto, eigen: !!i.dienstFotos?.[x.id] })),
        ]} />
      </section>

      {/* Reviews */}
      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Settings size={18} /> Reviews</h2></div>
        <form action={bewaarInstellingen}>
          <div className={kz.veld} style={{ marginBottom: 14 }}>
            <label htmlFor="googleReviewUrl">Link om een Google-review te schrijven</label>
            <input id="googleReviewUrl" name="googleReviewUrl" type="url" className={kz.invoer} defaultValue={i.googleReviewUrl ?? ""} placeholder="https://g.page/r/.../review" />
            <p className={kz.sub} style={{ fontSize: 13, marginTop: 4 }}>
              Te vinden in je Google-bedrijfsprofiel via &quot;Vraag om reviews&quot;. Na de oplevering vraagt de klantenzone om een eerlijke review.
              Nooit een beloning voor een review: dat mag niet.
            </p>
          </div>
          <div className={kz.velden} style={{ marginBottom: 14 }}>
            <div className={`${kz.veld} ${kz.vol}`}>
              <label htmlFor="reviewCitaat">Een echte review van Google (optioneel)</label>
              <textarea id="reviewCitaat" name="reviewCitaat" className={kz.invoer} defaultValue={i.reviewCitaat ?? ""} placeholder="Plak hier een korte review die een klant op Google schreef." />
            </div>
            <div className={kz.veld}>
              <label htmlFor="reviewNaam">Naam bij die review</label>
              <input id="reviewNaam" name="reviewNaam" className={kz.invoer} defaultValue={i.reviewNaam ?? ""} placeholder="bv. Els uit Geel" />
            </div>
          </div>
          <div className={kz.rijKnoppen}><button className={kz.knop}>Opslaan</button></div>
        </form>
      </section>

      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Tag size={18} /> Acties en burenvoordeel</h2></div>
        <p className={kz.sub} style={{ marginTop: 0 }}>Die hebben nu elk een eigen pagina in het menu.</p>
        <div className={kz.rijKnoppen}>
          <Link className={`${kz.knop} ${kz.knopLicht}`} href="/beheer/acties">Acties en buurtacties</Link>
          <Link className={`${kz.knop} ${kz.knopLicht}`} href="/beheer/doorverwijzingen">Burenvoordeel en doorverwijzingen</Link>
        </div>
      </section>

      {/* Koppeling */}
      <section className={kz.kaart}>
        <div className={kz.kaartKop}>
          <h2 className={kz.kaartTitel}><Plug size={18} /> Automatische koppeling</h2>
          <span className={`${kz.badge} ${koppelingAan ? kz.badgeGroen : ""}`}>{koppelingAan ? "Aan" : "Uit"}</span>
        </div>
        <p className={kz.sub} style={{ marginTop: 0 }}>
          Zo hoef je niet alles zelf in te vullen. Beavr, Zapier of Make kan bij een getekende offerte vanzelf een dossier aanmaken,
          met afspraken, werken, documenten en foto&apos;s. Je krijgt de link van de klant terug om door te sturen.
        </p>
        <ul className={kz.puntLijst} style={{ margin: "14px 0" }}>
          <li><span className={kz.puntStip} />Adres: <code>POST https://www.mos-x.be/api/klantenzone/koppeling</code></li>
          <li><span className={kz.puntStip} />Kop: <code>Authorization: Bearer &lt;KLANTENZONE_API_KEY&gt;</code></li>
          <li><span className={kz.puntStip} />Zelfde externId opnieuw sturen = het dossier aanvullen, niet dubbel aanmaken.</li>
        </ul>
        <pre className={kz.code}>{VOORBEELD}</pre>
        {!koppelingAan && <p className={kz.melding}>Zet in Vercel een geheime instelling <strong>KLANTENZONE_API_KEY</strong> (een lange willekeurige code) om de koppeling aan te zetten.</p>}
      </section>

      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}>Wat vanzelf gebeurt</h2></div>
        <ul className={kz.puntLijst}>
          <li><span className={kz.puntStip} />Een werk met de datum van vandaag staat op &quot;Bezig&quot;, van gisteren op &quot;Klaar&quot;.</li>
          <li><span className={kz.puntStip} />Gestart = Uitvoering. Alle werken klaar = Oplevering. Twee weken later = Nazorg.</li>
          <li><span className={kz.puntStip} />Garantie en volgende controle starten vanaf de opleverdatum.</li>
          <li><span className={kz.puntStip} />Afgewerkte werken komen vanzelf in het dakdossier.</li>
          <li><span className={kz.puntStip} />Een maand voor de onderhoudsmaand krijgt de klant één mail met &quot;Plan mijn onderhoud&quot; (niet als hij acties uitzette). Jij krijgt een overzicht.</li>
          <li><span className={kz.puntStip} />Rond de 12-maandencontrole en bij nieuwe foto&apos;s, documenten en statuswijzigingen krijgt de klant een korte mail.</li>
          <li><span className={kz.puntStip} />Een persoonlijk bericht bovenaan verdwijnt na een week vanzelf.</li>
          <li><span className={kz.puntStip} />Loopt iets anders? Zet het zelf in het dossier: een latere stap blijft altijd staan.</li>
        </ul>
      </section>
    </>
  );
}
