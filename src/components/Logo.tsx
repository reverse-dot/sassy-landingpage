type Props = { className?: string; mono?: boolean; showWord?: boolean };

/**
 * Mendleaf mark: a leaf formed from two opposing arcs, with its vein drawn
 * as a row of stitches — the "mend" in the name.
 */
export function Logo({ className, mono = false, showWord = true }: Props) {
  const tile = mono ? "currentColor" : "var(--ink)";
  const leaf = mono ? "var(--white)" : "#bfe0fb";
  return (
    <span className={["logo", className].filter(Boolean).join(" ")}>
      <svg
        className="logo__mark"
        viewBox="0 0 32 32"
        width="30"
        height="30"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="32" height="32" rx="9" fill={tile} />
        <path d="M8 24C8 14.6 14.6 8 24 8c0 9.4-6.6 16-16 16Z" fill={leaf} />
        <path
          d="M9.5 22.5 20 12"
          stroke={tile}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="2.4 2.2"
        />
      </svg>
      {showWord && <span className="logo__word">Mendleaf</span>}
    </span>
  );
}
