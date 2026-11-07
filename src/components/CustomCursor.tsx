"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shouldEnable = finePointer.matches && !reduceMotion.matches;

    setEnabled(shouldEnable);
    if (!shouldEnable) return;

    document.body.classList.add("has-custom-cursor");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      const element = event.target as HTMLElement | null;
      const interactive = element?.closest(
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="grow"]',
      );

      const cursor = cursorRef.current;
      if (!cursor) return;
      cursor.classList.add("is-visible");
      cursor.classList.toggle("is-active", Boolean(interactive));
    };

    const onLeave = () => {
      cursorRef.current?.classList.remove("is-visible");
    };

    const onPointerDown = () => {
      cursorRef.current?.classList.add("is-down");
    };

    const onPointerUp = () => {
      cursorRef.current?.classList.remove("is-down");
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.34;
      currentY += (targetY - currentY) * 0.34;
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      frame = window.requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    frame = window.requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span />
    </div>
  );
}
