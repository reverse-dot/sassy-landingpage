import { LuCamera, LuMic, LuPenLine, LuCheck } from "react-icons/lu";
import { steps } from "../data/content";
import { Reveal, RevealLines } from "./ScrollReveal";
import { TiltCard } from "./TiltCard";
import { useScrollVar } from "../motion/hooks";

function CaptureIllo() {
  return (
    <div className="illo illo--capture" aria-hidden="true">
      <div className="ic__phone">
        <div className="ic__paper">
          <span className="hand">knee ~3/52</span>
          <span className="hand">→ physio</span>
          <span className="ic__scan" />
        </div>
      </div>
      <div className="ic__modes">
        <span className="ic__mode">
          <LuCamera size={14} />
        </span>
        <span className="ic__mode">
          <LuPenLine size={14} />
        </span>
        <span className="ic__mode ic__mode--on">
          <LuMic size={14} />
          <span className="ic__wave">
            {Array.from({ length: 5 }).map((_, i) => (
              <i key={i} style={{ ["--w" as string]: i }} />
            ))}
          </span>
        </span>
      </div>
    </div>
  );
}

function StructureIllo() {
  const rows = ["Presenting", "Findings", "Assessment", "Plan"];
  return (
    <div className="illo illo--structure" aria-hidden="true">
      {rows.map((r, i) => (
        <div className="is__row" key={r} style={{ ["--r" as string]: i }}>
          <span className="is__label">{r}</span>
          <span className="is__slot">
            <span className="is__bar" />
          </span>
        </div>
      ))}
      <span className="is__flag">1 to check</span>
    </div>
  );
}

function ActIllo() {
  const items = ["Sign record", "Send referral", "Book review"];
  return (
    <div className="illo illo--act" aria-hidden="true">
      {items.map((t, i) => (
        <div className="ia__item" key={t} style={{ ["--c" as string]: i }}>
          <span className="ia__box">
            <LuCheck size={11} />
          </span>
          <span>{t}</span>
        </div>
      ))}
      <span className="ia__done hand">done by 5:10 ✓</span>
    </div>
  );
}

const ILLOS = [CaptureIllo, StructureIllo, ActIllo];

export function HowItWorks() {
  const lineRef = useScrollVar<HTMLDivElement>("--draw", (el, vh) => {
    const r = el.getBoundingClientRect();
    const p = (vh * 0.85 - r.top) / (r.height + vh * 0.25);
    return Math.min(1, Math.max(0, p));
  });

  return (
    <section className="how section" aria-labelledby="how-title">
      <div className="container">
        <div className="section-head section-head--center">
          <Reveal>
            <p className="eyebrow">How it works</p>
          </Reveal>
          <RevealLines
            id="how-title"
            className="h2"
            lines={["Three steps between", "the visit and the record"]}
          />
        </div>

        <div className="how__track" ref={lineRef}>
          <svg className="how__line" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 10 C 250 2, 750 18, 1000 10" pathLength={1} />
          </svg>

          <Reveal as="ol" className="how__grid" stagger={140} variant="up">
            {steps.map((s, i) => {
              const Illo = ILLOS[i];
              return (
                <li key={s.n} className="how__item">
                  <TiltCard className="how__card" max={2.5}>
                    <div className="how__num hand" aria-hidden="true">
                      {s.n}
                    </div>
                    <Illo />
                    <div className="how__body">
                      <p className="how__tag">{s.tag}</p>
                      <h3 className="h3">
                        <span className="sr-only">Step {s.n}: </span>
                        {s.title}
                      </h3>
                      <p className="body">{s.body}</p>
                    </div>
                  </TiltCard>
                </li>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
