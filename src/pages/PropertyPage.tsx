import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarCheck, Check, MapPin, Phone, Play } from "lucide-react";
import { paths } from "@/constants/routes";
import { agents, formatNumber, formatPrice, propertyBySlug, properties, purposeLabels, zoneByKey, type Media } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { SplitText } from "@/components/fx/SplitText";
import { Layout } from "@/components/site/Layout";
import { MediaView } from "@/components/site/MediaView";
import { MortgageCalculator } from "@/components/site/MortgageCalculator";
import { PropertyCard } from "@/components/site/PropertyCard";
import { ButtonLink, Container, Eyebrow, WhatsAppIcon } from "@/components/site/primitives";
import { VideoModal } from "@/components/site/VideoModal";
import { NotFoundPage } from "./NotFoundPage";

export function PropertyPage() {
  const { t, tr, lang } = useLang();
  const { slug = "" } = useParams();
  const property = propertyBySlug(slug);
  const [modal, setModal] = useState<string | null>(null);

  if (!property) return <NotFoundPage />;

  const title = tr(property.title);
  const zone = zoneByKey[property.zone];
  const zoneName = tr(zone.name);
  const agent = agents[property.agent];
  const media: Media[] = [property.cover, ...property.gallery];
  const similar = properties.filter((p) => p.purpose === property.purpose && p.slug !== property.slug).slice(0, 3);
  const firstName = agent.name.split(" ")[0];
  const enquiry = t(
    `Përshëndetje ${firstName}, jam i interesuar për “${title}” (${property.ref}). A mund ta vizitoj?`,
    `Hello ${firstName}, I'm interested in “${title}” (${property.ref}). Could I arrange a viewing?`,
  );

  const facts = [
    { label: t("Sipërfaqja", "Area"), value: `${property.area} m²` },
    { label: t("Planimetria", "Layout"), value: property.layout },
    { label: t("Banjo", "Bathrooms"), value: String(property.bathrooms) },
    property.floor ? { label: t("Kati", "Floor"), value: property.floor } : null,
    property.land ? { label: t("Truall", "Land"), value: `${formatNumber(property.land, lang)} m²` } : null,
    { label: t("Viti", "Year"), value: String(property.year) },
  ].filter((f): f is { label: string; value: string } => f !== null);

  const d = 0.012;
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${zone.lng - d},${zone.lat - d / 1.6},${zone.lng + d},${
    zone.lat + d / 1.6
  }&layer=mapnik&marker=${zone.lat},${zone.lng}`;

  return (
    <Layout title={title} overlay>
      {/* Video hero */}
      <section className="relative flex min-h-[88svh] flex-col justify-end overflow-hidden bg-ink pt-28 pb-10 text-paper">
        <div className="absolute inset-0 overflow-hidden">
          <div data-parallax="8" className="absolute -inset-y-[10%] inset-x-0">
            <MediaView item={property.cover} alt={title} eager className="size-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
        </div>
        <Container className="relative">
          <Link to={paths.properties} className="group inline-flex items-center gap-2 text-sm text-paper/70 transition-colors hover:text-paper">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> {t("Të gjitha pronat", "All properties")}
          </Link>
          <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-4xl">
              <span className="eyebrow text-clay-2">
                {tr(purposeLabels[property.purpose])} · {property.ref}
              </span>
              <h1 className="mt-5 font-serif text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.95] font-light tracking-tight">
                <SplitText trigger="load" text={title} />
              </h1>
              <p className="mt-5 flex items-center gap-2 text-paper/75">
                <MapPin className="size-4" /> {zoneName}, {t("Tiranë", "Tirana")}
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <p className="font-serif text-4xl sm:text-5xl">{formatPrice(property, lang)}</p>
              {property.cover.video && (
                <button
                  onClick={() => setModal(property.cover.video!)}
                  data-magnetic
                  className="flex items-center gap-3 rounded-full bg-paper py-2 pr-5 pl-2 text-sm font-semibold text-ink transition-colors hover:bg-clay hover:text-paper"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-ink text-paper">
                    <Play className="size-4 fill-current" />
                  </span>
                  {t("Shiko video tour", "Watch the video tour")}
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Key facts */}
      <section className="border-b border-ink/10 bg-paper">
        <Container>
          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {facts.map((f, i) => (
              <div key={f.label} data-reveal data-delay={String(i * 0.06)} className="border-ink/10 py-6 not-last:border-r sm:px-6 first:sm:pl-0">
                <dt className="text-[11px] font-semibold tracking-[0.2em] text-mist uppercase">{f.label}</dt>
                <dd className="mt-2 font-serif text-2xl">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-[1fr_24rem] lg:gap-20">
          <div className="min-w-0 space-y-20">
            <div>
              <Eyebrow>{t("Përshkrimi", "Description")}</Eyebrow>
              <p data-reveal className="mt-6 font-serif text-3xl leading-snug font-light sm:text-4xl">
                {tr(property.summary)}
              </p>
              <div className="mt-8 space-y-5 leading-relaxed text-ink-3">
                {property.description.map((para, i) => (
                  <p key={i}>{tr(para)}</p>
                ))}
              </div>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {property.features.map((f, i) => (
                  <li
                    key={i}
                    data-reveal
                    data-delay={String((i % 2) * 0.08)}
                    className="flex items-center gap-3 rounded-xl bg-paper px-4 py-3 text-sm transition-transform duration-500 hover:translate-x-1"
                  >
                    <span className="flex size-6 items-center justify-center rounded-full bg-clay/10 text-clay">
                      <Check className="size-3.5" />
                    </span>
                    {tr(f)}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Eyebrow>{t("Galeria", "Gallery")}</Eyebrow>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {media.map((item, i) => (
                  <button
                    key={item.image + i}
                    onClick={() => item.video && setModal(item.video)}
                    data-clip
                    data-cursor={item.video ? t("Luaj", "Play") : undefined}
                    className={`group relative overflow-hidden rounded-2xl bg-cream-2 ${i === 0 ? "col-span-2 aspect-video" : "aspect-[4/3]"}`}
                  >
                    <img
                      src={item.image}
                      alt={`${title} — ${t("foto", "photo")} ${i + 1}`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {item.video && (
                      <span className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/30">
                        <span className="flex size-14 items-center justify-center rounded-full bg-paper/90 text-ink transition-transform group-hover:scale-110">
                          <Play className="size-5 fill-current" />
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {property.purpose === "shitje" && (
              <div>
                <Eyebrow>{t("Kalkulatori i kredisë", "Mortgage calculator")}</Eyebrow>
                <h2 className="mt-5 font-serif text-4xl font-light">{t("Sa do të paguani në muaj?", "What would you pay each month?")}</h2>
                <div className="mt-8">
                  <MortgageCalculator price={property.price} />
                </div>
              </div>
            )}

            <div>
              <Eyebrow>{t("Vendndodhja", "Location")}</Eyebrow>
              <h2 className="mt-5 font-serif text-4xl font-light">{zoneName}</h2>
              <p className="mt-3 text-mist">
                {tr(zone.blurb)}. {t("Adresa e saktë jepet gjatë vizitës.", "The exact address is shared at the viewing.")}
              </p>
              <div className="mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-cream-2">
                <iframe title={`${t("Harta", "Map")} — ${zoneName}`} src={map} loading="lazy" className="size-full grayscale-[0.4]" />
              </div>
            </div>
          </div>

          {/* Agent card */}
          <aside>
            <div className="glow sticky top-28 rounded-3xl p-8 text-paper shadow-[0_40px_80px_-40px_rgba(23,22,20,0.7)]">
              <p className="text-[11px] font-semibold tracking-[0.28em] text-stone uppercase">
                {property.purpose === "shitje" ? t("Çmimi", "Price") : t("Qiraja", "Rent")}
              </p>
              <p className="mt-2 font-serif text-4xl">{formatPrice(property, lang)}</p>

              <div className="mt-8 flex items-center gap-4 border-t border-paper/10 pt-8">
                <span className="relative flex size-14 items-center justify-center rounded-full bg-clay font-serif text-xl">
                  {agent.initials}
                  <span className="absolute right-0 bottom-0 size-3.5 rounded-full border-2 border-ink bg-[#25d366]" />
                </span>
                <div>
                  <p className="font-semibold">{agent.name}</p>
                  <p className="text-sm text-stone">{tr(agent.role)}</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <a
                  href={`https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(enquiry)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25d366] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <WhatsAppIcon className="size-5" /> {t("Shkruaj në WhatsApp", "Message on WhatsApp")}
                </a>
                <a
                  href={`tel:${agent.phone.replace(/\s/g, "")}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-paper/20 py-3.5 text-sm font-semibold transition-colors hover:bg-paper hover:text-ink"
                >
                  <Phone className="size-4" /> {agent.phone}
                </a>
                <Link
                  to={`${paths.contact}?prona=${property.ref}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-clay py-3.5 text-sm font-semibold transition-colors hover:bg-paper hover:text-ink"
                >
                  <CalendarCheck className="size-4" /> {t("Rezervo një vizitë", "Book a viewing")}
                </Link>
              </div>
              <p className="mt-6 text-center text-xs text-stone">
                {t("Përgjigjemi brenda 15 minutave, 7 ditë në javë.", "We reply within 15 minutes, 7 days a week.")}
              </p>
            </div>
          </aside>
        </Container>
      </section>

      {similar.length > 0 && (
        <section className="border-t border-ink/10 py-20 sm:py-28">
          <Container>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] leading-none font-light">
                <SplitText text={t("Mund t'ju pëlqejnë *edhe*", "You may *also* like")} />
              </h2>
              <ButtonLink to={paths.properties} variant="outline">
                {t("Të gjitha pronat", "All properties")}
              </ButtonLink>
            </div>
            <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p, i) => (
                <div key={p.slug} data-reveal data-delay={String(i * 0.1)}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <VideoModal src={modal} title={title} onClose={() => setModal(null)} />
    </Layout>
  );
}
