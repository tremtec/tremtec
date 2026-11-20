import type { Dictionary } from "~/lib/i18n";
import { en, type LoginContent } from "./en";
import { ptBr } from "./pt-br";

export type { LoginContent } from "./en";

export const loginContent: Dictionary<LoginContent> = {
  en,
  "pt-br": ptBr,
};
