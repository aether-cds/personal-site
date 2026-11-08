"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.35,
      smoothWheel: true,
    });

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const destination = document.querySelector(hash);
      if (!destination) return;

      event.preventDefault();
      lenis.scrollTo(destination, { offset: -6, duration: 1.15 });

      // A skip link should move focus, not only scroll. `main` has tabIndex
      // -1 so it can receive programmatic focus without joining the tab order.
      if (hash === "#main" && destination instanceof HTMLElement) {
        destination.focus({ preventScroll: true });
      }
    };

    const onModal = (event: Event) => {
      const open = (event as CustomEvent<boolean>).detail;
      if (open) lenis.stop();
      else lenis.start();
    };

    document.addEventListener("click", onAnchorClick);
    window.addEventListener("app:modal", onModal as EventListener);

    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("app:modal", onModal as EventListener);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
