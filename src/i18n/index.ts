import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { fr } from './fr';
import { ar } from './ar';
import { en } from './en';

export type Language = 'fr' | 'ar' | 'en';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string; rtl: boolean }[] = [
  { code: 'fr', label: 'Français', nativeLabel: 'Français', rtl: false },
  { code: 'ar', label: 'Arabe', nativeLabel: 'العربية', rtl: true },
  { code: 'en', label: 'Anglais', nativeLabel: 'English', rtl: false },
];

const resources = {
  fr: { translation: fr },
  ar: { translation: ar },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

export default i18n;
