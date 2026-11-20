import type { Dictionary } from "~/lib/i18n";
import { en, type LandingContent } from "./en";
import { ptBr } from "./pt-br";

export type { LandingContent } from "./en";

export const landingContent: Dictionary<LandingContent> = {
  en,
  "pt-br": ptBr,
};
