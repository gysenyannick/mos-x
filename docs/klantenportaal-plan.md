# MOS-X klantenportaal — analyse en implementatieplan

Opgesteld op 23 oktober 2026, op basis van de code op branch `klantenzone`.

## 1. Wat er al staat

**Techniek**
- Next.js 16 (App Router, server actions), React 19, TypeScript, CSS-module `components/klantenzone/kz.module.css`.
- Opslag: Upstash Redis (één JSON-document per klant + instellingen), bestanden in Vercel Blob. Lokaal: `.data/klantenzone.json` en `public/_dev-uploads`.
- Per klant een schrijfslot (`wijzigKlant`) zodat gelijktijdige wijzigingen niet verloren gaan.
- Mail via Resend, leads naar Beavr, dagelijkse cron (`/api/klantenzone/herinnering`).

**Toegang**
- Klant: een lange, geheime link `/klant/<token>` (geen wachtwoord, niet geïndexeerd).
- Beheer: één beheerderswachtwoord (`ADMIN_PASSWORD`) met een ondertekende cookie.
- Geen medewerkersrol (Yannick voert alles zelf uit).

**Klantenzone (klant)**
| Onderdeel | Wat het nu doet |
|---|---|
| Overzicht | Begroeting, 4 fases (Planning → Uitvoering → Oplevering → Nazorg), volgende stap, bericht van Yannick, belangrijke melding, review, "Wat er gebeurde" per werkdag, planning met verzetten, vakman, onderhoud, voor/na, open facturen, buurvoordeel |
| Berichten | Gesprek klant ↔ Yannick, mail naar beide kanten |
| Foto's | Fotoverslag per werkdag, voor/na-schuifbalk |
| Documenten | Facturen, garanties, offertes, verslagen, fiches |
| Mijn dak | Dakdossier + PDF, onderhoud, opmerkingen/aandachtspunten met "Vraag een prijs", garantie + certificaat |
| Tips en advies | Vaste tips + eigen tips met foto/document |
| Diensten | Servicekaarten met foto, kortingen, aanvragen |
| Buurvoordeel | Cadeaubon, deellink, tegoed, bonus, voor/na op de uitnodiging |
| Spoed | Knop met telefoonnummer |

**Beheer**
Klantenlijst met fasefilters en "te doen", dossier (link, WhatsApp-knoppen, afspraken, documenten, werken, dakdossier, behandelingen, aanbevelingen, berichten, dagverslag, foto's, doorverwijzingen), vrije momenten, instellingen (tips, dienstfoto's, acties, reviews en buurvoordeel, koppeling met offertesoftware).

**Automatisch**
Fase en werkstatus volgen uit de datums, garantie start bij de oplevering, volgende onderhoudsmaand wordt berekend, onderhoudsherinnering per mail, bericht verdwijnt na een week.

## 2. Vergelijking met de wensenlijst

| Onderdeel uit de wensenlijst | Stand | Wat ontbreekt |
|---|---|---|
| Projectopvolging (fases, foto's, updates) | Grotendeels | Voorbereidingschecklist die de klant afvinkt, melding bij wijziging van een afspraak |
| Dakdossier | Grotendeels | Inspecties als apart type (12-maandencontrole), "wat valt wel/niet onder de garantie" |
| Dakzorg en onderhoud | Deels | Laatste fysieke controle, controlehistoriek, "Vraag een dakcontrole aan" als er geen beoordeling is |
| Diensten + aanvraag | Deels | Foto's toevoegen bij een aanvraag, statussen (ontvangen → offerte → ingepland → uitgevoerd), status zichtbaar voor de klant, diensten beheren in het beheer |
| Burenvoordeel | Deels | Statusflow tot "beloning beschikbaar", beloning pas na volledige betaling, misbruikcontroles, tegoed als onderhoudstegoed (geen cash), voorwaarden, QR-code |
| Mijn voordelen / tegoed | Ontbreekt | Transactielog (toegekend, gebruikt, gecorrigeerd, geannuleerd, vervallen) |
| Acties / campagnes | Basis | Types, doelgroep, regio, periode, maximum, pauzeren, combinatieregels, statistiek |
| Buurtacties | Ontbreekt | Campagnes per postcode/gemeente/route/werkdag, interesse tonen, groepsactie |
| Reviews | Basis | Wegklikken, rechtstreeks feedback geven, tracking van klikken |
| Stormmelding | Basis (enkel bellen) | Formulier met type, foto's, beschrijving, veiligheidsadvies |
| Meldingen | Deels (enkele mails) | Voorkeuren, scheiding operationeel/marketing, toestemming, frequentielimiet |
| Rapportage | Ontbreekt | Referrals, omzet, kosten, conversie, marge |
| Login en rollen | Link + 1 wachtwoord | Zie beslissing A |
| Geautomatiseerde tests | Ontbreekt | Tests voor de kernflows |

## 3. Wat nu niet strookt met de wensenlijst (moet aangepast)

1. **Beloning per overschrijving.** De wensenlijst vraagt een onderhoudstegoed, geen contant geld. Nu staat "per overschrijving" als keuze.
2. **Beloning te vroeg.** Nu telt het tegoed zodra Yannick de buur op "Klant geworden" zet. Volgens de wensenlijst pas na uitvoering en volledige betaling.
3. **Dubbele beloning met einddatum.** Een echte periode is geen nep-aftelklok, maar de wensenlijst wil geen kunstmatige druk. Voorstel: behouden als gewone campagne met voorwaarden, zonder "nog X dagen"-toon.
4. **Onderhoud binnen de garantie.** Bij Marie staat "onderhoud aangeraden in mei 2027" terwijl haar mosgarantie tot november 2027 loopt. Dat mag niet lijken op een voorwaarde voor de garantie. Oplossing: tijdens de garantie de gratis controle tonen, betalend onderhoud pas na de garantie, met een duidelijke zin dat de garantie los staat van onderhoud.
5. **Review.** Een knop om weg te klikken en een knop "Iets niet goed? Laat het ons weten" erbij. Geen beloning (die is er nu ook niet).
6. **"Onze ploeg".** De wensenlijst spreekt over ploegen en medewerkers. MOS-X positioneert Yannick als de persoon die zelf het werk doet. Voorstel: overal "Yannick" houden, medewerkersrol voorzien maar niet tonen zolang hij alleen werkt.
7. **Demo-gegevens.** Duidelijk als demo markeren (bv. een balk "Voorbeeldklant").

## 4. Beslissingen die je zelf moet nemen

**A. Inloggen.** Nu: geheime link. De wensenlijst wil veilige login met rollen.
- Voorstel: inloggen met een code per mail of sms (geen wachtwoord om te onthouden), de link blijft werken als snelle toegang maar vraagt na 30 dagen opnieuw een code. Facturen en garanties via tijdelijke downloadlinks.

**B. Database.** Redis met één document per klant werkt goed voor dossiers. Voor tegoeden, referrals en campagnes heb je een boekhouding nodig die nooit dubbel uitbetaalt en controleerbaar is.
- Voorstel: Postgres (Neon via Vercel, gratis te starten) voor referrals, tegoed-transacties, campagnes, aanvragen, meldingen en de auditlog. Dossiers mogen in een eerste fase in Redis blijven.

**C. Navigatie.** De wensenlijst heeft 8 onderdelen. Voorstel (7, eenvoudig gehouden):
1. Overzicht
2. Mijn werken (planning, fotoverslag, berichten van Yannick)
3. Mijn dakdossier (dakgegevens, documenten, garantie, inspecties)
4. Dakzorg (controles, onderhoud, tips)
5. Diensten (catalogus, aanvragen en hun status)
6. Mijn voordelen (burenvoordeel, acties, buurtacties, tegoed)
7. Hulp en contact (berichten, stormschade melden, profiel en meldingsvoorkeuren)

**D. Bedragen en regels** die je zelf instelt: beloning, minimumopdracht, diensten die meetellen, maximum per klant, geldigheid van tegoed, korting voor de buur, combineerbaar of niet.

## 5. Datamodel (toevoegingen)

Bestaand: `Klant` (met afspraken, werken, fotos, documenten, paspoort, behandelingen, aanbevelingen, aanvragen, opmerkingen, notities, verwijzingen), `Instellingen`, `Momenten`.

Nieuw of uitgebreid:

| Concept | Velden (kort) | Opmerking |
|---|---|---|
| `inspecties` (in Klant) | datum, soort (12 maanden, op vraag), bevindingen, foto's, verslag-pdf | Voor de 12-maandencontrole |
| `checklist` (in Klant) | punt, bevestigd op | Voorbereiding vóór de werken |
| `dienstAanvragen` | klant, dienst, tekst, foto's, status, historiek | Vervangt de huidige vrije `aanvragen` |
| `diensten` | id, naam, uitleg, foto, voordelen, vanafprijs?, actief | Beheerbaar i.p.v. vaste lijst |
| `referralCodes` | klant, code, actief | Bestaat al als `refCode` |
| `referrals` | code, aanbrenger, lead (naam, tel, adres), status, opdrachtwaarde, betaald op, reden afwijzing | Ontdubbeling op telefoon en adres, eigen adres geweigerd |
| `tegoedTransacties` | klant, soort (toegekend, gebruikt, gecorrigeerd, geannuleerd, vervallen), bedrag, bron, idempotentiesleutel, door wie, wanneer | Saldo = som; nooit overschrijven |
| `campagnes` | naam, type, uitleg, foto, periode, doelgroep, regio's (postcodes/gemeenten), diensten, voordeel, maximum, voorwaarden, status, combineerbaar | Verbergt zichzelf na de einddatum |
| `campagneDeelnames` | campagne, klant, interesse/aanvraag, status | Voor conversie en buurtacties |
| `meldingVoorkeuren` | klant, operationeel (altijd), marketing (ja/nee + datum + bron) | Toestemmingslog |
| `meldingen` | klant, soort, kanaal, verzonden op, sleutel | Geen dubbels, frequentielimiet |
| `reviewVerzoeken` | klant, getoond, geklikt, weggeklikt, feedback | Geen beloning |
| `stormMeldingen` | klant, type, tekst, foto's, status | |
| `auditLog` | wie, wat, wanneer, oud/nieuw | Verplicht bij tegoed en referrals |

## 6. Fasering

| Fase | Inhoud | Hangt af van |
|---|---|---|
| 1. Analyse | Dit document | — |
| 2. Basis consistent | Punten uit §3, voorbereidingschecklist, inspecties/12-maandencontrole, garantiepagina (wel/niet gedekt), review wegklikken + feedback, stormmelding als formulier, demo-markering, nieuwe navigatie | Beslissing C |
| 3. Diensten | Beheerbare catalogus, aanvraag met foto's en statussen, opvolging in beheer en voor de klant | — |
| 4. Burenvoordeel | Referralstatussen, beloning na betaling, misbruikcontroles, tegoed-transacties, voorwaarden, QR-code, beheer met goedkeuren en correcties | Beslissing B en D |
| 5. Acties | Campagnes met types, doelgroep, periode, maximum, pauzeren, combinatieregels | Beslissing B |
| 6. Buurtacties | Campagnes per postcode/gemeente/werkdag, interesse tonen, groepsactie | Fase 5 |
| 7. Automatisering | Meldingsvoorkeuren, toestemming, herinneringen (controle, onderhoud), reviewverzoek op het juiste moment, frequentielimiet | Fase 2–6 |
| 8. Rapportage en testen | Cijfers (referrals, omzet, kosten, conversie, marge of "marge onbekend"), geautomatiseerde tests van de kernflows | Alles |

Login (beslissing A) kan los van de fases, best vóór de livegang.

## 7. Risico's

- **Juridisch:** prijsacties, tegoed en marketingmails vallen onder Belgisch consumentenrecht en GDPR. Laat de voorwaarden van het burenvoordeel en de acties nalezen voor je ze publiceert.
- **Garantie:** nergens suggereren dat betalend onderhoud nodig is om de 2 jaar mosgarantie te behouden.
- **Opslag:** tegoeden in een document-opslag zonder transacties kan dubbel uitbetalen. Daarom de keuze voor Postgres bij fase 4.
- **Eenvoud:** de wensenlijst is groot. Je eerdere wens was "super simpel". Elke fase houdt het klantenscherm rustig; nieuwe onderdelen verschijnen pas als ze voor die klant relevant zijn.
