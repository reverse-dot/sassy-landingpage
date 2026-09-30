import { LuArrowRight, LuCheck } from "react-icons/lu";
import { MagneticButton } from "./MagneticButton";
import { PointerParallax, Layer } from "./PointerParallax";
import { RevealLines, Reveal } from "./ScrollReveal";
import { HandArrow, HandUnderline, Paper } from "./HandMarks";

export function FinalCTA() {
  return (
    <section className="cta section" id="start" aria-labelledby="cta-title">
      <div className="container container--wide">
        <Reveal variant="clip">
          <PointerParallax className="cta__panel" range={16} rotate={2}>
            <div className="cta__bg" aria-hidden="true" />

            <Layer depth={-0.8} className="cta__float cta__float--1" aria-hidden>
              <Paper className="cta__scrap float-a">
                <span className="hand">r/v 2/52 → text pt</span>
              </Paper>
            </Layer>
            <Layer depth={1.1} className="cta__float cta__float--2" aria-hidden>
              <div className="cta__tile float-b">
                <span className="badge badge--mint">
                  <LuCheck size={11} /> Signed
                </span>
                <span className="cta__tile-l" />
                <span className="cta__tile-l cta__tile-l--s" />
              </div>
            </Layer>
            <Layer depth={0.6} className="cta__float cta__float--3" aria-hidden>
              <div className="cta__tile cta__tile--sm float-a">
                <span className="badge badge--sky">Referral sent</span>
              </div>
            </Layer>

            <div className="cta__content">
              <RevealLines
                id="cta-title"
                className="display cta__title"
                lines={["Give your notes", "a better ending."]}
              />
              <Reveal as="p" className="lead cta__lead" delay={200}>
                Bring tomorrow's clinic list. We'll set up your templates with you and you'll sign your first
                structured note before lunch.
              </Reveal>
              <Reveal className="cta__actions" delay={300}>
                <MagneticButton href="#start" size="lg">
                  Start your free trial
                  <LuArrowRight className="arrow" size={17} aria-hidden="true" />
                </MagneticButton>
                <MagneticButton href="#demo" size="lg" variant="secondary" strength={0.22}>
                  Book a walkthrough
                </MagneticButton>
              </Reveal>
              <Reveal className="cta__note" delay={600}>
                <HandArrow variant="curve" className="cta__note-arrow" />
                <span className="hand">
                  your evenings, back
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
