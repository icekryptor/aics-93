// Showcase — data for the portfolio case cards (immersive homepage, #prtf).
// Each case: number + title + role/description + bullet list (4/6/8 items) +
// a grid of shots (2 desktop + 2 mobile per the Frame-1 mock; single-shot
// cases render one large image until more screenshots arrive).

export type Shot = {
  /** public path; empty string → placeholder (generative cover + «скрин · скоро») */
  src: string;
  kind: "desktop" | "mobile";
  alt: string;
};

export type ShowcaseCase = {
  title: string;
  /** 2–4 строки под заголовком */
  desc: string;
  /** 4 / 6 / 8 пунктов «что было сделано» */
  bullets: string[];
  shots: Shot[];
  accent: string;
  href?: string;
  wip?: boolean;
};

export const showcaseCases: ShowcaseCase[] = [
  {
    title: "ХИМИЧКА",
    desc: "работаю на текущий момент сооснователем, выполняю функции CTO/CMO",
    bullets: [
      "нейминг",
      "фирменный стиль",
      "дизайн продукта",
      "ERP и регламенты",
      "настройка трафика на маркетплейсах",
      "маркетинговые активности в соцсетях",
      "свой интернет-магазин",
      "своя учебная платформа",
    ],
    // реальные скрины из макета (Figma AICS-93 · Frame 1), сетка [деск|моб / моб|деск]
    shots: [
      { src: "/assets/cases/ximichka/oge-trainer.png", kind: "desktop", alt: "Химичка — учебная платформа, тренажёр ОГЭ" },
      { src: "/assets/cases/ximichka/wb-card.jpg", kind: "mobile", alt: "Химичка — карточка набора на Wildberries" },
      { src: "/assets/cases/ximichka/wb-app.jpg", kind: "mobile", alt: "Химичка — выдача Wildberries" },
      { src: "/assets/cases/ximichka/site.png", kind: "desktop", alt: "Химичка — официальный интернет-магазин" },
    ],
    accent: "#9057ff",
    href: "/cases/ximichka",
    wip: true,
  },
  {
    title: "GO.LD",
    desc: "Сайт и фирменный стиль для ювелирного лофта в Москве.",
    bullets: [
      "глубинное интервью",
      "маркетинговое исследование",
      "обновление брендбука и лого",
      "обновление сайта",
    ],
    shots: [
      { src: "/assets/cases/gold/site-desktop.webp", kind: "desktop", alt: "GO.LD — сайт" },
      { src: "/assets/cases/gold/site-mobile.webp", kind: "mobile", alt: "GO.LD — мобильная версия" },
    ],
    accent: "#c5ff44",
    href: "/cases/gold",
  },
  {
    title: "PRIDE CLUB",
    desc: "Обновление смыслового и визуального компонента образовательного бренда.",
    bullets: [
      "распаковка эксперта",
      "маркетинговое исследование",
      "обновление брендбука и лого",
      "редизайн соцсетей",
    ],
    shots: [
      { src: "/assets/tild6563-396__PRIDE_CLUB_-_Google_.png", kind: "desktop", alt: "PRIDE CLUB — сайт" },
    ],
    accent: "#5ab8ff",
    href: "https://pride-academy.ru",
  },
  {
    title: "HARMONICUM",
    desc: "Ребрендинг для коуча Варвары Косовой.",
    bullets: [
      "распаковка эксперта",
      "обновление брендбука и лого",
      "обновление сайта",
      "редизайн презентаций",
    ],
    shots: [{ src: "/assets/tild6637-333__Frame_1.png", kind: "desktop", alt: "HARMONICUM — сайт" }],
    accent: "#ff7050",
    href: "https://varvarakosova.ru",
  },
  {
    title: "АКАДЕМИЯ ЦЕНТР СВЕТА",
    desc: "Логотип, фирменный стиль и посадочные страницы для образовательного бренда.",
    bullets: [
      "исследование ценностей бизнеса",
      "проработка фирменного стиля",
      "основная страница + шаблон лендингов",
      "подготовка к запуску рекламы",
    ],
    shots: [
      { src: "/assets/tild3961-383__image_58.png", kind: "desktop", alt: "Академия Центр Света — сайт" },
    ],
    accent: "#9747ff",
    href: "https://academy-center-of-light.ru",
  },
  {
    title: "GENIUS CODE",
    desc: "Ребрендинг, лого и многостраничный сайт-платформа.",
    bullets: [
      "глубинное интервью",
      "маркетинговое исследование",
      "обновление брендбука и лого",
      "обновление сайта",
    ],
    shots: [{ src: "/assets/tild3331-353__noroot.png", kind: "desktop", alt: "GENIUS CODE — сайт" }],
    accent: "#ffd166",
    href: "https://edu.genius-code.ru",
  },
  {
    title: "ORTHODOCS",
    desc: "PMF-аналитика, идея приложения, логотип и прототипирование экранов.",
    bullets: [
      "опрос 30+ врачей и ортодонтов",
      "исследование конкурентов РФ/мира",
      "UX-раскадровка",
      "питч-презентация для инвестора",
    ],
    shots: [
      { src: "/assets/tild3964-623__Orthodocs_-_Figma.png", kind: "desktop", alt: "ORTHODOCS — прототип" },
    ],
    accent: "#5ab8ff",
  },
  {
    title: "УПЛИТЫ",
    desc: "Сайт для производителя кухонь с сетью салонов (ранее inCucina, на рынке с 2005 года).",
    bullets: ["корпоративный сайт", "каталог и портфолио", "расчёт проекта", "запись в салон"],
    shots: [
      { src: "/assets/cases/upliti/site-desktop.webp", kind: "desktop", alt: "Уплиты — сайт" },
      { src: "/assets/cases/upliti/site-mobile.webp", kind: "mobile", alt: "Уплиты — мобильная версия" },
    ],
    accent: "#5ab8ff",
    href: "/cases/upliti",
    wip: true,
  },
  {
    title: "EVOLVER",
    desc: "Сайт-манифест международного проекта Mind Evolution: «In Mind We Trust».",
    bullets: ["айдентика", "иммерсивное интро", "англоязычная версия", "сайт-манифест"],
    shots: [
      { src: "/assets/cases/evo/site-desktop.webp", kind: "desktop", alt: "EVOLVER — сайт" },
      { src: "/assets/cases/evo/site-mobile.webp", kind: "mobile", alt: "EVOLVER — мобильная версия" },
    ],
    accent: "#5ab8ff",
    href: "/cases/evo-center",
    wip: true,
  },
  {
    title: "HST TRANSPORT",
    desc: "Англоязычный корпоративный сайт логистической компании Honest Smart Transportation.",
    bullets: ["корпоративный сайт", "структура услуг", "кейсы и отрасли", "b2b-подача"],
    shots: [
      { src: "/assets/cases/hst/site-desktop.webp", kind: "desktop", alt: "HST — сайт" },
      { src: "/assets/cases/hst/site-mobile.webp", kind: "mobile", alt: "HST — мобильная версия" },
    ],
    accent: "#ff7050",
    href: "/cases/hst-transport",
    wip: true,
  },
  {
    title: "ЕВГЕНИЙ ГАНЦЕЛЬ",
    desc: "Линейка лендингов личного бренда фитнес-тренера и нутрициолога.",
    bullets: ["флагманский лендинг", "лендинг видео-разбора", "международная версия", "личный бренд"],
    shots: [
      { src: "/assets/cases/gantsel/steps-ru-desktop.webp", kind: "desktop", alt: "Евгений Ганцель — лендинг программы" },
      { src: "/assets/cases/gantsel/video-mobile.webp", kind: "mobile", alt: "Лендинг видео-разбора — мобильная версия" },
      { src: "/assets/cases/gantsel/body7-mobile.webp", kind: "mobile", alt: "7 Steps to Dream Body — мобильная версия" },
      { src: "/assets/cases/gantsel/body7-desktop.webp", kind: "desktop", alt: "7 Steps to Dream Body — сайт" },
    ],
    accent: "#9747ff",
    href: "/cases/gantsel",
    wip: true,
  },
];
