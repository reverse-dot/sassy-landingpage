import { useEffect, useState } from "react";
import { LuCalendarCheck, LuSend, LuSparkles, LuCheck } from "react-icons/lu";
import { PointerParallax, Layer } from "./PointerParallax";
import { ScaledStage } from "./ScaledStage";
import { HandArrow, HandCircle, Paper, Signature } from "./HandMarks";
import { prefersReducedMotion } from "../motion/env";

const FIELDS = [
  { k: "Presenting", v: "R knee pain × 3 wks, worse on stairs" },
  { k: "Examination", v: "Mild effusion · ligaments stable · full ROM" },
  { k: "Assessment", v: "Probable osteoarthritis flare, right knee" },
  { k: "Plan", v: "Physio referral · topical NSAID · review 2 wks" },
];

/**
 * The hero story in three beats:
 *   0 messy     – the handwritten page arrives
 *   1 organised – lines are matched and land in structured fields
 *   2 actionable – referral, follow-up and a task float out of the plan
 */
export function HeroVisual() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase(2);
      return;
    }
    const a = window.setTimeout(() => setPhase(1), 1500);
    const b = window.setTimeout(() => setPhase(2), 3300);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  return (
    <div
      className="hero-visual"
      role="img"
      aria-label="A handwritten visit note for a knee-pain consultation becomes a structured record with presenting complaint, examination, assessment and plan, then produces a physiotherapy referral, a follow-up booking and a patient task."
    >
      <ScaledStage width={640} height={580} className={`hv phase-${phase}`}>
        <PointerParallax className="hv__scene" range={18} rotate={1.6}>
          {/* Back glow */}
          <Layer depth={-0.25} rot={0} className="hv__glow" aria-hidden />

          {/* 1 · Handwritten page */}
          <Layer depth={-0.55} className="hv__note-wrap">
            <div className="hv__enter hv__enter--note">
              <Paper className="hv__note float-b">
                <div className="hn__head">
                  <span>Rosa A. · 58F</span>
                  <span>29/9</span>
                </div>
                <ol className="hn__lines">
                  <li className="hn__l" data-m="0">
                    R knee pain ~3/52, <span className="hn__up">↑</span> stairs
                  </li>
                  <li className="hn__l" data-m="1">no trauma. mild effusion</li>
                  <li className="hn__l" data-m="1">
                    ligs stable, FROM <span className="hn__tick">✓</span>
                  </li>
                  <li className="hn__l hn__l--circle" data-m="2">
                    <span className="hn__circled">
                      ?OA flare
                      <HandCircle className="hn__ring" delay={700} />
                    </span>
                  </li>
                  <li className="hn__l" data-m="3">
                    → physio ref
                  </li>
                  <li className="hn__l" data-m="3">
                    <s className="hn__strike">ibuprofen</s> topical NSAID
                  </li>
                  <li className="hn__l" data-m="3">
                    r/v 2/52 <span className="hn__margin">(text her)</span>
                  </li>
                </ol>
                <Signature className="hn__sig" />
              </Paper>
            </div>
          </Layer>

          {/* Connector */}
          <Layer depth={0.15} rot={0} className="hv__arrow">
            <HandArrow className="hv__arrow-svg" delay={900} />
            <span className="hand hv__arrow-label">sorted for you</span>
          </Layer>

          {/* 2 · Structured record */}
          <Layer depth={0.45} className="hv__doc-wrap">
            <div className="hv__enter hv__enter--doc">
              <article className="hv__doc float-a">
                <header className="hd__head">
                  <span className="avatar hd__av">RA</span>
                  <div className="hd__who">
                    <strong>Rosa Almeida</strong>
                    <span>58 · F · Visit note</span>
                  </div>
                  <span className={`badge ${phase >= 1 ? "badge--mint" : "badge--sky"} hd__status`}>
                    {phase >= 1 ? (
                      <>
                        <LuCheck size={11} aria-hidden="true" /> Ready to sign
                      </>
                    ) : (
                      <>
                        <LuSparkles size={11} aria-hidden="true" /> Reading…
                      </>
                    )}
                  </span>
                </header>
                <dl className="hd__fields">
                  {FIELDS.map((f, i) => (
                    <div className="hd__row" key={f.k} style={{ ["--fi" as string]: i }}>
                      <dt>{f.k}</dt>
                      <dd>
                        <span className="hd__skel" aria-hidden="true" />
                        <span className="hd__val">{f.v}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <footer className="hd__foot">
                  <span className="hd__src">
                    <span className="dot" /> From handwriting · 7 lines
                  </span>
                  <span className="hd__flag">1 word to check</span>
                </footer>
              </article>
            </div>
          </Layer>

          {/* 3 · Actions */}
          <Layer depth={1.05} className="hv__chip hv__chip--ref">
            <div className="hv__pop" style={{ ["--pi" as string]: 0 }}>
              <div className="chip">
                <span className="chip__icon chip__icon--mint">
                  <LuSend size={15} aria-hidden="true" />
                </span>
                <span className="chip__txt">
                  <strong>Referral drafted</strong>
                  <span>Physiotherapy · ready to send</span>
                </span>
              </div>
            </div>
          </Layer>

          <Layer depth={0.85} className="hv__chip hv__chip--fu">
            <div className="hv__pop" style={{ ["--pi" as string]: 1 }}>
              <div className="chip">
                <span className="chip__icon chip__icon--sky">
                  <LuCalendarCheck size={15} aria-hidden="true" />
                </span>
                <span className="chip__txt">
                  <strong>Review booked</strong>
                  <span>Mon, Oct 13 · 09:20</span>
                </span>
              </div>
            </div>
          </Layer>

          <Layer depth={1.3} className="hv__chip hv__chip--task">
            <div className="hv__pop" style={{ ["--pi" as string]: 2 }}>
              <div className="task-mini">
                <span className="task-mini__box" aria-hidden="true">
                  <LuCheck size={12} />
                </span>
                <span>Text exercise sheet to Rosa</span>
                <span className="badge badge--butter">Today</span>
              </div>
            </div>
          </Layer>
        </PointerParallax>
      </ScaledStage>
    </div>
  );
}
