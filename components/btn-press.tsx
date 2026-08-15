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

  const navigate = () => {
    const el = ref.current;
    if (el) el.removeAttribute("data-pressed");
    if (target === "_blank") {
      window.open(href, "_blank", rel ?? "noopener noreferrer");
    } else if (href.startsWith("tel:") || href.startsWith("mailto:")) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  const handlePointerDown = () => {
    const el = ref.current;
    if (el) el.setAttribute("data-pressed", "true");
    // Navigate after animation is visible
    navTimer.current = setTimeout(navigate, 200);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Click fires after pointerDown on mobile — navigation already scheduled
    // On desktop without pointerDown having fired, trigger it now
    if (!ref.current?.hasAttribute("data-pressed")) {
      handlePointerDown();
    }
  };

  const handlePointerCancel = () => {
    // Finger moved away — cancel navigation, remove pressed state
    if (navTimer.current) clearTimeout(navTimer.current);
    const el = ref.current;
    if (el) el.removeAttribute("data-pressed");
  };

  const mergedStyle: React.CSSProperties = {
    ...style,
    WebkitTapHighlightColor: "transparent",
    transition: `transform 120ms ease, opacity 120ms ease${style?.transition ? ", " + style.transition : ""}`,
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
