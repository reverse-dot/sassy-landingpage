import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  LuTrendingUp,
  LuLightbulb,
  LuInfo,
  LuSettings,
  LuSearch,
  LuBell,
  LuCheck,
  LuClock,
  LuTriangleAlert,
  LuChartColumn,
} from "react-icons/lu";
import { clients, WEEKDAYS, APP_URL, type Client, type Insight } from "../data/content";
import { Reveal, RevealLines } from "./ScrollReveal";
import { HandArrow } from "./HandMarks";
import { Logo } from "./Logo";
import { useScrollVar } from "../motion/hooks";

const TABS = ["Lado a lado", "Insights", "Contenido"] as const;
type Tab = (typeof TABS)[number];

const STATUS_TONE: Record<Client["status"], string> = {
  Sincronizado: "mint",
  Sincronizando: "sky",
  "Datos limitados": "peach",
};

const GROUP_ORDER: Insight["group"][] = ["Fortaleza", "Oportunidad", "Contexto"];

const GROUP_ICON = { Fortaleza: LuTrendingUp, Oportunidad: LuLightbulb, Contexto: LuInfo };
const APP_HOST = new URL(APP_URL).host;

type RailIcon = "summary" | "clients" | "reports" | "insights" | "competitors" | "content";

/** The app's own 16-unit sidebar icons. */
function NavGlyph({ name }: { name: RailIcon }) {
  return (
    <svg className="app__glyph" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {name === "summary" && (
        <>
          <rect x="1.5" y="1.5" width="5" height="5" rx="1" fill="currentColor" opacity="0.9" />
          <rect x="9.5" y="1.5" width="5" height="5" rx="1" fill="currentColor" opacity="0.45" />
          <rect x="1.5" y="9.5" width="5" height="5" rx="1" fill="currentColor" opacity="0.45" />
          <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="currentColor" opacity="0.9" />
        </>
      )}
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
        <path d="M2 12.5l3.5-4 3 2.5L13.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
  { icon: "summary", label: "Panel" },
  { icon: "clients", label: "Clientes" },
  { icon: "insights", label: "Insights" },
  { icon: "competitors", label: "Competidores" },
  { icon: "content", label: "Contenido" },
  { icon: "reports", label: "Informes" },
];

export function InteractiveDashboard() {
  const [cid, setCid] = useState(clients[0].id);
  const [tab, setTab] = useState<Tab>("Lado a lado");
  // Which competitors are being monitored (paused ones drop out of the views).
  const [watch, setWatch] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(clients.flatMap((c) => c.accounts.filter((a) => !a.you).map((a) => [`${c.id}:${a.handle}`, true])))
  );
  const [query, setQuery] = useState("");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const frameRef = useScrollVar<HTMLDivElement>("--p", (el, vh) => {
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
  });

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? clients.filter((c) => (c.name + " " + c.handle + " " + c.segment).toLowerCase().includes(q))
      : clients;
  }, [query]);

  const c = clients.find((x) => x.id === cid)!;
  const me = c.accounts[0];
  const isOn = (handle: string) => watch[`${c.id}:${handle}`] !== false;
  const competitors = c.accounts.filter((a) => !a.you);
  const activeCount = competitors.filter((a) => isOn(a.handle)).length;
  const rows = c.accounts.filter((a) => a.you || isOn(a.handle));
  const insights = GROUP_ORDER.flatMap((g) =>
    c.insights.filter((i) => i.group === g && (i.evidence.account === c.handle || isOn(i.evidence.account)))
  );
  const maxWeek = Math.max(...c.weekly);

  const onTabKey = (e: KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = TABS.length - 1;
    else return;
    e.preventDefault();
    setTab(TABS[n]);
    tabRefs.current[n]?.focus();
  };

  return (
    <section className="dash section" id="demo" aria-labelledby="dash-title">
      <div className="container container--wide">
        <div className="section-head section-head--center">
          <Reveal>
            <p className="eyebrow">Pruébalo</p>
          </Reveal>
          <RevealLines id="dash-title" className="h2" lines={["Un panel para todos", "tus clientes"]} />
          <Reveal as="p" className="lead" delay={150}>
            Esta es una vista previa interactiva con datos de ejemplo. Cambia de cliente, revisa el lado a lado y
            pausa o activa a tus competidores.
          </Reveal>
        </div>

        <div className="dash__wrap" ref={frameRef}>
          <div className="dash__hint" aria-hidden="true">
            <span className="hand">elige un cliente</span>
            <HandArrow variant="down" className="dash__hint-arrow" />
          </div>

          <div className="app">
            <div className="app__chrome" aria-hidden="true">
              <span className="app__dots">
                <i />
                <i />
                <i />
              </span>
              <span className="app__url">{APP_HOST}</span>
            </div>

            <div className="app__body">
              {/* Sidebar */}
              <aside className="app__side" aria-label="Navegación de la app (vista previa)">
                <div className="app__brand">
                  <Logo />
                </div>
                <ul className="app__nav">
                  {NAV.map((n, i) => (
                    <li key={n.label} className={i === 0 ? "is-on" : ""}>
                      <NavGlyph name={n.icon} />
                      <span>{n.label}</span>
                      {n.label === "Insights" && <em className="app__count">3</em>}
                    </li>
                  ))}
                </ul>
                <div className="app__side-foot">
                  <LuSettings size={16} aria-hidden="true" />
                  <span>Ajustes</span>
                </div>
              </aside>

              {/* Main */}
              <div className="app__main">
                <div className="app__top">
                  <label className="app__search">
                    <LuSearch size={15} aria-hidden="true" />
                    <span className="sr-only">Buscar clientes</span>
                    <input
                      type="search"
                      placeholder="Buscar cliente"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <kbd>⌘K</kbd>
                  </label>
                  <div className="app__top-right">
                    <span className="app__bell" aria-hidden="true">
                      <LuBell size={16} />
                      <i />
                    </span>
                    <span className="avatar app__me" aria-hidden="true">
                      AG
                    </span>
                  </div>
                </div>

                <div className="app__cols">
                  {/* Client switcher */}
                  <div className="app__list">
                    <p className="app__list-h">
                      Clientes <span>3 de 6</span>
                    </p>
                    <ul>
                      {list.map((x) => (
                        <li key={x.id}>
                          <button
                            className={["pt", x.id === cid ? "is-on" : ""].join(" ")}
                            aria-pressed={x.id === cid}
                            onClick={() => setCid(x.id)}
                          >
                            <span className="pt__time">{x.sync}</span>
                            <span className="app__av" aria-hidden="true">{x.initials}</span>
                            <span className="pt__txt">
                              <strong>{x.name}</strong>
                              <span>{x.segment}</span>
                            </span>
                            <span className={`pt__dot tone-dot-${STATUS_TONE[x.status]}`} title={x.status} />
                          </button>
                        </li>
                      ))}
                      {list.length === 0 && <li className="app__empty">Ningún cliente coincide con “{query}”.</li>}
                    </ul>
                  </div>

                  {/* Detail */}
                  <div className="app__detail" aria-live="polite">
                    <header className="pd__head" key={c.id}>
                      <span className="app__av app__av--lg" aria-hidden="true">{c.initials}</span>
                      <div className="pd__who">
                        <h3>{c.name}</h3>
                        <p>
                          {c.handle} · {c.segment}
                        </p>
                      </div>
                      <span className={`badge badge--${STATUS_TONE[c.status]} pd__status`}>{c.status}</span>
                      {c.flags.length > 0 && (
                        <div className="pd__flags">
                          {c.flags.map((f) => (
                            <span key={f} className="badge badge--butter">
                              <LuTriangleAlert size={11} aria-hidden="true" /> {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </header>

                    <div className="pd__tabs" role="tablist" aria-label="Vistas del cliente">
                      {TABS.map((t, i) => (
                        <button
                          key={t}
                          ref={(el) => {
                            tabRefs.current[i] = el;
                          }}
                          role="tab"
                          id={`tab-${i}`}
                          aria-selected={tab === t}
                          aria-controls={`panel-${i}`}
                          tabIndex={tab === t ? 0 : -1}
                          className={tab === t ? "is-on" : ""}
                          onClick={() => setTab(t)}
                          onKeyDown={(e) => onTabKey(e, i)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="pd__kpis">
                      <div className="pd__kpi">
                        <span className="pd__kico">
                          <LuTrendingUp size={14} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="pd__kl">Seguidores</p>
                          <p className="pd__kv">
                            {me.followers}
                            <small className={me.growth.startsWith("−") ? "is-down" : "is-up"}>{me.growth}</small>
                          </p>
                        </div>
                      </div>
                      <div className="pd__kpi">
                        <span className="pd__kico">
                          <LuChartColumn size={14} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="pd__kl">Interacción mediana</p>
                          <p className="pd__kv">
                            {me.engagement}
                            <small>{me.sample} pub.</small>
                          </p>
                        </div>
                      </div>
                      <div className="pd__kpi">
                        <span className="pd__kico">
                          <LuClock size={14} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="pd__kl">Frecuencia</p>
                          <p className="pd__kv">
                            {me.cadence}
                            <small>pub./sem</small>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pd__content">
                      <div
                        className="pd__panel"
                        role="tabpanel"
                        id={`panel-${TABS.indexOf(tab)}`}
                        aria-labelledby={`tab-${TABS.indexOf(tab)}`}
                        key={c.id + tab}
                      >
                        {tab === "Lado a lado" && (
                          <div>
                            <div className="pd__tablewrap">
                              <table className="pd__table">
                                <thead>
                                  <tr>
                                    <th scope="col">Cuenta</th>
                                    <th scope="col">Seguidores</th>
                                    <th scope="col">Interacción</th>
                                    <th scope="col">Pub./sem</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rows.map((a, i) => (
                                    <tr key={a.handle} className={a.you ? "is-you" : ""} style={{ ["--k" as string]: i }}>
                                      <th scope="row">
                                        <span>{a.handle}</span>
                                        {a.you && <em>Tú</em>}
                                      </th>
                                      <td>
                                        {a.followers}
                                        <small className={a.growth.startsWith("−") ? "is-down" : "is-up"}>{a.growth}</small>
                                      </td>
                                      <td>{a.engagement}</td>
                                      <td>{a.cadence}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <p className="pd__src">
                              <LuChartColumn size={13} aria-hidden="true" /> Ventana de 30 días · interacción
                              mediana de la muestra
                            </p>
                          </div>
                        )}
                        {tab === "Insights" && (
                          <div>
                            <ul className="pd__ins">
                              {insights.map((ins, i) => (
                                <li key={ins.text} style={{ ["--k" as string]: i }}>
                                  <div className="pd__ik">
                                    <span>
                                      {(() => {
                                        const I = GROUP_ICON[ins.group];
                                        return <I size={12} aria-hidden="true" />;
                                      })()}{" "}
                                      {ins.group}
                                    </span>
                                    <strong>{ins.evidence.window}</strong>
                                  </div>
                                  <p>{ins.text}</p>
                                  <small>
                                    {ins.evidence.metric}: {ins.evidence.value}
                                  </small>
                                  <div className="pd__if">
                                    <span>{ins.evidence.account}</span>
                                    <span>
                                      muestra {ins.evidence.sample} · cobertura {ins.evidence.coverage}
                                    </span>
                                  </div>
                                </li>
                              ))}
                              {insights.length === 0 && (
                                <li className="app__empty">Activa al menos un competidor para ver observaciones.</li>
                              )}
                            </ul>
                            <p className="pd__src">Observaciones deterministas · sin puntajes ni recomendaciones</p>
                          </div>
                        )}
                        {tab === "Contenido" && (
                          <div className="pd__cadence">
                            <p className="pd__sk">Publicaciones por día · últimos 30 días</p>
                            <div className="pd__week" aria-hidden="true">
                              {c.weekly.map((n, i) => (
                                <span
                                  key={i}
                                  className={i === c.bestDay ? "is-best" : ""}
                                  style={{ ["--h" as string]: `${Math.round((n / maxWeek) * 100)}%`, ["--k" as string]: i }}
                                />
                              ))}
                            </div>
                            <div className="pd__days" aria-hidden="true">
                              {WEEKDAYS.map((d, i) => (
                                <span key={d} className={i === c.bestDay ? "is-best" : ""}>
                                  {d}
                                </span>
                              ))}
                            </div>
                            <p className="pd__best">
                              <LuClock size={14} aria-hidden="true" /> Mejor momento: {c.bestMoment}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="pd__tasks">
                        <p className="pd__tasks-h">
                          Competidores{" "}
                          <span>
                            {activeCount} de {competitors.length} activos
                          </span>
                        </p>
                        <ul>
                          {competitors.map((a) => {
                            const on = isOn(a.handle);
                            const key = `${c.id}:${a.handle}`;
                            return (
                              <li key={key}>
                                <button
                                  className={["tk", "tk--watch", on ? "is-done" : ""].join(" ")}
                                  role="checkbox"
                                  aria-checked={on}
                                  onClick={() => setWatch((w) => ({ ...w, [key]: !on }))}
                                >
                                  <span className="tk__box" aria-hidden="true">
                                    <LuCheck size={11} />
                                  </span>
                                  <span className="tk__label">{a.handle}</span>
                                  <span className={`badge badge--${on ? "mint" : "butter"}`}>
                                    {on ? "Sync diaria" : "En pausa"}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
