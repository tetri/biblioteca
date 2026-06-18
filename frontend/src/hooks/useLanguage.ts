import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export type AppLanguage = 'pt-BR' | 'en' | 'es' | 'fr'

export function useLanguage() {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language as AppLanguage

  const setLanguage = useCallback(
    (lang: AppLanguage) => {
      i18n.changeLanguage(lang)
      localStorage.setItem('app-language', lang)
    },
    [i18n],
  )

  const availableLanguages: { value: AppLanguage; labelKey: string }[] = [
    { value: 'pt-BR', labelKey: 'language.pt-BR' },
    { value: 'en', labelKey: 'language.en' },
    { value: 'es', labelKey: 'language.es' },
    { value: 'fr', labelKey: 'language.fr' },
  ]

  return { currentLanguage, setLanguage, availableLanguages }
}
