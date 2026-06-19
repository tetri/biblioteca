import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ptBR from './locales/pt-BR/translation.json'
import en from './locales/en/translation.json'
import es from './locales/es/translation.json'
import fr from './locales/fr/translation.json'

const savedLanguage = typeof window !== 'undefined'
  ? localStorage.getItem('app-language') || 'pt-BR'
  : 'pt-BR'

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
  },
  lng: savedLanguage,
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
})

document.documentElement.lang = i18n.language || 'pt-BR'

export default i18n
