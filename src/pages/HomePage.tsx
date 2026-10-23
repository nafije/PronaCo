import { paths } from "@/constants/routes";
import { media, properties, services, stats, steps } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { ScrollWords } from "@/components/fx/SplitText";
import { Hero } from "@/components/home/Hero";
import { Reviews } from "@/components/home/Reviews";
import { Showcase3D } from "@/components/home/Showcase3D";
import { VideoTours } from "@/components/home/VideoTours";
import { Zones } from "@/components/home/Zones";
import { Layout } from "@/components/site/Layout";
import { MediaView } from "@/components/site/MediaView";
import { PropertyCard } from "@/components/site/PropertyCard";
import { ButtonLink, Container, SectionHead } from "@/components/site/primitives";

const showcase = [...properties.filter((p) => p.featured), ...properties.filter((p) => !p.featured)].slice(0, 6);

export function HomePage() {
  const { t, tr } = useLang();

  return (
    <Layout title={t("Agjenci imobiliare në Tiranë", "Real estate agency in Tirana")} overlay>
      <Hero />

      {/* Featured listings */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <SectionHead eyebrow={t("Prona të përzgjedhura", "Featured homes")} title={t("Të reja këtë *javë*.", "New this *week*.")} />
            <ButtonLink to={paths.properties} variant="outline">
              {t("Të gjitha pronat", "All properties")}
            </ButtonLink>
          </div>

          <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((p, i) => (
              <div key={p.slug} data-reveal data-delay={String((i % 3) * 0.1)} className={i % 3 === 1 ? "lg:mt-16" : ""}>
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Showcase3D />

      {/* About + numbers */}
      <section className="py-24 sm:py-32">
        <Container>
          <ScrollWords
            text={t(
              "Nuk shesim metra katrorë. Ju ndihmojmë të gjeni *vendin* ku do të jetoni vitet më të mira — me ndershmëri, dokumente të pastra dhe pa presion.",
              "We don't sell square metres. We help you find the *place* where you'll live your best years — honestly, with clean paperwork and no pressure.",
            )}
            className="max-w-6xl font-serif text-[clamp(1.9rem,4.2vw,3.8rem)] leading-[1.12] font-light tracking-tight"
          />

          <div className="mt-20 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div data-clip className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <MediaView
                item={{ image: media("key-handshake.jpg"), video: media("key-handshake.mp4") }}
                alt={t("Dorëzimi i çelësave të shtëpisë", "Handing over the house keys")}
                className="size-full object-cover"
              />
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-12">
              {stats.map((s) => (
                <div key={s.value} className="border-t border-ink/15 pt-6">
                  <dt className="font-serif text-[clamp(3rem,6vw,5rem)] leading-none font-light">
                    <span data-count={s.value}>{s.value}</span>
                    <span className="text-clay">{s.suffix}</span>
                  </dt>
                  <dd className="mt-3 text-sm text-mist">{tr(s.label)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <VideoTours />

      {/* Services */}
      <section id="sherbimet" className="bg-paper py-24 sm:py-32">
        <Container>
          <SectionHead
            eyebrow={t("Shërbimet", "Services")}
            title={t("Gjithçka, nga kërkimi *deri te noteri*.", "Everything, from the search *to the notary*.")}
            className="max-w-3xl"
          />
          <div className="mt-16 grid border-t border-l border-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <div
                key={i}
                data-reveal
                data-delay={String((i % 3) * 0.08)}
                className="group relative isolate overflow-hidden border-r border-b border-ink/10 p-8 transition-colors duration-500 hover:text-paper sm:p-10"
              >
                {/* Ink fill rises from the bottom on hover */}
                <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                <span className="font-serif text-lg text-clay italic">0{i + 1}</span>
                <h3 className="mt-10 font-serif text-3xl transition-transform duration-500 group-hover:translate-x-2">{tr(s.title)}</h3>
                <p className="mt-4 text-sm leading-relaxed text-mist transition-colors group-hover:text-stone">{tr(s.text)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Zones />

      {/* Process */}
      <section className="bg-cream-2 py-24 sm:py-32">
        <Container>
          <SectionHead eyebrow={t("Si punojmë", "How we work")} title={t("Katër hapa, *zero stres*.", "Four steps, *zero stress*.")} />
          <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <span aria-hidden className="absolute top-6 right-0 left-6 hidden h-px bg-ink/15 lg:block" />
            {steps.map((step, i) => (
              <li key={i} data-reveal data-delay={String(i * 0.12)} className="relative">
                <span className="relative flex size-12 items-center justify-center rounded-full bg-ink font-serif text-lg text-paper ring-8 ring-cream-2">
                  {i + 1}
                </span>
                <h3 className="mt-6 font-serif text-2xl">{tr(step.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-3">{tr(step.text)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Reviews />

      {/* Sell CTA */}
      <section className="px-4 pb-24 sm:px-8 sm:pb-32 lg:px-12">
        <div className="relative mx-auto max-w-[90rem] overflow-hidden rounded-[2rem] bg-ink text-paper">
          <div className="absolute inset-0 overflow-hidden">
            <div data-parallax="10" className="absolute -inset-y-[12%] inset-x-0">
              <MediaView
                item={{ image: media("couple-city.jpg"), video: media("couple-city.mp4") }}
                alt={t("Çift që shikon qytetin nga dritarja", "A couple looking at the city from a window")}
                className="size-full object-cover opacity-50"
              />
            </div>
          </div>
          <div className="relative px-6 py-24 text-center sm:px-12 sm:py-32">
            <span className="eyebrow text-clay-2">{t("Për pronarët", "For owners")}</span>
            <h2 className="mx-auto mt-6 max-w-4xl font-serif text-[clamp(2.4rem,6vw,5.5rem)] leading-[1] font-light">
              {t("Sa vlen prona juaj ", "What is your home worth ")}
              <span className="italic">{t("sot", "today")}</span>?
            </h2>
            <p data-reveal className="mx-auto mt-6 max-w-xl text-paper/75">
              {t(
                "Merrni një vlerësim falas brenda 48 orëve, bazuar në shitjet reale të zonës suaj.",
                "Get a free valuation within 48 hours, based on real sales in your area.",
              )}
            </p>
            <div data-reveal className="mt-10 flex flex-wrap justify-center gap-3">
              <ButtonLink to={paths.contact}>{t("Kërko vlerësim falas", "Request a free valuation")}</ButtonLink>
              <ButtonLink to={paths.properties} variant="light">
                {t("Shiko pronat", "Browse properties")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
