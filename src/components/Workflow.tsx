import { useEffect, useRef, useState } from "react";
import { LuCheck, LuClock, LuMoveHorizontal } from "react-icons/lu";
import { Reveal, RevealLines } from "./ScrollReveal";
import { HandCircle } from "./HandMarks";
import { useInView } from "../motion/hooks";
import { prefersReducedMotion } from "../motion/env";

const BEFORE = [
  { t: "seguidores_FINAL(2).xlsx", r: -6, x: 6, y: 26 },
  { t: "¿interacción 3% o 4%?", r: 4, x: 34, y: 12, red: true },
  { t: "captura del lunes.png", r: -3, x: 60, y: 30 },
  { t: "copiar cifras al informe!!", r: 5, x: 10, y: 58, red: true },
  { t: "perfil de la competencia 1/5", r: -5, x: 40, y: 62 },
  { t: "¿cuántas pub. subió?", r: 3, x: 70, y: 58 },
];

const AFTER = [
  { n: "Casa Lumbre", s: "Lado a lado · 30 días", b: "Al día" },
  { n: "Nube Studio", s: "Lado a lado · 30 días", b: "Al día" },
  { n: "Marea Viva", s: "Lado a lado · 30 días", b: "Al día" },
  { n: "Taller Alba", s: "Lado a lado · 30 días", b: "Al día" },
  { n: "Punto Sur", s: "Lado a lado · 30 días", b: "Al día" },
];

const BENEFITS = [
  { k: "Un solo panel", v: "Tus métricas y las de tu competencia, sin saltar entre perfiles, capturas y hojas de cálculo." },
  { k: "Datos que se actualizan solos", v: "Las sincronizaciones diarias mantienen el lado a lado al día, sin copiar cifras a mano." },
  { k: "Cada cliente, su espacio", v: "Cambia de cliente con el selector; cada uno con sus propios competidores." },
];

export function Workflow() {
  const [split, setSplit] = useState(72);
  const [touched, setTouched] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 });
  const raf = useRef(0);

  // One gentle sweep on first view to show the slider is interactive.
  useEffect(() => {
    if (!inView || touched || prefersReducedMotion()) {
      if (inView && prefersReducedMotion()) setSplit(50);
      return;
    }
    const from = 72;
    // Narrow screens: open further so the "after" list reads cleanly.
    const to = window.innerWidth < 640 ? 30 : 46;
    const dur = 1400;
    let start = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / dur);
      setSplit(from + (to - from) * ease(t));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    const id = window.setTimeout(() => (raf.current = requestAnimationFrame(step)), 350);
    return () => {
      clearTimeout(id);
      cancelAnimationFrame(raf.current);
    };
  }, [inView, touched]);

  return (
    <section className="flow section" id="workflow" aria-labelledby="flow-title">
      <div className="container">
        <div className="flow__head">
          <div className="section-head">
            <Reveal>
              <p className="eyebrow">Tu mes, reordenado</p>
            </Reveal>
            <RevealLines id="flow-title" className="h2" lines={["El cierre de mes,", "antes y después"]} />
          </div>
          <Reveal className="flow__hint" delay={200}>
            <LuMoveHorizontal size={16} aria-hidden="true" />
            <span>Arrastra para comparar</span>
          </Reveal>
        </div>

        <Reveal variant="clip">
          <div ref={ref} className="compare" style={{ ["--split" as string]: `${split}%` }}>
            {/* BEFORE */}
            <div className="compare__pane compare__before" aria-hidden="true">
              <div className="cmp__bar">
                <span className="cmp__clock">
                  <LuClock size={14} /> 18:40
                </span>
                <span className="badge badge--rose">5 informes por armar</span>
              </div>
              <div className="cmp__desk">
                {BEFORE.map((b, i) => (
                  <span
                    key={i}
                    className={["cmp__scrap", b.red ? "is-red" : ""].join(" ")}
                    style={{
                      left: `${b.x}%`,
                      top: `${b.y}%`,
                      ["--r" as string]: `${b.r}deg`,
                    }}
                  >
                    <span>{b.t}</span>
                    {b.red && <HandCircle className="cmp__ring" color="var(--pen-red)" width={1.6} />}
                  </span>
                ))}
              </div>
              <span className="cmp__label">Antes</span>
            </div>

            {/* AFTER */}
            <div className="compare__pane compare__after" aria-hidden="true">
              <div className="cmp__bar">
                <span className="cmp__clock">
                  <LuClock size={14} /> 17:05
                </span>
                <span className="badge badge--mint">
                  <LuCheck size={11} /> Todo al día
                </span>
              </div>
              <ul className="cmp__list">
                {AFTER.map((a) => (
                  <li key={a.n}>
                    <span className="cmp__n">{a.n}</span>
                    <span className="cmp__s">{a.s}</span>
                    <span className="badge badge--mint">
                      <LuCheck size={11} /> {a.b}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="hand cmp__home">…informe listo</p>
              <span className="cmp__label cmp__label--after">Con Bandito</span>
            </div>

            <div className="compare__handle" aria-hidden="true">
              <span className="compare__knob">
                <LuMoveHorizontal size={16} />
              </span>
            </div>

            <label className="sr-only" htmlFor="compare-range">
              Compara el cierre de mes antes y después de usar Bandito
            </label>
            <input
              id="compare-range"
              className="compare__range"
              type="range"
              min={4}
              max={96}
              step={0.5}
              value={split}
              aria-valuetext={`${Math.round(split)}% mostrando el antes`}
              onChange={(e) => {
                setTouched(true);
                cancelAnimationFrame(raf.current);
                setSplit(Number(e.target.value));
              }}
            />
          </div>
        </Reveal>

        <Reveal as="ul" className="flow__benefits" stagger={110}>
          {BENEFITS.map((b) => (
            <li key={b.k}>
              <h3 className="flow__bk">{b.k}</h3>
              <p className="body">{b.v}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
