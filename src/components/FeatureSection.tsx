import { useEffect, useRef, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { Reveal, RevealLines } from "./ScrollReveal";
import { SideBySideVisual, InsightsVisual, ContentVisual, ReportsVisual } from "./FeatureVisuals";

const FEATURES = [
  {
    kicker: "01 — Lado a lado",
    title: "Tú y tu competencia, en una sola vista",
    body: "Compara seguidores, interacción mediana y frecuencia de publicación de tu cuenta y las de tus competidores sobre una ventana de 30 días. Sin abrir perfiles uno por uno.",
    points: ["Seguidores, interacción y cadencia", "Sincronización diaria automática", "Datos públicos de tus competidores"],
    Visual: SideBySideVisual,
  },
  {
    kicker: "02 — Insights",
    title: "Insights con evidencia, sin puntajes",
    body: "Observaciones deterministas de tu muestra de 30 días, agrupadas en Fortalezas, Oportunidades y Contexto. Cada una muestra la cuenta, la métrica, el valor, la muestra y la cobertura.",
    points: ["Sin puntajes ni recomendaciones", "Avisa cuando la muestra es pequeña", "Un resumen de “3 cosas que deberías saber”"],
    Visual: InsightsVisual,
  },
  {
    kicker: "03 — Contenido",
    title: "Contenido y mejor momento",
    body: "Recorre las publicaciones tuyas y de tus competidores con filtros y detalle por publicación. Revisa la frecuencia semanal y el mejor momento para publicar, calculado con tus propios datos.",
    points: ["Filtros y detalle de cada publicación", "Frecuencia semanal de publicación", "Mejor momento según tu interacción"],
    Visual: ContentVisual,
  },
  {
    kicker: "04 — Informes",
    title: "Un informe por cliente, solo con datos observados",
    body: "Resume interacción, crecimiento y cadencia de cada cliente en un informe. Lo que no se pudo observar no se estima ni se rellena.",
    points: ["Interacción, crecimiento y cadencia", "Un informe por cliente", "Sin cifras inventadas"],
    Visual: ReportsVisual,
  },
];

/**
 * Pinned showcase. On large screens the product stage stays in view while
 * the chapters scroll past; the stage cross-fades to match the chapter
 * in the reading line. Below 1024px each chapter carries its own visual.
 */
export function FeatureSection() {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<boolean[]>(() => FEATURES.map(() => false));
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
            <p className="eyebrow">El producto</p>
          </Reveal>
          <RevealLines id="feat-title" className="h2" lines={["De tu cuenta a la comparación", "que respalda cada decisión"]} />
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
