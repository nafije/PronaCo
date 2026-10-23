import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { finishIntro, gsap, lockScroll, reducedMotion } from "@/lib/motion";

/** First-visit curtain: a counter runs to 100, then the panel wipes up to reveal the page. */
export function Preloader() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) {
      finishIntro();
      setGone(true);
      return;
    }
    lockScroll(true);
    const num = el.querySelector("[data-num]")!;
    const counter = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => setGone(true) });
    tl.from(el.querySelectorAll("[data-word]"), { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.08 })
      .to(
        counter,
        {
          v: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            num.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0,
      )
      .to(el.querySelector("[data-bar]"), { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
      .to(el.querySelectorAll("[data-fade]"), { autoAlpha: 0, y: -24, duration: 0.5, ease: "power2.in", stagger: 0.04 })
      .add(() => {
        lockScroll(false);
        finishIntro();
      })
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "<");
    return () => {
      tl.kill();
      lockScroll(false);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 text-paper [clip-path:inset(0%_0%_0%_0%)] sm:p-12"
    >
      <p data-fade className="text-[11px] font-semibold tracking-[0.28em] text-stone uppercase">
        {t("Tiranë · që nga 2014", "Tirana · since 2014")}
      </p>
      <p data-fade className="font-serif text-[clamp(3.5rem,14vw,11rem)] leading-[0.9] font-light tracking-tight">
        {["Prona", "&", "Co."].map((word) => (
          <span key={word} className="mr-[0.2em] inline-block overflow-hidden align-top">
            <span data-word className={`inline-block ${word === "&" ? "text-clay italic" : ""}`}>
              {word}
            </span>
          </span>
        ))}
      </p>
      <div data-fade>
        <div className="flex items-end justify-between">
          <span className="text-sm text-stone">{t("Duke hapur dyert…", "Opening the doors…")}</span>
          <span data-num className="font-serif text-6xl font-light tabular-nums sm:text-8xl">
            000
          </span>
        </div>
        <div className="mt-4 h-px bg-paper/15">
          <div data-bar className="h-full origin-left scale-x-0 bg-clay" />
        </div>
      </div>
    </div>
  );
}
