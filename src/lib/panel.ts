// Harness-панель — приватный реестр проектов (/panel, доступ по паролю).
// Ссылки на артефакты по клиентам: КП, прототипы, превью, прод.

export type PanelLink = { label: string; href: string };
export type PanelProject = {
  id: string;
  client: string;
  title: string;
  status: string; // текущий статус словами
  date: string; // последнее обновление, DD.MM.YYYY
  links: PanelLink[];
};

export const panelProjects: PanelProject[] = [
  {
    id: "martox",
    client: "MARTOX",
    title: "Сайт выхода брендов на рынок США",
    status: "КП отправлено · ожидаем выбор: лендинг / сайт",
    date: "24.07.2026",
    links: [
      { label: "КП-лендинг", href: "/kp/martox" },
      {
        label: "прототип (Figma)",
        href: "https://www.figma.com/design/QTJLqvRZ34PGOLw29Sdo7I/%D0%A5%D0%B8%D0%BC%D0%B8%D1%87%D0%BA%D0%B0?node-id=5223-732",
      },
    ],
  },
];
