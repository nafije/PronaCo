import { useState } from "react";
import { formatEuro } from "@/lib/data";
import { useLang } from "@/lib/i18n";

/** Monthly instalment for a fixed-rate loan: P·r / (1 − (1 + r)^−n). */
function instalment(principal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return r === 0 ? principal / n : (principal * r) / (1 - (1 + r) ** -n);
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm">
        <span className="text-mist">{label}</span>
        <span className="font-semibold">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full"
      />
    </label>
  );
}

export function MortgageCalculator({ price }: { price: number }) {
  const { t, lang } = useLang();
  const [down, setDown] = useState(30);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(4.2);

  const loan = price * (1 - down / 100);
  const monthly = instalment(loan, rate, years);

  return (
    <div className="grid gap-8 rounded-3xl bg-paper p-6 sm:p-10 md:grid-cols-[1.2fr_1fr]">
      <div className="space-y-7">
        <Slider
          label={t("Kapari", "Down payment")}
          value={down}
          display={`${down}% · ${formatEuro((price * down) / 100, lang)}`}
          min={10}
          max={70}
          step={5}
          onChange={setDown}
        />
        <Slider label={t("Afati", "Term")} value={years} display={`${years} ${t("vjet", "years")}`} min={5} max={30} step={1} onChange={setYears} />
        <Slider
          label={t("Interesi vjetor", "Annual interest")}
          value={rate}
          display={`${rate.toFixed(1)}%`}
          min={2}
          max={8}
          step={0.1}
          onChange={setRate}
        />
      </div>
      <div className="glow flex flex-col justify-between rounded-2xl p-6 text-paper sm:p-8">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-stone uppercase">{t("Kësti mujor", "Monthly payment")}</p>
          <p className="mt-3 font-serif text-5xl font-light">{formatEuro(monthly, lang)}</p>
        </div>
        <dl className="mt-8 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone">{t("Kredia", "Loan")}</dt>
            <dd>{formatEuro(loan, lang)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">{t("Totali i interesit", "Total interest")}</dt>
            <dd>{formatEuro(monthly * years * 12 - loan, lang)}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-stone">
          {t(
            "Llogaritje orientuese. Ju lidhim me bankat partnere për ofertën e saktë.",
            "An estimate only. We'll connect you with our partner banks for an exact offer.",
          )}
        </p>
      </div>
    </div>
  );
}
