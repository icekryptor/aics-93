// Single source of truth for site-wide identity — consumed by metadata,
// robots, sitemap, JSON-LD structured data, RSS and llms.txt.
import { legal } from "./content";

export const SITE_URL = "https://aistov.space";
export const SITE_NAME = "AICS-93 · Василий Аистов";
export const SITE_TITLE = "AICS-93 — сайты, фирменный стиль и ИИ-сервисы под ключ за 7–14 дней";
export const SITE_DESCRIPTION =
  "Студия AICS-93: разработка сайтов под ключ за 7–14 дней, фирменный стиль и дизайн-системы, веб-сервисы и внедрение ИИ в процессы. Один инженер + ИИ-конвейер вместо агентства — студийное качество, экономия бюджета до 70%.";

export const AUTHOR = {
  name: "Василий Аистов",
  jobTitle: "Дизайнер, бренд-стратег",
  legalName: legal.name, // ИП Аистов Василий Андреевич
  email: legal.email,
  phone: legal.phone,
  // Real profile URLs go here as they appear (Telegram is a placeholder for now).
  sameAs: [] as string[],
};

export const url = (path = "/") => new URL(path, SITE_URL).toString();
