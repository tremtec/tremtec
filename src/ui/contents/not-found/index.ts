import type { Dictionary } from "~/lib/i18n";
import { en, type NotFoundContent } from "./en";
import { ptBr } from "./pt-br";

export type { NotFoundContent } from "./en";

export const notFoundContent: Dictionary<NotFoundContent> = {
  en,
  "pt-br": ptBr,
};
