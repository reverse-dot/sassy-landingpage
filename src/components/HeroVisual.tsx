import { useEffect, useState } from "react";
import { LuRefreshCw, LuTrendingUp, LuCheck } from "react-icons/lu";
import { PointerParallax, Layer } from "./PointerParallax";
import { ScaledStage } from "./ScaledStage";
import { HandArrow, HandCircle, Paper } from "./HandMarks";
import { prefersReducedMotion } from "../motion/env";

const FIELDS = [
  { k: "Seguidores", v: "12.480 · +3,2% en 30 días" },
  { k: "Interacción", v: "3,4% mediana · @taller.norte 2,1%" },
  { k: "Frecuencia", v: "5 pub./sem · @taller.norte 3" },
  { k: "Muestra", v: "22 publicaciones · ventana de 30 días" },
];

/**
 * The hero story in three beats:
 *   0 messy     – manual notes and numbers copied from screenshots
 *   1 organised – the figures are matched and land in a side-by-side card
 *   2 evidence  – an insight, the daily sync and the "3 things" summary appear
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
      aria-label="Notas sueltas con cifras copiadas a mano se convierten en un lado a lado ordenado con seguidores, interacción y frecuencia de publicación, y de ahí salen un insight con evidencia, una sincronización diaria y un resumen de tres cosas que deberías saber."
    >
      <ScaledStage width={640} height={580} className={`hv phase-${phase}`}>
        <PointerParallax className="hv__scene" range={18} rotate={1.6}>
          {/* Back glow */}
          <Layer depth={-0.25} rot={0} className="hv__glow" aria-hidden />

          {/* 1 · Manual notes */}
          <Layer depth={-0.55} className="hv__note-wrap">
            <div className="hv__enter hv__enter--note">
              <Paper className="hv__note float-b">
                <div className="hn__head">
                  <span>Casa Lumbre · sept.</span>
                  <span>29/9</span>
                </div>
                <ol className="hn__lines">
                  <li className="hn__l" data-m="0">
                    seguidores ~12.4k <span className="hn__up">↑</span>
                  </li>
                  <li className="hn__l" data-m="1">eng. a ojo ~3%</li>
                  <li className="hn__l" data-m="1">
                    norte: 3 pub/sem <span className="hn__tick">✓</span>
                  </li>
                  <li className="hn__l hn__l--circle" data-m="2">
                    <span className="hn__circled">
                      ¿quién crece más?
                      <HandCircle className="hn__ring" delay={700} />
                    </span>
                  </li>
                  <li className="hn__l" data-m="3">
                    → copiar al informe
                  </li>
                  <li className="hn__l" data-m="3">
                    <s className="hn__strike">captura lunes</s> nueva
                  </li>
                  <li className="hn__l" data-m="3">
                    revisar <span className="hn__margin">(¿otra vez?)</span>
                  </li>
                </ol>
              </Paper>
            </div>
          </Layer>

          {/* Connector */}
          <Layer depth={0.15} rot={0} className="hv__arrow">
            <HandArrow className="hv__arrow-svg" delay={900} />
            <span className="hand hv__arrow-label">ordenado por Sassy</span>
          </Layer>

          {/* 2 · Side-by-side card */}
          <Layer depth={0.45} className="hv__doc-wrap">
            <div className="hv__enter hv__enter--doc">
              <article className="hv__doc float-a">
                <header className="hd__head">
                  <span className="avatar hd__av">CL</span>
                  <div className="hd__who">
                    <strong>Casa Lumbre</strong>
                    <span>@casa.lumbre · Lado a lado</span>
                  </div>
                  <span className={`badge ${phase >= 1 ? "badge--mint" : "badge--sky"} hd__status`}>
                    {phase >= 1 ? (
                      <>
                        <LuCheck size={11} aria-hidden="true" /> Al día
                      </>
                    ) : (
                      <>
                        <LuRefreshCw size={11} aria-hidden="true" /> Sincronizando…
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
                    <span className="dot" /> API oficial · 30 días
                  </span>
                  <span className="hd__flag">Muestra pequeña: 1 cuenta</span>
                </footer>
              </article>
            </div>
          </Layer>

          {/* 3 · Evidence chips */}
          <Layer depth={1.05} className="hv__chip hv__chip--ref">
            <div className="hv__pop" style={{ ["--pi" as string]: 0 }}>
              <div className="chip">
                <span className="chip__icon chip__icon--mint">
                  <LuTrendingUp size={15} aria-hidden="true" />
                </span>
                <span className="chip__txt">
                  <strong>Insight con evidencia</strong>
                  <span>Fortaleza · interacción mediana</span>
                </span>
              </div>
            </div>
          </Layer>

          <Layer depth={0.85} className="hv__chip hv__chip--fu">
            <div className="hv__pop" style={{ ["--pi" as string]: 1 }}>
              <div className="chip">
                <span className="chip__icon chip__icon--sky">
                  <LuRefreshCw size={15} aria-hidden="true" />
                </span>
                <span className="chip__txt">
                  <strong>Sincronizado hoy</strong>
                  <span>Competidores al día · 06:00</span>
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
                <span>3 cosas que deberías saber</span>
                <span className="badge badge--sky">Nuevo</span>
              </div>
            </div>
          </Layer>
        </PointerParallax>
      </ScaledStage>
    </div>
  );
}
