import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/common.json';
import ru from './locales/ru/common.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      ru: { common: ru },
    },
    lng: 'ru',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
