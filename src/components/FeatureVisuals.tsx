import { useEffect, useState } from "react";
import {
  LuSearch,
  LuFileText,
  LuFlaskConical,
  LuMessageSquare,
  LuSend,
  LuCalendarCheck,
  LuFileCheck,
  LuCheck,
  LuSparkles,
} from "react-icons/lu";
import { Paper } from "./HandMarks";
import { prefersReducedMotion } from "../motion/env";

/* ---------------------------------------------------------------
   Feature 1 — handwriting lines colour-matched to structured fields
   --------------------------------------------------------------- */
const F1 = [
  { hand: "c/o SOB on exertion, 2/12", field: "Presenting", value: "Breathless on exertion for 2 months", tone: "sky" },
  { hand: "ankles puffy ++ pm", field: "Examination", value: "Bilateral ankle swelling, worse evenings", tone: "mint" },
  { hand: "? HF — check BNP", field: "Assessment", value: "Possible heart failure — to confirm", tone: "lilac" },
  { hand: "echo + bloods, r/v 1/52", field: "Plan", value: "Echo · BNP & renal bloods · review 1 wk", tone: "peach" },
];

export function NotesToRecords({ active }: { active: boolean }) {
  return (
    <div
      className={["fv fv1", active ? "is-active" : ""].join(" ")}
      role="img"
      aria-label="Four handwritten lines are colour-matched to four structured fields: presenting complaint, examination, assessment and plan."
    >
      <Paper className="fv1__note">
        <p className="fv1__date hand">Tue — Mr D. Kowal</p>
        <ul>
          {F1.map((f, i) => (
            <li key={i} className={`fv1__line tone-${f.tone}`} style={{ ["--k" as string]: i }}>
              <span className="hand">{f.hand}</span>
            </li>
          ))}
        </ul>
      </Paper>

      <div className="fv1__card card">
        <div className="fv1__head">
          <span className="fv1__title">
            <LuFileText size={14} aria-hidden="true" /> Structured record
          </span>
          <span className="badge badge--mint">
            <LuSparkles size={11} aria-hidden="true" /> 4 of 4
          </span>
        </div>
        {F1.map((f, i) => (
          <div key={f.field} className={`fv1__field tone-${f.tone}`} style={{ ["--k" as string]: i }}>
            <span className="fv1__label">{f.field}</span>
            <span className="fv1__value">
              <span className="fv1__skel" />
              <span className="fv1__text">{f.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Feature 2 — searchable patient timeline
   --------------------------------------------------------------- */
const EVENTS = [
  { icon: LuFileText, t: "Today", title: "Visit note signed", sub: "Knee pain · mild effusion noted", tone: "sky", hit: true },
  { icon: LuFlaskConical, t: "Sep 12", title: "Bloods returned", sub: "CRP within range", tone: "mint" },
  { icon: LuMessageSquare, t: "Aug 28", title: "Patient message", sub: "“Knee swelling again after gardening”", tone: "butter", hit: true },
  { icon: LuFileText, t: "Jun 03", title: "Visit note", sub: "Hypertension review · stable", tone: "lilac" },
];

const QUERY = "swelling";

export function TimelineVisual({ active }: { active: boolean }) {
  const [typed, setTyped] = useState(prefersReducedMotion() ? QUERY.length : 0);

  useEffect(() => {
    if (!active || prefersReducedMotion()) return;
    let n = 0;
    setTyped(0);
    const id = window.setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= QUERY.length) clearInterval(id);
    }, 90);
    return () => clearInterval(id);
  }, [active]);

  const searching = typed >= QUERY.length;

  return (
    <div
      className={["fv fv2", active ? "is-active" : "", searching ? "is-searched" : ""].join(" ")}
      role="img"
      aria-label="A patient timeline with notes, lab results and messages. Searching for 'swelling' highlights the two matching entries."
    >
      <div className="fv2__card card">
        <div className="fv2__top">
          <div className="fv2__search">
            <LuSearch size={15} aria-hidden="true" />
            <span className="fv2__q">
              {QUERY.slice(0, typed)}
              <span className="fv2__caret" />
            </span>
            <span className="fv2__count">{searching ? "2 matches" : ""}</span>
          </div>
          <div className="fv2__filters">
            <span className="fv2__f is-on">All</span>
            <span className="fv2__f">Notes</span>
            <span className="fv2__f">Labs</span>
            <span className="fv2__f">Messages</span>
          </div>
        </div>
        <ol className="fv2__list">
          {EVENTS.map((e, i) => {
            const Icon = e.icon;
            return (
              <li
                key={i}
                className={["fv2__ev", e.hit ? "is-hit" : ""].join(" ")}
                style={{ ["--k" as string]: i }}
              >
                <span className={`fv2__icon tone-bg-${e.tone}`}>
                  <Icon size={14} aria-hidden="true" />
                </span>
                <span className="fv2__txt">
                  <strong>{e.title}</strong>
                  <span>{e.sub}</span>
                </span>
                <span className="fv2__t">{e.t}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="fv2__side card">
        <p className="fv2__side-k">Across 14 months</p>
        <div className="fv2__bars" aria-hidden="true">
          {[30, 52, 38, 70, 44, 86, 58, 64].map((h, i) => (
            <span key={i} style={{ ["--h" as string]: `${h}%`, ["--k" as string]: i }} />
          ))}
        </div>
        <p className="fv2__side-v">
          <strong>23</strong> entries, one place
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Feature 3 — tasks progressing through workflow states
   --------------------------------------------------------------- */
const TASKS = [
  { icon: LuSend, label: "Referral to cardiology", states: ["Drafted", "Sent", "Accepted"] },
  { icon: LuCalendarCheck, label: "Echo appointment", states: ["Suggested", "Requested", "Booked · Oct 8"] },
  { icon: LuFileCheck, label: "Patient summary", states: ["Drafted", "Reviewed", "Sent by text"] },
];
const STATE_TONES = ["butter", "sky", "mint"];

export function ActionsVisual({ active }: { active: boolean }) {
  const [step, setStep] = useState(prefersReducedMotion() ? 2 : 0);

  useEffect(() => {
    if (!active || prefersReducedMotion()) return;
    setStep(0);
    const a = window.setTimeout(() => setStep(1), 900);
    const b = window.setTimeout(() => setStep(2), 1900);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [active]);

  return (
    <div
      className={["fv fv3", active ? "is-active" : ""].join(" ")}
      role="img"
      aria-label="A plain-language visit summary, with three follow-up tasks moving from drafted to sent to completed."
    >
      <div className="fv3__summary card">
        <p className="fv3__k">
          <LuSparkles size={13} aria-hidden="true" /> Summary for the patient
        </p>
        <p className="fv3__s">
          We think your breathlessness and ankle swelling could be linked to how your heart is pumping. We've
          booked a heart scan and blood tests, and we'll see you again next week.
        </p>
      </div>
      <ul className="fv3__tasks">
        {TASKS.map((t, i) => {
          const Icon = t.icon;
          const s = Math.min(step, 2);
          return (
            <li key={t.label} className="fv3__task card" style={{ ["--k" as string]: i }}>
              <span className="fv3__icon">
                <Icon size={15} aria-hidden="true" />
              </span>
              <span className="fv3__label">{t.label}</span>
              <span className="fv3__track" aria-hidden="true">
                {[0, 1, 2].map((d) => (
                  <i key={d} className={d <= s ? "on" : ""} />
                ))}
              </span>
              <span className={`badge badge--${STATE_TONES[s]} fv3__state`} key={s}>
                {s === 2 && <LuCheck size={11} aria-hidden="true" />}
                {t.states[s]}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
