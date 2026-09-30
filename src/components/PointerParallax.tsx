import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { subscribePointer } from "../motion/pointer";
import { pointerEffectsEnabled } from "../motion/env";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Max translation in px for a layer of depth 1. */
  range?: number;
  /** Max rotation in degrees for a layer of depth 1. */
  rotate?: number;
  style?: CSSProperties;
  as?: "div" | "section";
};

/**
 * Drives every descendant `[data-depth]` layer from the shared, lerped
 * pointer. Deeper layers travel further; negative depth moves against the
 * cursor. Effect is paused while the container is off-screen.
 */
export function PointerParallax({
  children,
  className,
  range = 22,
  rotate = 2.2,
  style,
  as: Tag = "div",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !pointerEffectsEnabled()) return;

    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]")).map((el) => ({
      el,
      depth: parseFloat(el.dataset.depth || "0"),
      rot: parseFloat(el.dataset.rot ?? "1"),
    }));

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(root);

    const unsub = subscribePointer(({ x, y }) => {
      if (!visible) return;
      for (const l of layers) {
        const tx = x * range * l.depth;
        const ty = y * range * l.depth;
        const r = x * rotate * l.depth * l.rot;
        l.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotate(${r.toFixed(3)}deg)`;
      }
    });

    return () => {
      unsub();
      io.disconnect();
      layers.forEach((l) => (l.el.style.transform = ""));
    };
  }, [range, rotate]);

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}

type LayerProps = {
  depth: number;
  /** Multiplier on rotation (0 disables rotation for this layer). */
  rot?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  "aria-hidden"?: boolean;
};

/** A single parallax layer. Put CSS animations on its children, not on it. */
export function Layer({ depth, rot = 1, className, style, children, ...rest }: LayerProps) {
  return (
    <div
      data-depth={depth}
      data-rot={rot}
      className={["px-layer", className].filter(Boolean).join(" ")}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
