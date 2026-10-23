import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { navLinks, paths } from "@/constants/routes";
import { company, zones } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { smoothScrollTo } from "@/lib/motion";
import { Logo } from "./Logo";
import { Container, FacebookIcon, InstagramIcon } from "./primitives";

export function Footer() {
  const { t, tr } = useLang();

  return (
    <footer className="glow relative overflow-hidden pt-20 pb-8 text-paper">
      <Container>
        <div className="grid gap-12 border-b border-paper/10 pb-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone">
              {t(
                `Agjenci imobiliare në Tiranë që nga ${company.founded}. Shitje, qira dhe vlerësim pronash — çdo pronë me video tour.`,
                `A Tirana real estate agency since ${company.founded}. Sales, rentals and valuations — every home with a video tour.`,
              )}
            </p>
            <div className="mt-8 flex gap-3">
              {[
                { href: company.instagram, label: "Instagram", Icon: InstagramIcon },
                { href: company.facebook, label: "Facebook", Icon: FacebookIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  data-magnetic
                  className="flex size-11 items-center justify-center rounded-full border border-paper/15 transition-colors hover:border-clay hover:bg-clay hover:text-paper"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-stone uppercase">{t("Faqet", "Pages")}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-clay-2">
                    {tr(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-stone uppercase">{t("Zonat", "Areas")}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {zones.slice(0, 6).map((zone) => (
                <li key={zone.key}>
                  <Link to={`${paths.properties}?zona=${zone.key}`} className="transition-colors hover:text-clay-2">
                    {tr(zone.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-stone uppercase">{t("Zyra", "Office")}</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="text-stone">{company.address}</li>
              <li>
                <a href={company.phoneHref} className="transition-colors hover:text-clay-2">
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="transition-colors hover:text-clay-2">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex items-end justify-between gap-6">
          <p className="font-serif text-[clamp(3.5rem,13vw,12rem)] leading-[0.85] font-light tracking-tight text-paper/10">
            Prona <span className="text-clay/40 italic">&amp;</span> Co.
          </p>
          <button
            onClick={() => smoothScrollTo(0)}
            aria-label={t("Kthehu lart", "Back to top")}
            data-magnetic
            className="mb-2 flex size-14 shrink-0 items-center justify-center rounded-full border border-paper/20 transition-colors hover:border-clay hover:bg-clay sm:size-20"
          >
            <ArrowUp className="size-5" />
          </button>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 text-xs text-stone sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {company.name}. {t("Të gjitha të drejtat e rezervuara.", "All rights reserved.")}
          </p>
          <p>{t("Çmimet janë orientuese dhe mund të ndryshojnë.", "Prices are indicative and may change.")}</p>
          <a
            href="https://devbynas.com/"
            target="_blank"
            rel="noreferrer"
            data-magnetic
            className="group relative isolate inline-flex items-center gap-2.5 self-start overflow-hidden rounded-full border border-paper/15 bg-paper/5 py-1.5 pr-1.5 pl-3 backdrop-blur-md transition-colors duration-500 hover:border-clay-2/60 sm:self-auto"
          >
            {/* Gradient fill that sweeps in on hover */}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-clay to-clay-2 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-clay-2 opacity-70" />
              <span className="relative size-2 rounded-full bg-clay-2 transition-colors group-hover:bg-paper" />
            </span>
            <span className="text-stone transition-colors duration-500 group-hover:text-paper/80">{t("Krijuar nga", "Crafted by")}</span>
            <span className="font-serif text-sm text-paper italic">devbynas</span>
            <span className="flex size-6 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-3.5" />
            </span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
