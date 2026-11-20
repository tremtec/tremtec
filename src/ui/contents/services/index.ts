import type { Dictionary } from "~/lib/i18n";
import { en, type ServicesContent } from "./en";
import { ptBr } from "./pt-br";

export type { ServicesContent } from "./en";

export const servicesContent: Dictionary<ServicesContent> = {
  en,
  "pt-br": ptBr,
};
