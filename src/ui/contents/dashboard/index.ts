import type { Dictionary } from "~/lib/i18n";
import { type DashboardContent, en } from "./en";
import { ptBr } from "./pt-br";

export type { DashboardContent } from "./en";

export const dashboardContent: Dictionary<DashboardContent> = {
  en,
  "pt-br": ptBr,
};
