import { useState, type ReactNode } from "react";
import { LuTrendingUp, LuLightbulb, LuInfo, LuSettings, LuSun, LuChevronDown, LuCheck } from "react-icons/lu";
import { APP_URL, dashboardPreview as d, type PreviewMetric, type PreviewWindow } from "../data/content";
import { PreviewLineChart, fmt } from "./PreviewLineChart";

const APP_HOST = new URL(APP_URL).host;
const WEEKDAY_SHORT = ["D", "L", "M", "M", "J", "V", "S"];
const WINDOWS: PreviewWindow[] = [7, 30, 90];
/** Weekly series keep this many points per window (the app buckets posts by week). */
const WEEKS_FOR: Record<PreviewWindow, number> = { 7: 2, 30: 5, 90: 13 };

const METRICS: { key: PreviewMetric; label: string }[] = [
  { key: "growth", label: "Crecimiento" },
  { key: "engagement", label: "Engagement" },
  { key: "frequency", label: "Frecuencia" },
];

const KIND_ICON = { Fortaleza: LuTrendingUp, Oportunidad: LuLightbulb, Contexto: LuInfo };

type RailIcon = "clients" | "reports" | "insights" | "competitors" | "content";

/** The app's own 16-unit rail icons. */
function NavGlyph({ name }: { name: RailIcon }) {
  return (
    <svg className="dp-nav__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {name === "clients" && (
        <>
          <circle cx="5.5" cy="5.5" r="2.5" fill="currentColor" opacity="0.9" />
          <circle cx="11" cy="6.5" r="2" fill="currentColor" opacity="0.45" />
          <path d="M1.5 13.5c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" stroke="currentColor" strokeWidth="1.5" />
        </>
      )}
      {name === "reports" && (
        <>
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 5.5v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.5" />
        </>
      )}
      {name === "insights" && (
        <path d="M2 12.5l3.5-4 3 2.5L13.5 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {name === "competitors" && (
        <>
          <circle cx="5.5" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10.5" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        </>
      )}
      {name === "content" && (
        <>
          <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" fill="currentColor" opacity="0.85" />
          <rect x="9.5" y="1.5" width="4.5" height="4.5" rx="1" fill="currentColor" opacity="0.85" />
          <rect x="1.5" y="9.5" width="4.5" height="4.5" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="9.5" y="9.5" width="4.5" height="4.5" rx="1" fill="currentColor" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

const NAV: { icon: RailIcon; label: string }[] = [
  { icon: "clients", label: "Clientes" },
  { icon: "reports", label: "Informes" },
  { icon: "insights", label: "Insights" },
  { icon: "competitors", label: "Competidores" },
  { icon: "content", label: "Contenido" },
];

function KpiIcon({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <div className={["dp-kpi__icon", accent ? "is-accent" : ""].join(" ")}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </div>
  );
}

/** Rendimiento card: window tabs + metric dropdown over the shared line chart. */
function Performance() {
  const [metric, setMetric] = useState<PreviewMetric>("growth");
  const [days, setDays] = useState<PreviewWindow>(30);
  const [open, setOpen] = useState(false);

  const data = d.chart[metric];
  const keep = metric === "growth" ? days : WEEKS_FOR[days];
  const x = data.x.slice(-keep);
  const series = data.series.map((s) => ({ ...s, values: s.values.slice(-keep) }));
  const mine = series[0].values;
  const first = mine[0];
  const last = mine[mine.length - 1];

  const hero =
    metric === "growth"
      ? { vf: fmt.count, df: fmt.signedPercent, delta: first ? ((last - first) / first) * 100 : null, unit: "seguidores" }
      : metric === "engagement"
        ? { vf: fmt.percent, df: fmt.signedPp, delta: last - first, unit: undefined }
        : { vf: fmt.count, df: fmt.signedCount, delta: last - first, unit: "/sem" };

  const current = METRICS.find((m) => m.key === metric)!;

  return (
    <section className="dp-card dp-card--line dp-perf" aria-label="Rendimiento">
      <div className="dp-card__head dp-card__head--end">
        <h2 className="dp-card__title">Rendimiento</h2>
        <div className="dp-perf__controls">
          <div className="dp-seg" role="group" aria-label="Ventana">
            {WINDOWS.map((w) => (
              <button key={w} type="button" aria-pressed={days === w} className={["dp-seg__tab", days === w ? "is-on" : ""].join(" ")} onClick={() => setDays(w)}>
                {w} días
              </button>
            ))}
          </div>
          <div className="dp-select">
            <button
              type="button"
              className="dp-select__trigger"
              data-open={open}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label={`Métrica: ${current.label}`}
              onClick={() => setOpen((o) => !o)}
            >
              <span>{current.label}</span>
              <LuChevronDown size={16} strokeWidth={2.2} aria-hidden="true" />
            </button>
            {open && (
              <>
                <button type="button" className="dp-select__scrim" aria-label="Cerrar" tabIndex={-1} onClick={() => setOpen(false)} />
                <ul className="dp-select__menu" role="listbox" aria-label="Métrica">
                  {METRICS.map((m) => (
                    <li key={m.key} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={m.key === metric}
                        className="dp-option"
                        onClick={() => {
                          setMetric(m.key);
                          setOpen(false);
                        }}
                      >
                        <span>{m.label}</span>
                        {m.key === metric && <LuCheck size={14} strokeWidth={2.4} aria-hidden="true" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="dp-perf__body">
        <p className="dp-label">{current.label}</p>
        <div className="dp-perf__box">
          <PreviewLineChart
            key={metric}
            x={x}
            series={series}
            valueFormatter={hero.vf}
            deltaFormatter={hero.df}
            delta={hero.delta}
            unit={hero.unit}
            ariaLabel={current.label}
          />
        </div>
      </div>
    </section>
  );
}

/** The app preview: the real client dashboard, rebuilt statically. The scroll-scrubbed transform is driven by the parent via `--p`. */
export function AppPreview() {
  const k = d.kpis;
  const maxBar = Math.max(...k.bestFormat.bars.map((b) => b.value));
  const maxDay = Math.max(...k.bestTime.weekdays);
  const dayFloor = Math.min(...k.bestTime.weekdays) * 0.7;

  return (
    <div className="dash__wrap">
      <div className="dp">
        {/* Peach gradient for the active rail icon. Kept outside the rail so it still paints when the rail is hidden. */}
        <svg aria-hidden="true" width="0" height="0" className="dp__defs">
          <defs>
            <linearGradient id="dp-peach-16" x1="2.67" y1="2.67" x2="13.33" y2="13.33" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffd7b2" />
              <stop offset="40%" stopColor="#ffb987" />
              <stop offset="100%" stopColor="#fb8a74" />
            </linearGradient>
          </defs>
        </svg>

        <div className="dp__chrome" aria-hidden="true">
          <span className="dp__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="dp__url">{APP_HOST}</span>
        </div>

        <div className="dp__body">
          {/* Rail: always dark, icon-only, client switcher above settings */}
          <aside className="dp-rail" aria-label="Navegación de la app (vista previa)">
            <div className="dp-rail__logo">
              <img src={`${import.meta.env.BASE_URL}logo/logo-collapsed.png`} alt="" width={48} height={48} decoding="async" />
            </div>
            <div className="dp-rail__rule">
              <div />
            </div>
            <nav className="dp-rail__nav">
              {NAV.map((n, i) => (
                <span key={n.label} className={["dp-nav", i === 0 ? "is-on" : ""].join(" ")} title={n.label} aria-label={n.label}>
                  <NavGlyph name={n.icon} />
                </span>
              ))}
            </nav>
            <div className="dp-rail__client">
              <span className="dp-client" title={`Plan: ${d.client.plan}`}>
                {d.client.initial}
              </span>
            </div>
            <div className="dp-rail__foot">
              <span className="dp-nav" title="Ajustes" aria-label="Ajustes">
                <LuSettings size={16} strokeWidth={2.25} aria-hidden="true" />
              </span>
            </div>
          </aside>

          <div className="dp__col">
            <header className="dp-top">
              <div className="dp-top__client">
                <span className="dp-top__kicker">Cliente</span>
                <span className="dp-top__name">
                  {d.client.name}
                  <LuChevronDown size={16} strokeWidth={2.2} aria-hidden="true" />
                </span>
              </div>
              <div className="dp-top__right">
                <div className="dp-top__sync">
                  <i aria-hidden="true" />
                  <span>Sync</span>
                  <em>· {d.client.lastSync}</em>
                </div>
                <span className="dp-round" aria-hidden="true">
                  <LuSun size={18} strokeWidth={1.8} />
                </span>
                <span className="dp-round" aria-hidden="true">
                  <svg viewBox="0 0 22 22" width="22" height="22" className="dp-flag">
                    <clipPath id="dp-flag-clip">
                      <circle cx="11" cy="11" r="11" />
                    </clipPath>
                    <g clipPath="url(#dp-flag-clip)">
                      <rect width="22" height="22" fill="#c60b1e" />
                      <rect y="5.5" width="22" height="11" fill="#ffc400" />
                    </g>
                  </svg>
                </span>
                <span className="dp-round dp-top__bell" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="17" height="17">
                    <path
                      d="M8 1.8c-1.9 0-3.3 1.5-3.3 3.4v2c0 .6-.2 1.2-.6 1.7l-.7.9c-.4.5-.1 1.3.6 1.3h8c.7 0 1-.8.6-1.3l-.7-.9c-.4-.5-.6-1.1-.6-1.7v-2c0-1.9-1.4-3.4-3.3-3.4Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                    <path d="M6.3 12.8a1.8 1.8 0 0 0 3.4 0" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <i />
                </span>
                <span className="dp-user" aria-hidden="true">
                  <span className="dp-avatar dp-avatar--28">A</span>
                  <span>ana@casalumbre.com</span>
                </span>
              </div>
            </header>

            <div className="dp-main">
              <div className="dp-page">
                {/* Client header */}
                <header className="dp-banner">
                  <span className="dp-avatar dp-avatar--72" aria-hidden="true">
                    {d.client.initial}
                  </span>
                  <div className="dp-banner__text">
                    <h2 className="dp-banner__name">{d.client.name}</h2>
                    <span className="dp-plan">
                      <span className="dp-badge">
                        Plan: {d.client.plan}: {d.client.planUsed}/{d.client.planMax} competidores
                      </span>
                      <span className="dp-badge">{d.client.workspace}</span>
                    </span>
                    <div className="dp-stats">
                      <div>
                        <p>{d.client.posts}</p>
                        <span>publicaciones</span>
                      </div>
                      <div>
                        <p>{d.client.followers}</p>
                        <span>seguidores</span>
                      </div>
                      <div>
                        <p>{d.client.following}</p>
                        <span>seguidos</span>
                      </div>
                    </div>
                  </div>
                </header>

                <div className="dp-stack">
                  {/* 1. KPI cards */}
                  <div className="dp-kpis">
                    <section className="dp-card dp-card--line dp-kpi" aria-label="Mejor formato">
                      <div className="dp-kpi__head">
                        <KpiIcon>
                          <rect x="3" y="12" width="4" height="9" rx="1" />
                          <rect x="10" y="7" width="4" height="14" rx="1" />
                          <rect x="17" y="3" width="4" height="18" rx="1" />
                        </KpiIcon>
                        <p className="dp-label">Mejor formato · 30 d</p>
                      </div>
                      <p className="dp-qualifier">Interacción mediana por formato</p>
                      <div className="dp-fbars">
                        {k.bestFormat.bars.map((b, i) => (
                          <div key={b.label} className="dp-fbars__row">
                            <span className="dp-fbars__label">{b.label}</span>
                            <div className="dp-track">
                              <div
                                className={["dp-track__fill", i === k.bestFormat.best ? "is-best" : "is-muted"].join(" ")}
                                style={{ width: `${Math.max(4, (b.value / maxBar) * 100)}%` }}
                              />
                            </div>
                            <span className="dp-fbars__value">{fmt.percent(b.value)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="dp-kpi__foot dp-kpi__foot--end">
                        <p className="dp-value dp-value--lg">{k.bestFormat.bars[k.bestFormat.best].label}</p>
                        <p className="dp-value dp-value--sm">{fmt.percent(k.bestFormat.bars[k.bestFormat.best].value)} ER</p>
                      </div>
                    </section>

                    <section className="dp-card dp-card--line dp-kpi" aria-label="Mejor momento">
                      <div className="dp-kpi__head">
                        <KpiIcon accent>
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3.5 2" />
                        </KpiIcon>
                        <p className="dp-label">Mejor momento · 30 d</p>
                      </div>
                      <p className="dp-qualifier">Interacción promedio por día de la semana</p>
                      <div className="dp-week" role="img" aria-label="Interacción promedio por día de la semana">
                        {/* Bars start at a floor below the lowest day so small ER differences stay visible. */}
                        <span className="dp-week__plot">
                          {k.bestTime.weekdays.map((v, i) => (
                            <span key={i} className={["dp-week__slot", i === k.bestTime.bestWeekday ? "is-best" : ""].join(" ")}>
                              <span
                                className="dp-week__bar"
                                style={{ height: `${Math.max(4, ((v - dayFloor) / (maxDay - dayFloor)) * 100)}%` }}
                              />
                            </span>
                          ))}
                        </span>
                        <span className="dp-week__days" aria-hidden="true">
                          {WEEKDAY_SHORT.map((w, i) => (
                            <span key={i} className={i === k.bestTime.bestWeekday ? "is-best" : ""}>
                              {w}
                            </span>
                          ))}
                        </span>
                      </div>
                    </section>

                    <section className="dp-card dp-card--line dp-kpi" aria-label="Interacción frente a los 30 días anteriores">
                      <div className="dp-kpi__head">
                        <KpiIcon>
                          <path d="M4 19V9M12 19V5M20 19v-7" />
                        </KpiIcon>
                        <p className="dp-label">Vos contra vos mismo · 30 d</p>
                      </div>
                      <p className="dp-qualifier">Interacción vs. los 30 días anteriores</p>
                      <p className="dp-tech dp-tech--gap">
                        {k.selfTrend.current} últimos 30 días · {k.selfTrend.previous} los 30 anteriores
                      </p>
                      <p className="dp-value dp-value--lg dp-kpi__foot is-up">↑ {k.selfTrend.diff}</p>
                    </section>

                    <section className="dp-card dp-card--line dp-kpi" aria-label="Datos analizados">
                      <div className="dp-kpi__head">
                        <KpiIcon>
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 3v9l6 3" />
                        </KpiIcon>
                        <p className="dp-label">Datos analizados · 30 d</p>
                      </div>
                      <p className="dp-qualifier dp-qualifier--snug">{k.analyzed.line}</p>
                      <div className="dp-track dp-track--cover" role="img" aria-label={`Datos analizados ${k.analyzed.coverageLabel}`}>
                        <div className="dp-track__fill is-cover" style={{ width: `${k.analyzed.coverage}%` }} />
                      </div>
                      <p className="dp-tech dp-tech--gap">Cobertura · {k.analyzed.coverageLine}</p>
                      <p className="dp-value dp-value--lg dp-kpi__foot">{k.analyzed.coverageLabel}</p>
                    </section>
                  </div>

                  {/* 2. Rendimiento (60%) beside the insights teaser (40%) */}
                  <div className="dp-split">
                    <Performance />

                    <div className="dp-split__side">
                      <section className="dp-card dp-insights" aria-label="3 cosas que deberías saber">
                        <div className="dp-card__head dp-card__head--base">
                          <h2 className="dp-card__title">3 cosas que deberías saber</h2>
                          <p className="dp-tech">Los hallazgos más relevantes de la muestra de 30 días</p>
                        </div>
                        <hr className="dp-rule" />
                        <div className="dp-insights__grid">
                          {d.insights.map((ins) => {
                            const Icon = KIND_ICON[ins.kind];
                            return (
                              <article key={ins.title} className="dp-tile">
                                <div className="dp-tile__head">
                                  <span>
                                    <Icon size={12} aria-hidden="true" />
                                    {ins.kind}
                                  </span>
                                  <strong className={ins.tone === "warning" ? "is-warn" : ""}>{ins.window}</strong>
                                </div>
                                <h3>{ins.title}</h3>
                                <p>{ins.description}</p>
                                <div className="dp-tile__foot">
                                  <span className="dp-tile__acc">{ins.account}</span>
                                  <span className="dp-tile__val">{ins.value}</span>
                                  <span className="dp-tile__evi">
                                    Evidencia · {ins.entries} {ins.entries === 1 ? "dato" : "datos"}
                                  </span>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* 3. Best posts */}
                  <section className="dp-card dp-card--line dp-posts" aria-label="Mejores publicaciones">
                    <div className="dp-card__head dp-card__head--start">
                      <div>
                        <h2 className="dp-card__title">Mejores publicaciones</h2>
                        <p className="dp-context">Ordenado por interacción (likes y comentarios)</p>
                      </div>
                      <span className="dp-btn">Ver todo el contenido →</span>
                    </div>
                    <div className="dp-posts__grid">
                      {d.posts.map((p) => (
                        <div key={p.caption} className="dp-post">
                          <span className="dp-post__thumb" style={{ background: p.gradient }}>
                            <span className="dp-badge dp-badge--post">{p.format}</span>
                          </span>
                          <span className="dp-post__body">
                            <span className="dp-post__who">
                              <span className="dp-avatar dp-avatar--24" aria-hidden="true">
                                {d.client.initial}
                              </span>
                              <span className="dp-post__user">@{d.client.username}</span>
                            </span>
                            <span className="dp-post__stats">
                              <span>
                                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                                  <path
                                    d="M8 13.5 2.6 8.3C1 6.8 1 4.3 2.7 2.9c1.5-1.2 3.6-1 5 .4L8 3.6l.3-.3c1.4-1.4 3.5-1.6 5-.4 1.7 1.4 1.7 3.9.1 5.4L8 13.5Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {p.likes}
                              </span>
                              <span>
                                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                                  <path d="M2 3.5h12v7H6.2L3 13.2V10.5H2z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                                </svg>
                                {p.comments}
                              </span>
                            </span>
                            <span className="dp-post__meta">
                              {p.age}
                              <span aria-hidden="true">·</span>
                              {p.er} ER
                            </span>
                            <span className="dp-post__caption">{p.caption}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Quality strip */}
                  <footer className="dp-quality" aria-label="Colofón · calidad de datos">
                    <div>
                      <span className="dp-quality__title">Colofón · calidad de datos</span>
                      <span>
                        {d.quality.line} <strong>· {d.quality.coverageLine}</strong>
                      </span>
                      <span>
                        Cobertura: <strong>{d.quality.coverage}</strong>
                      </span>
                      <span>
                        Muestra: <strong>{d.quality.sample}</strong>
                      </span>
                      <span>
                        Ventana: <strong>{d.quality.window}</strong>
                      </span>
                      <span>
                        Base: <strong>{d.quality.basis}</strong>
                      </span>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
