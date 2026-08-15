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
  const isPressed = useRef(false);

  const navigate = () => {
    isPressed.current = false;
    if (target === "_blank") {
      window.open(href, "_blank", rel ?? "noopener noreferrer");
    } else if (href.startsWith("tel:") || href.startsWith("mailto:")) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  const applyPress = () => {
    const el = ref.current;
    if (!el || isPressed.current) return;
    isPressed.current = true;
    // Direct inline style — werkt gegarandeerd op iOS Safari
    el.style.transform = "scale(0.98) translateY(1px)";
    el.style.opacity = "0.88";
    navTimer.current = setTimeout(() => {
      el.style.transform = "";
      el.style.opacity = "";
      navigate();
    }, 230);
  };

  const cancelPress = () => {
    if (navTimer.current) clearTimeout(navTimer.current);
    isPressed.current = false;
    const el = ref.current;
    if (el) {
      el.style.transform = "";
      el.style.opacity = "";
    }
  };

  const handlePointerDown = () => applyPress();
  const handlePointerCancel = () => cancelPress();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isPressed.current) applyPress();
  };

  const mergedStyle: React.CSSProperties = {
    ...style,
    WebkitTapHighlightColor: "transparent",
    transition: `transform 140ms ease, opacity 140ms ease${style?.transition ? ", " + style.transition : ""}`,
  };

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      className={className ? `btn-press ${className}` : "btn-press"}
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
