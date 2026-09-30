import type { CSSProperties, ReactNode } from "react";

/* Original hand-drawn marks. Each path uses pathLength="1" so the
   `.draw` utility in motion.css can animate it on regardless of length. */

type MarkProps = {
  className?: string;
  style?: CSSProperties;
  color?: string;
  width?: number;
  delay?: number;
};

export function HandCircle({ className, style, color = "var(--pen-red)", width = 2.2, delay = 0 }: MarkProps) {
  return (
    <svg
      className={["hand-mark draw", className].filter(Boolean).join(" ")}
      viewBox="0 0 120 48"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ ...style, ["--draw-delay" as string]: `${delay}ms` }}
    >
      <path
        pathLength={1}
        d="M14 30C6 18 30 5 64 4c30-1 52 7 52 20 0 13-28 21-58 20C28 43 6 36 7 24 8 14 26 8 44 7"
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function HandUnderline({ className, style, color = "var(--sky-500)", width = 3, delay = 0 }: MarkProps) {
  return (
    <svg
      className={["hand-mark draw", className].filter(Boolean).join(" ")}
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ ...style, ["--draw-delay" as string]: `${delay}ms` }}
    >
      <path
        pathLength={1}
        d="M3 11c30-5 62-7 96-6 30 1 58 3 98-2"
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function HandArrow({
  className,
  style,
  color = "var(--pen)",
  width = 2,
  delay = 0,
  variant = "curve",
}: MarkProps & { variant?: "curve" | "loop" | "down" }) {
  const d =
    variant === "loop"
      ? "M4 40c18-4 30-20 22-30-7-9-20 2-12 12 10 12 38 12 72-4"
      : variant === "down"
        ? "M30 4c-14 14-18 30-6 46"
        : "M4 34C30 8 64 4 94 18";
  const head =
    variant === "loop"
      ? "M76 10l12 8-13 5"
      : variant === "down"
        ? "M14 44l10 8 8-11"
        : "M82 9l13 9-13 7";
  return (
    <svg
      className={["hand-mark draw", className].filter(Boolean).join(" ")}
      viewBox="0 0 100 56"
      aria-hidden="true"
      style={{ ...style, ["--draw-delay" as string]: `${delay}ms` }}
    >
      <path pathLength={1} d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path
        pathLength={1}
        d={head}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transitionDelay: `${delay + 650}ms` }}
      />
    </svg>
  );
}

export function Signature({ className, color = "var(--pen)" }: { className?: string; color?: string }) {
  return (
    <svg className={["hand-mark draw", className].filter(Boolean).join(" ")} viewBox="0 0 120 40" aria-hidden="true">
      <path
        pathLength={1}
        d="M4 30c8-18 14-24 16-18s-8 20-2 20 12-26 18-22-6 18 0 18 10-14 14-14 2 10 8 10 10-12 16-12 4 8 10 8 18-6 30-10"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A sheet of ruled paper with a torn-ish top edge and a margin line. */
export function Paper({
  children,
  className,
  style,
  tone = "paper",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  tone?: "paper" | "sticky" | "sky";
}) {
  return (
    <div className={["paper", `paper--${tone}`, className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}
