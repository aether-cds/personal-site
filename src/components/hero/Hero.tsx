"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { useNepalTime } from "@/hooks/useNepalTime";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  copy,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  type Language,
  type TimeZoneMode,
} from "@/lib/i18n";
import { ensureAudio, playBowlNote, playGong } from "@/lib/singingBowl";
import HelpDialog from "@/components/hero/HelpDialog";
import OrbClock from "@/components/hero/OrbClock";
import RollingValue from "@/components/hero/RollingValue";

const PhysicsField = dynamic(() => import("@/components/hero/PhysicsField"), {
  ssr: false,
});

type Option<T extends string> = { value: T; label: string };

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="seg-option"
          aria-pressed={value === option.value}
          lang={option.label === "ने" ? "ne" : undefined}
          onClick={() => onChange(option.value)}
          data-cursor="grow"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 3h5v5" />
        <path d="M4 20 21 3" />
        <path d="M21 16v5h-5" />
        <path d="m15 15 6 6" />
        <path d="m4 4 5 5" />
      </g>
    </svg>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
        {on ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <>
            <path d="m16 9 5 6" />
            <path d="m21 9-5 6" />
          </>
        )}
      </g>
    </svg>
  );
}

export default function Hero() {
  const [lang, setLang] = useState<Language>("en");
  const [zone, setZone] = useState<TimeZoneMode>("npt");
  const [soundOn, setSoundOn] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [shuffleSignal, setShuffleSignal] = useState(0);
  const [namaste, setNamaste] = useState<{ id: number } | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const time = useNepalTime(zone, lang);
  const gongKeyRef = useRef("");
  const namasteIdRef = useRef(0);
  const namasteTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (reducedMotion) setSoundOn(false);
  }, [reducedMotion]);

  useEffect(() => {
    if (!soundOn || !time.mounted) return;
    if (time.minuteValue !== 0 || time.secondValue > 1) return;

    const key = `${zone}-${time.hourValue}-${time.bs?.day ?? ""}`;
    if (gongKeyRef.current === key) return;
    gongKeyRef.current = key;
    playGong();
  }, [
    soundOn,
    time.mounted,
    time.minuteValue,
    time.secondValue,
    time.hourValue,
    time.bs?.day,
    zone,
  ]);

  useEffect(() => {
    const onNamaste = () => {
      namasteIdRef.current += 1;
      setNamaste({ id: namasteIdRef.current });
      if (namasteTimerRef.current) {
        window.clearTimeout(namasteTimerRef.current);
      }
      namasteTimerRef.current = window.setTimeout(() => {
        setNamaste(null);
      }, 1800);
    };

    window.addEventListener("hero:namaste", onNamaste);
    return () => {
      window.removeEventListener("hero:namaste", onNamaste);
      if (namasteTimerRef.current) {
        window.clearTimeout(namasteTimerRef.current);
      }
    };
  }, []);

  const toggleSound = async () => {
    if (reducedMotion) return;
    if (soundOn) {
      setSoundOn(false);
      return;
    }
    const context = await ensureAudio();
    if (!context) return;
    setSoundOn(true);
    playBowlNote({ size: 120, y: 320, viewportHeight: 800 });
  };

  const reshuffle = () => {
    setShuffleSignal((signal) => signal + 1);
  };

  const hourLabel = time.hour;
  const minuteLabel = time.minute;
  const monthLabel = time.monthName;
  const dayLabel = time.day;
  const zoneLabel = time.zoneLabel;

  return (
    <section
      id="top"
      className="hero relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-crimson text-ink"
    >
      <h1 className="sr-only">
        {site.name} — {site.role} based in {site.location}
      </h1>

      <PhysicsField
        soundOn={soundOn}
        reducedMotion={reducedMotion}
        shuffleSignal={shuffleSignal}
      />

      <div className="dot-fade" aria-hidden="true" />

      <OrbClock zone={zone} reducedMotion={reducedMotion} />

      <p className="sr-only">{time.mounted ? time.spoken : "Loading Nepal time."}</p>

      {/* Four corner values */}
      <div className="hero-corner hero-corner--hour">
        <span className="hero-label">
          {copy.hour[lang]} <span className="hero-label-slash">/</span>{" "}
          {copy.hour[lang === "en" ? "np" : "en"]}
        </span>
        <RollingValue value={hourLabel} lang={lang} className="hero-num" />
      </div>

      <div className="hero-corner hero-corner--minute">
        <span className="hero-label">
          {copy.minute[lang]} <span className="hero-label-slash">/</span>{" "}
          {copy.minute[lang === "en" ? "np" : "en"]}
        </span>
        <RollingValue value={minuteLabel} lang={lang} className="hero-num" />
      </div>

      <div className="hero-corner hero-corner--month">
        <span className="hero-label">
          {copy.month[lang]} <span className="hero-label-slash">/</span>{" "}
          {copy.month[lang === "en" ? "np" : "en"]}
        </span>
        <span
          key={monthLabel}
          className="hero-month word-swap"
          lang={lang === "np" ? "ne" : undefined}
        >
          {monthLabel}
        </span>
        <span className="hero-meta">
          Bikram Sambat <span aria-hidden="true">·</span> BS
        </span>
      </div>

      <div className="hero-corner hero-corner--day">
        <span className="hero-label">
          {copy.day[lang]} <span className="hero-label-slash">/</span>{" "}
          {copy.day[lang === "en" ? "np" : "en"]}
        </span>
        <RollingValue value={dayLabel} lang={lang} className="hero-day" />
        <span className="hero-meta hero-meta--stack">
          <span>
            {time.year} <span className="hero-meta-muted">BS</span>
          </span>
          <span>
            {time.adDate} <span className="hero-meta-muted">AD</span>
          </span>
        </span>
      </div>

      {/* Top centre: nav + greeting */}
      <div className="hero-top">
        <a href="#work" className="nav-work" data-cursor="grow">
          <span
            className={lang === "en" ? "nav-work-active" : "nav-work-idle"}
          >
            {copy.work.en}
          </span>
          <span className="nav-work-slash" aria-hidden="true">
            /
          </span>
          <span
            lang="ne"
            className={lang === "np" ? "nav-work-active" : "nav-work-idle"}
          >
            {copy.work.np}
          </span>
          <span className="nav-work-arrow" aria-hidden="true">
            ↘
          </span>
        </a>

        <div className="greeting">
          <span className="greeting-ne" lang="ne">
            नमस्ते
          </span>
          <span className="greeting-en">Namaste</span>
        </div>
      </div>

      {/* Top right: language + timezone */}
      <div className="hero-toggles">
        <Segmented
          label="Language"
          value={lang}
          options={LANGUAGE_OPTIONS}
          onChange={setLang}
        />
        <Segmented
          label="Time zone"
          value={zone}
          options={TIMEZONE_OPTIONS}
          onChange={setZone}
        />
      </div>

      {/* Left edge tab */}
      <div className="portfolio-tab" role="img" aria-label="Syami portfolio">
        <span className="portfolio-initial" aria-hidden="true">
          {site.initial}
        </span>
        <span className="portfolio-word" aria-hidden="true">
          Portfolio
        </span>
      </div>

      {/* Right edge controls */}
      <div className="hero-tools" role="group" aria-label="Playground controls">
        <button
          type="button"
          className="round-btn"
          onClick={reshuffle}
          aria-label="Reshuffle all shapes"
          data-cursor="grow"
        >
          <ShuffleIcon />
        </button>

        <button
          type="button"
          className="round-btn sound-btn"
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
          disabled={reducedMotion}
          title={
            reducedMotion
              ? "Sound is disabled because reduced motion is on"
              : soundOn
                ? "Sound on"
                : "Sound off"
          }
          data-cursor="grow"
        >
          <SoundIcon on={soundOn} />
          <span className="sound-dots" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} />
            ))}
          </span>
        </button>

        <button
          type="button"
          className="round-btn"
          onClick={() => setHelpOpen(true)}
          aria-label="Open help and instructions"
          aria-haspopup="dialog"
          data-cursor="grow"
        >
          <span className="help-mark" aria-hidden="true">
            ?
          </span>
        </button>
      </div>

      {/* Scroll cue */}
      <a href="#about" className="scroll-cue" aria-label="Scroll to about">
        <span className="scroll-cue-arrow" aria-hidden="true">
          ↓
        </span>
        <span className="scroll-cue-label" aria-hidden="true">
          Scroll
        </span>
      </a>

      {/* Footer microtext */}
      <p className="hero-footer">
        {site.location} <span aria-hidden="true">·</span>{" "}
        {site.coordinates} <span aria-hidden="true">·</span>{" "}
        {site.timezone} <span aria-hidden="true">·</span> {zoneLabel}
      </p>

      {namaste ? (
        <div key={namaste.id} className="namaste-flash" aria-hidden="true">
          <span lang="ne">नमस्ते</span>
          <span>Namaste</span>
        </div>
      ) : null}

      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </section>
  );
}
