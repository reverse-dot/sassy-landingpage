import { useLayoutEffect, useRef, type ReactNode } from "react";

type Props = {
  /** Design-space size of the composition, in px. */
  width: number;
  height: number;
  className?: string;
  children: ReactNode;
  /** Upper bound on scale so it never grows past its designed size. */
  maxScale?: number;
};

/**
 * Lays out an absolutely-positioned composition at a fixed design size and
 * scales it uniformly to fit its container width. Keeps intricate
 * illustrations pixel-consistent from 320px phones to wide desktops.
 */
export function ScaledStage({ width, height, className, children, maxScale = 1 }: Props) {
  const outer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const set = () => {
      const k = Math.min(maxScale, el.clientWidth / width);
      el.style.setProperty("--k", k.toFixed(4));
      el.style.height = `${Math.round(height * k)}px`;
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, maxScale]);

  return (
    <div ref={outer} className={["stage", className].filter(Boolean).join(" ")}>
      <div className="stage__inner" style={{ width, height }}>
        {children}
      </div>
    </div>
  );
}
