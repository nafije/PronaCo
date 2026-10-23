import { useEffect, type RefObject } from "react";
import { gsap, reducedMotion, ScrollTrigger } from "@/lib/motion";

/**
 * Declarative scroll effects for everything inside `scope`:
 * - data-reveal          fade and rise in (data-delay="0.2" to offset)
 * - data-clip            image wipes open from the bottom while the image settles from a zoom
 * - data-parallax="10"   element drifts by ±10% while its parent crosses the viewport
 * - data-count="850"     number counts up from zero
 */
export function useScrollReveals(scope: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    if (reducedMotion() || !scope.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 50,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%" } });
        tl.from(el, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
        const img = el.querySelector("img, video");
        if (img) tl.from(img, { scale: 1.4, duration: 2, ease: "expo.out" }, 0.1);
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax || 10);
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const counter = { v: 0 };
        gsap.to(counter, {
          v: Number(el.dataset.count),
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
        });
      });
    }, scope);

    // Images load late and shift layout; re-measure once they settle.
    const refresh = () => ScrollTrigger.refresh();
    const timer = setTimeout(refresh, 800);
    window.addEventListener("load", refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [scope, key]);
}
