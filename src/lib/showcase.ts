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
    desc: "Работаю на текущий момент сооснователем — выполняю функции CTO/CMO.",
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
    // 2 desktop + 2 mobile по сетке мокапа. Пустой src → плейсхолдер;
    // заменить на реальные скрины: /public/assets/cases/ximichka/*.png
    shots: [
      { src: "/assets/tild3862-643___-_Google_Chrome_2.png", kind: "desktop", alt: "Химичка — сайт" },
      { src: "", kind: "mobile", alt: "Химичка — карточка на Wildberries" },
      { src: "", kind: "mobile", alt: "Химичка — мобильная версия магазина" },
      { src: "", kind: "desktop", alt: "Химичка — учебная платформа, тренажёр ОГЭ" },
    ],
    accent: "#c856ff",
    href: "https://ximi4ka.ru",
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
    shots: [{ src: "/assets/tild6432-323__image_60.png", kind: "desktop", alt: "GO.LD — сайт" }],
    accent: "#c5ff44",
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
];
