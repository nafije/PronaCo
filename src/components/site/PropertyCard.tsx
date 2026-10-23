import { useRef, type CSSProperties, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Bath, BedDouble, Maximize, Play } from "lucide-react";
import { paths } from "@/constants/routes";
import { formatPrice, purposeLabels, typeLabels, zoneByKey, type Property } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { gsap, reducedMotion } from "@/lib/motion";

/** Listing card: tilts in 3D toward the pointer, with a light glare, and swaps the poster for the video. */
export function PropertyCard({
  property,
  className = "",
  style,
}: {
  property: Property;
  className?: string;
  style?: CSSProperties;
}) {
  const { t, tr, lang } = useLang();
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  const play = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  const tilt = (e: MouseEvent) => {
    const el = frame.current;
    if (!el || reducedMotion()) return;
    const box = el.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width;
    const y = (e.clientY - box.top) / box.height;
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
    gsap.to(el, { rotateY: (x - 0.5) * 12, rotateX: (0.5 - y) * 12, transformPerspective: 900, duration: 0.6, ease: "power3.out" });
  };

  const leave = () => {
    video.current?.pause();
    if (frame.current) gsap.to(frame.current, { rotateX: 0, rotateY: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <Link
      to={paths.property(property.slug)}
      onMouseEnter={play}
      onMouseMove={tilt}
      onMouseLeave={leave}
      data-cursor={t("Shiko", "View")}
      className={`group block ${className}`}
      style={style}
    >
      <div
        ref={frame}
        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-2 shadow-[0_30px_60px_-35px_rgba(23,22,20,0.45)] transition-shadow duration-700 will-change-transform group-hover:shadow-[0_50px_80px_-35px_rgba(23,22,20,0.6)]"
      >
        <img
          src={property.cover.image}
          alt={tr(property.title)}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        />
        {property.cover.video && (
          <video
            ref={video}
            src={property.cover.video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 size-full scale-105 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/10" />
        {/* Glare follows the pointer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.55), transparent 55%)" }}
        />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className="rounded-full bg-paper/85 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-ink backdrop-blur-md">
            {tr(purposeLabels[property.purpose])}
          </span>
          {property.tag && (
            <span className="rounded-full bg-clay px-3 py-1.5 text-[11px] font-semibold tracking-wide text-paper shadow-lg shadow-clay/30">
              {tr(property.tag)}
            </span>
          )}
        </div>

        {property.cover.video && (
          <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-ink/40 py-1.5 pr-3 pl-1.5 text-[11px] font-semibold text-paper backdrop-blur-md">
            <span className="flex size-6 items-center justify-center rounded-full bg-paper text-ink">
              <Play className="size-3 fill-current" />
            </span>
            Video tour
          </span>
        )}
        <span className="absolute right-4 bottom-4 font-serif text-2xl text-paper drop-shadow">{formatPrice(property, lang)}</span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-mist uppercase">
            {tr(zoneByKey[property.zone].name)} · {tr(typeLabels[property.type])}
          </p>
          <h3 className="mt-2 font-serif text-2xl leading-tight transition-colors duration-500 group-hover:text-clay">{tr(property.title)}</h3>
        </div>
        <span className="mt-1 shrink-0 text-xs text-mist">{property.ref}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink/10 pt-4 text-sm text-ink-3">
        <span className="flex items-center gap-2">
          <Maximize className="size-4 text-mist" /> {property.area} m²
        </span>
        {property.bedrooms > 0 && (
          <span className="flex items-center gap-2">
            <BedDouble className="size-4 text-mist" /> {property.layout}
          </span>
        )}
        <span className="flex items-center gap-2">
          <Bath className="size-4 text-mist" /> {property.bathrooms} {t("banjo", property.bathrooms === 1 ? "bath" : "baths")}
        </span>
      </div>
    </Link>
  );
}
