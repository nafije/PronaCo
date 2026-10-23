import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import { paths } from "@/constants/routes";
import { formatPrice, properties, zoneByKey } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { MediaView } from "@/components/site/MediaView";
import { Container, SectionHead } from "@/components/site/primitives";
import { VideoModal } from "@/components/site/VideoModal";

const tours = properties.filter((p) => p.cover.video).slice(0, 4);

/** Dark showcase: pick a listing on the left, its walkthrough plays large on the right. */
export function VideoTours() {
  const { t, tr, lang } = useLang();
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<string | null>(null);
  const tour = tours[active];

  return (
    <section className="glow py-24 text-paper sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead
            light
            eyebrow="Video tours"
            title={t("Vizitoni nga divani, *vendosni* në vend.", "Tour from the sofa, *decide* on the spot.")}
            className="max-w-3xl"
          />
          <p data-reveal className="max-w-sm text-sm leading-relaxed text-stone">
            {t(
              "Çdo pronë që publikojmë filmohet nga ekipi ynë — brenda, jashtë dhe nga dron. Pa surpriza në vizitë.",
              "Every home we list is filmed by our own team — inside, outside and by drone. No surprises at the viewing.",
            )}
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
          <ol className="order-2 divide-y divide-paper/10 border-y border-paper/10 lg:order-1">
            {tours.map((p, i) => (
              <li key={p.slug}>
                <button
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`group flex w-full items-center gap-5 py-6 text-left transition-colors duration-500 ${
                    active === i ? "text-paper" : "text-paper/40 hover:text-paper/80"
                  }`}
                >
                  <span className="w-8 font-sans text-xs">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`flex-1 transition-transform duration-500 ${active === i ? "translate-x-2" : ""}`}>
                    <span className="block font-serif text-2xl leading-tight sm:text-3xl">{tr(p.title)}</span>
                    <span className="mt-1 block text-sm text-stone">
                      {tr(zoneByKey[p.zone].name)} · {formatPrice(p, lang)}
                    </span>
                  </span>
                  <span className={`h-px bg-clay transition-all duration-700 ${active === i ? "w-12" : "w-0"}`} aria-hidden />
                </button>
              </li>
            ))}
          </ol>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-ink-2 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-paper/10">
              <MediaView
                key={tour.slug}
                item={tour.cover}
                alt={`Video tour: ${tr(tour.title)}`}
                eager
                className="size-full animate-[zoom-in_1s_cubic-bezier(0.16,1,0.3,1)_both] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4 sm:inset-x-8 sm:bottom-8">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.28em] text-clay-2 uppercase">{tour.ref}</p>
                  <p className="mt-2 font-serif text-2xl sm:text-4xl">{tr(tour.title)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModal(tour.cover.video!)}
                    className="flex items-center gap-2 rounded-full bg-paper/15 px-4 py-2.5 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-paper hover:text-ink"
                  >
                    <Maximize2 className="size-4" /> {t("Ekran i plotë", "Full screen")}
                  </button>
                  <Link
                    to={paths.property(tour.slug)}
                    className="flex items-center gap-2 rounded-full bg-clay px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-paper hover:text-ink"
                  >
                    {t("Detajet", "Details")} <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <VideoModal src={modal} title={tr(tour.title)} onClose={() => setModal(null)} />
    </section>
  );
}
