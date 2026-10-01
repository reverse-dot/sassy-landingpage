import { useEffect, useId, useRef, useState } from "react";
import type { PreviewSeries } from "../data/content";

/* Line chart of the dashboard preview. Mirrors the app's MetricLineChart:
   hero summary, 2.5px lines (dashed for competitors), gradient area under
   the client's own line, end-point dots, crosshair tooltip and a legend. */

const HEIGHT = 280;
const MARGIN = { top: 8, right: 8, bottom: 24, left: 56 };
/** The app's categorical series palette, in its fixed order. */
const SERIES_COLORS = ["#3987e5", "#d95926", "#199e70", "#c98500"];
const DASHES = ["", "6 4", "2 4"];
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const group = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const dec = (n: number, d = 1) => n.toFixed(d).replace(".", ",");

export const fmt = {
  count: (n: number) => group(n),
  percent: (n: number) => `${dec(n)}%`,
  signedPercent: (n: number) => `${n >= 0 ? "+" : "−"}${dec(Math.abs(n))}%`,
  signedPp: (n: number) => `${n >= 0 ? "+" : "−"}${dec(Math.abs(n))} pp`,
  signedCount: (n: number) => `${n >= 0 ? "+" : "−"}${group(Math.abs(n))}`,
};

function formatDate(ms: number) {
  const d = new Date(ms);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** 4 "nice" tick values covering [lo, hi]. */
function niceTicks(lo: number, hi: number, count = 4) {
  const span = hi - lo || 1;
  const raw = span / (count - 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const start = Math.floor(lo / step) * step;
  const ticks: number[] = [];
  for (let v = start; v < hi + step; v += step) ticks.push(Number(v.toFixed(6)));
  return ticks;
}

/** Monotone cubic interpolation (the app's chart default curve), as an SVG path. */
function monotonePath(pts: [number, number][]) {
  const n = pts.length;
  if (n < 2) return "";
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0]);
    m.push((pts[i + 1][1] - pts[i][1]) / (dx[i] || 1));
  }
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${pts[i][0] + h},${pts[i][1] + t[i] * h},${pts[i + 1][0] - h},${pts[i + 1][1] - t[i + 1] * h},${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

type Props = {
  x: number[];
  series: PreviewSeries[];
  valueFormatter: (n: number) => string;
  deltaFormatter: (n: number) => string;
  /** Plain difference (pp / count) or %-of-baseline change, decided by the caller. */
  delta: number | null;
  unit?: string;
  ariaLabel: string;
};

export function PreviewLineChart({ x, series, valueFormatter, deltaFormatter, delta, unit, ariaLabel }: Props) {
  const gradId = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const set = () => setWidth(Math.max(240, el.clientWidth));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const all = series.flatMap((s) => s.values);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = (hi - lo || 1) * 0.08;
  const ticks = niceTicks(lo - pad, hi + pad);
  const yLo = ticks[0];
  const yHi = ticks[ticks.length - 1];
  const x0 = x[0];
  const x1 = x[x.length - 1];
  const sx = (v: number) => MARGIN.left + ((v - x0) / (x1 - x0 || 1)) * plotW;
  const sy = (v: number) => MARGIN.top + (1 - (v - yLo) / (yHi - yLo || 1)) * plotH;
  const path = (s: PreviewSeries) => monotonePath(s.values.map((v, i) => [sx(x[i]), sy(v)]));
  const xTicks = [0, 1, 2, 3, 4].map((i) => x0 + ((x1 - x0) * i) / 4);

  const latest = series[0].values[series[0].values.length - 1];
  const baseY = MARGIN.top + plotH;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let best = 0;
    for (let i = 1; i < x.length; i++) if (Math.abs(sx(x[i]) - px) < Math.abs(sx(x[best]) - px)) best = i;
    setHover(best);
  };

  return (
    <>
      <div className="dp-hero">
        <span className="dp-hero__value">{valueFormatter(latest)}</span>
        {unit && <span className="dp-hero__unit">{unit}</span>}
        {delta !== null && (
          <span className={["dp-hero__delta", delta < 0 ? "is-down" : ""].join(" ")}>
            {delta >= 0 ? "▲" : "▼"} {deltaFormatter(delta)}
          </span>
        )}
      </div>

      <div className="dp-chart" ref={wrapRef} role="img" aria-label={ariaLabel}>
        <svg width={width} height={HEIGHT} onPointerMove={onMove} onPointerLeave={() => setHover(null)} aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES_COLORS[0]} stopOpacity="0.2" />
              <stop offset="100%" stopColor={SERIES_COLORS[0]} stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line className="dp-chart__grid" x1={MARGIN.left} x2={width - MARGIN.right} y1={sy(t)} y2={sy(t)} />
              <text className="dp-chart__tick" x={MARGIN.left - 10} y={sy(t)} textAnchor="end" dominantBaseline="middle">
                {valueFormatter(t)}
              </text>
            </g>
          ))}
          <line className="dp-chart__domain" x1={MARGIN.left} x2={width - MARGIN.right} y1={baseY} y2={baseY} />
          {xTicks.map((t, i) => (
            <text
              key={i}
              className="dp-chart__tick"
              x={sx(t)}
              y={HEIGHT - 6}
              textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}
            >
              {formatDate(t)}
            </text>
          ))}
          <path d={`${path(series[0])}L${sx(x1)},${baseY}L${sx(x0)},${baseY}Z`} fill={`url(#${gradId})`} />
          {series.map((s, i) => (
            <path
              key={s.id}
              d={path(s)}
              fill="none"
              stroke={SERIES_COLORS[i]}
              strokeWidth="2.5"
              strokeDasharray={DASHES[i] || undefined}
            />
          ))}
          {series.map((s, i) => (
            <circle key={s.id} cx={sx(x1)} cy={sy(s.values[s.values.length - 1])} r="2.5" fill={SERIES_COLORS[i]} />
          ))}
          {hover !== null && (
            <>
              <line className="dp-chart__cross" x1={sx(x[hover])} x2={sx(x[hover])} y1={MARGIN.top} y2={baseY} />
              {series.map((s, i) => (
                <circle key={s.id} cx={sx(x[hover])} cy={sy(s.values[hover])} r="3.5" fill={SERIES_COLORS[i]} />
              ))}
            </>
          )}
        </svg>
        {hover !== null && (
          <div
            className="dp-chart__tip"
            style={{
              left: Math.min(sx(x[hover]) + 14, width - 190),
              top: MARGIN.top + 6,
            }}
          >
            <strong>{formatDate(x[hover])}</strong>
            {series.map((s) => (
              <div key={s.id}>
                {s.label}: <strong>{valueFormatter(s.values[hover])}</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <ul className="dp-legend" aria-label={ariaLabel}>
        {series.map((s, i) => (
          <li key={s.id}>
            <span
              aria-hidden="true"
              style={{
                borderTopWidth: i === 0 ? 2.5 : 2,
                borderTopStyle: i === 0 ? "solid" : i % 2 === 0 ? "dotted" : "dashed",
                borderTopColor: SERIES_COLORS[i],
              }}
            />
            {s.label}
          </li>
        ))}
      </ul>
    </>
  );
}
