import { useEffect, useState } from "react";
import { LuLock, LuKeyRound, LuUserCheck, LuHistory, LuDatabase, LuShieldCheck } from "react-icons/lu";
import { securityPoints, auditLog } from "../data/content";
import { Reveal, RevealLines } from "./ScrollReveal";
import { useInView } from "../motion/hooks";
import { prefersReducedMotion } from "../motion/env";

const ICONS = { lock: LuLock, key: LuKeyRound, user: LuUserCheck, history: LuHistory, database: LuDatabase };
const ACT_TONE: Record<string, string> = {
  signed: "mint",
  viewed: "sky",
  edited: "lilac",
  flagged: "peach",
  exported: "butter",
  revoked: "rose",
};

/** An audit trail that quietly appends a new entry every few seconds. */
function AuditPanel() {
  const [ref, inView] = useInView<HTMLDivElement>({ once: false, threshold: 0.2 });
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const id = window.setInterval(() => setHead((h) => h + 1), 2600);
    return () => clearInterval(id);
  }, [inView]);

  const rows = Array.from({ length: 5 }, (_, i) => {
    const idx = (head - i + auditLog.length * 100) % auditLog.length;
    return { ...auditLog[idx], key: head - i };
  });

  return (
    <div ref={ref} className="audit" aria-label="Example audit trail" role="figure">
      <div className="audit__head">
        <span className="audit__title">
          <LuShieldCheck size={15} aria-hidden="true" /> Audit trail
        </span>
        <span className="audit__live">
          <i aria-hidden="true" /> Live
        </span>
      </div>
      <ol className="audit__list" key={head}>
        {rows.map((r, i) => (
          <li key={r.key} className={i === 0 ? "is-new" : ""} style={{ ["--k" as string]: i }}>
            <span className="audit__t">{r.t}</span>
            <span className="audit__txt">
              <strong>{r.who}</strong> <span className={`audit__act tone-fg-${ACT_TONE[r.act]}`}>{r.act}</span>{" "}
              {r.obj}
            </span>
          </li>
        ))}
      </ol>
      <div className="audit__foot">
        <span>Tamper-evident · exportable</span>
        <span>Retention: 8 years</span>
      </div>
    </div>
  );
}

export function Security() {
  return (
    <section className="sec section on-dark" id="security" aria-labelledby="sec-title">
      <div className="sec__glow" aria-hidden="true" />
      <div className="container sec__grid">
        <div className="sec__copy">
          <Reveal>
            <p className="eyebrow eyebrow--dark">Trust</p>
          </Reveal>
          <RevealLines
            id="sec-title"
            className="h2"
            lines={["Designed with privacy", "and security at the core"]}
          />
          <Reveal as="p" className="lead sec__lead" delay={150}>
            Clinical notes are some of the most personal words anyone writes down. We treat them that way — in
            how the product is built, who can see what, and what happens to the data over time.
          </Reveal>
          <Reveal delay={250}>
            <AuditPanel />
          </Reveal>
        </div>

        <Reveal as="ul" className="sec__points" stagger={90}>
          {securityPoints.map((s) => {
            const I = ICONS[s.icon as keyof typeof ICONS];
            return (
              <li key={s.title} className="sec__point">
                <span className="sec__icon">
                  <I size={18} aria-hidden="true" />
                </span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
