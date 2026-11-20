import type { Dictionary } from "~/lib/i18n";
import { type BlogContent, en } from "./en";
import { ptBr } from "./pt-br";

export type { BlogContent } from "./en";

export const blogContent: Dictionary<BlogContent> = {
  en,
  "pt-br": ptBr,
};
