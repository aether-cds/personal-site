"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/motion/Reveal";
import { site } from "@/data/site";

const COPIED_MESSAGE = "Email copied · इमेल कपी भयो";
const COPY_ERROR_MESSAGE = "Copy failed — select the email instead";

async function legacyCopy(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (!document.execCommand("copy")) {
      throw new Error("Copy command was rejected");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

async function writeToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Permission can be denied even on a secure origin; try the older path.
    }
  }

  await legacyCopy(text);
}

export default function Contact() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);

    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2400);
  };

  const copyEmail = async () => {
    try {
      await writeToClipboard(site.email);
      showToast(COPIED_MESSAGE);
    } catch {
      showToast(COPY_ERROR_MESSAGE);
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="section-inner contact-inner">
        <Reveal>
          <p className="eyebrow">Contact / सम्पर्क</p>
          <h2 className="contact-title">
            Have something worth making?
          </h2>
          <p className="contact-lede">
            I take on a small number of projects each year. Tell me what you
            are building, who it is for, and when it needs to exist.
          </p>

          <button
            type="button"
            className="contact-email"
            onClick={copyEmail}
            aria-label={`Copy email address ${site.email}`}
            data-cursor="grow"
          >
            <span>{site.email}</span>
            <span className="contact-copy" aria-hidden="true">
              Copy ↗
            </span>
          </button>
          <p className="contact-hint">
            Click to copy <span aria-hidden="true">·</span> or write to me
            directly
          </p>
        </Reveal>

        <Reveal className="contact-side">
          <p className="eyebrow">Elsewhere</p>
          <ul className="social-list" aria-label="Social links">
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

          <p className="contact-availability">{site.availability}</p>
        </Reveal>
      </div>

      <div
        className={`toast${toastVisible ? " is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>
    </section>
  );
}
