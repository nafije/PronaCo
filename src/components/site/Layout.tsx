import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { company, whatsappLink } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { smoothScrollTo } from "@/lib/motion";
import { useScrollReveals } from "@/components/fx/useScrollReveals";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppIcon } from "./primitives";

export function Layout({ title, overlay = false, children }: { title: string; overlay?: boolean; children: ReactNode }) {
  const { t, lang } = useLang();
  const { pathname, hash } = useLocation();
  const root = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    document.title = `${title} | ${company.name}`;
  }, [title]);

  // Layout remounts per page, so the first run is a fresh page: jump to top, then to the hash if any.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      smoothScrollTo(0, true);
    }
    if (!hash) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(hash.slice(1));
      if (el) smoothScrollTo(el);
    }, 400);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  // Re-run when the language changes: swapped text re-renders the revealed elements.
  useScrollReveals(root, `${pathname}:${lang}`);

  return (
    <div ref={root} className="flex min-h-screen flex-col">
      <Header overlay={overlay} />
      <main className="flex-1">{children}</main>
      <Footer />

      <a
        href={whatsappLink(t("Përshëndetje! Po kërkoj një pronë në Tiranë.", "Hello! I'm looking for a property in Tirana."))}
        target="_blank"
        rel="noreferrer"
        aria-label={t("Na shkruani në WhatsApp", "Message us on WhatsApp")}
        data-magnetic
        className="fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:scale-110 sm:right-6 sm:bottom-6"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366]/40 [animation-duration:3s]" />
        <WhatsAppIcon className="relative size-7" />
      </a>

      {/* Film grain over everything for a printed, editorial feel */}
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[60]" />
    </div>
  );
}
