import { z } from "zod";
import { DEFAULT_LOCALE, localeEnum } from "~/domain/shared/locale";
import { SERVICE_OPTIONS } from "./constants";

// Schema
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  company: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
  service: z.enum(SERVICE_OPTIONS),
  locale: localeEnum.default(DEFAULT_LOCALE),
});

export type ContactForm = z.infer<typeof contactSchema>;
