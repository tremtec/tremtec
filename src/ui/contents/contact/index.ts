import type { Dictionary } from "~/lib/i18n";
import { type ContactContent, en } from "./en";
import { ptBr } from "./pt-br";

export type { ContactContent, TrustSignal } from "./en";

export const contactContent: Dictionary<ContactContent> = {
  en,
  "pt-br": ptBr,
};
