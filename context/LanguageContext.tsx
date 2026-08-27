'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type LangCode, type Translations, LANG_META, translations } from '../lib/i18n'

interface LanguageContextValue {
  lang: LangCode
  setLang: (l: LangCode) => void
  trans: Translations
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  trans: translations.en,
  dir: 'ltr',
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en')

  // Persist choice
  const setLang = (l: LangCode) => {
    setLangState(l)
    try { localStorage.setItem('wl_lang', l) } catch {}
  }

  // Restore from localStorage on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wl_lang') as LangCode | null
      if (saved && saved in translations) setLangState(saved)
    } catch {}
  }, [])

  // Keep <html dir> and <html lang> in sync
  useEffect(() => {
    const meta = LANG_META[lang]
    document.documentElement.dir  = meta.dir
    document.documentElement.lang = lang
  }, [lang])

  const { dir } = LANG_META[lang]

  return (
    <LanguageContext.Provider value={{ lang, setLang, trans: translations[lang], dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
