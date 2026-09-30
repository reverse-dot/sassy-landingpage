import { useState } from "react";
import { LuCheck, LuArrowRight } from "react-icons/lu";
import { plans } from "../data/content";
import { Reveal, RevealLines } from "./ScrollReveal";
import { TiltCard } from "./TiltCard";
import { MagneticButton } from "./MagneticButton";

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="price section" id="pricing" aria-labelledby="price-title">
      <div className="container">
        <div className="section-head section-head--center">
          <Reveal>
            <p className="eyebrow">Pricing</p>
          </Reveal>
          <RevealLines id="price-title" className="h2" lines={["Simple plans,", "priced per clinician"]} />
          <Reveal delay={150}>
            <div className="toggle" role="radiogroup" aria-label="Billing period">
              <button
                role="radio"
                aria-checked={!annual}
                className={!annual ? "is-on" : ""}
                onClick={() => setAnnual(false)}
              >
                Monthly
              </button>
              <button
                role="radio"
                aria-checked={annual}
                className={annual ? "is-on" : ""}
                onClick={() => setAnnual(true)}
              >
                Yearly <span className="toggle__save">save ~20%</span>
              </button>
              <span className="toggle__pill" data-pos={annual ? "1" : "0"} aria-hidden="true" />
            </div>
          </Reveal>
        </div>

        <Reveal as="ul" className="price__grid" stagger={120} variant="up">
          {plans.map((p) => {
            const amount = annual ? p.annual : p.monthly;
            return (
              <li key={p.name} className={["price__item", p.featured ? "is-featured" : ""].join(" ")}>
                <TiltCard className="plan" max={2}>
                  {p.featured && <span className="plan__ribbon hand">{p.note}</span>}
                  <h3 className="plan__name">{p.name}</h3>
                  <p className="plan__blurb">{p.blurb}</p>

                  <div className="plan__price" aria-live="polite">
                    {amount != null ? (
                      <>
                        <span className="plan__cur">$</span>
                        <span className="plan__amt" key={amount}>
                          {amount}
                        </span>
                        <span className="plan__unit">
                          {p.unit}
                          <br />
                          {annual ? "billed yearly" : "billed monthly"}
                        </span>
                      </>
                    ) : (
                      <span className="plan__custom">Custom</span>
                    )}
                  </div>

                  <MagneticButton
                    href="#start"
                    variant={p.featured ? "light" : "primary"}
                    size="lg"
                    strength={0.18}
                    className="plan__cta"
                  >
                    {p.cta}
                    <LuArrowRight className="arrow" size={16} aria-hidden="true" />
                  </MagneticButton>

                  <ul className="plan__features">
                    {p.features.map((f) => (
                      <li key={f}>
                        <span className="plan__tick" aria-hidden="true">
                          <LuCheck size={12} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </li>
            );
          })}
        </Reveal>
        <p className="price__fine">Prices in USD, excluding tax. Every plan starts with 14 days free.</p>
      </div>
    </section>
  );
}
