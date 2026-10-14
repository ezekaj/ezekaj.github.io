import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DICT, type Lang } from './content';

interface I18n {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  pick: <T>(value: T | Record<Lang, T>) => T;
}

const STORAGE_KEY = 'ez-lang';

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'sq') return stored;
  } catch {
    /* storage unavailable */
  }
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param === 'en' || param === 'sq') return param;
  return navigator.language?.toLowerCase().startsWith('sq') ? 'sq' : 'en';
}

const Ctx = createContext<I18n | null>(null);

function isRecord<T>(value: T | Record<Lang, T>): value is Record<Lang, T> {
  return typeof value === 'object' && value !== null && 'en' in value && 'sq' in value;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const t = useCallback((key: string) => DICT[lang][key] ?? DICT.en[key] ?? key, [lang]);
  const pick = useCallback(<T,>(value: T | Record<Lang, T>): T => (isRecord(value) ? value[lang] : value), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, pick }), [lang, setLang, t, pick]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
