export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const mq = (q: string) =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(q)
    : null;

export const reducedMotionQuery = mq("(prefers-reduced-motion: reduce)");
export const finePointerQuery = mq("(hover: hover) and (pointer: fine)");

export const prefersReducedMotion = () => !!reducedMotionQuery?.matches;

/** Cursor-driven effects only run with a real mouse/trackpad and motion allowed. */
export const pointerEffectsEnabled = () =>
  !!finePointerQuery?.matches && !prefersReducedMotion();

/**
 * Frame-rate independent lerp factor. `k` is the per-frame factor at 60fps,
 * so the feel is identical on 60Hz, 120Hz and throttled displays.
 */
export const damp = (k: number, dtMs: number) => 1 - Math.pow(1 - k, dtMs / (1000 / 60));
