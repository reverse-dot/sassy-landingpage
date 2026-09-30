import { testimonials } from "../data/content";
import { Reveal } from "./ScrollReveal";
import { TiltCard } from "./TiltCard";

const initials = (n: string) =>
  n
    .replace(/\.$/, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section className="quotes section" aria-labelledby="quotes-title">
      <div className="container">
        <div className="quotes__grid">
          <Reveal as="figure" className="quotes__featured" variant="up">
            <p className="eyebrow" id="quotes-title">
              Creadores, empresas y agencias
            </p>
            <span className="quotes__mark hand" aria-hidden="true">
              “
            </span>
            <blockquote>
              <p>{featured.quote}</p>
            </blockquote>
            <figcaption className="quotes__who">
              <span className={`avatar avatar--lg tone-bg-${featured.tone}`} aria-hidden="true">
                {initials(featured.name)}
              </span>
              <span>
                <strong>{featured.name}</strong>
                <span>
                  {featured.role}, {featured.org}
                </span>
              </span>
            </figcaption>
          </Reveal>

          <Reveal as="ul" className="quotes__cards" stagger={110} variant="up">
            {rest.map((t, i) => (
              <li key={t.name} className={`quotes__col quotes__col--${i % 2}`}>
                <TiltCard as="figure" className={`qcard qcard--${t.tone}`} max={2.5}>
                  <blockquote>
                    <p>“{t.quote}”</p>
                  </blockquote>
                  <figcaption className="qcard__who">
                    <span className={`avatar tone-bg-${t.tone}`} aria-hidden="true">
                      {initials(t.name)}
                    </span>
                    <span>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </span>
                  </figcaption>
                </TiltCard>
              </li>
            ))}
          </Reveal>
        </div>
        <p className="quotes__note">Los testimonios, nombres y roles son ficticios, solo con fines ilustrativos.</p>
      </div>
    </section>
  );
}
