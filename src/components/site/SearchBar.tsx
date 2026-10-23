import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { paths } from "@/constants/routes";
import { formatEuro, propertyTypes, typeLabels, zones, type Purpose } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export const budgets: Record<Purpose, number[]> = {
  shitje: [300000, 500000, 1000000],
  qira: [800, 1500, 5000],
};

/** Hero search: builds the query string the listings page reads its filters from. */
export function SearchBar() {
  const { t, tr, lang } = useLang();
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<Purpose>("shitje");
  const [zone, setZone] = useState("");
  const [type, setType] = useState("");
  const [max, setMax] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ qellimi: purpose });
    if (zone) params.set("zona", zone);
    if (type) params.set("tipi", type);
    if (max) params.set("max", max);
    navigate(`${paths.properties}?${params}`);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-paper/20 bg-paper/85 p-2 text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
    >
      <div className="relative flex w-fit gap-1 p-1">
        {(["shitje", "qira"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setPurpose(p);
              setMax("");
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
              purpose === p ? "bg-ink text-paper" : "text-mist hover:text-ink"
            }`}
          >
            {p === "shitje" ? t("Blej", "Buy") : t("Me qira", "Rent")}
          </button>
        ))}
      </div>
      <div className="grid gap-2 p-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <label className="block">
          <span className="sr-only">{t("Zona", "Area")}</span>
          <select className="field" value={zone} onChange={(e) => setZone(e.target.value)}>
            <option value="">{t("Të gjitha zonat", "All areas")}</option>
            {zones.map((z) => (
              <option key={z.key} value={z.key}>
                {tr(z.name)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">{t("Tipi", "Type")}</span>
          <select className="field" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">{t("Çdo tip prone", "Any property type")}</option>
            {propertyTypes.map((pt) => (
              <option key={pt} value={pt}>
                {tr(typeLabels[pt])}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">{t("Buxheti", "Budget")}</span>
          <select className="field" value={max} onChange={(e) => setMax(e.target.value)}>
            <option value="">{t("Çdo buxhet", "Any budget")}</option>
            {budgets[purpose].map((b) => (
              <option key={b} value={b}>
                {t("Deri në", "Up to")} {formatEuro(b, lang)}
                {purpose === "qira" ? t(" / muaj", " / month") : ""}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="group flex items-center justify-center gap-2 rounded-xl bg-clay px-7 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink"
        >
          <Search className="size-4 transition-transform duration-500 group-hover:rotate-90" /> {t("Kërko", "Search")}
        </button>
      </div>
    </form>
  );
}
