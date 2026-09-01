// Harness-панель — приватный реестр проектов (/panel, доступ по паролю).
// Ссылки на живые артефакты по клиентам: превью, макеты, дизайн-система, доки.

export type PanelLinkKind = "live" | "design" | "doc";
export type PanelLink = { label: string; href: string; kind: PanelLinkKind };
export type PanelProject = {
  id: string;
  client: string;
  title: string;
  status: string; // текущий статус словами
  stage: string; // где по этапам производства
  date: string; // последнее обновление, DD.MM.YYYY
  links: PanelLink[];
};

export const panelProjects: PanelProject[] = [
  {
    id: "gagarin",
    client: "Школа «Гагарин»",
    title: "Учебная платформа — форк learn.ximi4ka.ru под русский и английский",
    status:
      "КП отправлено (80 000 ₽, оплата частями) · ответ ждём через квиз в конце предложения",
    stage: "продажа: КП на руках у школы, работы не начаты",
    date: "01.09.2026",
    links: [
      { label: "КП · студийный вид", href: "/kp/gagarin", kind: "doc" },
      { label: "КП · документ", href: "/kp/gagarin/doc", kind: "doc" },
      { label: "платформа-основа", href: "https://learn.ximi4ka.ru", kind: "live" },
    ],
  },
  {
    id: "martox",
    client: "MARTOX",
    title: "Оператор вывода бизнеса в США — лендинг + страницы пакетов",
    status: "Сайт в вёрстке: герой, этапы-аккордеон, квиз · превью обновляется на каждый пуш",
    stage: "дизайн v3 (15 экранов) · фабрика: 3.1 референсы · вёрстка идёт",
    date: "30.07.2026",
    links: [
      { label: "превью сайта", href: "https://martox-site.vercel.app", kind: "live" },
      {
        label: "макет v3 · 15 экранов",
        href: "https://www.figma.com/design/Hy8nJUaFc0WcP7aWrMXPSo?node-id=32-18",
        kind: "design",
      },
      { label: "дизайн-система (PDF)", href: "/clients/martox-design-system.pdf", kind: "design" },
      {
        label: "прототип (первый)",
        href: "https://www.figma.com/design/QTJLqvRZ34PGOLw29Sdo7I/%D0%A5%D0%B8%D0%BC%D0%B8%D1%87%D0%BA%D0%B0?node-id=5223-732",
        kind: "design",
      },
      { label: "страница проекта", href: "/clients/martox.html", kind: "doc" },
      { label: "КП", href: "/kp/martox", kind: "doc" },
      { label: "ТЗ клиента (PDF)", href: "/clients/martox-tz.pdf", kind: "doc" },
    ],
  },
];

export const LINK_KIND_COLOR: Record<PanelLinkKind, string> = {
  live: "var(--color-signal-cool)",
  design: "var(--color-signal-2)",
  doc: "var(--color-runtime-ink-soft)",
};
