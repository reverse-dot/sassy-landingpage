import { footerCols, PRIVACY_URL, TERMS_URL } from "../data/content";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="foot" aria-labelledby="foot-title">
      <h2 id="foot-title" className="sr-only">
        Pie de página
      </h2>
      <div className="container container--wide">
        <div className="foot__top">
          <div className="foot__brand">
            <Logo />
            <p>Analítica de Instagram para agencias, creadores y marcas.</p>
          </div>
          <nav className="foot__cols" aria-label="Pie de página">
            {footerCols.map((c) => (
              <div key={c.title}>
                <h3>{c.title}</h3>
                <ul>
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="foot__bottom">
          <p>© 2026 Sassy. Los datos de ejemplo de esta página son ficticios.</p>
          <ul>
            <li>
              <a href={TERMS_URL}>Términos</a>
            </li>
            <li>
              <a href={PRIVACY_URL}>Privacidad</a>
            </li>
          </ul>
        </div>
        <p className="foot__word" aria-hidden="true">
          Sassy
        </p>
      </div>
    </footer>
  );
}
