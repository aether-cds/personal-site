"use client";

import { useState } from "react";
import Reveal from "@/components/motion/Reveal";
import Modal from "@/components/ui/Modal";
import { projects, type Project } from "@/data/projects";

export default function Work() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="work" className="section work">
      <div className="section-inner">
        <Reveal>
          <header className="section-head work-head">
            <div>
              <p className="eyebrow">Selected work / 2024—2026</p>
              <h2 className="section-title">Things built with care.</h2>
            </div>
            <p className="section-lede">
              Four experiments in type, transit, pattern and sound. Open a row
              to read the longer story.
            </p>
          </header>
        </Reveal>

        <div className="project-list">
          {projects.map((project) => (
            <Reveal key={project.slug}>
              <button
                type="button"
                className="project-row"
                onClick={() => setActive(project)}
                aria-haspopup="dialog"
                aria-label={`Open details for ${project.title}`}
                data-cursor="grow"
              >
                <span className="project-index" aria-hidden="true">
                  {project.index}
                </span>
                <span className="project-main">
                  <span className="project-title">{project.title}</span>
                  <span className="project-summary">{project.summary}</span>
                </span>
                <span className="project-meta">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </span>
                <span className="project-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={active?.title ?? "Project"}
      >
        {active ? (
          <div className="modal-body project-detail">
            <div className="project-detail-meta">
              <span>{active.category}</span>
              <span>{active.year}</span>
              <span>{active.role}</span>
            </div>

            <p>{active.description}</p>

            <div>
              <h3>Stack</h3>
              <ul className="project-detail-stack">
                {active.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {active.href ? (
              <a
                className="project-detail-link"
                href={active.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="grow"
              >
                View project <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <p className="modal-note">
                Full case study coming soon. Ask me about the process in the
                meantime.
              </p>
            )}
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
