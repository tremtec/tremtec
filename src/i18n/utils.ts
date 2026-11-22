import { defaultLang, ui } from "./ui";

export function useTranslations(locale: string | undefined) {
  const lang =
    locale && locale in ui ? (locale as keyof typeof ui) : defaultLang;

  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
