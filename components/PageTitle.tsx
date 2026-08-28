'use client'
import { useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function PageTitle({ en, ar }: { en: string; ar: string }) {
  const { lang } = useLanguage()
  useEffect(() => {
    document.title = lang === 'ar' ? ar : en
  }, [lang, en, ar])
  return null
}
