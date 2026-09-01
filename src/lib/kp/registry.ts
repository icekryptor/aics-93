/* Реестр готовых КП — источник правды для внутреннего индекса /kp
   (закрыт паролем панели) и для реестра проектов /panel.
   Собрал КП — добавь запись здесь, иначе он потеряется. */

export type KpVariant = { label: string; href: string; note: string };

export type KpEntry = {
  id: string;
  client: string;
  subject: string; // о чём предложение, одной строкой
  price: string;
  priceNote?: string; // как платят: части, скидка
  term: string;
  sent: string; // дата отправки, DD.MM.YYYY
  status: string; // что с ним сейчас
  state: "won" | "waiting" | "draft";
  variants: KpVariant[];
};

export const KP_STATE_LABEL: Record<KpEntry["state"], string> = {
  won: "принято",
  waiting: "ждём ответа",
  draft: "черновик",
};

export const KP_STATE_COLOR: Record<KpEntry["state"], string> = {
  won: "var(--color-constructive)",
  waiting: "var(--color-signal-2)",
  draft: "var(--color-runtime-ink-soft)",
};

export const kpEntries: KpEntry[] = [
  {
    id: "gagarin",
    client: "Школа «Гагарин»",
    subject: "Своя учебная платформа: форк learn.ximi4ka.ru под русский и английский",
    price: "80 000 ₽",
    priceNote: "двумя по 40 000 ₽ или четырьмя по 20 000 ₽ · френдли-прайс",
    term: "2–3 недели",
    sent: "01.09.2026",
    status:
      "Отправлено. Заканчивается квизом — ответы падают в телеграм, отдельного воркера не заводим.",
    state: "waiting",
    variants: [
      { label: "студийный вид", href: "/kp/gagarin", note: "тёмная сцена, канон ДС" },
      { label: "документ · сериф", href: "/kp/gagarin/doc", note: "светлый лист, 18px/140%, под печать" },
    ],
  },
  {
    id: "martox",
    client: "MARTOX",
    subject: "Сайт оператора вывода брендов на рынок США — лендинг или полный сайт",
    price: "1 200 $ / 2 100 $",
    priceNote: "лендинг ≈11 дней · сайт ≈16 дней · френдли-прайс −25%",
    term: "11–16 дней",
    sent: "24.07.2026",
    status: "Принято: дизайн согласован 30.07.2026, сайт сдан 16.08.2026.",
    state: "won",
    variants: [{ label: "открыть КП", href: "/kp/martox", note: "финтех-зона, RouteMap, гант" }],
  },
];
