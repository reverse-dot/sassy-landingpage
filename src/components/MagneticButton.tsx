import { useEffect, useRef, type ReactNode, type MouseEventHandler } from "react";
import { damp, lerp, pointerEffectsEnabled } from "../motion/env";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler;
  variant?: "primary" | "secondary" | "ghost" | "light";
  size?: "md" | "lg";
  className?: string;
  /** 0..1 — how strongly the button is pulled toward the cursor. */
  strength?: number;
  type?: "button" | "submit";
  "aria-label"?: string;
};

/**
 * Button/link that is softly attracted to the cursor. The label travels a
 * little further than the shell, which gives it a sense of depth. Uses its
 * own short-lived rAF loop that stops as soon as it settles.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  strength = 0.32,
  type = "button",
  ...rest
}: Props) {
  const shell = useRef<HTMLElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = shell.current;
    const inner = label.current;
    if (!el || !inner || !pointerEffectsEnabled()) return;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let last = 0;
    const MAX = 12;

    const loop = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      const t = damp(0.16, dt);
      cur.x = lerp(cur.x, target.x, t);
      cur.y = lerp(cur.y, target.y, t);
      el.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`;
      inner.style.transform = `translate3d(${(cur.x * 0.45).toFixed(2)}px, ${(cur.y * 0.45).toFixed(2)}px, 0)`;
      if (Math.abs(cur.x - target.x) < 0.02 && Math.abs(cur.y - target.y) < 0.02) {
        raf = 0;
        last = 0;
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
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      target.x = Math.max(-MAX, Math.min(MAX, dx * strength));
      target.y = Math.max(-MAX, Math.min(MAX, dy * strength));
      wake();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      wake();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  const cls = ["btn", `btn--${variant}`, `btn--${size}`, "magnetic", className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <span ref={label} className="btn__label">
      {children}
    </span>
  );

  return href ? (
    <a ref={shell as never} href={href} className={cls} onClick={onClick} {...rest}>
      {content}
    </a>
  ) : (
    <button ref={shell as never} type={type} className={cls} onClick={onClick} {...rest}>
      {content}
    </button>
  );
}
