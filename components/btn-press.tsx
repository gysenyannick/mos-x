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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = ref.current;
    if (el) el.setAttribute("data-pressed", "true");

    setTimeout(() => {
      if (el) el.removeAttribute("data-pressed");
      if (target === "_blank") {
        window.open(href, "_blank", rel ?? "noopener noreferrer");
      } else if (href.startsWith("tel:") || href.startsWith("mailto:")) {
        window.location.href = href;
      } else {
        router.push(href);
      }
    }, 220);
  };

  const mergedStyle: React.CSSProperties = {
    ...style,
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
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
}
