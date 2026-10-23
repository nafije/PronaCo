import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { company, media, whatsappLink } from "@/lib/data";
import { T, useLang } from "@/lib/i18n";
import { SplitText } from "@/components/fx/SplitText";
import { Layout } from "@/components/site/Layout";
import { MediaView } from "@/components/site/MediaView";
import { Container, Eyebrow } from "@/components/site/primitives";

const interests = [
  T("Dua të blej", "I want to buy"),
  T("Dua të marr me qira", "I want to rent"),
  T("Dua të shes", "I want to sell"),
  T("Dua të jap me qira", "I want to let my property"),
  T("Vlerësim falas", "Free valuation"),
];

/** No backend: the form composes a WhatsApp message to the office, which is how most clients reach agencies here. */
export function ContactPage() {
  const { t, tr } = useLang();
  const [params] = useSearchParams();
  const ref = params.get("prona") ?? "";
  const [interest, setInterest] = useState(ref ? 0 : 4);
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = [
      t(`Përshëndetje, jam ${data.get("name")}.`, `Hello, I'm ${data.get("name")}.`),
      `${tr(interests[interest])}${data.get("ref") ? ` — ${t("prona", "property")} ${data.get("ref")}` : ""}.`,
      String(data.get("message") || ""),
      `Tel: ${data.get("phone")}`,
    ].filter(Boolean);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
    setSent(true);
  };

  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${company.coords.lng - 0.006},${company.coords.lat - 0.0035},${
    company.coords.lng + 0.006
  },${company.coords.lat + 0.0035}&layer=mapnik&marker=${company.coords.lat},${company.coords.lng}`;

  return (
    <Layout title={t("Kontakt", "Contact")}>
      <section className="pt-36 pb-20 sm:pt-44 sm:pb-28">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Eyebrow>{t("Kontakt", "Contact")}</Eyebrow>
            <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.92] font-light tracking-tight">
              <SplitText trigger="load" text={t("Le të *flasim*.", "Let's *talk*.")} />
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-3">
              {t(
                "Kërkoni, shisni apo doni thjesht të dini sa vlen prona juaj? Na shkruani — përgjigjemi brenda 15 minutave.",
                "Buying, selling, or just curious what your home is worth? Message us — we reply within 15 minutes.",
              )}
            </p>

            <ul className="mt-12 space-y-6">
              {[
                { Icon: Phone, label: t("Telefon", "Phone"), value: company.phone, href: company.phoneHref },
                { Icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
                { Icon: MapPin, label: t("Zyra", "Office"), value: company.address },
              ].map(({ Icon, label, value, href }, i) => (
                <li key={label} data-reveal data-delay={String(i * 0.08)} className="group flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-paper text-clay transition-colors duration-500 group-hover:bg-clay group-hover:text-paper">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold tracking-[0.2em] text-mist uppercase">{label}</span>
                    {href ? (
                      <a href={href} className="mt-1 block text-lg transition-colors hover:text-clay">
                        {value}
                      </a>
                    ) : (
                      <span className="mt-1 block text-lg">{value}</span>
                    )}
                  </span>
                </li>
              ))}
              <li data-reveal data-delay="0.24" className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-paper text-clay">
                  <Clock className="size-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-[11px] font-semibold tracking-[0.2em] text-mist uppercase">{t("Orari", "Hours")}</span>
                  <span className="mt-1 block max-w-xs space-y-1">
                    {company.hours.map((h) => (
                      <span key={h.days.sq} className="flex justify-between gap-6">
                        <span className="text-ink-3">{tr(h.days)}</span>
                        <span>{tr(h.time)}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-[2rem] bg-paper p-6 shadow-[0_40px_80px_-50px_rgba(23,22,20,0.45)] sm:p-10">
            {sent ? (
              <div className="flex h-full min-h-96 animate-[zoom-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both] flex-col items-center justify-center text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-clay text-paper">
                  <Send className="size-6" />
                </span>
                <p className="mt-6 font-serif text-4xl">{t("Faleminderit!", "Thank you!")}</p>
                <p className="mt-3 max-w-sm text-mist">
                  {t(
                    "Mesazhi juaj u hap në WhatsApp. Dërgojeni dhe një nga agjentët tanë ju shkruan menjëherë.",
                    "Your message opened in WhatsApp. Send it and one of our agents will reply right away.",
                  )}
                </p>
                <button onClick={() => setSent(false)} className="mt-8 text-sm font-semibold text-clay">
                  {t("Dërgo një mesazh tjetër", "Send another message")}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6">
                <fieldset>
                  <legend className="text-sm font-semibold">{t("Si mund t'ju ndihmojmë?", "How can we help?")}</legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {interests.map((option, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInterest(i)}
                        className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                          interest === i ? "scale-105 border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink"
                        }`}
                      >
                        {tr(option)}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-mist">{t("Emri juaj", "Your name")}</span>
                    <input name="name" required className="field mt-2 bg-cream" placeholder={t("Emër Mbiemër", "First Last")} />
                  </label>
                  <label className="block">
                    <span className="text-sm text-mist">{t("Telefoni", "Phone")}</span>
                    <input name="phone" type="tel" required className="field mt-2 bg-cream" placeholder="+355 6X XXX XXXX" />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm text-mist">{t("Kodi i pronës (opsional)", "Property code (optional)")}</span>
                  <input name="ref" defaultValue={ref} className="field mt-2 bg-cream" placeholder={t("p.sh. PC-1042", "e.g. PC-1042")} />
                </label>
                <label className="block">
                  <span className="text-sm text-mist">{t("Mesazhi", "Message")}</span>
                  <textarea
                    name="message"
                    rows={5}
                    className="field mt-2 resize-none bg-cream"
                    placeholder={t("Zona, buxheti, sa dhoma ju duhen…", "Area, budget, how many bedrooms…")}
                  />
                </label>
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-clay py-4 text-sm font-semibold text-paper transition-colors hover:bg-ink"
                >
                  <Send className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />{" "}
                  {t("Dërgo mesazhin", "Send message")}
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-cream-2 lg:aspect-auto">
            <iframe title={t("Harta e zyrës", "Office map")} src={map} loading="lazy" className="size-full min-h-80 grayscale-[0.4]" />
          </div>
          <div data-clip className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <MediaView
              item={{ image: media("couple-keys.jpg"), video: media("couple-keys.mp4") }}
              alt={t("Agjente që takon një çift në apartament", "An agent meeting a couple in an apartment")}
              className="size-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-8 text-paper">
              <p className="font-serif text-3xl leading-tight">{t("Kafeja është gati — ejani në zyrë.", "The coffee's on — drop by the office.")}</p>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
