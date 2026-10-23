import { Link } from "react-router-dom";
import { paths } from "@/constants/routes";
import { company } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export function Logo({ className = "" }: { className?: string }) {
  const { t } = useLang();
  return (
    <Link to={paths.home} className={`group flex items-center gap-2.5 ${className}`} aria-label={`${company.name} — ${t("kreu", "home")}`}>
      <svg viewBox="0 0 32 32" className="size-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6" aria-hidden>
        <path d="M6 26V13l10-7.5L26 13v13" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12.5 26v-7.5h7V26" fill="none" stroke="var(--color-clay)" strokeWidth="1.6" />
      </svg>
      <span className="font-serif text-2xl leading-none tracking-tight">
        Prona <span className="text-clay italic">&amp;</span> Co.
      </span>
    </Link>
  );
}
