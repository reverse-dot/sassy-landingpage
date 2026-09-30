import { useEffect, useRef, useState } from "react";
import { LuArrowRight, LuMenu, LuX } from "react-icons/lu";
import { Logo } from "./Logo";
import { MagneticButton } from "./MagneticButton";
import { navLinks } from "../data/content";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Mobile menu: lock scroll, close on Escape, move focus in and back out.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Hover pill that glides between desktop links.
  const movePill = (el: HTMLElement | null) => {
    const pill = pillRef.current;
    const list = listRef.current;
    if (!pill || !list) return;
    if (!el) {
      pill.style.opacity = "0";
      return;
    }
    const lr = list.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    pill.style.opacity = "1";
    pill.style.width = `${r.width}px`;
    pill.style.transform = `translate3d(${r.left - lr.left}px, 0, 0)`;
  };

  return (
    <header className={["nav", scrolled ? "is-scrolled" : "", open ? "is-open" : ""].join(" ")}>
      <div className="nav__bar container container--wide">
        <a href="#top" className="nav__logo" aria-label="Mendleaf home">
          <Logo />
        </a>

        <nav className="nav__desktop" aria-label="Primary">
          <ul ref={listRef} className="nav__list" onPointerLeave={() => movePill(null)}>
            <span ref={pillRef} className="nav__pill" aria-hidden="true" />
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="nav__link"
                  onPointerEnter={(e) => movePill(e.currentTarget)}
                  onFocus={(e) => movePill(e.currentTarget)}
                  onBlur={() => movePill(null)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__actions">
          <a href="#login" className="nav__login">
            Log in
          </a>
          <MagneticButton href="#start" size="md" strength={0.25} className="nav__cta">
            Start free
            <LuArrowRight className="arrow" aria-hidden="true" size={16} />
          </MagneticButton>
          <button
            ref={toggleRef}
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav__toggle-icon" data-state={open ? "open" : "closed"}>
              <LuMenu size={20} aria-hidden="true" className="i-menu" />
              <LuX size={20} aria-hidden="true" className="i-close" />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        className="nav__panel"
        role="dialog"
        aria-modal={open}
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        data-open={open}
      >
        <nav aria-label="Mobile">
          <ul className="nav__mlist">
            {navLinks.map((l, i) => (
              <li key={l.label} style={{ ["--i" as string]: i }}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  <span>{l.label}</span>
                  <LuArrowRight size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav__mactions" style={{ ["--i" as string]: navLinks.length }}>
          <a href="#login" className="btn btn--secondary btn--lg" onClick={() => setOpen(false)}>
            <span className="btn__label">Log in</span>
          </a>
          <a href="#start" className="btn btn--primary btn--lg" onClick={() => setOpen(false)}>
            <span className="btn__label">
              Start free <LuArrowRight size={16} aria-hidden="true" />
            </span>
          </a>
          <p className="hand nav__mnote">no card, no contract ✓</p>
        </div>
      </div>
    </header>
  );
}
