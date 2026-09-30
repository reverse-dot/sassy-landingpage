import { useEffect, useState } from "react";
import { LuSearch, LuTrendingUp, LuUsers, LuClock, LuInfo, LuColumns2, LuSparkles, LuFileCheck } from "react-icons/lu";
import { Paper } from "./HandMarks";
import { prefersReducedMotion } from "../motion/env";
import { clients, WEEKDAYS } from "../data/content";

/* ---------------------------------------------------------------
   Feature 1 — manual figures matched to a side-by-side card
   --------------------------------------------------------------- */
const F1 = [
  { manual: "seguidores ~12.4k (¿12.5k?)", field: "Seguidores", value: "12.480 · +3,2% en 30 días", tone: "sky" },
  { manual: "eng. a ojo, ¿3%?", field: "Interacción mediana", value: "3,4% · @taller.norte 2,1%", tone: "mint" },
  { manual: "norte: ¿3 pub. por sem.?", field: "Frecuencia", value: "5 pub./sem · @taller.norte 3", tone: "lilac" },
  { manual: "revisar capturas del lunes", field: "Ventana", value: "Últimos 30 días · 22 pub.", tone: "peach" },
];

export function SideBySideVisual({ active }: { active: boolean }) {
  return (
    <div
      className={["fv fv1", active ? "is-active" : ""].join(" ")}
      role="img"
      aria-label="Cuatro notas manuales se emparejan con cuatro campos ordenados: seguidores, interacción mediana, frecuencia y ventana de análisis."
    >
      <Paper className="fv1__note">
        <p className="fv1__date">Lun — Casa Lumbre</p>
        <ul>
          {F1.map((f, i) => (
            <li key={i} className={`fv1__line tone-${f.tone}`} style={{ ["--k" as string]: i }}>
              <span>{f.manual}</span>
            </li>
          ))}
        </ul>
      </Paper>

      <div className="fv1__card card">
        <div className="fv1__head">
          <span className="fv1__title">
            <LuColumns2 size={14} aria-hidden="true" /> Lado a lado
          </span>
          <span className="badge badge--mint">
            <LuSparkles size={11} aria-hidden="true" /> 4 de 4
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
   Feature 2 — insights with evidence, searchable
   --------------------------------------------------------------- */
const EVENTS = [
  { icon: LuTrendingUp, t: "cob. 100%", title: "Fortaleza · interacción", sub: "3,4% vs 2,1% · muestra de 22 pub. · 30 días", tone: "mint", hit: true },
  { icon: LuUsers, t: "cob. 100%", title: "Fortaleza · seguidores", sub: "+3,2% vs +1,1%, +2,4% y +0,6% · 30 días", tone: "sky" },
  { icon: LuClock, t: "cob. 100%", title: "Oportunidad · frecuencia", sub: "@estudio.bruma 7 vs 5 pub./sem · 30 días", tone: "peach" },
  { icon: LuInfo, t: "parcial", title: "Contexto · muestra pequeña", sub: "@cafe.ancla · 9 pub. · lectura con cautela", tone: "lilac", hit: true },
];

const QUERY = "muestra";

export function InsightsVisual({ active }: { active: boolean }) {
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
      aria-label="Lista de insights con evidencia, agrupados en fortalezas, oportunidades y contexto. Al buscar «muestra» se resaltan las dos entradas que la mencionan."
    >
      <div className="fv2__card card">
        <div className="fv2__top">
          <div className="fv2__search">
            <LuSearch size={15} aria-hidden="true" />
            <span className="fv2__q">
              {QUERY.slice(0, typed)}
              <span className="fv2__caret" />
            </span>
            <span className="fv2__count">{searching ? "2 coincidencias" : ""}</span>
          </div>
          <div className="fv2__filters">
            <span className="fv2__f is-on">Todos</span>
            <span className="fv2__f">Fortalezas</span>
            <span className="fv2__f">Oportunidades</span>
            <span className="fv2__f">Contexto</span>
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
        <p className="fv2__side-k">Ventana de 30 días</p>
        <div className="fv2__bars" aria-hidden="true">
          {[52, 70, 44, 86, 58].map((h, i) => (
            <span key={i} style={{ ["--h" as string]: `${h}%`, ["--k" as string]: i }} />
          ))}
        </div>
        <p className="fv2__side-v">
          <strong>22</strong> publicaciones analizadas
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Feature 3 — weekly cadence and best moment to post
   --------------------------------------------------------------- */
export function ContentVisual({ active }: { active: boolean }) {
  const c = clients[0];
  const max = Math.max(...c.weekly);
  return (
    <div
      className={["fv fv3", active ? "is-active" : ""].join(" ")}
      role="img"
      aria-label={`Publicaciones por día de la semana de ${c.handle} y su mejor momento para publicar: ${c.bestMoment.toLowerCase()}.`}
    >
      <div className="fv3__summary card">
        <p className="fv3__k">
          <LuSparkles size={13} aria-hidden="true" /> Mejor momento para publicar
        </p>
        <p className="fv3__s">
          Con las últimas 22 publicaciones de {c.handle}, la interacción mediana fue mayor los{" "}
          {c.bestMoment.toLowerCase().replace("jueves, ", "jueves ")}.
        </p>
      </div>
      <div className="fv3__chart card">
        <p className="fv3__chart-h">
          Publicaciones por día <span>Últimos 30 días</span>
        </p>
        <div className="fv3__week" aria-hidden="true">
          {c.weekly.map((n, i) => (
            <span
              key={i}
              className={["fv3__bar", i === c.bestDay ? "is-best" : ""].join(" ")}
              style={{ ["--h" as string]: `${Math.round((n / max) * 100)}%`, ["--k" as string]: i }}
            />
          ))}
        </div>
        <div className="fv3__days" aria-hidden="true">
          {WEEKDAYS.map((d, i) => (
            <span key={d} className={i === c.bestDay ? "is-best" : ""}>
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Feature 4 — per-client report, observed data only
   --------------------------------------------------------------- */
const TILES = [
  { k: "Interacción", v: "3,4%", d: "mediana", flat: true, spark: [50, 62, 44, 70, 58, 80] },
  { k: "Crecimiento", v: "+3,2%", d: "seguidores", flat: false, spark: [30, 38, 46, 55, 64, 78] },
  { k: "Cadencia", v: "5/sem", d: "publicaciones", flat: true, spark: [60, 40, 70, 55, 66, 62] },
];

export function ReportsVisual({ active }: { active: boolean }) {
  return (
    <div
      className={["fv fv4", active ? "is-active" : ""].join(" ")}
      role="img"
      aria-label="Informe de un cliente con tres indicadores: interacción mediana 3,4%, crecimiento de seguidores 3,2% y cadencia de 5 publicaciones por semana, calculados con 22 publicaciones observadas."
    >
      <div className="fv4__doc card">
        <div className="fv4__head">
          <div>
            <strong>Casa Lumbre</strong>
            <span>Informe del cliente · ventana de 30 días</span>
          </div>
          <span className="badge badge--mint">
            <LuFileCheck size={11} aria-hidden="true" /> Datos observados
          </span>
        </div>
        <div className="fv4__grid">
          {TILES.map((t, i) => (
            <div key={t.k} className="fv4__tile" style={{ ["--k" as string]: i }}>
              <span className="fv4__tile-k">{t.k}</span>
              <span className="fv4__tile-v">{t.v}</span>
              <span className={["fv4__tile-d", t.flat ? "is-flat" : ""].join(" ")}>{t.d}</span>
              <span className="fv4__spark" aria-hidden="true">
                {t.spark.map((h, j) => (
                  <i key={j} style={{ ["--h" as string]: `${h}%` }} />
                ))}
              </span>
            </div>
          ))}
        </div>
        <p className="fv4__foot">
          <span>22 publicaciones · cobertura 100%</span>
          <span>Sin estimaciones</span>
        </p>
      </div>
    </div>
  );
}
