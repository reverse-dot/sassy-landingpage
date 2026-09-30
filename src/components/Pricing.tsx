import { LuCheck, LuArrowRight } from "react-icons/lu";
import { plans, APP_URL } from "../data/content";
import { Reveal, RevealLines } from "./ScrollReveal";
import { TiltCard } from "./TiltCard";
import { MagneticButton } from "./MagneticButton";

export function Pricing() {
  return (
    <section className="price section" id="pricing" aria-labelledby="price-title">
      <div className="container">
        <div className="section-head section-head--center">
          <Reveal>
            <p className="eyebrow">Precios</p>
          </Reveal>
          <RevealLines id="price-title" className="h2" lines={["Gratis durante la beta,", "planes claros después"]} />
        </div>

        <Reveal className="price__beta">
          <strong>
            Hoy Bandito es gratis <span className="badge badge--sky">Beta</span>
          </strong>
          <p>
            Todas las cuentas nuevas empiezan en un plan beta gratuito. Los precios de abajo son los que
            aplicarán cuando termine la beta.
          </p>
        </Reveal>

        <Reveal as="ul" className="price__grid" stagger={120} variant="up">
          {plans.map((p) => (
            <li key={p.name} className={["price__item", p.featured ? "is-featured" : ""].join(" ")}>
              <TiltCard className="plan" max={2}>
                {p.featured && <span className="plan__ribbon hand">{p.note}</span>}
                <h3 className="plan__name">{p.name}</h3>
                <p className="plan__blurb">{p.blurb}</p>

                <div className="plan__price">
                  <span className="plan__cur">{p.cur}</span>
                  <span className="plan__amt">{p.price}</span>
                  <span className="plan__unit">{p.unit}</span>
                </div>
                <p className="plan__after">Después de la beta</p>

                <MagneticButton
                  href={APP_URL}
                  variant={p.featured ? "primary" : "secondary"}
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
          ))}
        </Reveal>
        <p className="price__fine">
          Precios posteriores a la beta. Los planes Creador y Empresa se cobran en pesos chilenos (CLP); el plan
          Agencia, en dólares (USD).
        </p>
      </div>
    </section>
  );
}
