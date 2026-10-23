import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "sq" | "en";

/** A string in both site languages. */
export type Text = Record<Lang, string>;

export const T = (sq: string, en: string): Text => ({ sq, en });

const storageKey = "pronaco-lang";

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "sq" || saved === "en") return saved;
  } catch {
    // storage blocked — fall through to the default
  }
  return "sq";
}

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({ lang: "sq", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(storageKey, lang);
    } catch {
      // not persisted, still works for this visit
    }
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  return {
    lang,
    setLang,
    /** Inline copy: pick the Albanian or English string. */
    t: (sq: string, en: string) => (lang === "en" ? en : sq),
    /** Copy stored in data as a `Text`. */
    tr: (text: Text) => text[lang],
  };
}
