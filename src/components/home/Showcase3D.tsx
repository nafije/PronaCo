import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/constants/routes";
import { formatPrice, properties, zoneByKey } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { gsap, reducedMotion } from "@/lib/motion";
import { Container, Eyebrow } from "@/components/site/primitives";

const panels = properties.slice(0, 10);

/**
 * Pinned 3D carousel: listings stand in a ring that turns a full circle as the visitor scrolls,
 * tilting slightly so the ring reads as an object in space.
 */
export function Showcase3D() {
  const { t, tr, lang } = useLang();
  const section = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const r = ring.current;
    if (!el || !r) return;

    // Panel width follows the viewport; the radius is whatever closes the ring with a small gap.
    const size = () => {
      const w = Math.min(300, Math.max(150, window.innerWidth * 0.19));
      r.style.setProperty("--w", `${w}px`);
      r.style.setProperty("--r", `${Math.round(w / 2 / Math.tan(Math.PI / panels.length) + w * 0.12)}px`);
    };
    size();
    window.addEventListener("resize", size);

    if (reducedMotion()) return () => window.removeEventListener("resize", size);

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=220%", pin: true, scrub: 1.2 } })
        .fromTo(r, { rotateY: 20, rotateX: -14, scale: 0.7 }, { rotateY: -340, rotateX: 6, scale: 1, ease: "none" }, 0)
        .fromTo("[data-ring-title]", { yPercent: 30, autoAlpha: 0.2 }, { yPercent: -10, autoAlpha: 1, ease: "power1.out", duration: 0.3 }, 0)
        .fromTo("[data-ring-progress]", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
    }, el);

    return () => {
      window.removeEventListener("resize", size);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={section} className="glow relative flex min-h-svh flex-col overflow-hidden py-20 text-paper sm:py-24">
      <Container className="relative z-10 text-center">
        <Eyebrow className="text-clay-2">{t("Galeria 360°", "360° gallery")}</Eyebrow>
        <h2 data-ring-title className="mx-auto mt-5 max-w-4xl font-serif text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.02] font-light tracking-tight">
          {t("Ecni nëpër ", "Walk through ")}
          <span className="text-clay-2 italic">{t("çdo dhomë", "every room")}</span>
          {t(" — pa lëvizur nga vendi.", " — without leaving your seat.")}
        </h2>
      </Container>

      <div className="relative flex flex-1 items-center justify-center [perspective:1600px]">
        <div ref={ring} className="preserve-3d relative size-0">
          {panels.map((p, i) => (
            <Link
              key={p.slug}
              to={paths.property(p.slug)}
              data-cursor={t("Hyr", "Enter")}
              style={{
                width: "var(--w)",
                transform: `translate(-50%, -50%) rotateY(${(i * 360) / panels.length}deg) translateZ(var(--r))`,
              }}
              className="group absolute top-0 left-0 block aspect-[3/4] overflow-hidden rounded-2xl bg-ink-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-paper/10"
            >
              <img
                src={p.cover.image}
                alt={tr(p.title)}
                loading="lazy"
                className="size-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-clay-2 uppercase">{tr(zoneByKey[p.zone].name)}</p>
                <p className="mt-1 font-serif text-base leading-tight sm:text-xl">{tr(p.title)}</p>
                <p className="mt-1 text-xs text-paper/70">{formatPrice(p, lang)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Container className="relative z-10 flex items-center gap-4 text-xs text-stone">
        <span>01</span>
        <span className="h-px flex-1 bg-paper/15">
          <span data-ring-progress className="block h-full origin-left bg-clay-2" />
        </span>
        <span>{String(panels.length).padStart(2, "0")}</span>
      </Container>
    </section>
  );
}
