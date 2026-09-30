import { useTheme } from "../theme";

type Props = { className?: string; showWord?: boolean };

/**
 * Bandito mark: the app logo (transparent PNG, white on dark and black on
 * light) next to the wordmark set in the display face.
 */
export function Logo({ className, showWord = true }: Props) {
  const { theme } = useTheme();
  return (
    <span className={["logo", className].filter(Boolean).join(" ")}>
      <img
        className="logo__mark"
        src={`${import.meta.env.BASE_URL}logo/bandito-logo-${theme === "light" ? "black" : "white"}.png`}
        alt=""
        width={74}
        height={28}
        decoding="async"
        aria-hidden="true"
      />
      {showWord && <span className="logo__word">Bandito</span>}
    </span>
  );
}
