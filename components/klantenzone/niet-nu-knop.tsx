"use client";

import { useTransition } from "react";
import { nietNu } from "@/app/klant/actions";
import kz from "./kz.module.css";

export default function NietNuKnop({ klantId, aanbevelingId }: { klantId: string; aanbevelingId: string }) {
  const [bezig, start] = useTransition();
  return (
    <button
      type="button"
      className={`${kz.knop} ${kz.knopLicht} ${kz.knopKlein}`}
      disabled={bezig}
      onClick={() => start(() => nietNu(klantId, aanbevelingId))}
    >
      Nu niet
    </button>
  );
}
