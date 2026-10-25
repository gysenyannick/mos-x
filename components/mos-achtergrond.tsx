type Hoek = "linksonder" | "rechtsboven" | "linksboven" | "rechtsonder";

const POSITIE: Record<Hoek, string> = {
  linksonder: "0% 100%",
  rechtsboven: "100% 0%",
  linksboven: "0% 0%",
  rechtsonder: "100% 100%",
};

/**
 * Decoratieve achtergrond: een echte foto van bemoste dakpannen, zacht en in grijsgroen,
 * die vanuit een hoek wegvloeit. De ouder moet `position: relative` en `isolation: isolate` hebben.
 */
export default function MosAchtergrond({ hoek = "linksonder", sterkte = 1 }: { hoek?: Hoek; sterkte?: number }) {
  const pos = POSITIE[hoek];
  const links = pos.startsWith("0%");
  // Fotobreedte 640px: laat ook de binnenrand van de foto zacht uitlopen
  const rand = links ? "linear-gradient(to right, #000 0, #000 380px, transparent 620px)" : "linear-gradient(to left, #000 0, #000 380px, transparent 620px)";
  const masker = `radial-gradient(ellipse 70% 85% at ${pos}, #000 0%, rgba(0,0,0,0.55) 40%, transparent 75%), ${rand}`;
  const laag: React.CSSProperties = {
    position: "absolute", inset: 0, pointerEvents: "none",
    WebkitMaskImage: masker, maskImage: masker, WebkitMaskComposite: "source-in", maskComposite: "intersect",
  };
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: -1, isolation: "isolate" }}>
      <div style={{ ...laag, backgroundImage: "url('/images/IMG_4493.JPEG')", backgroundSize: "640px auto", backgroundRepeat: "no-repeat", backgroundPosition: pos, filter: "grayscale(1) sepia(1) hue-rotate(45deg) saturate(1.4) contrast(1.1)", opacity: 0.2 * sterkte }} />
    </div>
  );
}
