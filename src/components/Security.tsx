import { useEffect, useState } from "react";
import { LuLock, LuEye, LuUnlink, LuTrash2, LuFileCheck, LuRefreshCw } from "react-icons/lu";
import { securityPoints, syncLog } from "../data/content";
import { Reveal, RevealLines } from "./ScrollReveal";
import { useInView } from "../motion/hooks";
import { prefersReducedMotion } from "../motion/env";

const ICONS = { lock: LuLock, eye: LuEye, unlink: LuUnlink, trash: LuTrash2, check: LuFileCheck };
const ACT_TONE: Record<string, string> = {
  sincronizó: "mint",
  agregaste: "sky",
  actualizó: "sky",
  recalculó: "lilac",
  cambiaste: "butter",
  marcó: "peach",
};

/** An example sync feed that quietly appends a new entry every few seconds. */
function SyncPanel() {
  const [ref, inView] = useInView<HTMLDivElement>({ once: false, threshold: 0.2 });
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const id = window.setInterval(() => setHead((h) => h + 1), 2600);
    return () => clearInterval(id);
  }, [inView]);

  const rows = Array.from({ length: 5 }, (_, i) => {
    const idx = (head - i + syncLog.length * 100) % syncLog.length;
    return { ...syncLog[idx], key: head - i };
  });

  return (
    <div ref={ref} className="audit" aria-label="Ejemplo de actividad de sincronización" role="figure">
      <div className="audit__head">
        <span className="audit__title">
          <LuRefreshCw size={15} aria-hidden="true" /> Actividad de ejemplo
        </span>
        <span className="audit__live">
          <i aria-hidden="true" /> Conectada
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
        <span>Datos públicos y API oficial</span>
        <span>Desconecta cuando quieras</span>
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
            <p className="eyebrow eyebrow--dark">Privacidad y datos</p>
          </Reveal>
          <RevealLines
            id="sec-title"
            className="h2"
            lines={["Tus datos, con", "reglas claras"]}
          />
          <Reveal as="p" className="lead sec__lead" delay={150}>
            Bandito trabaja con la cuenta de tus clientes, así que explicamos qué datos usamos, cómo los obtenemos
            y cómo puedes retirarlos en cualquier momento.
          </Reveal>
          <Reveal delay={250}>
            <SyncPanel />
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
