// Single source of truth for site-wide identity — consumed by metadata,
// robots, sitemap, JSON-LD structured data, RSS and llms.txt.
import { legal } from "./content";

export const SITE_URL = "https://aistov.space";
export const SITE_NAME = "AICS-93 · Василий Аистов";
export const SITE_TITLE = "Ребрендинг и дизайн на миллионы. Сайты, логотипы, брендбук.";
export const SITE_DESCRIPTION =
  "7 лет в дизайне, работа с крупными брендами. 2 года в ведении собственной онлайн-школы с оборотами от 5М. Делаю новый дизайн для брендов, увеличивающих свою долю на рынке — от брендбука до презентаций. Полный ребрендинг + внедрение процессов и команды.";

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
