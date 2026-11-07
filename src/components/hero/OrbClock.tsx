"use client";

import { useEffect, useRef } from "react";
import type { TimeZoneMode } from "@/lib/i18n";
import { NPT_OFFSET_MS } from "@/lib/nepaliDate";

type OrbClockProps = {
  zone: TimeZoneMode;
  reducedMotion: boolean;
};

const TICKS = Array.from({ length: 12 }, (_, index) => index);

function rotateHand(element: SVGGElement | null, degrees: number) {
  element?.setAttribute("transform", `rotate(${degrees} 100 100)`);
}

export default function OrbClock({ zone, reducedMotion }: OrbClockProps) {
  const hourRef = useRef<SVGGElement>(null);
  const minuteRef = useRef<SVGGElement>(null);
  const secondRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let frame = 0;
    let interval = 0;

    const update = () => {
      const date =
        zone === "npt" ? new Date(Date.now() + NPT_OFFSET_MS) : new Date();
      const hours = zone === "npt" ? date.getUTCHours() : date.getHours();
      const minutes = zone === "npt" ? date.getUTCMinutes() : date.getMinutes();
      const seconds = zone === "npt" ? date.getUTCSeconds() : date.getSeconds();
      const milliseconds = date.getMilliseconds();
      const smoothSeconds = reducedMotion
        ? seconds
        : seconds + milliseconds / 1000;

      rotateHand(
        hourRef.current,
        ((hours % 12) + minutes / 60 + seconds / 3600) * 30,
      );
      rotateHand(minuteRef.current, (minutes + seconds / 60) * 6);
      rotateHand(secondRef.current, smoothSeconds * 6);
    };

    const start = () => {
      update();
      if (reducedMotion) {
        interval = window.setInterval(update, 1000);
      } else {
        frame = window.requestAnimationFrame(function loop() {
          update();
          frame = window.requestAnimationFrame(loop);
        });
      }
    };

    const stop = () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
      frame = 0;
      interval = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!frame && !interval) start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [zone, reducedMotion]);

  return (
    <div className="orb-stage" aria-hidden="true">
      <div className="orb-mandala">
        <svg viewBox="0 0 400 400" focusable="false">
          <g fill="none" stroke="currentColor">
            {[56, 78, 104, 132, 158].map((radius) => (
              <circle key={radius} cx="200" cy="200" r={radius} />
            ))}
            {Array.from({ length: 36 }, (_, index) => {
              const angle = (index / 36) * Math.PI * 2;
              const inner = index % 3 === 0 ? 132 : 150;
              return (
                <line
                  key={index}
                  x1={200 + Math.cos(angle) * inner}
                  y1={200 + Math.sin(angle) * inner}
                  x2={200 + Math.cos(angle) * 168}
                  y2={200 + Math.sin(angle) * 168}
                />
              );
            })}
            {Array.from({ length: 8 }, (_, index) => {
              const angle = (index / 8) * Math.PI * 2;
              return (
                <ellipse
                  key={index}
                  cx={200 + Math.cos(angle) * 92}
                  cy={200 + Math.sin(angle) * 92}
                  rx="20"
                  ry="8"
                  transform={`rotate(${(angle * 180) / Math.PI} ${
                    200 + Math.cos(angle) * 92
                  } ${200 + Math.sin(angle) * 92})`}
                />
              );
            })}
          </g>
        </svg>
      </div>

      <div className="orb">
        <svg className="orb-clock" viewBox="0 0 200 200" focusable="false">
          <g className="orb-ticks">
            {TICKS.map((tick) => {
              const angle = (tick / 12) * Math.PI * 2;
              const inner = 86;
              const outer = tick % 3 === 0 ? 92 : 90;
              return (
                <line
                  key={tick}
                  x1={100 + Math.cos(angle) * inner}
                  y1={100 + Math.sin(angle) * inner}
                  x2={100 + Math.cos(angle) * outer}
                  y2={100 + Math.sin(angle) * outer}
                />
              );
            })}
          </g>

          <g ref={hourRef} className="orb-hand orb-hand--hour">
            <line x1="100" y1="100" x2="100" y2="66" />
            <circle cx="100" cy="66" r="2.4" />
          </g>

          <g ref={minuteRef} className="orb-hand orb-hand--minute">
            <line x1="100" y1="100" x2="100" y2="48" />
            <circle cx="100" cy="48" r="2" />
          </g>

          <g ref={secondRef} className="orb-hand orb-hand--second">
            <line x1="100" y1="100" x2="100" y2="42" />
            <circle cx="100" cy="42" r="1.7" />
          </g>

          <circle
            cx="100"
            cy="100"
            r="3.2"
            className="orb-hand orb-hand--second"
          />
        </svg>

        <span className="orb-zone">{zone === "npt" ? "NPT" : "LOCAL"}</span>
      </div>
    </div>
  );
}
