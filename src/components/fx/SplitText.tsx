import { Fragment, useEffect, useRef } from "react";
import { gsap, introDone, reducedMotion } from "@/lib/motion";

/**
 * Renders text word by word so each word can rise out of a mask.
 * "\n" breaks a line; words wrapped in *stars* (one or several) are set in clay italic.
 */
function Words({ text, wordClass = "" }: { text: string; wordClass?: string }) {
  let inAccent = false;
  return (
    <>
      {text.split("\n").map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((raw, wi, arr) => {
            // "*word*", "*two words*." — trailing punctuation stays upright
            let word = raw;
            let accent = inAccent;
            if (word.startsWith("*")) {
              accent = true;
              word = word.slice(1);
            }
            let trail = "";
            const close = word.match(/^(.*)\*([.,!?:;]*)$/);
            if (close) {
              word = close[1];
              trail = close[2];
              inAccent = false;
            } else {
              inAccent = accent;
            }
            return (
              <Fragment key={wi}>
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                  <span data-w className={`inline-block ${wordClass}`}>
                    {accent ? <span className="text-clay italic">{word}</span> : word}
                    {trail}
                  </span>
                </span>
                {wi < arr.length - 1 && " "}
              </Fragment>
            );
          })}
        </span>
      ))}
    </>
  );
}

type SplitTextProps = {
  text: string;
  className?: string;
  /** "load" plays on mount, "view" when scrolled into view. */
  trigger?: "load" | "view";
  delay?: number;
};

export function SplitText({ text, className = "", trigger = "view", delay = 0 }: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const words = el.querySelectorAll("[data-w]");
    gsap.set(words, { yPercent: 120 });
    const vars = { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.06, delay };
    let tween: gsap.core.Tween | undefined;
    let cancelled = false;
    if (trigger === "load") {
      introDone.then(() => {
        if (!cancelled) tween = gsap.to(words, { ...vars, delay: delay + 0.2 });
      });
    } else {
      tween = gsap.to(words, { ...vars, scrollTrigger: { trigger: el, start: "top 88%" } });
    }
    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      gsap.set(words, { clearProps: "transform" });
    };
  }, [text, trigger, delay]);

  return (
    <span ref={ref} className={`block ${className}`}>
      <Words text={text} />
    </span>
  );
}

/** A statement whose words light up one after another as it scrolls through the viewport. */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-w]",
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [text]);

  return (
    <p ref={ref} className={className}>
      <Words text={text} />
    </p>
  );
}
