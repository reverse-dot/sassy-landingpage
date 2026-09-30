import { useEffect, useRef, useState, type RefObject } from "react";
import { subscribeScroll, viewportProgress } from "./scroll";
import { prefersReducedMotion, reducedMotionQuery } from "./env";

/**
 * Adds `is-in` to the element the first time it enters the viewport.
 * All the actual motion lives in CSS (see motion.css) so it is
 * compositor-only (transform / opacity / clip-path).
 */
export function useInView<T extends Element>(
  opts: { rootMargin?: string; threshold?: number; once?: boolean } = {}
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { rootMargin = "0px 0px -12% 0px", threshold = 0.12, once = true } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView];
}

/**
 * Writes the element's viewport progress (0..1) into a CSS custom property
 * every scroll frame, without React re-renders. CSS does the rest.
 */
export function useScrollVar<T extends HTMLElement>(
  varName = "--p",
  compute: (el: T, vh: number) => number = (el, vh) => viewportProgress(el, vh)
) {
  const ref = useRef<T>(null);
  const computeRef = useRef(compute);
  computeRef.current = compute;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty(varName, "1");
      return;
    }
    let prev = -1;
    return subscribeScroll((_, vh) => {
      const p = computeRef.current(el, vh);
      // Skip redundant style writes.
      if (Math.abs(p - prev) < 0.0005) return;
      prev = p;
      el.style.setProperty(varName, p.toFixed(4));
    });
  }, [varName]);

  return ref;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion());
  useEffect(() => {
    const q = reducedMotionQuery;
    if (!q) return;
    const on = () => setReduced(q.matches);
    q.addEventListener?.("change", on);
    return () => q.removeEventListener?.("change", on);
  }, []);
  return reduced;
}
