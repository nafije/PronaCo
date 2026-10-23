import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { company, media, showreel, zones } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { gsap, introDone, reducedMotion } from "@/lib/motion";
import { SplitText } from "@/components/fx/SplitText";
import { MediaView } from "@/components/site/MediaView";
import { Container } from "@/components/site/primitives";
import { SearchBar } from "@/components/site/SearchBar";
import { VideoModal } from "@/components/site/VideoModal";

/**
 * Full-screen video hero. On load the footage settles from a zoom; on scroll the whole stage
 * tips back in 3D and shrinks into a rounded card while the headline lifts away.
 */
export function Hero() {
  const { t, tr } = useLang();
  const [reel, setReel] = useState<string | null>(null);
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el || reducedMotion()) return;
    let cancelled = false;
    const ctx = gsap.context(() => {
      gsap.set("[data-hero-media]", { scale: 1.25 });
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
        .to("[data-stage]", { scale: 0.86, rotateX: 18, borderRadius: "2.5rem", ease: "none" }, 0)
        .to("[data-hero-copy]", { yPercent: -40, autoAlpha: 0, ease: "none" }, 0);
    }, el);
    introDone.then(() => {
      if (!cancelled) ctx.add(() => gsap.to("[data-hero-media]", { scale: 1, duration: 2.6, ease: "expo.out" }));
    });
    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <>
      <section
        ref={section}
        className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink pt-28 pb-8 text-paper [perspective:1400px] sm:pb-12"
      >
        <div data-stage className="absolute inset-0 origin-[50%_100%] overflow-hidden will-change-transform">
          <div data-parallax="8" className="absolute -inset-y-[10%] inset-x-0">
            <MediaView
              item={{ image: media("city-aerial.jpg"), video: media("city-aerial.mp4") }}
              alt={t("Pamje nga ajri e qytetit", "Aerial view of the city")}
              eager
              data-hero-media=""
              className="size-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/40" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_20%,rgba(192,98,58,0.28),transparent_70%)]" />
        </div>

        <Container className="relative">
          <div data-hero-copy className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <span className="eyebrow animate-[fade-in_1s_ease_both] text-paper/80">{tr(company.tagline)}</span>
              <h1 className="mt-6 font-serif text-[clamp(2.9rem,8vw,7.5rem)] leading-[0.95] font-light tracking-tight">
                <SplitText
                  trigger="load"
                  text={t("Shtëpinë tuaj të radhës,\n*shikojeni* para se ta vizitoni.", "Your next home —\n*see it* before you visit.")}
                />
              </h1>
              <p data-reveal data-delay="0.5" className="mt-8 max-w-xl text-base leading-relaxed text-paper/75 sm:text-lg">
                {t(
                  "Apartamente, vila dhe zyra në Tiranë — secila me video tour të plotë, që të humbni kohë vetëm për pronat që ju pëlqejnë vërtet.",
                  "Apartments, villas and offices in Tirana — each with a full video tour, so you only spend time on the homes you truly love.",
                )}
              </p>
            </div>

            <button
              onClick={() => setReel(showreel)}
              data-magnetic
              className="group flex shrink-0 items-center gap-4 self-start text-left lg:self-auto"
            >
              <span className="relative flex size-20 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:scale-110">
                <span className="absolute inset-0 animate-ping rounded-full bg-paper/30 [animation-duration:2.4s]" />
                {/* Rotating caption ring */}
                <svg viewBox="0 0 100 100" className="absolute -top-5 -left-5 size-30 max-w-none animate-[spin_14s_linear_infinite] text-paper/70" aria-hidden>
                  <defs>
                    <path id="hero-ring" d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
                  </defs>
                  <text fontSize="8.5" letterSpacing="3" fill="currentColor">
                    <textPath href="#hero-ring">{t("SHIKONI VIDEON · TIRANA NGA LART · ", "WATCH THE FILM · TIRANA FROM ABOVE · ")}</textPath>
                  </text>
                </svg>
                <Play className="relative size-6 fill-current" />
              </span>
              <span className="ml-4 text-sm">
                <span className="block font-semibold">{t("Shikoni videon", "Watch the film")}</span>
                <span className="text-paper/60">{t("Tirana nga lart · 0:30", "Tirana from above · 0:30")}</span>
              </span>
            </button>
          </div>

          <div data-reveal data-delay="0.7" className="mt-12">
            <SearchBar />
          </div>
        </Container>

        {/* Scroll cue */}
        <div aria-hidden className="absolute bottom-0 left-1/2 hidden h-16 w-px overflow-hidden bg-paper/15 lg:block">
          <span className="block size-full animate-scroll-line bg-paper" />
        </div>
      </section>

      {/* Neighbourhood ticker */}
      <div className="relative z-10 overflow-hidden border-b border-ink/10 bg-cream py-5">
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {[...zones, ...zones].map((zone, i) => (
            <span key={i} className={`flex items-center gap-10 font-serif text-2xl whitespace-nowrap italic ${i % 2 ? "text-outline text-ink/60" : "text-ink/70"}`}>
              {tr(zone.name)}
              <span className="size-1.5 rounded-full bg-clay" />
            </span>
          ))}
        </div>
      </div>

      <VideoModal src={reel} title={t("Tirana nga lart", "Tirana from above")} onClose={() => setReel(null)} />
    </>
  );
}
