type Props = { className?: string; showWord?: boolean };

/**
 * Sassy mark: the white logo from the app (transparent PNG, made for dark
 * backgrounds) next to the wordmark set in the display face.
 */
export function Logo({ className, showWord = true }: Props) {
  return (
    <span className={["logo", className].filter(Boolean).join(" ")}>
      <img
        className="logo__mark"
        src="/logo/bandito-logo-white.png"
        alt=""
        width={58}
        height={22}
        decoding="async"
        aria-hidden="true"
      />
      {showWord && <span className="logo__word">Sassy</span>}
    </span>
  );
}
