import type { Dictionary } from "~/lib/i18n";
import { en, type UsersContent } from "./en";
import { ptBr } from "./pt-br";

export type { UsersContent } from "./en";

export const usersContent: Dictionary<UsersContent> = {
  en,
  "pt-br": ptBr,
};
