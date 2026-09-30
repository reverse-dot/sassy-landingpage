import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  LuLayoutDashboard,
  LuUsers,
  LuFileText,
  LuListChecks,
  LuInbox,
  LuSettings,
  LuSearch,
  LuBell,
  LuCheck,
  LuSparkles,
  LuTriangleAlert,
  LuFlaskConical,
  LuMessageSquare,
  LuPenLine,
} from "react-icons/lu";
import { patients, type Patient } from "../data/content";
import { Reveal, RevealLines } from "./ScrollReveal";
import { HandArrow } from "./HandMarks";
import { Logo } from "./Logo";
import { useScrollVar } from "../motion/hooks";

const TABS = ["Note", "Summary", "Timeline"] as const;
type Tab = (typeof TABS)[number];

const STATUS_TONE: Record<Patient["status"], string> = {
  "Ready to sign": "mint",
  Drafting: "sky",
  Signed: "lilac",
  "Needs review": "peach",
};

const KIND_ICON = { note: LuFileText, lab: LuFlaskConical, msg: LuMessageSquare, task: LuListChecks };

export function InteractiveDashboard() {
  const [pid, setPid] = useState(patients[0].id);
  const [tab, setTab] = useState<Tab>("Note");
  const [done, setDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(patients.flatMap((p) => p.tasks.map((t) => [`${p.id}:${t.id}`, t.done])))
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
      ? patients.filter((p) => (p.name + " " + p.reason).toLowerCase().includes(q))
      : patients;
  }, [query]);

  const p = patients.find((x) => x.id === pid)!;
  const openTasks = p.tasks.filter((t) => !done[`${p.id}:${t.id}`]).length;

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
            <p className="eyebrow">Try it</p>
          </Reveal>
          <RevealLines id="dash-title" className="h2" lines={["A calm place to", "finish the day"]} />
          <Reveal as="p" className="lead" delay={150}>
            This is a working preview with sample patients. Switch between visits, flip through the record and
            tick off a task or two.
          </Reveal>
        </div>

        <div className="dash__wrap" ref={frameRef}>
          <div className="dash__hint" aria-hidden="true">
            <span className="hand">pick a patient</span>
            <HandArrow variant="down" className="dash__hint-arrow" />
          </div>

          <div className="app">
            <div className="app__chrome" aria-hidden="true">
              <span className="app__dots">
                <i />
                <i />
                <i />
              </span>
              <span className="app__url">app.mendleaf.example/today</span>
            </div>

            <div className="app__body">
              {/* Sidebar */}
              <aside className="app__side" aria-label="App navigation (preview)">
                <div className="app__brand">
                  <Logo />
                </div>
                <ul className="app__nav">
                  {[
                    [LuLayoutDashboard, "Today", true],
                    [LuUsers, "Patients", false],
                    [LuFileText, "Notes", false],
                    [LuListChecks, "Tasks", false],
                    [LuInbox, "Inbox", false],
                  ].map(([Icon, label, on]) => {
                    const I = Icon as typeof LuUsers;
                    return (
                      <li key={label as string} className={on ? "is-on" : ""}>
                        <I size={16} aria-hidden="true" />
                        <span>{label as string}</span>
                        {label === "Tasks" && <em className="app__count">7</em>}
                      </li>
                    );
                  })}
                </ul>
                <div className="app__side-foot">
                  <LuSettings size={16} aria-hidden="true" />
                  <span>Settings</span>
                </div>
              </aside>

              {/* Main */}
              <div className="app__main">
                <div className="app__top">
                  <label className="app__search">
                    <LuSearch size={15} aria-hidden="true" />
                    <span className="sr-only">Search today's patients</span>
                    <input
                      type="search"
                      placeholder="Search patients"
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
                      MC
                    </span>
                  </div>
                </div>

                <div className="app__cols">
                  {/* Schedule */}
                  <div className="app__list">
                    <p className="app__list-h">
                      Today <span>Mon 29 Sep</span>
                    </p>
                    <ul>
                      {list.map((x) => (
                        <li key={x.id}>
                          <button
                            className={["pt", x.id === pid ? "is-on" : ""].join(" ")}
                            aria-pressed={x.id === pid}
                            onClick={() => setPid(x.id)}
                          >
                            <span className="pt__time">{x.time}</span>
                            <span className={`avatar tone-bg-${x.tone}`}>{x.initials}</span>
                            <span className="pt__txt">
                              <strong>{x.name}</strong>
                              <span>{x.reason}</span>
                            </span>
                            <span className={`pt__dot tone-dot-${STATUS_TONE[x.status]}`} title={x.status} />
                          </button>
                        </li>
                      ))}
                      {list.length === 0 && <li className="app__empty">No patients match “{query}”.</li>}
                    </ul>
                  </div>

                  {/* Detail */}
                  <div className="app__detail" aria-live="polite">
                    <header className="pd__head" key={p.id}>
                      <span className={`avatar avatar--lg tone-bg-${p.tone}`}>{p.initials}</span>
                      <div className="pd__who">
                        <h3>{p.name}</h3>
                        <p>
                          {p.age} · {p.sex} · {p.mrn}
                        </p>
                      </div>
                      <span className={`badge badge--${STATUS_TONE[p.status]} pd__status`}>{p.status}</span>
                      {p.flags.length > 0 && (
                        <div className="pd__flags">
                          {p.flags.map((f) => (
                            <span key={f} className="badge badge--rose">
                              <LuTriangleAlert size={11} aria-hidden="true" /> {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </header>

                    <div className="pd__tabs" role="tablist" aria-label="Record views">
                      {TABS.map((t, i) => (
                        <button
                          key={t}
                          ref={(el) => {
                            tabRefs.current[i] = el;
                          }}
                          role="tab"
                          id={`tab-${t}`}
                          aria-selected={tab === t}
                          aria-controls={`panel-${t}`}
                          tabIndex={tab === t ? 0 : -1}
                          className={tab === t ? "is-on" : ""}
                          onClick={() => setTab(t)}
                          onKeyDown={(e) => onTabKey(e, i)}
                        >
                          {t}
                        </button>
                      ))}
                      <span
                        className="pd__tab-ind"
                        style={{ ["--ti" as string]: TABS.indexOf(tab) }}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="pd__content">
                      <div
                        className="pd__panel"
                        role="tabpanel"
                        id={`panel-${tab}`}
                        aria-labelledby={`tab-${tab}`}
                        key={p.id + tab}
                      >
                        {tab === "Note" && (
                          <dl className="pd__fields">
                            {p.fields.map((f, i) => (
                              <div key={f.label} style={{ ["--k" as string]: i }}>
                                <dt>{f.label}</dt>
                                <dd>{f.value}</dd>
                              </div>
                            ))}
                            <p className="pd__src">
                              <LuPenLine size={13} aria-hidden="true" /> Structured from handwriting · edited by
                              you
                            </p>
                          </dl>
                        )}
                        {tab === "Summary" && (
                          <div className="pd__summary">
                            <p className="pd__sk">
                              <LuSparkles size={13} aria-hidden="true" /> Generated summary · review before
                              sharing
                            </p>
                            <p>{p.summary}</p>
                          </div>
                        )}
                        {tab === "Timeline" && (
                          <ol className="pd__tl">
                            {p.timeline.map((ev, i) => {
                              const I = KIND_ICON[ev.kind];
                              return (
                                <li key={i} style={{ ["--k" as string]: i }}>
                                  <span className="pd__tl-ico">
                                    <I size={13} aria-hidden="true" />
                                  </span>
                                  <span className="pd__tl-what">{ev.what}</span>
                                  <span className="pd__tl-meta">
                                    {ev.who} · {ev.when}
                                  </span>
                                </li>
                              );
                            })}
                          </ol>
                        )}
                      </div>

                      <div className="pd__tasks">
                        <p className="pd__tasks-h">
                          Follow-ups <span>{openTasks} open</span>
                        </p>
                        <ul>
                          {p.tasks.map((t) => {
                            const key = `${p.id}:${t.id}`;
                            const isDone = !!done[key];
                            return (
                              <li key={key}>
                                <button
                                  className={["tk", isDone ? "is-done" : ""].join(" ")}
                                  role="checkbox"
                                  aria-checked={isDone}
                                  onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}
                                >
                                  <span className="tk__box" aria-hidden="true">
                                    <LuCheck size={11} />
                                  </span>
                                  <span className="tk__label">{t.label}</span>
                                  <span className={`badge badge--${isDone ? "mint" : t.tone}`}>
                                    {isDone ? "Done" : t.due}
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
