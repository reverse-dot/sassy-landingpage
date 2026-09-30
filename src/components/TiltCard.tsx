import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { damp, lerp, pointerEffectsEnabled } from "../motion/env";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Keep it small — this is a nudge, not a flip. */
  max?: number;
  /** Adds a soft light that follows the cursor (uses --mx / --my). */
  spotlight?: boolean;
  style?: CSSProperties;
  as?: "div" | "article" | "li" | "figure";
};

/**
 * Card that leans very slightly toward the cursor and exposes the local
 * pointer position as CSS vars for highlights. Lerped, rAF-driven, sleeps
 * when settled.
 */
export function TiltCard({
  children,
  className,
  max = 3,
  spotlight = true,
  style,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !pointerEffectsEnabled()) return;
    const target = { rx: 0, ry: 0 };
    const cur = { rx: 0, ry: 0 };
    let raf = 0;
    let last = 0;

    const loop = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      const t = damp(0.12, dt);
      cur.rx = lerp(cur.rx, target.rx, t);
      cur.ry = lerp(cur.ry, target.ry, t);
      el.style.transform = `perspective(1100px) rotateX(${cur.rx.toFixed(3)}deg) rotateY(${cur.ry.toFixed(3)}deg)`;
      if (Math.abs(cur.rx - target.rx) < 0.005 && Math.abs(cur.ry - target.ry) < 0.005) {
        raf = 0;
        last = 0;
        if (target.rx === 0 && target.ry === 0) el.style.transform = "";
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      target.ry = (px - 0.5) * 2 * max;
      target.rx = -(py - 0.5) * 2 * max;
      if (spotlight) {
        el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      }
      wake();
    };
    const onLeave = () => {
      target.rx = 0;
      target.ry = 0;
      wake();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max, spotlight]);

  return (
    <Tag
      ref={ref as never}
      className={["tilt", spotlight ? "tilt--spot" : "", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </Tag>
  );
}
