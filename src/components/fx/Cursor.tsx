import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/motion";

/**
 * Trailing ring for mouse users. It swells over links and buttons, shows a word over
 * anything with data-cursor="View", and pulls [data-magnetic] elements toward the pointer.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled] = useState(() => window.matchMedia("(pointer: fine)").matches && !reducedMotion());

  useEffect(() => {
    const el = ring.current;
    if (!enabled || !el) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const toX = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const toY = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    let magnet: HTMLElement | null = null;

    const release = () => {
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
      magnet = null;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      gsap.to(el, { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
      toX(e.clientX);
      toY(e.clientY);

      const target = e.target as Element;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? "");
      el.dataset.state = labelled ? "label" : target.closest("a, button, select, input, textarea, label") ? "hover" : "";

      const next = target.closest<HTMLElement>("[data-magnetic]");
      if (next !== magnet) release();
      magnet = next;
      if (next) {
        const box = next.getBoundingClientRect();
        gsap.to(next, {
          x: (e.clientX - (box.left + box.width / 2)) * 0.35,
          y: (e.clientY - (box.top + box.height / 2)) * 0.35,
          duration: 0.5,
          ease: "power3.out",
        });
      }
    };
    const hide = () => {
      release();
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ring} aria-hidden className="cursor-ring">
      <span>{label}</span>
    </div>
  );
}
