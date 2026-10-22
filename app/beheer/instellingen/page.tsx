import { Plug, Settings, Tag, Trash2 } from "lucide-react";
import { isBeheerder } from "@/lib/klantenzone/auth";
import { getInstellingen } from "@/lib/klantenzone/store";
import { EXTRAS } from "@/lib/klantenzone/types";
import { fmtKort, vandaag } from "@/lib/klantenzone/tijd";
import { BevestigKnop } from "@/components/klantenzone/beheer-client";
import { bewaarInstellingen, verwijderActie, voegActieToe } from "../actions";
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

      {/* Acties */}
      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Tag size={18} /> Acties en kortingen</h2></div>
        <p className={kz.sub} style={{ marginTop: 0, marginBottom: 14 }}>Klanten zien een actie bij &quot;Extra&apos;s&quot;, op de dienst waarvoor ze geldt. Verlopen acties verdwijnen vanzelf.</p>
        {(i.acties ?? []).length > 0 && (
          <ul className={kz.lijst} style={{ marginBottom: 16 }}>
            {(i.acties ?? []).map((a) => (
              <li key={a.id} className={kz.rij}>
                <div className={kz.rijMidden}>
                  <p className={kz.rijTitel}>{a.titel}</p>
                  <p className={kz.rijSub}>{a.tekst}</p>
                  <p className={kz.rijSub}>Geldt voor: {EXTRAS.find((x) => x.id === a.extra)?.naam ?? "algemeen"}</p>
                  <p className={kz.rijSub}>{a.geldigTot ? `${a.geldigTot < vandaag() ? "Verlopen op" : "Geldig tot"} ${fmtKort(a.geldigTot)}` : "Geen einddatum"}</p>
                </div>
                <BevestigKnop actie={verwijderActie.bind(null, a.id)} vraag="Actie verwijderen?"><Trash2 size={14} /></BevestigKnop>
              </li>
            ))}
          </ul>
        )}
        <form action={voegActieToe}>
          <div className={kz.velden}>
            <div className={kz.veld}><label htmlFor="atitel">Titel</label><input id="atitel" name="titel" required className={kz.invoer} placeholder="bv. -15% op gootreiniging in november" /></div>
            <div className={kz.veld}>
              <label htmlFor="aextra">Geldt voor</label>
              <select id="aextra" name="extra" className={kz.invoer} defaultValue="">
                <option value="">Algemeen (bovenaan Extra&apos;s)</option>
                {EXTRAS.map((x) => <option key={x.id} value={x.id}>{x.naam}</option>)}
              </select>
            </div>
            <div className={kz.veld}><label htmlFor="atot">Geldig tot (optioneel)</label><input id="atot" name="geldigTot" type="date" className={kz.invoer} /></div>
            <div className={`${kz.veld} ${kz.vol}`}><label htmlFor="atekst">Uitleg</label><textarea id="atekst" name="tekst" className={kz.invoer} placeholder="bv. Na de bladval lopen goten snel vol. Boek je gootreiniging deze maand en krijg 15% korting." /></div>
          </div>
          <div className={kz.rijKnoppen}><button className={`${kz.knop} ${kz.knopPrimair}`}>Actie toevoegen</button></div>
        </form>
      </section>

      {/* Buurvoordeel */}
      <section className={kz.kaart}>
        <div className={kz.kaartKop}><h2 className={kz.kaartTitel}><Settings size={18} /> Reviews en buurvoordeel</h2></div>
        <form action={bewaarInstellingen}>
          <div className={kz.veld} style={{ marginBottom: 14 }}>
            <label htmlFor="googleReviewUrl">Link om een Google-review te schrijven</label>
            <input id="googleReviewUrl" name="googleReviewUrl" type="url" className={kz.invoer} defaultValue={i.googleReviewUrl ?? ""} placeholder="https://g.page/r/.../review" />
            <p className={kz.sub} style={{ fontSize: 13, marginTop: 4 }}>
              Te vinden in je Google-bedrijfsprofiel via &quot;Vraag om reviews&quot;. Na de oplevering vraagt de klantenzone dan
              vanzelf om een review.
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
          <div className={kz.veld}>
            <label htmlFor="burenVoordeel">Wat buren en doorverwijzers krijgen</label>
            <textarea id="burenVoordeel" name="burenVoordeel" className={kz.invoer} defaultValue={i.burenVoordeel ?? ""}
              placeholder="bv. Wordt je buur klant? Dan krijgen jullie allebei € 50 korting op jullie volgende onderhoud." />
            <p className={kz.sub} style={{ fontSize: 13, marginTop: 4 }}>Leeg laten = geen beloning beloven. Kies een bedrag dat je marge toelaat.</p>
          </div>
          <div className={kz.rijKnoppen}><button className={kz.knop}>Opslaan</button></div>
        </form>
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
          <li><span className={kz.puntStip} />Een maand voor de onderhoudsmaand krijgt de klant één mail met           <li><span className={kz.puntStip} />Afgewerkte werken komen vanzelf in de historiek van het dak.</li>quot;Plan mijn onderhoud          <li><span className={kz.puntStip} />Afgewerkte werken komen vanzelf in de historiek van het dak.</li>quot;. Jij krijgt een overzicht.</li>
          <li><span className={kz.puntStip} />Een persoonlijk bericht bovenaan verdwijnt na een week vanzelf.</li>
          <li><span className={kz.puntStip} />Loopt iets anders? Zet het zelf in het dossier: een latere stap blijft altijd staan.</li>
        </ul>
      </section>
    </>
  );
}
