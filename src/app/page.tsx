import Hero from "@/components/hero/Hero";
import Reveal from "@/components/motion/Reveal";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function Home() {
  return (
    <main>
      <Hero />

      <section id="work" className="section">
        <div className="section-inner">
          <Reveal>
            <header className="section-head">
              <p className="eyebrow">Selected work / 2024—2026</p>
              <h2 className="section-title">Things built with care.</h2>
            </header>
          </Reveal>

          <div className="project-list">
            {projects.map((project) => (
              <Reveal key={project.slug}>
                <article className="project-row">
                  <span className="project-index" aria-hidden="true">
                    {project.index}
                  </span>
                  <div className="project-main">
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                  </div>
                  <div className="project-meta">
                    <span>{project.category}</span>
                    <span>{project.year}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="section-inner about-grid">
          <Reveal>
            <div>
              <p className="eyebrow">About</p>
              <p className="about-lede">{site.intro}</p>
              <p className="about-body">{site.nepalLine}</p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <p className="eyebrow">{site.availability}</p>
              <ul className="social-list">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="grow"
                    >
                      <span>{social.label}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${site.email}`} data-cursor="grow">
                    <span>Email</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="site-footer">
        <span>© {site.name}</span>
        <span>
          {site.location} · {site.timezone}
        </span>
      </footer>
    </main>
  );
}
