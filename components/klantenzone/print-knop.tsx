"use client";

/** Opent het afdrukvenster; daar kies je "Opslaan als PDF". */
export default function PrintKnop({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      {children}
    </button>
  );
}
