import Reveal from "@/components/motion/Reveal";
import { site } from "@/data/site";

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="section-inner">
        <Reveal>
          <header className="section-head">
            <p className="eyebrow">About / परिचय</p>
            <h2 className="section-title">
              A designer who codes. A developer who draws.
            </h2>
          </header>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-copy">
            <p className="about-lede">{site.intro}</p>
            <p className="about-body">{site.nepalLine}</p>
            <p className="about-nepal" lang="ne">
              {site.nepalLineNe}
            </p>
          </Reveal>

          <Reveal className="about-side">
            <div>
              <p className="eyebrow">Toolkit</p>
              <ul className="skill-list" aria-label="Skills and tools">
                {site.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>

            <p className="about-availability">{site.availability}</p>

            <div className="about-coordinates">
              <span>{site.location}</span>
              <span>{site.coordinates}</span>
              <span>{site.timezone}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
