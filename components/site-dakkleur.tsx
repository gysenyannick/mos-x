"use client";

import { useRef, useState } from "react";
import { Check, ChevronRight, ImagePlus, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { DAKKLEUREN, type DakkleurId } from "@/lib/dakkleuren";

/** Verkleint de foto in de browser, zodat het uploaden snel gaat en de AI niet te veel kost. */
function verkleinFoto(bestand: File, max = 1536): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(bestand);
    const img = new Image();
    img.onload = () => {
      const schaal = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * schaal);
      c.height = Math.round(img.height * schaal);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.86));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("foto")); };
    img.src = url;
  });
}

function VoorNa({ voor, na, label }: { voor: string; na: string; label?: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="dk-vn">
      <img src={na} alt="Na: dak in de nieuwe kleur" className="dk-vn-img" />
      <img src={voor} alt="Voor: dak zoals het nu is" className="dk-vn-img" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <div className="dk-vn-lijn" style={{ left: `${pos}%` }}><span>‹ ›</span></div>
      <span className="dk-vn-tag" style={{ left: 14 }}>Voor</span>
      <span className="dk-vn-tag dk-vn-tag-na" style={{ right: 14 }}>Na</span>
      {label && <span className="dk-vn-label">{label}</span>}
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Schuif tussen voor en na" className="dk-vn-schuif" />
    </div>
  );
}

export default function SiteDakkleur({ pagina = false }: { pagina?: boolean }) {
  const [foto, setFoto] = useState<string | null>(null);
  const [kleur, setKleur] = useState<DakkleurId>("antraciet");
  const [resultaat, setResultaat] = useState<{ beeld: string; kleur: DakkleurId } | null>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const invoer = useRef<HTMLInputElement>(null);
  const gekozen = DAKKLEUREN.find((k) => k.id === kleur)!;
  const stap = resultaat ? 3 : foto ? 2 : 1;

  async function kiesFoto(bestand?: File) {
    if (!bestand) return;
    setFout(null);
    setResultaat(null);
    try {
      setFoto(await verkleinFoto(bestand));
    } catch {
      setFout("Die foto kunnen we niet openen. Probeer een JPG of PNG.");
    }
  }

  async function kleurIn() {
    if (!foto || bezig) return;
    setBezig(true);
    setFout(null);
    try {
      const r = await fetch("/api/dakkleur", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ foto, kleur }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.beeld) throw new Error(d.fout ?? "Het lukte niet om je dak in te kleuren.");
      setResultaat({ beeld: d.beeld, kleur });
    } catch (e) {
      setFout(e instanceof Error ? e.message : "Er ging iets mis.");
    } finally {
      setBezig(false);
    }
  }

  const resultaatKleur = resultaat && DAKKLEUREN.find((k) => k.id === resultaat.kleur);

  return (
    <section id="dakkleur" className={pagina ? "dk-sectie dk-pagina" : "dk-sectie"}>
      <style>{`
        .dk-sectie { position: relative; overflow: hidden; padding: 104px 24px; background: radial-gradient(900px 520px at 88% 30%, rgba(155,203,108,0.20), transparent 62%), radial-gradient(700px 500px at 0% 100%, rgba(155,203,108,0.08), transparent 60%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 72%); }
        .dk-pagina { min-height: 100vh; padding-top: 160px; display: flex; align-items: center; }
        .dk-pagina .dk-raster { width: 100%; }
        .dk-sectie::before { content: ""; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 22px 22px; mask-image: linear-gradient(90deg, #000 0%, transparent 45%); pointer-events: none; }
        .dk-raster { position: relative; max-width: 1140px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); gap: 64px; align-items: center; }
        .dk-oog { display: flex; align-items: center; gap: 12px; margin: 0 0 18px; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .dk-nieuw { display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 999px; background: #9BCB6C; color: #0B0F0C; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; }
        .dk-titel { margin: 0 0 20px; font-size: clamp(2rem, 3vw, 2.55rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.028em; color: #FFFFFF; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .dk-titel span { color: #9BCB6C; display: block; }
        .dk-tekst { margin: 0 0 32px; max-width: 440px; font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.72); font-family: var(--font-inter), system-ui, sans-serif; }
        .dk-stappen { list-style: none; margin: 0 0 34px; padding: 0; display: grid; gap: 12px; }
        .dk-stappen li { display: grid; grid-template-columns: 36px minmax(0, 1fr); gap: 14px; align-items: center; font-size: 16px; color: rgba(255,255,255,0.88); font-family: var(--font-inter), system-ui, sans-serif; }
        .dk-stappen b { width: 36px; height: 36px; border-radius: 11px; display: grid; place-items: center; background: rgba(255,255,255,0.07); border: 1px solid rgba(155,203,108,0.35); color: #9BCB6C; font-family: var(--font-montserrat), system-ui, sans-serif; font-weight: 800; font-size: 14px; transition: background-color .2s ease, color .2s ease; }
        .dk-stappen li.aan b { background: #9BCB6C; border-color: #9BCB6C; color: #0B0F0C; }
        .dk-merk { display: inline-flex; align-items: center; gap: 12px; padding: 10px 16px 10px 10px; border-radius: 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); font-size: 13.5px; color: rgba(255,255,255,0.75); font-family: var(--font-inter), system-ui, sans-serif; }
        .dk-merk b { color: #fff; font-weight: 600; }
        .dk-waaier { display: flex; }
        .dk-waaier i { width: 16px; height: 30px; border-radius: 4px; margin-right: -5px; box-shadow: 0 0 0 1.5px #16261A; }

        .dk-studio { position: relative; }
        .dk-stalen { position: absolute; z-index: 0; top: -26px; right: -18px; display: flex; pointer-events: none; }
        .dk-stalen i { width: 54px; height: 120px; border-radius: 10px; margin-left: -26px; box-shadow: 0 10px 24px -8px rgba(0,0,0,0.5); transform-origin: bottom center; }
        .dk-kaart { position: relative; z-index: 1; padding: 16px; border-radius: 24px; background: #FFFFFF; box-shadow: 0 2px 16px rgba(0,0,0,0.07), 0 40px 80px -30px rgba(0,0,0,0.6); }
        .dk-balk { display: flex; justify-content: space-between; align-items: center; padding: 4px 6px 14px; }
        .dk-balk-titel { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 800; letter-spacing: -0.01em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .dk-ai { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px; background: #EEF6E6; color: #9BCB6C; font-size: 11px; font-weight: 800; letter-spacing: 0.06em; }
        .dk-punten { display: flex; gap: 6px; }
        .dk-punten i { width: 22px; height: 5px; border-radius: 3px; background: #E5E7EB; transition: background-color .2s ease; }
        .dk-punten i.aan { background: #9BCB6C; }

        .dk-vn, .dk-upload { position: relative; aspect-ratio: 4 / 3; border-radius: 16px; overflow: hidden; background: #F7F8F6; user-select: none; }
        .dk-vn-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .dk-vn-lijn { position: absolute; top: 0; bottom: 0; width: 3px; margin-left: -1.5px; background: #fff; box-shadow: 0 0 12px rgba(0,0,0,0.35); pointer-events: none; }
        .dk-vn-lijn span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; border-radius: 50%; background: #fff; color: #1A1A1A; display: grid; place-items: center; font-weight: 800; font-size: 13px; letter-spacing: 2px; box-shadow: 0 6px 18px rgba(0,0,0,0.3); }
        .dk-vn-tag { position: absolute; top: 14px; padding: 6px 11px; border-radius: 999px; background: rgba(11,15,12,0.72); color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; font-family: var(--font-montserrat), system-ui, sans-serif; pointer-events: none; }
        .dk-vn-tag-na { background: #9BCB6C; color: #0B0F0C; }
        .dk-vn-label { position: absolute; left: 14px; bottom: 14px; padding: 7px 13px; border-radius: 999px; background: rgba(255,255,255,0.94); color: #1A1A1A; font-size: 12.5px; font-weight: 600; font-family: var(--font-inter), system-ui, sans-serif; pointer-events: none; box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
        .dk-vn-schuif { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; }
        .dk-upload img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .dk-wissel { position: absolute; right: 12px; bottom: 12px; display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 999px; border: 0; background: rgba(255,255,255,0.94); color: #1A1A1A; font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--font-inter), system-ui, sans-serif; transition: background-color .2s ease; }
        .dk-wissel:hover { background: #EEF6E6; }
        .dk-wissel:active { transform: translateY(1px); }
        .dk-wissel:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; }
        .dk-laden { position: absolute; inset: 0; display: grid; place-items: center; align-content: center; gap: 12px; background: rgba(11,15,12,0.58); color: #fff; font-weight: 600; font-family: var(--font-inter), system-ui, sans-serif; backdrop-filter: blur(3px); }
        .dk-laden svg, .dk-spin { animation: dk-draai 1s linear infinite; }
        @keyframes dk-draai { to { transform: rotate(360deg); } }

        .dk-kleuren-kop { margin: 18px 6px 12px; display: flex; justify-content: space-between; align-items: baseline; font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #8E8E89; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .dk-kleuren-kop span { display: inline-flex; align-items: center; gap: 8px; text-transform: none; letter-spacing: 0; font-size: 14px; font-weight: 700; color: #1A1A1A; }
        .dk-kleuren-kop span i { width: 12px; height: 12px; border-radius: 4px; }
        .dk-kleuren { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; padding: 0 2px; }
        .dk-kleur { position: relative; display: grid; justify-items: center; gap: 7px; padding: 0; border: 0; background: none; cursor: pointer; font-size: 12px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .dk-kleur i { position: relative; display: grid; place-items: center; width: 100%; max-width: 50px; aspect-ratio: 1; border-radius: 14px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), 0 4px 10px -4px rgba(0,0,0,0.35); transition: transform .15s ease, box-shadow .15s ease; color: #fff; }
        .dk-kleur i::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(145deg, rgba(255,255,255,0.18), transparent 55%); }
        .dk-kleur i svg { opacity: 0; transform: scale(.6); transition: opacity .15s ease, transform .15s ease; position: relative; z-index: 1; }
        .dk-kleur:hover i { transform: translateY(-2px); }
        .dk-kleur:active i { transform: translateY(0); }
        .dk-kleur:focus-visible { outline: none; }
        .dk-kleur:focus-visible i { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1A1A1A; }
        .dk-kleur[aria-pressed="true"] { color: #1A1A1A; font-weight: 600; }
        .dk-kleur[aria-pressed="true"] i { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #9BCB6C, 0 8px 16px -6px rgba(0,0,0,0.4); }
        .dk-kleur[aria-pressed="true"] i svg { opacity: 1; transform: none; }

        .dk-knoppen { margin-top: 18px; display: flex; gap: 10px; flex-wrap: wrap; }
        .dk-knop { flex: 1 1 auto; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 54px; padding: 0 22px; border-radius: 12px; border: 0; background: #9BCB6C; color: #fff; font-size: 15px; font-weight: 700; text-decoration: none; cursor: pointer; font-family: var(--font-montserrat), system-ui, sans-serif; box-shadow: 0 10px 24px -12px rgba(122,181,78,0.9); transition: background-color .2s ease, transform .15s ease; }
        .dk-knop:hover { background: #7AB54E; }
        .dk-knop:active { transform: translateY(1px); }
        .dk-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; }
        .dk-knop:disabled { opacity: 0.6; cursor: default; }
        .dk-knop-licht { background: #fff; color: #1A1A1A; border: 1px solid #CFE5B8; box-shadow: none; }
        .dk-knop-licht:hover { background: #EEF6E6; }
        .dk-fout { margin: 12px 6px 0; font-size: 14px; color: #B42318; font-family: var(--font-inter), system-ui, sans-serif; }
        .dk-noot { margin: 12px 6px 2px; font-size: 12.5px; line-height: 1.5; color: #8E8E89; text-align: center; font-family: var(--font-inter), system-ui, sans-serif; }

        @media (max-width: 960px) {
          .dk-sectie { padding: 72px 20px; }
          .dk-sectie.dk-pagina { padding-top: 124px; }
          .dk-raster { grid-template-columns: minmax(0, 1fr); gap: 40px; }
          .dk-tekst { max-width: none; }
          .dk-stalen { right: -6px; top: -20px; }
          .dk-stalen i { width: 40px; height: 90px; margin-left: -20px; }
        }
        @media (max-width: 520px) {
          .dk-titel { font-size: 1.85rem; }
          .dk-kaart { padding: 12px; border-radius: 20px; }
          .dk-kleuren { grid-template-columns: repeat(4, minmax(0, 1fr)); row-gap: 14px; }
          .dk-knop { width: 100%; }
          .dk-merk { font-size: 12.5px; }
        }
        @media (prefers-reduced-motion: reduce) { .dk-laden svg, .dk-spin { animation: none; } }
      `}</style>

      <div className="dk-raster">
        <div>
          <p className="dk-oog"><span className="dk-nieuw"><Sparkles size={12} />NIEUW</span>Dakkleur-tool</p>
          <h2 className="dk-titel">Benieuwd hoe je dak eruitziet <span>in een nieuwe kleur?</span></h2>
          <p className="dk-tekst">Upload een foto van je woning en kies een kleur uit ons coatinggamma. Onze AI toont je dak meteen in die kleur. Gratis en vrijblijvend.</p>
          <ol className="dk-stappen">
            <li className={stap >= 1 ? "aan" : ""}><b>1</b>Upload een foto van je dak</li>
            <li className={stap >= 2 ? "aan" : ""}><b>2</b>Kies een van de 7 coatingkleuren</li>
            <li className={stap >= 3 ? "aan" : ""}><b>3</b>Bekijk het resultaat en vraag je richtprijs</li>
          </ol>
          <div className="dk-merk">
            <span className="dk-waaier">{DAKKLEUREN.map((k) => <i key={k.id} style={{ background: k.hex }} />)}</span>
            <span><b>7 coatingkleuren</b> · 10 jaar garantie</span>
          </div>
        </div>

        <div className="dk-studio">
          <div className="dk-stalen" aria-hidden="true">
            {["rood", "terra", "fondant"].map((id, i) => (
              <i key={id} style={{ background: DAKKLEUREN.find((k) => k.id === id)!.hex, transform: `rotate(${(i - 1) * 12 + 8}deg)` }} />
            ))}
          </div>
          <div className="dk-kaart">
            <div className="dk-balk">
              <span className="dk-balk-titel">Dakkleur-studio <span className="dk-ai"><Sparkles size={11} />AI</span></span>
              <span className="dk-punten" aria-hidden="true">{[1, 2, 3].map((n) => <i key={n} className={stap >= n ? "aan" : ""} />)}</span>
            </div>

            {resultaat && foto && !bezig ? (
              <VoorNa voor={foto} na={resultaat.beeld} label={`Jouw dak in ${resultaatKleur?.naam.toLowerCase()}`} />
            ) : foto ? (
              <div className="dk-upload">
                <img src={foto} alt="Jouw foto" />
                {!bezig && <button type="button" className="dk-wissel" onClick={() => invoer.current?.click()}><RotateCcw size={14} />Andere foto</button>}
                {bezig && <div className="dk-laden"><Loader2 size={30} />Je dak wordt ingekleurd…</div>}
              </div>
            ) : (
              <VoorNa voor="/images/Before bevel.jpg" na="/images/Na bevel.jpg" label="Voorbeeld: van bruin naar antraciet" />
            )}

            <div className="dk-kleuren-kop">Kies je kleur <span><i style={{ background: gekozen.hex }} />{gekozen.naam}</span></div>
            <div className="dk-kleuren" role="group" aria-label="Kies een dakkleur">
              {DAKKLEUREN.map((k) => (
                <button key={k.id} type="button" className="dk-kleur" aria-pressed={kleur === k.id} onClick={() => setKleur(k.id)}>
                  <i style={{ background: k.hex }}><Check size={18} strokeWidth={3} /></i>
                  {k.naam}
                </button>
              ))}
            </div>

            <input ref={invoer} type="file" accept="image/*" hidden onChange={(e) => { kiesFoto(e.target.files?.[0]); e.target.value = ""; }} />

            <div className="dk-knoppen">
              {!foto ? (
                <button type="button" className="dk-knop" onClick={() => invoer.current?.click()}><ImagePlus size={18} />Upload een foto van je huis</button>
              ) : resultaat && resultaat.kleur === kleur && !bezig ? (
                <>
                  <a href="/#calculator" className="dk-knop">Bereken je richtprijs<ChevronRight size={18} /></a>
                  <button type="button" className="dk-knop dk-knop-licht" onClick={() => { setResultaat(null); invoer.current?.click(); }}>Andere foto</button>
                </>
              ) : (
                <button type="button" className="dk-knop" onClick={kleurIn} disabled={bezig}>
                  {bezig ? <Loader2 size={18} className="dk-spin" /> : <Sparkles size={18} />}
                  {bezig ? "Bezig…" : `Toon mijn dak in ${gekozen.naam.toLowerCase()}`}
                </button>
              )}
            </div>

            {fout && <p className="dk-fout" role="alert">{fout}</p>}
            <p className="dk-noot">AI-voorbeeld: de echte kleur kan licht afwijken. Je foto wordt niet bewaard.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
