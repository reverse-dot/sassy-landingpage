import { LuArrowRight, LuArrowDown } from "react-icons/lu";
import { MagneticButton } from "./MagneticButton";
import { RevealLines } from "./ScrollReveal";
import { HandCircle } from "./HandMarks";
import { HeroVisual } from "./HeroVisual";
import { APP_URL, CTA_LABEL } from "../data/content";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__blob hero__blob--a" />
        <div className="hero__blob hero__blob--b" />
      </div>

      <div className="hero__inner container container--wide">
        <div className="hero__copy">
          <a href="#pricing" className="announce hero__in" style={{ ["--d" as string]: "0ms" }}>
            <span className="announce__tag">Beta</span>
            <span className="announce__txt">Gratis mientras dure la beta</span>
            <LuArrowRight size={14} aria-hidden="true" className="announce__arrow" />
          </a>

          <RevealLines
            as="h1"
            id="hero-title"
            immediate
            delay={120}
            stagger={110}
            className="display hero__title"
            lines={[
              <>Tu Instagram,</>,
              <>frente a la</>,
              <>
                <span className="hero__circled">
                  competencia.
                  <HandCircle className="hero__ring" color="var(--accent)" width={2.6} delay={1100} />
                </span>
              </>,
            ]}
          />

          <p className="lead hero__lead hero__in" style={{ ["--d" as string]: "380ms" }}>
            Analítica de Instagram para agencias. Sigue el crecimiento, la interacción y la competencia de tus
            clientes en un solo panel.
          </p>

          <div className="hero__ctas hero__in" style={{ ["--d" as string]: "500ms" }}>
            <MagneticButton href={APP_URL} size="lg">
              {CTA_LABEL}
              <LuArrowRight className="arrow" size={17} aria-hidden="true" />
            </MagneticButton>
            <MagneticButton href="#how" size="lg" variant="secondary" strength={0.22}>
              <span className="play-dot" aria-hidden="true">
                <LuArrowDown size={12} />
              </span>
              Ver cómo funciona
            </MagneticButton>
          </div>

          <ul className="hero__meta hero__in" style={{ ["--d" as string]: "620ms" }}>
            <li>Beta gratuita</li>
            <li>Conexión oficial con Instagram</li>
            <li>Un espacio por cliente</li>
          </ul>
        </div>

        <div className="hero__visual">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
