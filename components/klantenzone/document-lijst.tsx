"use client";

import { createElement, useEffect, useState } from "react";
import { ClipboardCheck, Download, Eye, FileSearch, FileText, FlaskConical, Package, Receipt, ShieldCheck, X } from "lucide-react";
import { DOC_TYPE_LABEL, type DocType, type Document } from "@/lib/klantenzone/types";

const ICOON: Record<DocType, typeof FileText> = {
  offerte: FileText,
  voorschot: Receipt,
  factuur: Receipt,
  garantie: ShieldCheck,
  oplevering: ClipboardCheck,
  inspectie: FileSearch,
  fiche: FlaskConical,
  product: Package,
  andere: FileText,
};
import kz from "./kz.module.css";

type Props = {
  documenten: Document[];
  /** Datums en bedragen op de server opgemaakt (zelfde notatie overal) */
  labels: Record<string, { datum: string; bedrag?: string }>;
};

/** Documenten met een ingebouwde viewer: klik om te bekijken, of download. */
export default function DocumentLijst({ documenten, labels }: Props) {
  const [open, setOpen] = useState<Document | null>(null);

  useEffect(() => {
    if (!open) return;
    const toets = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", toets);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", toets); document.body.style.overflow = ""; };
  }, [open]);

  const isPdf = (d: Document) => /\.pdf($|\?)/i.test(d.url);

  return (
    <>
      <ul className={kz.lijst}>
        {documenten.map((d) => (
          <li key={d.id} className={kz.rij}>
            <button type="button" className={kz.docKlik} onClick={() => setOpen(d)} aria-label={`${d.titel} bekijken`}>
              <span className={kz.rijIcoon}>{createElement(ICOON[d.type] ?? FileText, { size: 18 })}</span>
              <span className={kz.rijMidden}>
                <span className={kz.rijTitel} style={{ display: "block" }}>{d.titel}</span>
                <span className={kz.rijSub} style={{ display: "block" }}>
                  {DOC_TYPE_LABEL[d.type]} · {labels[d.id]?.datum}{labels[d.id]?.bedrag ? ` · ${labels[d.id].bedrag}` : ""}
                </span>
                {d.status === "betaald" && <span className={`${kz.badge} ${kz.badgeGroen} ${kz.docStatus}`}>Betaald</span>}
                {d.status === "open" && <span className={`${kz.badge} ${kz.badgeAmber} ${kz.docStatus}`}>Te betalen</span>}
              </span>
            </button>
            <div className={kz.rijRechts}>
              <button type="button" className={`${kz.icoonKnop} ${kz.verbergMobiel}`} onClick={() => setOpen(d)} aria-label="Bekijken"><Eye size={16} /></button>
              <a className={kz.icoonKnop} href={d.url} download target="_blank" rel="noopener" aria-label="Downloaden"><Download size={16} /></a>
            </div>
          </li>
        ))}
      </ul>

      {open && (
        <div className={kz.viewerAchter} onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.titel}>
          <div className={kz.viewer} onClick={(e) => e.stopPropagation()}>
            <div className={kz.viewerKop}>
              <div style={{ minWidth: 0 }}>
                <p className={kz.rijTitel}>{open.titel}</p>
                <p className={kz.rijSub}>{DOC_TYPE_LABEL[open.type]} · {labels[open.id]?.datum}{labels[open.id]?.bedrag ? ` · ${labels[open.id].bedrag}` : ""}</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <a className={`${kz.knop} ${kz.knopKlein}`} href={open.url} download target="_blank" rel="noopener"><Download size={15} /> Download</a>
                <button type="button" className={kz.icoonKnop} onClick={() => setOpen(null)} aria-label="Sluiten"><X size={18} /></button>
              </div>
            </div>
            <div className={kz.viewerInhoud}>
              {isPdf(open) ? (
                <iframe src={open.url} title={open.titel} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={open.url} alt={open.titel} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
