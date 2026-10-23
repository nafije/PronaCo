import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { PenLine, Quote, Star, X } from "lucide-react";
import { reviews as seeded, type Review } from "@/lib/data";
import { useLang, type Lang } from "@/lib/i18n";
import { gsap, reducedMotion } from "@/lib/motion";
import { Container, SectionHead } from "@/components/site/primitives";

// Reviews left on this site are kept in the visitor's browser (there is no backend yet).
const storageKey = "pronaco-reviews";

function loadSaved(): Review[] {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function Stars({ rating, className = "size-4" }: { rating: number; className?: string }) {
  return (
    <span className="flex gap-0.5 text-clay" aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${className} ${n <= rating ? "fill-current" : "opacity-25"}`} />
      ))}
    </span>
  );
}

const dateFormats: Record<Lang, Intl.DateTimeFormat> = {
  sq: new Intl.DateTimeFormat("sq-AL", { month: "long", year: "numeric" }),
  en: new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }),
};

function ReviewCard({ review }: { review: Review }) {
  const { tr, lang } = useLang();
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col justify-between rounded-3xl border border-ink/5 bg-paper p-7 shadow-[0_20px_50px_-30px_rgba(23,22,20,0.35)] transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_40px_70px_-30px_rgba(23,22,20,0.45)] sm:w-[25rem] sm:p-8">
      <div>
        <div className="flex items-center justify-between">
          <Stars rating={review.rating} />
          <Quote className="size-6 text-clay/30" />
        </div>
        <blockquote className="mt-5 font-serif text-xl leading-snug sm:text-[1.4rem]">
          “{typeof review.text === "string" ? review.text : tr(review.text)}”
        </blockquote>
      </div>
      <figcaption className="mt-8 flex items-center gap-3 border-t border-ink/10 pt-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream-2 font-serif text-ink">
          {review.name.charAt(0)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{review.name}</span>
          <span className="block truncate text-xs text-mist">
            {review.detail ? `${tr(review.detail)} · ` : ""}
            {dateFormats[lang].format(new Date(review.date))}
          </span>
        </span>
        <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold tracking-wide text-mist uppercase">
          {review.source}
        </span>
      </figcaption>
    </figure>
  );
}

/** One endless row; hovering it pauses the drift so a card can be read. */
function Row({ items, reverse = false }: { items: Review[]; reverse?: boolean }) {
  // Repeat short rows so a single copy is always wider than the screen.
  const base = items.length < 4 ? [...items, ...items, ...items] : items;
  return (
    <div className="group flex overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className={`flex w-max gap-6 pr-6 group-hover:[animation-play-state:paused] ${
          reverse ? "animate-marquee-reverse" : "animate-marquee-slow"
        }`}
      >
        {[...base, ...base].map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>
    </div>
  );
}

function ReviewForm({ onSubmit, onClose }: { onSubmit: (review: Review) => void; onClose: () => void }) {
  const { t } = useLang();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSubmit({
      name: String(data.get("name")).trim(),
      rating,
      date: new Date().toISOString().slice(0, 10),
      text: String(data.get("text")).trim(),
      source: "Website",
    });
  };

  return (
    <form onSubmit={submit} className="relative mt-10 animate-[zoom-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both] rounded-3xl bg-paper p-6 sm:p-10">
      <button
        type="button"
        onClick={onClose}
        aria-label={t("Mbyll", "Close")}
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full transition-[transform,background-color] hover:rotate-90 hover:bg-cream"
      >
        <X className="size-4" />
      </button>
      <p className="font-serif text-3xl">{t("Ndani përvojën tuaj", "Share your experience")}</p>

      <fieldset className="mt-6">
        <legend className="text-sm text-mist">{t("Vlerësimi juaj", "Your rating")}</legend>
        <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} / 5`}
              aria-pressed={rating === n}
              className="text-clay transition-transform hover:scale-125"
            >
              <Star className={`size-8 ${n <= (hover || rating) ? "fill-current" : "opacity-30"}`} />
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_2fr]">
        <label className="block">
          <span className="text-sm text-mist">{t("Emri juaj", "Your name")}</span>
          <input name="name" required maxLength={40} className="field mt-2 bg-cream" placeholder={t("p.sh. Ana K.", "e.g. Anna K.")} />
        </label>
        <label className="block">
          <span className="text-sm text-mist">{t("Vlerësimi", "Review")}</span>
          <textarea
            name="text"
            required
            minLength={10}
            maxLength={400}
            rows={3}
            className="field mt-2 resize-none bg-cream"
            placeholder={t("Si ishte bashkëpunimi me ne?", "How was working with us?")}
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-full bg-clay px-8 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-ink"
      >
        {t("Publiko vlerësimin", "Post review")}
      </button>
    </form>
  );
}

export function Reviews() {
  const { t } = useLang();
  const [saved, setSaved] = useState<Review[]>(loadSaved);
  const [writing, setWriting] = useState(false);
  const [thanks, setThanks] = useState(false);
  const bars = useRef<HTMLDivElement>(null);

  const all = useMemo(() => [...saved, ...seeded], [saved]);
  const average = all.reduce((sum, r) => sum + r.rating, 0) / all.length;
  const counts = [5, 4, 3, 2, 1].map((n) => ({ n, count: all.filter((r) => r.rating === n).length }));
  const half = Math.ceil(all.length / 2);

  useEffect(() => {
    const el = bars.current;
    if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-bar]", {
        scaleX: 0,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const add = (review: Review) => {
    const next = [review, ...saved];
    setSaved(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // kept for this visit only
    }
    setWriting(false);
    setThanks(true);
  };

  return (
    <section id="vleresimet" className="overflow-hidden py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <SectionHead
            eyebrow={t("Vlerësimet", "Reviews")}
            title={t("Fjalët e tyre, *jo tonat*.", "Their words, *not ours*.")}
          />

          <div ref={bars} className="grid gap-8 rounded-3xl bg-paper p-6 sm:grid-cols-[auto_1fr] sm:p-8">
            <div>
              <p className="font-serif text-7xl leading-none font-light">{average.toFixed(1)}</p>
              <div className="mt-3">
                <Stars rating={Math.round(average)} />
              </div>
              <p className="mt-2 text-sm text-mist">
                {all.length} {t("vlerësime", "reviews")}
              </p>
            </div>
            <div className="space-y-2">
              {counts.map(({ n, count }) => (
                <div key={n} className="flex items-center gap-3 text-xs text-mist">
                  <span className="w-3">{n}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-2">
                    <span
                      data-bar
                      style={{ width: `${(count / all.length) * 100}%` }}
                      className="block h-full origin-left rounded-full bg-clay"
                    />
                  </span>
                  <span className="w-5 text-right">{count}</span>
                </div>
              ))}
              {!writing && (
                <button
                  onClick={() => {
                    setWriting(true);
                    setThanks(false);
                  }}
                  className="mt-4 flex items-center gap-2 text-sm font-semibold text-clay transition-colors hover:text-ink"
                >
                  <PenLine className="size-4" /> {t("Shkruani një vlerësim", "Write a review")}
                </button>
              )}
              {thanks && (
                <p className="mt-4 animate-[fade-in_0.6s_ease_both] text-sm text-olive">
                  {t("Faleminderit! Vlerësimi juaj u shtua.", "Thank you! Your review has been added.")}
                </p>
              )}
            </div>
          </div>
        </div>

        {writing && <ReviewForm onSubmit={add} onClose={() => setWriting(false)} />}
      </Container>

      <div className="mt-16 space-y-3">
        <Row items={all.slice(0, half)} />
        <Row items={all.slice(half)} reverse />
      </div>
    </section>
  );
}
