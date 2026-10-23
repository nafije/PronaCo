import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { formatEuro, properties, propertyTypes, typeLabels, zones, type Property } from "@/lib/data";
import { T, useLang } from "@/lib/i18n";
import { SplitText } from "@/components/fx/SplitText";
import { Layout } from "@/components/site/Layout";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Container, Eyebrow } from "@/components/site/primitives";
import { budgets } from "@/components/site/SearchBar";

const sorts = {
  "": { label: T("Të rejat", "Newest"), compare: (a: Property, b: Property) => b.ref.localeCompare(a.ref) },
  "cmimi-ulet": { label: T("Çmimi: nga i ulëti", "Price: low to high"), compare: (a: Property, b: Property) => a.price - b.price },
  "cmimi-larte": { label: T("Çmimi: nga i larti", "Price: high to low"), compare: (a: Property, b: Property) => b.price - a.price },
  siperfaqja: { label: T("Sipërfaqja më e madhe", "Largest first"), compare: (a: Property, b: Property) => b.area - a.area },
};

type SortKey = keyof typeof sorts;

/** Listings with filters kept in the query string, so the hero search and zone links land pre-filtered. */
export function PropertiesPage() {
  const { t, tr, lang } = useLang();
  const [params, setParams] = useSearchParams();
  const purpose = params.get("qellimi") ?? "";
  const zone = params.get("zona") ?? "";
  const type = params.get("tipi") ?? "";
  const rooms = Number(params.get("dhoma") ?? 0);
  const max = Number(params.get("max") ?? 0);
  const sort = (params.get("rendit") ?? "") as SortKey;

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(
    () =>
      properties
        .filter(
          (p) =>
            (!purpose || p.purpose === purpose) &&
            (!zone || p.zone === zone) &&
            (!type || p.type === type) &&
            (!rooms || p.bedrooms >= rooms) &&
            (!max || p.price <= max),
        )
        .sort((sorts[sort] ?? sorts[""]).compare),
    [purpose, zone, type, rooms, max, sort],
  );

  const active = [...params.keys()].some((k) => k !== "rendit");

  return (
    <Layout title={t("Pronat", "Properties")}>
      <section className="pt-36 pb-12 sm:pt-44">
        <Container>
          <Eyebrow>{t("Shitje & qira · Tiranë", "Sale & rent · Tirana")}</Eyebrow>
          <h1 className="mt-6 font-serif text-[clamp(3rem,9vw,8rem)] leading-[0.92] font-light tracking-tight">
            <SplitText trigger="load" text={t("Gjeni pronën *tuaj*.", "Find *your* place.")} />
          </h1>
        </Container>
      </section>

      <section className="sticky top-0 z-30 border-y border-ink/10 bg-cream/80 py-4 backdrop-blur-xl backdrop-saturate-150">
        <Container className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="flex shrink-0 gap-1 rounded-full bg-cream-2 p-1">
            {[
              { value: "", label: t("Të gjitha", "All") },
              { value: "shitje", label: t("Shitje", "Buy") },
              { value: "qira", label: t("Qira", "Rent") },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  const next = new URLSearchParams(params);
                  if (opt.value) next.set("qellimi", opt.value);
                  else next.delete("qellimi");
                  next.delete("max"); // sale and rent budgets are different scales
                  setParams(next, { replace: true });
                }}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  purpose === opt.value ? "bg-ink text-paper" : "text-mist hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-5">
            <select aria-label={t("Zona", "Area")} className="field" value={zone} onChange={(e) => set("zona", e.target.value)}>
              <option value="">{t("Të gjitha zonat", "All areas")}</option>
              {zones.map((z) => (
                <option key={z.key} value={z.key}>
                  {tr(z.name)}
                </option>
              ))}
            </select>
            <select aria-label={t("Tipi", "Type")} className="field" value={type} onChange={(e) => set("tipi", e.target.value)}>
              <option value="">{t("Çdo tip", "Any type")}</option>
              {propertyTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {tr(typeLabels[pt])}
                </option>
              ))}
            </select>
            <select
              aria-label={t("Dhoma gjumi", "Bedrooms")}
              className="field"
              value={rooms || ""}
              onChange={(e) => set("dhoma", e.target.value)}
            >
              <option value="">{t("Dhoma gjumi", "Bedrooms")}</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}+ {t("dhoma", "beds")}
                </option>
              ))}
            </select>
            <select aria-label={t("Buxheti", "Budget")} className="field" value={max || ""} onChange={(e) => set("max", e.target.value)}>
              <option value="">{t("Çdo buxhet", "Any budget")}</option>
              {budgets[purpose === "qira" ? "qira" : "shitje"].map((n) => (
                <option key={n} value={n}>
                  {t("Deri në", "Up to")} {formatEuro(n, lang)}
                </option>
              ))}
            </select>
            <select
              aria-label={t("Rendit", "Sort")}
              className="field col-span-2 md:col-span-1"
              value={sort}
              onChange={(e) => set("rendit", e.target.value)}
            >
              {Object.entries(sorts).map(([value, s]) => (
                <option key={value} value={value}>
                  {tr(s.label)}
                </option>
              ))}
            </select>
          </div>
        </Container>
      </section>

      <section className="pt-10 pb-24 sm:pb-32">
        <Container>
          <div className="flex items-center justify-between gap-4 text-sm">
            <p className="flex items-center gap-2 text-mist">
              <SlidersHorizontal className="size-4" />
              {results.length} {results.length === 1 ? t("pronë", "property") : t("prona", "properties")}
            </p>
            {active && (
              <button onClick={() => setParams({}, { replace: true })} className="flex items-center gap-1.5 font-semibold text-clay">
                <X className="size-4" /> {t("Pastro filtrat", "Clear filters")}
              </button>
            )}
          </div>

          {results.length > 0 ? (
            <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p, i) => (
                <PropertyCard
                  key={p.slug}
                  property={p}
                  className="animate-[zoom-in_0.8s_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: `${(i % 6) * 60}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl bg-paper px-6 py-24 text-center">
              <p className="font-serif text-4xl">{t("Asnjë pronë me këto kritere.", "No properties match these filters.")}</p>
              <p className="mx-auto mt-4 max-w-md text-mist">
                {t(
                  "Na shkruani çfarë kërkoni — shumë prona i kemi jashtë portaleve dhe ju njoftojmë sapo del diçka e përshtatshme.",
                  "Tell us what you're after — many of our homes never reach the portals, and we'll let you know as soon as something fits.",
                )}
              </p>
              <button
                onClick={() => setParams({}, { replace: true })}
                className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay"
              >
                {t("Shiko të gjitha pronat", "See all properties")}
              </button>
            </div>
          )}
        </Container>
      </section>
    </Layout>
  );
}
