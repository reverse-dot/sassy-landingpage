import { useEffect, useId, useMemo, useRef, useState } from "react";
import { LuSettings, LuTrendingUp, LuLightbulb, LuInfo, LuClock, LuChartColumn, LuCheck, LuBell } from "react-icons/lu";
import { clients, WEEKDAYS, APP_URL, type Account, type Client, type Insight } from "../data/content";
import { Reveal, RevealLines } from "./ScrollReveal";
import { HandArrow } from "./HandMarks";
import { useScrollVar } from "../motion/hooks";

/* ------------------------------------------------------------------
   Preview of the Bandito app shell: icon rail, header, page header,
   KPI cards, "Lado a lado" comparison and insight tiles. Styles live in
   styles/dashboard.css; colours come from tokens.css.
   ------------------------------------------------------------------ */

type RailIcon = "summary" | "clients" | "reports" | "insights" | "competitors" | "content";

/** The app's own 16-unit rail icons. */
function RailGlyph({ name }: { name: RailIcon }) {
  return (
    <svg className="ad__glyph" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
  { icon: "summary", label: "Resumen" },
  { icon: "clients", label: "Clientes" },
  { icon: "reports", label: "Informes" },
  { icon: "insights", label: "Insights" },
  { icon: "competitors", label: "Competidores" },
  { icon: "content", label: "Contenido" },
];

const TABS = ["Todos", "Fortalezas", "Oportunidades", "Contexto"] as const;
type Tab = (typeof TABS)[number];
const GROUP_TAB: Record<Insight["group"], Exclude<Tab, "Todos">> = {
  Fortaleza: "Fortalezas",
  Oportunidad: "Oportunidades",
  Contexto: "Contexto",
};
const GROUP_ICON = { Fortaleza: LuTrendingUp, Oportunidad: LuLightbulb, Contexto: LuInfo };
const GROUP_ORDER: Insight["group"][] = ["Fortaleza", "Oportunidad", "Contexto"];

const STATUS_COLOR: Record<Client["status"], string> = {
  Sincronizado: "ad__dot--ok",
  Sincronizando: "ad__dot--accent",
  "Datos limitados": "ad__dot--warn",
};

/* ---- small helpers ---- */
const num = (s: string) => parseFloat(s.replace(/\./g, "").replace(",", ".").replace("%", "").replace("−", "-"));
const APP_HOST = new URL(APP_URL).host;

function rankOf(list: Account[], a: Account, get: (x: Account) => number) {
  return [...list].sort((x, y) => get(y) - get(x)).findIndex((x) => x.handle === a.handle) + 1;
}

/** Decorative trend line, deterministic per client. */
function Sparkline({ seed, growth }: { seed: string; growth: string }) {
  const id = useId();
  const up = !growth.startsWith("−");
  const base = seed.charCodeAt(seed.length - 1);
  const pts = Array.from({ length: 10 }, (_, i) => {
    const wiggle = ((base * (i + 3)) % 7) / 7 - 0.5;
    const trend = up ? i / 9 : 1 - i / 9;
    return 0.75 - (trend * 0.5 + wiggle * 0.18);
  });
  const d = pts.map((y, i) => `${i === 0 ? "M" : "L"}${(i / 9) * 100} ${(y * 32).toFixed(1)}`).join(" ");
  return (
    <svg className="ad__spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L100 32 L0 32 Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Avatar({ name, size = 56 }: { name: string; size?: number }) {
  const initial = (name.replace("@", "").trim().charAt(0) || "·").toUpperCase();
  return (
    <span
      className="ad__avatar"
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.42) }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export function InteractiveDashboard() {
  const [cid, setCid] = useState(clients[0].id);
  const [tab, setTab] = useState<Tab>("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  // Which competitors are being monitored (paused ones drop out of every view).
  const [watch, setWatch] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(clients.flatMap((c) => c.accounts.filter((a) => !a.you).map((a) => [`${c.id}:${a.handle}`, true])))
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const frameRef = useScrollVar<HTMLDivElement>("--p", (el, vh) => {
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
  });

  // Client switcher popover: focus moves in on open, Escape closes and returns focus.
  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const c = clients.find((x) => x.id === cid)!;
  const me = c.accounts[0];
  const key = (h: string) => `${c.id}:${h}`;
  const isOn = (h: string) => watch[key(h)] !== false;
  const competitors = c.accounts.filter((a) => !a.you);
  const activeCount = competitors.filter((a) => isOn(a.handle)).length;
  const cols = c.accounts.filter((a) => a.you || isOn(a.handle));
  const [bestDay, bestHours] = c.bestMoment.split(", entre ");

  const visible = useMemo(
    () =>
      GROUP_ORDER.flatMap((g) =>
        c.insights.filter((i) => i.group === g && (i.evidence.account === c.handle || watch[`${c.id}:${i.evidence.account}`] !== false))
      ),
    [c, watch]
  );
  const shown = visible.filter((i) => tab === "Todos" || GROUP_TAB[i.group] === tab);
  const count = (t: Tab) => (t === "Todos" ? visible.length : visible.filter((i) => GROUP_TAB[i.group] === t).length);

  const pick = (id: string) => {
    setCid(id);
    setMenuOpen(false);
    triggerRef.current?.focus();
  };

  const rows: { label: string; hint: string; get: (a: Account) => number; cell: (a: Account) => string; dots?: boolean }[] = [
    { label: "Seguidores", hint: "al cierre", get: (a) => num(a.followers), cell: (a) => a.followers },
    { label: "Interacción mediana", hint: "por publicación", get: (a) => num(a.engagement), cell: (a) => a.engagement },
    { label: "Frecuencia", hint: "pub. por semana", get: (a) => num(a.cadence), cell: (a) => `${a.cadence} / sem`, dots: true },
  ];

  const maxWeek = Math.max(...c.weekly);

  return (
    <section className="dash section" id="demo" aria-labelledby="dash-title">
      <div className="container container--wide">
        <div className="section-head section-head--center">
          <Reveal>
            <p className="eyebrow">Pruébalo</p>
          </Reveal>
          <RevealLines id="dash-title" className="h2" lines={["Un panel para todos", "tus clientes"]} />
          <Reveal as="p" className="lead" delay={150}>
            Esta es una vista previa interactiva con datos de ejemplo. Cambia de cliente, filtra los insights y
            pausa o activa a tus competidores.
          </Reveal>
        </div>

        <div className="dash__wrap" ref={frameRef}>
          <div className="dash__hint" aria-hidden="true">
            <span className="hand">elige un cliente</span>
            <HandArrow variant="down" className="dash__hint-arrow" />
          </div>

          <div className="ad">
            <div className="ad__chrome" aria-hidden="true">
              <span className="ad__dots">
                <i />
                <i />
                <i />
              </span>
              <span className="ad__url">{APP_HOST}</span>
            </div>

            <div className="ad__shell">
              {/* Rail: always dark, icon-only */}
              <aside className="ad__rail" aria-label="Navegación de la app (vista previa)">
                <img className="ad__logo" src="/logo/logo-collapsed.png" alt="Bandito" width={48} height={18} />
                <hr className="ad__rule" />
                <ul className="ad__nav">
                  {NAV.map((n, i) => (
                    <li
                      key={n.label}
                      className={["ad__navitem", i === 0 ? "is-active" : ""].join(" ")}
                      data-tip={n.label}
                      title={n.label}
                    >
                      <RailGlyph name={n.icon} />
                      <span className="sr-only">{n.label}</span>
                    </li>
                  ))}
                </ul>

                <div className="ad__switch">
                  <button
                    ref={triggerRef}
                    type="button"
                    className="ad__trigger"
                    aria-haspopup="listbox"
                    aria-expanded={menuOpen}
                    aria-label={`Cambiar de cliente. Cliente actual: ${c.name}`}
                    title={c.name}
                    onClick={() => setMenuOpen((o) => !o)}
                  >
                    {c.name.charAt(0)}
                  </button>
                  {menuOpen && (
                    <>
                      <button type="button" className="ad__scrim" aria-label="Cerrar selector de clientes" tabIndex={-1} onClick={() => setMenuOpen(false)} />
                      <div className="ad__menu" role="listbox" aria-label="Clientes" ref={menuRef}>
                        {clients.map((x) => (
                          <button
                            key={x.id}
                            type="button"
                            role="option"
                            aria-selected={x.id === cid}
                            className="ad__option"
                            onClick={() => pick(x.id)}
                          >
                            <span className="ad__optname">{x.name}</span>
                            {x.id === cid && <LuCheck size={14} aria-hidden="true" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="ad__foot">
                  <div className="ad__navitem" data-tip="Ajustes" title="Ajustes">
                    <LuSettings size={18} aria-hidden="true" />
                    <span className="sr-only">Ajustes</span>
                  </div>
                </div>
              </aside>

              <div className="ad__content">
                <header className="ad__header">
                  <div className="ad__who">
                    <span className="ad__kicker">Cliente</span>
                    <select className="ad__select" aria-label="Cliente" value={cid} onChange={(e) => setCid(e.target.value)}>
                      {clients.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ad__hright">
                    <span className="ad__sync">
                      <i className={["ad__dot", STATUS_COLOR[c.status]].join(" ")} aria-hidden="true" />
                      <strong>{c.status}</strong>
                      <span>· hoy {c.sync}</span>
                    </span>
                    <span className="ad__bell" aria-hidden="true">
                      <LuBell size={16} />
                      <i />
                    </span>
                  </div>
                </header>

                <div className="ad__main" tabIndex={0} role="region" aria-label={`Panel de ${c.name} (desplazable)`}>
                  <div className="ad__page" key={c.id}>
                    {/* Page header */}
                    <div className="ad__pagehead">
                      <div className="ad__pt">
                        <Avatar name={c.name} size={56} />
                        <div className="ad__ptxt">
                          <p className="ad__k">Plan Agencia · {clients.length}/6 clientes</p>
                          <h3 className="ad__h1">{c.name}</h3>
                          <p className="ad__ctx">
                            {c.handle} · {c.segment}
                          </p>
                        </div>
                      </div>
                      <div className="ad__segmented" role="group" aria-label="Ventana de análisis">
                        <span className="ad__segtab is-active" aria-current="true">
                          30 días
                        </span>
                      </div>
                    </div>
                    <hr className="ad__hr" />

                    {c.flags.length > 0 && (
                      <p className="ad__flag">
                        <LuInfo size={13} aria-hidden="true" /> {c.flags[0]}
                      </p>
                    )}

                    {/* KPI cards */}
                    <div className="ad__kpis">
                      <section className="ad__card ad__kpi" aria-label="Seguidores">
                        <div className="ad__khead">
                          <span className="ad__ico">
                            <LuTrendingUp size={16} aria-hidden="true" />
                          </span>
                          <p className="ad__label">Seguidores</p>
                        </div>
                        <p className="ad__qual">Crecimiento en 30 días</p>
                        <Sparkline seed={c.id + c.handle} growth={me.growth} />
                        <div className="ad__kfoot">
                          <p className="ad__value">{me.followers}</p>
                          <p className={["ad__delta", me.growth.startsWith("−") ? "is-down" : "is-up"].join(" ")}>{me.growth}</p>
                        </div>
                      </section>

                      <section className="ad__card ad__kpi" aria-label="Interacción mediana">
                        <div className="ad__khead">
                          <span className="ad__ico">
                            <LuChartColumn size={16} aria-hidden="true" />
                          </span>
                          <p className="ad__label">Interacción</p>
                        </div>
                        <p className="ad__qual">Mediana por publicación</p>
                        <div className="ad__bars" aria-hidden="true">
                          {[
                            ["Tú", me.engagement],
                            ...competitors.slice(0, 2).map((a) => [a.handle.replace("@", ""), a.engagement]),
                          ].map(([n, v], i) => (
                            <div key={n} className="ad__barrow">
                              <span>{n}</span>
                              <div>
                                <i className={i === 0 ? "is-you" : ""} style={{ width: `${Math.min(100, (num(v) / 6) * 100)}%` }} />
                              </div>
                              <span>{v}</span>
                            </div>
                          ))}
                        </div>
                        <div className="ad__kfoot">
                          <p className="ad__value">{me.engagement}</p>
                          <p className="ad__tech">muestra {me.sample} pub.</p>
                        </div>
                      </section>

                      <section className="ad__card ad__kpi" aria-label="Frecuencia de publicación">
                        <div className="ad__khead">
                          <span className="ad__ico">
                            <LuClock size={16} aria-hidden="true" />
                          </span>
                          <p className="ad__label">Frecuencia</p>
                        </div>
                        <p className="ad__qual">Publicaciones por día</p>
                        <div className="ad__week" aria-hidden="true">
                          {c.weekly.map((n, i) => (
                            <span key={i} className={i === c.bestDay ? "is-best" : ""} style={{ height: `${Math.round((n / maxWeek) * 100)}%` }} />
                          ))}
                        </div>
                        <div className="ad__days" aria-hidden="true">
                          {WEEKDAYS.map((d) => (
                            <span key={d}>{d}</span>
                          ))}
                        </div>
                        <div className="ad__kfoot">
                          <p className="ad__value">
                            {me.cadence}
                            <small> / sem</small>
                          </p>
                        </div>
                      </section>

                      <section className="ad__card ad__kpi ad__kpi--accent" aria-label="Mejor momento para publicar">
                        <div className="ad__khead">
                          <span className="ad__ico ad__ico--accent">
                            <LuClock size={16} aria-hidden="true" />
                          </span>
                          <p className="ad__label">Mejor momento</p>
                        </div>
                        <p className="ad__qual">Según tu interacción</p>
                        <div className="ad__kfoot ad__kfoot--split">
                          <div>
                            <p className="ad__qual ad__qual--s">Mejor día</p>
                            <p className="ad__value ad__value--m">{bestDay}</p>
                          </div>
                          <div>
                            <p className="ad__qual ad__qual--s">Mejor hora</p>
                            <p className="ad__value ad__value--m">{bestHours?.replace(" y ", "–")}</p>
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Lado a lado */}
                    <section className="ad__card ad__panel" aria-labelledby="ad-cmp">
                      <div className="ad__phead">
                        <h4 id="ad-cmp" className="ad__h2">
                          Lado a lado
                        </h4>
                        <p className="ad__tech">
                          Ventana de 30 días · {activeCount} de {competitors.length} competidores activos
                        </p>
                      </div>
                      <div className="ad__scroll">
                        <table className="ad__table">
                          <thead>
                            <tr>
                              <th scope="col">
                                <span className="sr-only">Métrica</span>
                              </th>
                              {cols.map((a) => (
                                <th scope="col" key={a.handle} className={a.you ? "is-you" : ""}>
                                  <span className="ad__acc">
                                    <Avatar name={a.handle} size={22} />
                                    <span className="ad__accname">{a.handle}</span>
                                  </span>
                                  {a.you ? <em>Tú</em> : a.sample < 10 ? <small>muestra pequeña</small> : null}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((r) => (
                              <tr key={r.label}>
                                <th scope="row">
                                  {r.label}
                                  <small>{r.hint}</small>
                                </th>
                                {cols.map((a) => {
                                  const rank = rankOf(cols, a, r.get);
                                  return (
                                    <td key={a.handle}>
                                      <div className={["ad__cell", a.you ? "is-you" : ""].join(" ")}>
                                        <span className="ad__cv">{r.cell(a)}</span>
                                        {r.dots ? (
                                          <span className="ad__pips" aria-hidden="true">
                                            {Array.from({ length: 7 }, (_, i) => (
                                              <i key={i} className={i < Math.min(7, num(a.cadence)) ? "on" : ""} />
                                            ))}
                                          </span>
                                        ) : r.label === "Seguidores" ? (
                                          <span className={["ad__cd", a.growth.startsWith("−") ? "is-down" : "is-up"].join(" ")}>{a.growth}</span>
                                        ) : null}
                                        <span className="ad__rank">
                                          {rank === 1 ? "👑" : "•"} {rank}.º de {cols.length}
                                        </span>
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* Insights */}
                    <section className="ad__insights" aria-labelledby="ad-ins">
                      <div className="ad__phead">
                        <div>
                          <p className="ad__k">Insights</p>
                          <h4 id="ad-ins" className="ad__h2">
                            Lo que dicen los datos
                          </h4>
                        </div>
                        <div className="ad__segmented" role="group" aria-label="Tipo de insight">
                          {TABS.map((t) => (
                            <button
                              key={t}
                              type="button"
                              className={["ad__segtab", tab === t ? "is-active" : ""].join(" ")}
                              aria-pressed={tab === t}
                              onClick={() => setTab(t)}
                            >
                              {t}
                              <span className="ad__count">{count(t)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="ad__tiles" aria-live="polite">
                        {shown.map((ins, i) => {
                          const Icon = GROUP_ICON[ins.group];
                          const e = ins.evidence;
                          return (
                            <article key={ins.text} className="ad__tile" style={{ ["--k" as string]: i }}>
                              <div className="ad__tk">
                                <span>
                                  <Icon size={12} aria-hidden="true" /> {ins.group}
                                </span>
                                <strong>{e.window}</strong>
                              </div>
                              <h5 className="ad__tt">{ins.text}</h5>
                              <p className="ad__td">
                                {e.metric}: {e.value}
                              </p>
                              <div className="ad__tf">
                                <span className="ad__acct">{e.account}</span>
                                <span>
                                  muestra {e.sample} · cobertura {e.coverage}
                                </span>
                              </div>
                            </article>
                          );
                        })}
                        {shown.length === 0 && (
                          <p className="ad__empty">
                            {visible.length === 0
                              ? "Activa al menos un competidor para ver observaciones."
                              : "No hay observaciones en esta categoría."}
                          </p>
                        )}
                      </div>
                      <p className="ad__tech ad__note">Observaciones deterministas · sin puntajes ni recomendaciones</p>
                    </section>

                    {/* Competitors */}
                    <section className="ad__card ad__panel" aria-labelledby="ad-comp">
                      <div className="ad__phead">
                        <h4 id="ad-comp" className="ad__h2">
                          Competidores
                        </h4>
                        <p className="ad__tech">
                          {activeCount} de {competitors.length} activos · sincronización diaria
                        </p>
                      </div>
                      <ul className="ad__comps">
                        {competitors.map((a) => {
                          const on = isOn(a.handle);
                          return (
                            <li key={a.handle}>
                              <button
                                type="button"
                                role="checkbox"
                                aria-checked={on}
                                className={["ad__comp", on ? "is-on" : ""].join(" ")}
                                onClick={() => setWatch((w) => ({ ...w, [key(a.handle)]: !on }))}
                              >
                                <Avatar name={a.handle} size={32} />
                                <span className="ad__cname">
                                  <strong>{a.handle}</strong>
                                  <small>{a.sample} pub. en la muestra</small>
                                </span>
                                <span className={["ad__pill", on ? "is-on" : ""].join(" ")}>{on ? "Sync diaria" : "En pausa"}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
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
