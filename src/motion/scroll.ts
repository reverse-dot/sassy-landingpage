/**
 * Scroll ticker: one passive scroll/resize listener, coalesced into one
 * rAF callback per frame, shared by every scroll-driven effect.
 */
type ScrollSub = (scrollY: number, vh: number) => void;

const subs = new Set<ScrollSub>();
let raf = 0;
let bound = false;

function run() {
  raf = 0;
  const y = window.scrollY;
  const vh = window.innerHeight;
  subs.forEach((fn) => fn(y, vh));
}

function request() {
  if (!raf) raf = requestAnimationFrame(run);
}

export function subscribeScroll(fn: ScrollSub): () => void {
  if (typeof window === "undefined") return () => {};
  if (!bound) {
    bound = true;
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
  }
  subs.add(fn);
  request();
  return () => {
    subs.delete(fn);
  };
}

/**
 * Progress of an element through the viewport.
 * 0 when its top meets the viewport bottom, 1 when its bottom meets the top.
 */
export function viewportProgress(el: Element, vh = window.innerHeight) {
  const r = el.getBoundingClientRect();
  const total = vh + r.height;
  return Math.min(1, Math.max(0, (vh - r.top) / total));
}

/**
 * Progress through a tall "scroll track" whose child is position: sticky.
 * 0 when the track top reaches the viewport top (+offset), 1 when its end does.
 */
export function stickyProgress(track: Element, vh = window.innerHeight, offset = 0) {
  const r = track.getBoundingClientRect();
  const distance = r.height - vh;
  if (distance <= 0) return r.top <= offset ? 1 : 0;
  return Math.min(1, Math.max(0, (offset - r.top) / distance));
}
