import { footerCols } from "../data/content";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="foot" aria-labelledby="foot-title">
      <h2 id="foot-title" className="sr-only">
        Site footer
      </h2>
      <div className="container container--wide">
        <div className="foot__top">
          <div className="foot__brand">
            <Logo />
            <p>Clinical notes, clearly kept. Made for the people who write them.</p>
            <form className="foot__form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="foot-email" className="foot__form-l">
                Product notes, once a month
              </label>
              <div className="foot__form-row">
                <input id="foot-email" type="email" placeholder="you@clinic.org" autoComplete="email" />
                <button type="submit" className="btn btn--primary btn--md">
                  <span className="btn__label">Subscribe</span>
                </button>
              </div>
            </form>
          </div>
          <nav className="foot__cols" aria-label="Footer">
            {footerCols.map((c) => (
              <div key={c.title}>
                <h3>{c.title}</h3>
                <ul>
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#top">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="foot__bottom">
          <p>© 2026 Mendleaf. A fictional product created for a design concept.</p>
          <ul>
            <li>
              <a href="#top">Terms</a>
            </li>
            <li>
              <a href="#top">Privacy</a>
            </li>
            <li>
              <a href="#top">Accessibility</a>
            </li>
          </ul>
        </div>
        <p className="foot__word" aria-hidden="true">
          Mendleaf
        </p>
      </div>
    </footer>
  );
}
