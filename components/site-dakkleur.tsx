"use client";

import { useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, House, Loader2, RotateCcw, Sparkles, Sun, Upload } from "lucide-react";
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

function VoorNa({ voor, na }: { voor: string; na: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="dk-vn">
      <img src={na} alt="Na: dak in de nieuwe kleur" />
      <img src={voor} alt="Voor: dak zoals het nu is" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <div className="dk-vn-lijn" style={{ left: `${pos}%` }}><span>‹ ›</span></div>
      <span className="dk-vn-tag">Voor</span>
      <span className="dk-vn-tag dk-vn-na">Na</span>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Schuif tussen voor en na" />
    </div>
  );
}

const STAPPEN = ["Foto", "Kleur", "Resultaat"];

/** Dakkleur-tool in drie stappen, rechtstreeks op de pagina. */
export default function SiteDakkleur() {
  const [stap, setStap] = useState(0);
  const [foto, setFoto] = useState<string | null>(null);
  const [kleur, setKleur] = useState<DakkleurId | null>(null);
  const [beeld, setBeeld] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [sleep, setSleep] = useState(false);
  const invoer = useRef<HTMLInputElement>(null);
  const gekozen = DAKKLEUREN.find((k) => k.id === kleur);

  async function kiesFoto(bestand?: File) {
    if (!bestand) return;
    if (!bestand.type.startsWith("image/")) { setFout("Kies een foto (JPG, PNG of WebP)."); return; }
    setFout(null);
    try { setFoto(await verkleinFoto(bestand)); } catch { setFout("Die foto kunnen we niet openen. Probeer een JPG of PNG."); }
  }

  async function kleurIn() {
    if (!foto || !kleur) return;
    setStap(2); setBezig(true); setFout(null); setBeeld(null);
    try {
      const r = await fetch("/api/dakkleur", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ foto, kleur }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.beeld) throw new Error(d.fout ?? "Het lukte niet om je dak in te kleuren.");
      setBeeld(d.beeld);
    } catch (e) {
      setFout(e instanceof Error ? e.message : "Er ging iets mis.");
    } finally {
      setBezig(false);
    }
  }

  function opnieuw() { setStap(0); setFoto(null); setKleur(null); setBeeld(null); setFout(null); }

  return (
    <section id="dakkleur" className="dk">
      <style>{`
        .dk { padding: 96px 24px; background: radial-gradient(800px 420px at 50% 0%, rgba(155,203,108,0.16), transparent 65%), linear-gradient(160deg, #1E3324 0%, #0B0F0C 75%); }
        .dk-kop { max-width: 640px; margin: 0 auto 36px; text-align: center; }
        .dk-oog { margin: 0 0 14px; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #B9DE95; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .dk-kop h2 { margin: 0 0 14px; font-size: clamp(1.9rem, 3.4vw, 2.7rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.028em; color: #FFFFFF; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .dk-kop h2 span { display: block; color: #9BCB6C; }
        .dk-kop p { margin: 0; font-size: 16.5px; line-height: 1.7; color: rgba(255,255,255,0.72); font-family: var(--font-inter), system-ui, sans-serif; }

        .dk-kaart { max-width: 880px; margin: 0 auto; padding: 30px 36px 32px; border-radius: 24px; background: #FFFFFF; box-shadow: 0 40px 90px -40px rgba(0,0,0,0.8); }
        .dk-stappen { display: flex; justify-content: center; gap: 8px; margin: 0 0 26px; padding: 0 0 20px; border-bottom: 1px solid #E5E7EB; }
        .dk-stappen li { list-style: none; display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #B0B6AC; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .dk-stappen li + li::before { content: ""; width: 34px; height: 2px; margin-right: 8px; border-radius: 1px; background: #E5E7EB; }
        .dk-stappen i { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; letter-spacing: 0; background: #F2F4F0; color: #8E8E89; }
        .dk-stappen li.aan { color: #1A1A1A; }
        .dk-stappen li.aan i { background: #9BCB6C; color: #FFFFFF; }
        .dk-stappen li.klaar i { background: #EEF6E6; color: #5E8F38; }
        .dk-kaart h3 { margin: 0 0 18px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }

        .dk-tip { display: flex; align-items: center; gap: 18px; margin-bottom: 16px; padding: 18px 20px; border-radius: 16px; background: #F7F8F6; border: 1px solid #E5E7EB; }
        .dk-tip > i { width: 52px; height: 52px; flex: none; border-radius: 14px; display: grid; place-items: center; background: #FFFFFF; border: 1px solid #E5E7EB; }
        .dk-tip b { display: block; margin-bottom: 8px; font-size: 14.5px; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .dk-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .dk-chips span { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; background: #FFFFFF; border: 1px solid #E5E7EB; font-size: 13px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }

        .dk-drop { position: relative; display: grid; place-items: center; align-content: center; gap: 10px; min-height: 260px; padding: 24px; border-radius: 18px; border: 2px dashed #CFD5CA; background: #FFFFFF; text-align: center; cursor: pointer; transition: border-color .2s ease, background-color .2s ease; }
        .dk-drop:hover, .dk-drop.sleep { border-color: #9BCB6C; background: #F7FBF3; }
        .dk-drop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; }
        .dk-drop > i { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: #EEF6E6; }
        .dk-drop b { font-size: 16.5px; color: #1A1A1A; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .dk-gsm { display: none; }
        .dk-drop small { font-size: 13.5px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }
        .dk-drop.met-foto { padding: 0; min-height: 0; border-style: solid; overflow: hidden; }
        .dk-drop.met-foto img { width: 100%; max-height: 420px; object-fit: contain; display: block; background: #F7F8F6; }
        .dk-wissel { position: absolute; right: 12px; bottom: 12px; display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 999px; background: rgba(255,255,255,0.95); color: #1A1A1A; font-size: 13px; font-weight: 600; font-family: var(--font-inter), system-ui, sans-serif; box-shadow: 0 4px 14px rgba(0,0,0,0.15); }

        .dk-kleuren { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 12px; }
        .dk-kleur { display: grid; justify-items: center; gap: 8px; padding: 14px 6px; border-radius: 16px; border: 1px solid #E5E7EB; background: #FFFFFF; cursor: pointer; font-size: 13px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; transition: border-color .2s ease, box-shadow .2s ease, transform .15s ease; }
        .dk-kleur:hover { border-color: #CFE5B8; transform: translateY(-2px); }
        .dk-kleur:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 2px; }
        .dk-kleur[aria-pressed="true"] { border-color: #9BCB6C; box-shadow: 0 0 0 3px rgba(155,203,108,0.25); color: #1A1A1A; font-weight: 600; }
        .dk-kleur i { width: 48px; height: 48px; border-radius: 12px; display: grid; place-items: center; color: #FFFFFF; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), 0 4px 10px -4px rgba(0,0,0,0.35); }
        .dk-kleur i svg { opacity: 0; }
        .dk-kleur[aria-pressed="true"] i svg { opacity: 1; }
        .dk-kleur-noot { margin: 14px 0 0; font-size: 13px; color: #8E8E89; text-align: center; font-family: var(--font-inter), system-ui, sans-serif; }

        .dk-vn { position: relative; aspect-ratio: 4 / 3; border-radius: 16px; overflow: hidden; background: #F7F8F6; user-select: none; }
        .dk-vn img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .dk-vn-lijn { position: absolute; top: 0; bottom: 0; width: 3px; margin-left: -1.5px; background: #fff; pointer-events: none; }
        .dk-vn-lijn span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 42px; height: 42px; border-radius: 50%; background: #fff; display: grid; place-items: center; font-weight: 800; font-size: 13px; letter-spacing: 2px; box-shadow: 0 4px 14px rgba(0,0,0,0.25); }
        .dk-vn-tag { position: absolute; top: 14px; left: 14px; padding: 6px 11px; border-radius: 999px; background: rgba(11,15,12,0.72); color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; font-family: var(--font-montserrat), system-ui, sans-serif; }
        .dk-vn-na { left: auto; right: 14px; background: #9BCB6C; color: #0B0F0C; }
        .dk-vn input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; }
        .dk-laden { min-height: 300px; display: grid; place-items: center; align-content: center; gap: 14px; border-radius: 16px; background: #F7F8F6; text-align: center; font-size: 15px; color: #545454; font-family: var(--font-inter), system-ui, sans-serif; }
        .dk-laden svg { animation: dk-draai 1s linear infinite; }
        @keyframes dk-draai { to { transform: rotate(360deg); } }
        .dk-fout { margin: 14px 0 0; padding: 14px 16px; border-radius: 12px; background: #FDF2F1; color: #B42318; font-size: 14.5px; font-family: var(--font-inter), system-ui, sans-serif; }

        .dk-knoppen { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 22px; }
        .dk-knop { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 52px; padding: 0 24px; border-radius: 10px; border: 0; font-size: 15px; font-weight: 700; text-decoration: none; cursor: pointer; font-family: var(--font-montserrat), system-ui, sans-serif; transition: background-color .2s ease, border-color .2s ease, transform .15s ease; }
        .dk-knop:active { transform: translateY(1px); }
        .dk-knop:focus-visible { outline: 2px solid #1A1A1A; outline-offset: 3px; }
        .dk-knop-g { background: #9BCB6C; color: #FFFFFF; box-shadow: 0 10px 24px -12px rgba(122,181,78,0.9); }
        .dk-knop-g:hover { background: #7AB54E; }
        .dk-knop-g:disabled { background: #C9CFC4; box-shadow: none; cursor: default; }
        .dk-knop-l { background: #FFFFFF; color: #1A1A1A; border: 1px solid #E5E7EB; }
        .dk-knop-l:hover { border-color: #9BCB6C; background: #F7FBF3; }
        .dk-knop-l:disabled { opacity: 0.5; cursor: default; }
        .dk-noot { margin: 16px 0 0; text-align: center; font-size: 12.5px; color: #8E8E89; font-family: var(--font-inter), system-ui, sans-serif; }

        @media (max-width: 760px) {
          .dk { padding: 72px 16px; }
          .dk-kaart { padding: 22px 18px 24px; border-radius: 20px; }
          .dk-stappen li + li::before { width: 14px; margin-right: 4px; }
          .dk-stappen li { font-size: 11px; gap: 6px; }
          .dk-tip > i { display: none; }
          .dk-pc { display: none; }
          .dk-gsm { display: block; }
          .dk-kleuren { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
          .dk-kleur { padding: 10px 4px; font-size: 12px; }
          .dk-kleur i { width: 40px; height: 40px; }
          .dk-knop { padding: 0 18px; }
        }
        @media (prefers-reduced-motion: reduce) { .dk-laden svg { animation: none; } }
      `}</style>

      <div className="dk-kop">
        <p className="dk-oog">Dakkleur-tool</p>
        <h2>Benieuwd hoe je dak eruitziet <span>in een nieuwe kleur?</span></h2>
        <p>Upload een foto van je woning, kies een kleur en onze AI toont meteen het resultaat. Gratis en vrijblijvend.</p>
      </div>

      <div className="dk-kaart">
        <ol className="dk-stappen" aria-label="Stappen">
          {STAPPEN.map((s, i) => (
            <li key={s} className={i === stap ? "aan" : i < stap ? "klaar" : ""}><i>{i < stap ? <Check size={13} strokeWidth={3} /> : i + 1}</i>{s}</li>
          ))}
        </ol>

        {stap === 0 && (
          <>
            <h3>Upload een foto van je woning</h3>
            <div className="dk-tip">
              <i><House size={26} color="#9BCB6C" /></i>
              <div>
                <b>Tip voor de beste foto</b>
                <div className="dk-chips">
                  <span><Sun size={14} color="#9BCB6C" />Bij daglicht</span>
                  <span><House size={14} color="#9BCB6C" />Recht van voren</span>
                  <span><Check size={14} color="#9BCB6C" />Dak goed in beeld</span>
                </div>
              </div>
            </div>
            <div
              className={`dk-drop${sleep ? " sleep" : ""}${foto ? " met-foto" : ""}`}
              role="button"
              tabIndex={0}
              aria-label="Kies een foto van je woning"
              onClick={() => invoer.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); invoer.current?.click(); } }}
              onDragOver={(e) => { e.preventDefault(); setSleep(true); }}
              onDragLeave={() => setSleep(false)}
              onDrop={(e) => { e.preventDefault(); setSleep(false); kiesFoto(e.dataTransfer.files?.[0]); }}
            >
              {foto ? (
                <>
                  <img src={foto} alt="Jouw foto" />
                  <span className="dk-wissel"><RotateCcw size={14} />Andere foto</span>
                </>
              ) : (
                <>
                  <i><Upload size={26} color="#5E8F38" /></i>
                  <b className="dk-pc">Sleep een foto hierheen of klik om te kiezen</b>
                  <b className="dk-gsm">Tik om een foto te kiezen</b>
                  <small>JPG, PNG of WebP</small>
                </>
              )}
            </div>
            <input ref={invoer} type="file" accept="image/*" hidden onChange={(e) => { kiesFoto(e.target.files?.[0]); e.target.value = ""; }} />
            {fout && <p className="dk-fout" role="alert">{fout}</p>}
            <div className="dk-knoppen">
              <span />
              <button type="button" className="dk-knop dk-knop-g" disabled={!foto} onClick={() => setStap(1)}>Kies een kleur<ChevronRight size={17} /></button>
            </div>
          </>
        )}

        {stap === 1 && (
          <>
            <h3>Kies een kleur voor je dak</h3>
            <div className="dk-kleuren" role="group" aria-label="Kies een dakkleur">
              {DAKKLEUREN.map((k) => (
                <button key={k.id} type="button" className="dk-kleur" aria-pressed={kleur === k.id} onClick={() => setKleur(k.id)}>
                  <i style={{ background: k.hex }}><Check size={20} strokeWidth={3} /></i>
                  {k.naam}
                </button>
              ))}
            </div>
            <p className="dk-kleur-noot">De kleuren op je scherm zijn een benadering. Tijdens het plaatsbezoek tonen we je de echte stalen.</p>
            <div className="dk-knoppen">
              <button type="button" className="dk-knop dk-knop-l" onClick={() => setStap(0)}><ChevronLeft size={17} />Terug</button>
              <button type="button" className="dk-knop dk-knop-g" disabled={!kleur} onClick={kleurIn}><Sparkles size={17} />Toon mijn dak</button>
            </div>
          </>
        )}

        {stap === 2 && (
          <>
            <h3>{bezig ? "Je dak wordt ingekleurd" : beeld ? `Jouw dak in ${gekozen?.naam.toLowerCase()}` : "Dat lukte niet"}</h3>
            {bezig && <div className="dk-laden"><Loader2 size={34} color="#9BCB6C" />Even geduld, dit duurt een paar seconden.</div>}
            {!bezig && beeld && foto && <VoorNa voor={foto} na={beeld} />}
            {!bezig && fout && <p className="dk-fout" role="alert">{fout}</p>}
            <div className="dk-knoppen">
              <button type="button" className="dk-knop dk-knop-l" onClick={() => setStap(1)} disabled={bezig}><ChevronLeft size={17} />Andere kleur</button>
              {beeld ? (
                <a className="dk-knop dk-knop-g" href="#calculator">Bereken je richtprijs<ChevronRight size={17} /></a>
              ) : (
                <button type="button" className="dk-knop dk-knop-l" onClick={opnieuw} disabled={bezig}><RotateCcw size={16} />Opnieuw</button>
              )}
            </div>
          </>
        )}

        <p className="dk-noot">AI-voorbeeld: de echte kleur kan licht afwijken. Je foto wordt niet bewaard.</p>
      </div>
    </section>
  );
}
