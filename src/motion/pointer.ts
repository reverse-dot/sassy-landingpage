/**
 * Global pointer store.
 *
 * A single pointermove listener and a single requestAnimationFrame loop feed
 * every pointer-reactive element on the page. The loop lerps `current`
 * toward `target` and goes to sleep once they converge, so the page is idle
 * (zero rAF work) while the mouse is still.
 */
import { damp, lerp, pointerEffectsEnabled } from "./env";

export type PointerFrame = {
  /** Smoothed pointer position, normalised to -1..1 across the viewport. */
  x: number;
  y: number;
  /** Raw client coordinates of the latest event (unsmoothed). */
  clientX: number;
  clientY: number;
  dt: number;
};

type Subscriber = (f: PointerFrame) => void;

const subs = new Set<Subscriber>();
const target = { x: 0, y: 0 };
const current = { x: 0, y: 0 };
let clientX = -9999;
let clientY = -9999;
let raf = 0;
let last = 0;
let bound = false;

const SMOOTHING = 0.075; // per-frame at 60fps — slow, weighty follow

function tick(now: number) {
  const dt = last ? Math.min(64, now - last) : 16.7;
  last = now;
  const t = damp(SMOOTHING, dt);
  current.x = lerp(current.x, target.x, t);
  current.y = lerp(current.y, target.y, t);

  const frame: PointerFrame = { x: current.x, y: current.y, clientX, clientY, dt };
  subs.forEach((fn) => fn(frame));

  const settled =
    Math.abs(current.x - target.x) < 0.0004 && Math.abs(current.y - target.y) < 0.0004;
  if (settled) {
    raf = 0;
    last = 0;
    return;
  }
  raf = requestAnimationFrame(tick);
}

function wake() {
  if (!raf && subs.size) raf = requestAnimationFrame(tick);
}

function onMove(e: PointerEvent) {
  if (e.pointerType === "touch") return;
  clientX = e.clientX;
  clientY = e.clientY;
  target.x = (e.clientX / window.innerWidth) * 2 - 1;
  target.y = (e.clientY / window.innerHeight) * 2 - 1;
  wake();
}

function onLeave() {
  target.x = 0;
  target.y = 0;
  clientX = -9999;
  clientY = -9999;
  wake();
}

function bind() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.addEventListener("blur", onLeave);
}

/** Subscribe to smoothed pointer frames. No-op on touch / reduced motion. */
export function subscribePointer(fn: Subscriber): () => void {
  if (!pointerEffectsEnabled()) return () => {};
  bind();
  subs.add(fn);
  wake();
  return () => {
    subs.delete(fn);
  };
}

/** Latest raw pointer position (for hit-testing, e.g. magnetic buttons). */
export const rawPointer = () => ({ x: clientX, y: clientY });
