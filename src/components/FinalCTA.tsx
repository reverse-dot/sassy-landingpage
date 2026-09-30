import { LuArrowRight, LuCheck } from "react-icons/lu";
import { MagneticButton } from "./MagneticButton";
import { PointerParallax, Layer } from "./PointerParallax";
import { RevealLines, Reveal } from "./ScrollReveal";
import { HandArrow, HandUnderline, Paper } from "./HandMarks";
import { APP_URL, LOGIN_URL, CTA_LABEL } from "../data/content";

export function FinalCTA() {
  return (
    <section className="cta section" id="start" aria-labelledby="cta-title">
      <div className="container container--wide">
        <Reveal variant="clip">
          <PointerParallax className="cta__panel" range={16} rotate={2}>
            <div className="cta__bg" aria-hidden="true" />

            <Layer depth={-0.8} className="cta__float cta__float--1" aria-hidden>
              <Paper className="cta__scrap float-a">
                <span className="intro__k">Interacción</span>
                <span className="intro__v">3,4%</span>
              </Paper>
            </Layer>
            <Layer depth={1.1} className="cta__float cta__float--2" aria-hidden>
              <div className="cta__tile float-b">
                <span className="badge badge--mint">
                  <LuCheck size={11} /> Sincronizado
                </span>
                <span className="cta__tile-l" />
                <span className="cta__tile-l cta__tile-l--s" />
              </div>
            </Layer>
            <Layer depth={0.6} className="cta__float cta__float--3" aria-hidden>
              <div className="cta__tile cta__tile--sm float-a">
                <span className="badge badge--sky">3 insights</span>
              </div>
            </Layer>

            <div className="cta__content">
              <RevealLines
                id="cta-title"
                className="display cta__title"
                lines={["Empieza a comparar", "con evidencia."]}
              />
              <Reveal as="p" className="lead cta__lead" delay={200}>
                Conecta tu Instagram, agrega a tus primeros competidores y mira tu primer lado a lado. Mientras
                dure la beta, todo es gratis.
              </Reveal>
              <Reveal className="cta__actions" delay={300}>
                <MagneticButton href={APP_URL} size="lg">
                  {CTA_LABEL}
                  <LuArrowRight className="arrow" size={17} aria-hidden="true" />
                </MagneticButton>
                <MagneticButton href={LOGIN_URL} size="lg" variant="secondary" strength={0.22}>
                  Iniciar sesión
                </MagneticButton>
              </Reveal>
              <Reveal className="cta__note" delay={600}>
                <HandArrow variant="curve" className="cta__note-arrow" />
                <span className="hand">
                  gratis durante la beta
                  <HandUnderline className="cta__note-line" delay={900} />
                </span>
              </Reveal>
            </div>
          </PointerParallax>
        </Reveal>
      </div>
    </section>
  );
}
