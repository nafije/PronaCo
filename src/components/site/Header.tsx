import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Phone } from "lucide-react";
import { navLinks, paths } from "@/constants/routes";
import { company } from "@/lib/data";
import { useLang, type Lang } from "@/lib/i18n";
import { lockScroll } from "@/lib/motion";
import { Logo } from "./Logo";
import { ButtonLink, Container, InstagramIcon, RollText } from "./primitives";

/** SQ / EN pill; the active language sits on a sliding thumb. */
function LangToggle({ light }: { light: boolean }) {
  const { lang, setLang } = useLang();
  const options: Lang[] = ["sq", "en"];
  return (
    <div
      role="group"
      aria-label="Language / Gjuha"
      className={`relative flex rounded-full border p-0.5 text-[11px] font-semibold tracking-[0.15em] uppercase ${
        light ? "border-paper/30" : "border-ink/15"
      }`}
    >
      <span
        aria-hidden
        className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          light ? "bg-paper" : "bg-ink"
        } ${lang === "en" ? "translate-x-full" : ""}`}
      />
      {options.map((option) => (
        <button
          key={option}
          onClick={() => setLang(option)}
          aria-pressed={lang === option}
          className={`relative w-10 rounded-full py-1.5 transition-colors duration-500 ${
            lang === option ? (light ? "text-ink" : "text-paper") : "opacity-60 hover:opacity-100"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/** `overlay` pages open on a full-bleed video, so the header starts light until the page scrolls. */
export function Header({ overlay = false }: { overlay?: boolean }) {
  const { t, tr } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      setHidden(y > last && y > 400);
      setProgress(max > 0 ? y / max : 0);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  const light = overlay && !scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,color] duration-500 ${
          hidden && !open ? "-translate-y-full" : ""
        } ${scrolled && !open ? "border-b border-ink/5 bg-cream/75 backdrop-blur-xl backdrop-saturate-150" : "border-b border-transparent"} ${
          light ? "text-paper" : "text-ink"
        }`}
      >
        <Container className="flex h-20 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `group relative flex items-center gap-2 py-1 text-[13px] font-semibold tracking-wide ${
                    isActive && !link.to.includes("#") ? "text-clay" : ""
                  }`
                }
              >
                <RollText>{tr(link.label)}</RollText>
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 lg:gap-6">
            <a href={company.phoneHref} className="hidden items-center gap-2 text-[13px] font-semibold xl:flex">
              <Phone className="size-4" />
              {company.phone}
            </a>
            <LangToggle light={light} />
            <div className="hidden lg:block">
              <ButtonLink to={paths.contact} variant={light ? "light" : "ink"}>
                {t("Vlerësim falas", "Free valuation")}
              </ButtonLink>
            </div>

            <button
              className="flex items-center gap-3 text-[13px] font-semibold tracking-[0.2em] uppercase md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("Mbyll menunë", "Close menu") : t("Hap menunë", "Open menu")}
              aria-expanded={open}
            >
              <span className="hidden sm:inline">{open ? t("Mbyll", "Close") : "Menu"}</span>
              <span className="relative block h-3 w-7">
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
                />
              </span>
            </button>
          </div>
        </Container>

        {/* Reading progress */}
        <span
          aria-hidden
          style={{ transform: `scaleX(${progress})` }}
          className={`absolute bottom-0 left-0 h-px w-full origin-left bg-clay transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`}
        />
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-cream transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] md:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <Container className="flex flex-1 flex-col justify-center gap-2 pt-20">
          {navLinks.map((link, i) => (
            <div key={link.to} className="overflow-hidden">
              <NavLink
                to={link.to}
                end
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${200 + i * 70}ms` : "0ms" }}
                className={({ isActive }) =>
                  `flex items-baseline gap-4 font-serif text-5xl font-light transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-6xl ${
                    open ? "translate-y-0" : "translate-y-full"
                  } ${isActive && !link.to.includes("#") ? "text-clay italic" : "text-ink"}`
                }
              >
                <span className="font-sans text-xs text-mist">0{i + 1}</span>
                {tr(link.label)}
              </NavLink>
            </div>
          ))}
        </Container>
        <Container
          className={`flex items-end justify-between border-t border-ink/10 py-8 transition-opacity delay-500 duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="space-y-1 text-sm">
            <a href={company.phoneHref} className="block font-semibold">
              {company.phone}
            </a>
            <a href={`mailto:${company.email}`} className="block text-mist">
              {company.email}
            </a>
          </div>
          <a href={company.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon className="size-6" />
          </a>
        </Container>
      </div>
    </>
  );
}
