import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Intro: load-triggered animations wait for the preloader to lift ---

let releaseIntro = () => {};
/** Resolves once the preloader is gone (at once on later navigations). */
export const introDone = new Promise<void>((resolve) => (releaseIntro = resolve));
export const finishIntro = () => releaseIntro();

// --- Smooth scroll (Lenis driven by the GSAP ticker so ScrollTrigger stays in sync) ---

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (lenis || reducedMotion()) return;
  lenis = new Lenis({ lerp: 0.09, anchors: { offset: -96 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function smoothScrollTo(target: number | HTMLElement, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, offset: typeof target === "number" ? 0 : -96, duration: 1.4 });
  } else if (typeof target === "number") {
    window.scrollTo(0, target);
  } else {
    target.scrollIntoView();
  }
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
