"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

type Props = {
  href: string;
  target?: string;
  rel?: string;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
};

export function BtnPress({ href, target, rel, className = "", style, onMouseEnter, onMouseLeave, children }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressed = useRef(false);

  const navigate = () => {
    const el = ref.current;
    if (el) el.removeAttribute("data-pressed");
    pressed.current = false;
    if (target === "_blank") {
      window.open(href, "_blank", rel ?? "noopener noreferrer");
    } else if (href.startsWith("tel:") || href.startsWith("mailto:")) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  const handlePointerDown = () => {
    if (pressed.current) return;
    pressed.current = true;
    const el = ref.current;
    // rAF forces iOS Safari to paint the state change before navigating
    requestAnimationFrame(() => {
      if (el) el.setAttribute("data-pressed", "true");
      navTimer.current = setTimeout(navigate, 230);
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!pressed.current) handlePointerDown();
  };

  const handlePointerCancel = () => {
    if (navTimer.current) clearTimeout(navTimer.current);
    pressed.current = false;
    const el = ref.current;
    if (el) el.removeAttribute("data-pressed");
  };

  const mergedStyle: React.CSSProperties = {
    ...style,
    WebkitTapHighlightColor: "transparent",
    transition: `transform 150ms ease, opacity 150ms ease${style?.transition ? ", " + style.transition : ""}`,
  };

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      className={`btn-press ${className}`.trim()}
      style={mergedStyle}
      onPointerDown={handlePointerDown}
      onPointerCancel={handlePointerCancel}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
}
