import { LuArrowRight, LuPlay } from "react-icons/lu";
import { MagneticButton } from "./MagneticButton";
import { RevealLines } from "./ScrollReveal";
import { HandCircle } from "./HandMarks";
import { HeroVisual } from "./HeroVisual";

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
          <a href="#features" className="announce hero__in" style={{ ["--d" as string]: "0ms" }}>
            <span className="announce__tag">New</span>
            <span className="announce__txt">Referral letters, drafted straight from your plan</span>
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
              <>Scribble freely.</>,
              <>
                Chart{" "}
                <span className="hero__circled">
                  clearly.
                  <HandCircle className="hero__ring" color="var(--sky-500)" width={2.6} delay={1100} />
                </span>
              </>,
            ]}
          />

          <p className="lead hero__lead hero__in" style={{ ["--d" as string]: "380ms" }}>
            Mendleaf reads the notes you already write — by hand or out loud — and turns them into a clean,
            structured record with every follow-up pulled out and ready to go.
          </p>

          <div className="hero__ctas hero__in" style={{ ["--d" as string]: "500ms" }}>
            <MagneticButton href="#start" size="lg">
              Start your free trial
              <LuArrowRight className="arrow" size={17} aria-hidden="true" />
            </MagneticButton>
            <MagneticButton href="#product" size="lg" variant="secondary" strength={0.22}>
              <span className="play-dot" aria-hidden="true">
                <LuPlay size={11} />
              </span>
              See it in 90 seconds
            </MagneticButton>
          </div>

          <ul className="hero__meta hero__in" style={{ ["--d" as string]: "620ms" }}>
            <li>14 days free</li>
            <li>No card needed</li>
            <li>Set up in an afternoon</li>
          </ul>
        </div>

        <div className="hero__visual">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
