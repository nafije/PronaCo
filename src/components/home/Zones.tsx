import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { paths } from "@/constants/routes";
import { properties, zones } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { Container, SectionHead } from "@/components/site/primitives";

const listed = zones
  .map((zone) => ({ ...zone, count: properties.filter((p) => p.zone === zone.key).length }))
  .filter((zone) => zone.count > 0);

/** Neighbourhood index: hovering a row swaps the sticky photo beside it. */
export function Zones() {
  const { t, tr } = useLang();
  const [hovered, setHovered] = useState(0);

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHead
          eyebrow={t("Zonat", "Neighbourhoods")}
          title={t("Njohim çdo lagje të *Tiranës*.", "We know every corner of *Tirana*.")}
          className="max-w-3xl"
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <ul className="border-t border-ink/10">
            {listed.map((zone, i) => (
              <li key={zone.key} onMouseEnter={() => setHovered(i)}>
                <Link
                  to={`${paths.properties}?zona=${zone.key}`}
                  className="group relative isolate flex items-center gap-6 overflow-hidden border-b border-ink/10 py-6"
                >
                  {/* Wash that fills the row from the left on hover */}
                  <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-paper transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                  <span className="w-8 pl-1 text-xs text-mist">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 transition-transform duration-500 group-hover:translate-x-3">
                    <span className="block font-serif text-3xl leading-tight transition-colors group-hover:text-clay sm:text-4xl">
                      {tr(zone.name)}
                    </span>
                    <span className="mt-1 block text-sm text-mist">{tr(zone.blurb)}</span>
                  </span>
                  <span className="hidden text-sm text-mist sm:block">
                    {zone.count} {zone.count === 1 ? t("pronë", "listing") : t("prona", "listings")}
                  </span>
                  <span className="mr-1 flex size-10 items-center justify-center rounded-full border border-ink/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-clay group-hover:bg-clay group-hover:text-paper">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-3xl bg-cream-2 shadow-[0_40px_80px_-40px_rgba(23,22,20,0.5)]">
              {listed.map((zone, i) => (
                <img
                  key={zone.key}
                  src={zone.image}
                  alt=""
                  loading="lazy"
                  className={`absolute inset-0 size-full object-cover transition-[opacity,transform,clip-path] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    hovered === i ? "scale-100 opacity-100 [clip-path:inset(0_0_0_0)]" : "scale-110 opacity-0 [clip-path:inset(0_0_0_100%)]"
                  }`}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-8">
                <p key={hovered} className="animate-[zoom-in_0.8s_cubic-bezier(0.16,1,0.3,1)_both] font-serif text-3xl text-paper italic">
                  {tr(listed[hovered].name)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
