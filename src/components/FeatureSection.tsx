import { useEffect, useRef, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { Reveal, RevealLines } from "./ScrollReveal";
import { NotesToRecords, TimelineVisual, ActionsVisual } from "./FeatureVisuals";

const FEATURES = [
  {
    kicker: "01 — Capture",
    title: "Turn notes into structured records",
    body: "Every line of your page is matched to the right part of the record and colour-keyed back to where it came from, so checking the result takes seconds, not a re-read.",
    points: ["Works with your own templates", "Uncertain words are flagged, never guessed", "Abbreviations expanded the way you use them"],
    Visual: NotesToRecords,
  },
  {
    kicker: "02 — Organise",
    title: "Keep every detail organised",
    body: "Notes, results and patient messages live on one searchable timeline. Type a word you remember and find the visit, the lab and the message that mentioned it.",
    points: ["Search across notes, labs and messages", "Filters that match how you think", "History that's quick to scan before a visit"],
    Visual: TimelineVisual,
  },
  {
    kicker: "03 — Act",
    title: "Move from visit to action",
    body: "Referrals, bookings and patient summaries are drafted from your plan and tracked until they're done — nothing lives only in the margin any more.",
    points: ["Referral letters in your house style", "Plain-language summaries for patients", "A shared board for the whole team"],
    Visual: ActionsVisual,
  },
];

/**
 * Pinned showcase. On large screens the product stage stays in view while
 * the three chapters scroll past; the stage cross-fades to match the chapter
 * in the reading line. Below 1024px each chapter carries its own visual.
 */
export function FeatureSection() {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<boolean[]>([false, false, false]);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = chapterRefs.current.filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.index);
          setActive(i);
          setSeen((s) => (s[i] ? s : s.map((v, j) => (j === i ? true : v))));
        });
      },
      // A thin band across the middle of the viewport acts as the "reading line".
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="feat section" id="features" aria-labelledby="feat-title">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <p className="eyebrow">The product</p>
          </Reveal>
          <RevealLines id="feat-title" className="h2" lines={["From the page in your hand", "to the next thing that happens"]} />
        </div>

        <div className="feat__grid">
          <div className="feat__chapters">
            {FEATURES.map((f, i) => {
              const V = f.Visual;
              return (
                <article
                  key={f.title}
                  className={["feat__chapter", active === i ? "is-current" : ""].join(" ")}
                  data-index={i}
                  ref={(el) => {
                    chapterRefs.current[i] = el;
                  }}
                  aria-labelledby={`feat-${i}`}
                >
                  <Reveal stagger={80}>
                    <p className="feat__kicker">{f.kicker}</p>
                    <h3 id={`feat-${i}`} className="feat__title">
                      {f.title}
                    </h3>
                    <p className="body feat__body">{f.body}</p>
                    <ul className="feat__points">
                      {f.points.map((p) => (
                        <li key={p}>
                          <LuArrowRight size={14} aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                  <Reveal className="feat__inline" variant="clip">
                    <V active={seen[i]} />
                  </Reveal>
                </article>
              );
            })}
          </div>

          <div className="feat__stage-col">
            <div className="feat__stage">
              <div className="feat__progress" aria-hidden="true">
                {FEATURES.map((f, i) => (
                  <span key={i} className={active === i ? "is-on" : active > i ? "is-past" : ""}>
                    <i />
                    {f.kicker.split(" — ")[1]}
                  </span>
                ))}
              </div>
              <div className="feat__frames">
                {FEATURES.map((f, i) => {
                  const V = f.Visual;
                  const state = active === i ? "is-shown" : active > i ? "is-before" : "is-after";
                  return (
                    <div key={i} className={`feat__frame ${state}`} aria-hidden={active !== i}>
                      <V active={active === i && seen[i]} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
