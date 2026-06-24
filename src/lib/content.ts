// Central content + asset map for the landing.
// Image filenames map to public/assets (downloaded from the original Tilda site).
const A = (f: string) => `/assets/${f}`;

export const assets = {
  wordmark: A("tild3432-653__AICS-93.svg"),
  gear: A("tild6638-313__gear.svg"),
  monogramA: A("tild6666-366__a.svg"),
  monogramV: A("tild6337-643__v.svg"),
  texture: A("tild6166-613__griddy_diddy.svg"),
  noise: A("tild3265-326__noise.gif"),
  loopStart: A("tild3337-663__1y.svg"),
  loopEnd: A("tild3265-626__2y.svg"),
  crowd: A("tild3666-646__Frame_34.svg"),
  rocket: A("tild6339-363__image-from-rawpixel-.png"),
  portrait1: A("tild6336-333__photo_2023-05-19_16-.jpg"),
  portrait2: A("tild3033-343__photo_2023-10-14_23-.jpg"),
  talkingHead: A("tild3836-336__ezgif-1-0c82f05ea0.gif"),
};

export const nav = [
  { label: "Подход", href: "#how" },
  { label: "Портфолио", href: "#prtf" },
  { label: "Опыт", href: "#exp" },
  { label: "Контакты", href: "#upgrade" },
];

export const competencies = [
  { num: "01", label: "бренд-дизайнер" },
  { num: "02", label: "маркетинговое управление" },
  { num: "03", label: "веб-разработка" },
];

export const heroStats = [
  {
    big: "10 лет",
    text: "разнопланового опыта: от построения маркетинговых стратегий до разработки приложений с нуля под ключ",
  },
  {
    big: "PDCA",
    text: "i₁: стратегия → действия → аналитика → улучшение → i₂",
  },
  {
    big: "AI",
    text: "собственная база знаний и система манифестов для агентов дают быстрые и точные результаты",
  },
];

export const frameworks = [
  {
    n: "01",
    code: "PMF",
    full: "product market fit",
    text: "поиск ниши на вашем рынке, которую ваш продукт идеально закрывает",
  },
  {
    n: "02",
    code: "STP",
    full: "segmentation, targeting, positioning",
    text: "поиск и позиционирование бренда для тех сегментов ЦА, которые ищут ваш продукт прямо сейчас",
  },
  {
    n: "03",
    code: "SWOT",
    full: "strengths, weaknesses, opportunities, threats",
    text: "оценка полученных гипотез с точки зрения возможностей и рисков",
  },
  {
    n: "04",
    code: "BMI",
    full: "brand maturity index",
    text: "уровень зрелости бренда — основа для планирования дальнейших действий по бренду",
  },
  {
    n: "05",
    code: "JTBD",
    full: "jobs to be done",
    text: "какую «работу» нанимают выполнять ваш продукт — язык реальных потребностей клиента",
  },
  {
    n: "06",
    code: "CustDev",
    full: "customer development",
    text: "проверка гипотез о клиенте через интервью — до того, как вложить деньги в продукт",
  },
  {
    n: "07",
    code: "PDCA",
    full: "plan · do · check · act",
    text: "цикл непрерывных улучшений: планируй → делай → проверяй → корректируй",
  },
  {
    n: "08",
    code: "AARRR",
    full: "pirate metrics",
    text: "воронка: привлечение, активация, удержание, рекомендации, выручка",
  },
  {
    n: "09",
    code: "4P",
    full: "product, price, place, promotion",
    text: "базовый маркетинг-микс для упаковки и вывода предложения на рынок",
  },
  {
    n: "10",
    code: "PESTEL",
    full: "macro environment",
    text: "макросреда: политические, экономические, социальные, технологические, эко- и правовые факторы",
  },
  {
    n: "11",
    code: "OKR",
    full: "objectives & key results",
    text: "амбициозные цели и измеримые ключевые результаты для фокуса команды",
  },
  {
    n: "12",
    code: "Lean",
    full: "lean canvas",
    text: "бизнес-модель на одной странице: гипотезы, метрики, каналы и ценность",
  },
];

export const reasons = [
  {
    title: "Собственные площадки — собственная экономика",
    text: "Жёсткая привязка к условиям маркетплейсов вынуждает вас рисковать своей прибылью. Продавая со своих площадок, вы возвращаете контроль над ключевыми метриками и статьями расходов.",
  },
  {
    title: "Поиск по брендовым запросам",
    text: "Собственные ключевые фразы, по которым покупатели находят именно вас. Прирост органики по брендовым ключам без роста бюджетов.",
  },
  {
    title: "Улучшение KPI воронки продаж",
    text: "Узнаваемый бренд увеличивает окупаемость рекламных бюджетов во всех каналах, легче преодолевает баннерную слепоту, является фундаментом для роста LTV.",
  },
  {
    title: "Множитель масштабирования",
    text: "Зрелый бренд облегчает получение крупных контрактов, приглашений в СМИ, инвестиций и коллабораций.",
  },
  {
    title: "Легче защитить права",
    text: "Товарные знаки и интеллектуальную собственность намного проще защитить — вы можете быть спокойны за неприкосновенность ваших усилий.",
  },
  {
    title: "Отстройка от конкурентов, аудитория выбирает вас",
    text: "Узнаваемый бренд с репутацией — серьёзный аргумент для вашей целевой аудитории выбрать именно ваш продукт при сравнении с аналогами.",
  },
];

export const salesEngine = {
  title: "Двигатель продаж бизнеса",
  center: "Собственный сайт",
  nodes: [
    "Брендбук",
    "Маркетинг-стратегия",
    "Продакт-дизайн",
    "Контент и реклама",
    "Удержание, LTV, повторные покупки",
    "KPI, контроль",
  ],
};

export const aboutFacts: { lead?: string; rest: string }[] = [
  { rest: "Business Builder, действующий CMO" },
  { lead: "Арт-директор / дизайнер", rest: " со стажем 10 лет" },
  {
    lead: "В теме ML / LLM с 2023",
    rest: ", разработал сеть нейроагентов по маркетинговым анализам, стратегированию и выбору целевых эмоций бренда (внедряю для клиентов)",
  },
  {
    lead: "Cofounder Химички",
    rest: " — STEM-бренда, нашедшего свой PMF и собравшего более 20 000 заказов",
  },
];

export const aboutStats = [
  { big: ">15 000", label: "часов практики", sub: "это 1,71 год непрерывной работы", deco: "rings" as const },
  { big: "250+", label: "проектов разной сложности", sub: "", deco: "dots" as const },
  { big: "81", label: "студент обучен дизайну", sub: "", deco: "people" as const },
];

export const aboutPhoto = "/assets/tild6336-333__photo_2023-05-19_16-.jpg";

export type Project = {
  name: string;
  subtitle: string;
  tags?: string[];
  services: string[];
  image: string;
  link?: string;
  featured?: boolean;
};

export const featured: Project = {
  name: "ХИМИЧКА",
  subtitle: "Моя главная гордость — STEM-бренд наборов для опытов",
  services: [
    "Нейминг, фирменный стиль, логотип",
    "Продуктовый дизайн",
    "Веб-дизайн",
    "Продвижение товара на WB",
    "Внедрение системного управления",
  ],
  image: "/assets/tild3862-643___-_Google_Chrome_2.png",
  link: "#",
  featured: true,
};

export const cases: Project[] = [
  {
    name: "GO.LD",
    subtitle: "Сайт и фирменный стиль для ювелирного лофта в Москве",
    tags: ["#стратегический-дизайн", "#ребрендинг", "#разработка-сайта"],
    services: ["глубинное интервью", "маркетинговое исследование", "обновление брендбука и лого", "обновление сайта"],
    image: "/assets/tild6432-323__image_60.png",
  },
  {
    name: "PRIDE CLUB",
    subtitle: "Обновление смыслового и визуального компонента образовательного бренда",
    tags: ["#стратегический-дизайн", "#ребрендинг", "#разработка-сайта"],
    services: ["распаковка эксперта", "маркетинговое исследование", "обновление брендбука и лого", "редизайн соцсетей"],
    image: "/assets/tild6563-396__PRIDE_CLUB_-_Google_.png",
    link: "https://pride-academy.ru",
  },
  {
    name: "HARMONICUM",
    subtitle: "Ребрендинг для коуча Варвары Косовой",
    tags: ["#стратегический-дизайн", "#ребрендинг", "#разработка-сайта"],
    services: ["распаковка эксперта", "обновление брендбука и лого", "обновление сайта", "редизайн презентаций"],
    image: "/assets/tild6637-333__Frame_1.png",
    link: "https://varvarakosova.ru",
  },
  {
    name: "АКАДЕМИЯ ЦЕНТР СВЕТА",
    subtitle: "Логотип, фирменный стиль и посадочные страницы для образовательного бренда",
    tags: ["#стратегический-дизайн", "#ребрендинг", "#разработка-сайта"],
    services: ["исследование ценностей бизнеса", "проработка фирменного стиля", "основная страница + шаблон лендингов"],
    image: "/assets/tild3961-383__image_58.png",
    link: "https://academy-center-of-light.ru",
  },
  {
    name: "GENIUS CODE",
    subtitle: "Ребрендинг, лого и многостраничный сайт-платформа",
    tags: ["#стратегический-дизайн", "#ребрендинг", "#разработка-сайта"],
    services: ["глубинное интервью", "маркетинговое исследование", "обновление брендбука и лого", "обновление сайта"],
    image: "/assets/tild3331-353__noroot.png",
    link: "https://edu.genius-code.ru",
  },
  {
    name: "ORTHODOCS",
    subtitle: "PMF-аналитика, идея приложения, логотип и прототипирование экранов",
    tags: ["#стратегический-дизайн", "#ребрендинг", "#разработка-сайта"],
    services: ["опрос 30+ врачей и ортодонтов", "исследование конкурентов РФ/мира", "UX-раскадровка", "питч-презентация для инвестора"],
    image: "/assets/tild3964-623__Orthodocs_-_Figma.png",
  },
];

export const moreProjects: Project[] = [
  { name: "ME, MY GOALS, DESIRES AND VALUES", subtitle: "Сайт для тренинга", services: [], image: "/assets/tild3036-643__Main_Page.png", link: "#" },
  { name: "SK MAXSTROY", subtitle: "Сайт для строительной компании", services: [], image: "/assets/tild3338-333___-_-_Google_Chrom.png", link: "#" },
  { name: "MEDINCOGNITO", subtitle: "Сайт для компании анонимных медицинских услуг", services: [], image: "/assets/tild6336-633__Med-Incognito_Servic.png", link: "#" },
  { name: "LINKWOOD PARTNERS", subtitle: "Сайт для компании-девелопера", services: [], image: "/assets/tild3464-323___-_Linkwood_Partners.png", link: "#" },
  { name: "СТАРТ В МИР СЪЕМОК", subtitle: "Сайт для курса", services: [], image: "/assets/tild3738-386___-_Google_Chrome.png", link: "#" },
  { name: "Y-DATA", subtitle: "Многостраничный сайт для ML-компании", services: [], image: "/assets/tild3237-316___-_Google_Chrome_.png", link: "#" },
  { name: "WOOP", subtitle: "Website for a franchise", services: [], image: "/assets/tild3663-386___WOOP_-_Opera.png", link: "#" },
  { name: "ТАНДЫР.РФ", subtitle: "Лого, фирменный стиль и приложение под ключ", services: [], image: "/assets/tild6538-376__Frame_45.png", link: "#" },
];

export const gantt = {
  title: "Пример сметы проекта в виде Ганта",
  project: "Разработка многостраничного сайта для строительной компании",
  scope: [
    "Разработать сайт с 6 подстраницами, блогом и каталогом типовых проектов",
    "Подготовить к запуску рекламной кампании, подключить аналитику",
    "Интегрировать сайт с AmoCRM, Roistat и MailChimp",
    "Подключить систему эквайринга",
  ],
  // start/len in days; total = 20 → staggered Gantt cascade
  phases: [
    { name: "Маркетинговое исследование", days: 4, start: 0, color: "#ff3d92" },
    { name: "Прототипирование и копирайтинг", days: 4, start: 4, color: "#d94fe6" },
    { name: "Разработка дизайн-макетов", days: 6, start: 8, color: "#b15cff" },
    { name: "Вёрстка, интеграция, запуск", days: 6, start: 14, color: "#8b67ff" },
  ],
  total: 20,
  team: [
    { name: "Василий", role: "Главный Пчёл проекта", initial: "В" },
    { name: "Артём", role: "Маркетолог-аналитик", initial: "А" },
    { name: "Виталий", role: "Front-end разработчик", initial: "В" },
    { name: "Любовь", role: "Веб-дизайнер", initial: "Л" },
  ],
  duration: "20 дней",
  budget: "190 000 руб",
  budgetFinal: "159 000 руб",
};

export const projectTypes = [
  "Лендинг",
  "Многостраничный сайт",
  "Интернет-магазин",
  "Своё приложение",
  "Фирменный стиль (лого, айдентика)",
  "Фирменный стиль + сайт",
  "UX/UI-дизайн отдельно",
  "Дизайн-система",
];

export const bio = {
  big: [
    { value: "10", label: "лет работаю в дизайне, упаковке и маркетинге" },
    { value: "250+", label: "проектов разных уровней сложности разработано" },
    { value: "81", label: "студент обучен веб-дизайну" },
  ],
  paragraphs: [
    "Хоть я и получил высшее медицинское образование, стремление созидать крутые, качественные вещи, строить системы и пробовать новое заставило пойти в веб-дизайн ещё в 2015 году.",
    "Чтобы конкурировать, мы должны быть сильными, яркими и в какой-то степени безбашенными. У меня есть большое желание помогать сильным проектам выходить в ТОП и быть частью их истории.",
    "Дизайнер и маркетолог с опытом создания онлайн-школы с семизначным оборотом. 15 000 часов опыта практики в дизайне и разработке.",
  ],
};

export const legal = {
  name: "ИП Аистов Василий Андреевич",
  inn: "ИНН: 431401950080",
  ogrn: "ОГРН: 319435000027879",
  phone: "+7 985 993-83-11",
  phoneHref: "+79859938311",
  email: "dpmnstudio@gmail.com",
  telegram: "https://t.me/",
};
