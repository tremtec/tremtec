import type { Dictionary } from "~/lib/i18n";
import { en, type ProductsContent } from "./en";
import { ptBr } from "./pt-br";

export type { ProductsContent } from "./en";

export const productsContent: Dictionary<ProductsContent> = {
  en,
  "pt-br": ptBr,
};
