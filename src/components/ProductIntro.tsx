import { Fragment } from "react";
import { useScrollVar } from "../motion/hooks";
import { HandArrow } from "./HandMarks";
import { Reveal } from "./ScrollReveal";

const TEXT =
  "Clinicians write for people, not for databases. Mendleaf meets you there — it reads shorthand, arrows and crossed-out doses exactly as you wrote them, then quietly turns the page into a record your whole team can trust.";

/** Words that get a soft highlight once they are fully revealed. */
const EMPHASIS = new Set(["arrows", "crossed-out", "trust."]);

/**
 * Editorial statement whose words brighten one by one as the reader scrolls
 * (scroll-scrubbed via a single CSS variable — no per-frame React renders).
 */
export function ProductIntro() {
  const ref = useScrollVar<HTMLElement>("--p", (el, vh) => {
    const r = el.getBoundingClientRect();
    // 0 when the block's top is at 88% of the viewport, 1 when its bottom reaches 55%.
    const start = vh * 0.88;
    const end = vh * 0.55;
    const p = (start - r.top) / (start - end + r.height);
    return Math.min(1, Math.max(0, p));
  });

  const words = TEXT.split(" ");

  return (
    <section className="intro section" id="product" aria-labelledby="intro-title" ref={ref}>
      <div className="container intro__grid">
        <div className="intro__side">
          <Reveal>
            <p className="eyebrow" id="intro-title">
              Why Mendleaf
            </p>
          </Reveal>
          <div className="intro__fan" aria-hidden="true">
            <span className="intro__sheet intro__sheet--1">
              <span className="hand">bp 132/80 ✓</span>
            </span>
            <span className="intro__sheet intro__sheet--2">
              <span className="hand">f/u 2/52 →</span>
            </span>
            <span className="intro__sheet intro__sheet--3">
              <span className="intro__lines" />
            </span>
          </div>
        </div>

        <div className="intro__main">
          <p className="intro__text" style={{ ["--n" as string]: words.length }}>
            {words.map((w, i) => (
              <Fragment key={i}>
                <span
                  className={["iw", EMPHASIS.has(w) ? "iw--em" : ""].join(" ")}
                  style={{ ["--i" as string]: i }}
                >
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <Reveal className="intro__aside" delay={200}>
            <HandArrow variant="loop" className="intro__aside-arrow" color="var(--pen)" />
            <span className="hand">yes — even your handwriting</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
