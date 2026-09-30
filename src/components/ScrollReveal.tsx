import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { useInView } from "../motion/hooks";

type Variant = "up" | "fade" | "mask" | "scale" | "left" | "right" | "clip";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  /** Delay before this element (or the first staggered child) animates, ms. */
  delay?: number;
  /** If set, each direct child animates in sequence, `stagger` ms apart. */
  stagger?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
  threshold?: number;
};

/**
 * Scroll-triggered entrance. Adds `is-in` once on viewport entry; the CSS in
 * motion.css handles the actual transition (compositor-only properties).
 * With `stagger`, direct children receive `--ri` indices.
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  delay = 0,
  stagger,
  className,
  style,
  id,
  threshold,
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold });

  const kids =
    stagger != null
      ? Children.map(children, (child, i) =>
          isValidElement(child)
            ? cloneElement(child as ReactElement<{ style?: CSSProperties; className?: string }>, {
                style: {
                  ...((child.props as { style?: CSSProperties }).style || {}),
                  ["--ri" as string]: i,
                },
                className: [
                  (child.props as { className?: string }).className,
                  "reveal-child",
                  `reveal--${variant}`,
                ]
                  .filter(Boolean)
                  .join(" "),
              })
            : child
        )
      : children;

  const cls = [
    stagger != null ? "reveal-group" : `reveal reveal--${variant}`,
    inView ? "is-in" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={ref}
      id={id}
      className={cls}
      style={{
        ...style,
        ["--rd" as string]: `${delay}ms`,
        ["--rs" as string]: `${stagger ?? 0}ms`,
      }}
    >
      {kids}
    </Tag>
  );
}

type LinesProps = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of on viewport entry (for the hero). */
  immediate?: boolean;
  id?: string;
};

/** Headline where each line rises out of its own mask, staggered. */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 90,
  immediate = false,
  id,
}: LinesProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.2 });
  // For above-the-fold headlines: flip to `is-in` two frames after mount so
  // the initial (hidden) state is painted first and the transition runs.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!immediate) return;
    let b = 0;
    const a = requestAnimationFrame(() => (b = requestAnimationFrame(() => setMounted(true))));
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [immediate]);
  const on = immediate ? mounted : inView;
  return (
    <Tag
      ref={ref}
      id={id}
      className={["reveal-lines", on ? "is-in" : "", immediate ? "is-immediate" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {lines.map((line, i) => (
        <span className="rl-mask" key={i}>
          <span className="rl-line" style={{ transitionDelay: `${delay + i * stagger}ms` }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
