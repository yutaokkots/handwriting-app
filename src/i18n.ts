import i18n from 'i18next';
import Backend from 'i18next-http-backend'; // public/locales/<lang>/translation.json
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';


i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng:"ha",
        debug:true,
        ns:["translation"],
        backend: {
            loadPath: "/locales/{{lng}}/translation.json"
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n

// backend: {
//     loadPath: "./locales/{{lng}}/translation.json"
// },
// export const defaultNS = "translation";
// export const resources = {
//     en: {
//         translation,
//     },
// } as const;

// i18n.use(initReactI18next).init({
//     lng: "en",
//     ns: ["ns1", "ns2"],
//     defaultNS,
//     resources,
// });
