# AICS-93 · Дизайн-система (v1)

Машино-читаемый канон для сборки/пересборки страниц. Порядок истины:
1. **Код** — токены в `src/app/globals.css` (`@theme`) и утилиты (`.btn-case*`, `.tech-label`, `.hud`, `.signal-grad`) — единственный источник значений.
2. **Этот файл** — правила применения, реестр компонентов, грамматика страниц, анти-правила.
3. **Глобальный скилл** `~/.claude/skills/glassmorphism-design/` — базовая физика стекла (формулы, specular, запреты).
4. Figma `AICS-93` (fileKey `r2o8qS0qIkCakbzqlRuDjl`) — источник новых макетов; при расхождении с этим файлом — уточнить у Василия и обновить канон.

Любое НОВОЕ дизайн-решение, принятое в чате, вносится сюда в том же коммите.

---

## 1. Токены (сводка; истина — globals.css @theme)

| Токен | Значение | Роль |
|---|---|---|
| `--color-bg` | `#ffffff` | светлые секции — чистый белый |
| `--color-ink` / `-soft` | `#302055` / `#554488` | текст на светлом |
| `--color-line` | `#ded6f0` | бордеры на светлом |
| `--color-accent` / `-2` / `-ink` | `#9747ff` / `#b57bff` / `#8038e8` | фиолетовый акцент (accent-ink — текст на белом) |
| `--color-runtime` / `-2` / `-line` | `#0e0a1b` / `#171029` / `#2c2247` | тёмные full-bleed сцены |
| `--color-runtime-ink` / `-soft` | `#efeaff` / `#a99fce` | текст на тёмном |
| `--color-signal` / `-2` / `-cool` | `#9747ff` / `#b57bff` / `#c9b6ff` | «сигнал» на тёмном |
| constructive / destructive / mild | `#c5ff44` / `#ff7050` / `#ccbbee` | семантика |
| Секция showcase | `#120e22`, карточка `#261645`/45–90 | из Figma Frame 1 |
| **CTA-циан** | `linear-gradient(105deg,#a5f4ff,#5fd9f5 55%,#3ec2ea)`, текст `#0b1e33` | primary-кнопки |
| Шапка-гантель | тело `#17121f`, активная плашка `#2b2538` | SystemNav |

## 2. Типографика

- **Все заголовки** (h1–h6 и заголовки-`<p>`): **Neue Haas Bold** (глобальное правило с `!important` в globals.css).
- **Unbounded (`--font-display`) — ТОЛЬКО цифры и аббревиатуры**: статы («10 лет»), счётчики («01/07»), коды (PDCA, PMF), вордмарка «AICS-93» (в т.ч. внутри заголовков — оборачивать `<span className="font-display">`).
- **Body**: 15px / 400 (база на `body`); пункты списков в кейсах — 16px.
- `.tech-label` — Neue Haas, lowercase, letter-spacing .04em (глазки/лейблы). `.hud` — настоящий monospace (псевдо-код ридауты).
- Заголовок кейса: uppercase, tracking `0.05em`.

## 3. Форма (радиусы) — фирменная асимметрия

| Элемент | Радиус |
|---|---|
| **Кнопки** (все) | `5px 55px 55px 25px` |
| **Подложка/панель под текстом** | `25px 55px 55px 5px` (зеркало кнопки), **без обводки** |
| Карточка кейса | 36px, lg: 56px |
| Ячейки скринов | 10px |
| WIP-бейдж | 5px, рамка `white/50`, без заливки |
| Активный пункт наva / плашки в шапке | **3px** |
| Шапка-гантель: блобы | full (круг/капсулы) |
| Прочие карточки на светлом | 20–28px (`--radius-card`) |

## 4. Кнопки (утилиты в globals.css — не изобретать новые стили)

- `.btn-case` — **primary**: циан-градиент + свечение, тёмный текст, hover-lift + brightness, active-прижатие (spring `cubic-bezier(.34,1.56,.64,1)`).
- `.btn-case-glass` — **secondary на тёмном**: white/8 + `blur(20px) saturate(180%)` + 1px white/12 + specular.
- `.btn-case-glass-dark` — **secondary на светлом**: тёмное стекло `rgba(28,21,40,.05)`.
- Исключения (НЕ трогать): плашки КП/TG в шапке-гантели (3px), чипы-переключатели в формах, стрелки-круги слайдера.
- Запрещено: `signal-grad` для новых кнопок, pill-формы, пульсирующие glow.

## 5. Стекло

- Физика — по скиллу `glassmorphism-design`: заливка всегда белая нейтральная, 1px бордер, **specular** `0 1px 0 rgba(255,255,255,.2) inset` обязателен, `blur(20px) saturate(180%)`.
- Гласс-подложки на хиро: лого-лок-ап и «человек-студия» — образцы канона (20px, white/8).
- ⚠️ **Инженерный запрет**: `backdrop-filter` НЕ ставить внутри анимируемого transform-контейнера (трек слайдера и т.п.) — блюр «отрывается» и пропадает (Chrome/Safari). Внутри треков — «фейк-стекло»: плотная заливка + внутренние glow-слои с обычным `filter: blur`. Вне треков — настоящий backdrop.
- Не более 3 блюр-слоёв друг над другом.

## 6. Фоновые системы (тёмные сцены)

- **Орбы**: 2–3 градиентных круга (розовый `#ff9ad5→#ff3d9c→#d316ff`, фиолетовый `#6703ff→#9747ff→#c856ff`); автономный синус-дрейф + скролл-параллакс с инерцией (lerp k≈0.055, скорости −0.11/+0.075/−0.05).
- **Частицы**: ~64 пиксельных квадрата 1.5–4.5px, белые/фиолетовые, мерцание + индивидуальная инерция (k 0.02–0.035).
- **Pixel disintegration** (`PixelDissolve`): плотный левый край → рассыпание, клетки с разной непрозрачностью, smoothstep-фейды. Использовать как акцент (бейджи, декор), не обои.
- Всё на rAF с паузой: IntersectionObserver + `document.hidden` + `prefers-reduced-motion` → статичный кадр.

## 7. Реестр компонентов

| Компонент | Файл | Когда |
|---|---|---|
| `CaseShowcase` | `components/showcase/CaseShowcase.tsx` | блок «работы»; образец карточки кейса |
| `PixelDissolve` | `components/showcase/PixelDissolve.tsx` | пиксельная дезинтеграция |
| `GearSolid` | `components/GearSolid.tsx` | сплошная шестерёнка (лого малых размеров; `hole` опц.) |
| `SystemNav` | `components/system/SystemNav.tsx` | шапка-гантель (канон формы) |
| `QuizPanel` | `components/QuizPanel.tsx` | квиз-дровер 320px, 5 шагов |
| `QuizInline` | `components/QuizInline.tsx` | квиз-блок в конце лендинга; data-driven шаги (`Service.quiz.steps`: input/single/multi/budget/contacts; дефолт — 5 шагов дровера) |
| `SeeAlso` | `components/services/SeeAlso.tsx` | блок «смотрите также» (`Service.seeAlso.items`) + баннер подписки на тг-канал |
| Конфиг квиза | `lib/quiz.ts` | общие вопросы/шаги/бюджет для дровера и инлайна — менять здесь |
| `BackdropFX` (внутри CaseShowcase) | — | орбы+частицы; при переиспользовании — выделить |
| `GenerativeCover` | `components/blog/GenerativeCover.tsx` | генеративные обложки-плейсхолдеры |
| `SignalTransition` | `components/system/SignalTransition.tsx` | переходы между актами главной |
| Данные кейсов | `lib/showcase.ts` | title/desc/bullets(4·6·8)/shots(2деск+2моб)/accent/href/wip |
| Данные направлений | `lib/solutions.ts` | лендинги направлений (товарка/услуги/связки) — тот же тип Service, роут `/solutions/[slug]`; переопределения: `valuePropsTitle/Eyebrow`, `comparison.aicsLabel` |
| Данные услуг | `lib/services.ts` | реестр лендингов; опц. блоки: `modules`, `bizCases`, `solutionBank`, `gantt` (смета после прогресс-бара), `training` (вместо closing), `ctaQuiz`, `deliverablesTitle`, `comparison.title/classicLabel` |
| `BrandEvolution` | `components/services/BrandEvolution.tsx` | хиро-3D «эволюция бренда»: ДНК→клетки→единорог (`heroVisual: "evolution"`; дебаг `?evo=0\|1\|2`) |
| `CardVideo` | `components/services/CardVideo.tsx` | видео-обложка карточки услуги (muted loop, IO play/pause, `Service.card`); фолбэк — GenerativeCover |
| `ConveyorBlock` | `components/ConveyorBlock.tsx` | «как работает ИИ-конвейер» (главная, ACT III): терминал-карточка conveyor.log (`.hud normal-case`, шапка с 3 точками), роли-чипы «1 = 4», честная плашка с бордером `--color-signal-cool`; тайминги фаз = Гант лендинга сайтов |
| `GoalLink` | `components/system/GoalLink.tsx` | ссылка с целью Метрики для серверных компонентов (`goal`, `goalParams`) |
| `PricingBlock` | `components/PricingBlock.tsx` | публичные пакеты и условия (главная): 3 карточки «цена от → состав → срок» + чипы условий (50/50, договор, ответственность за сроки, KPI); цены в $ цифрами font-display; источник цен — `Service.pricing` (услуги) |
| `CaseLongread` | `components/cases/CaseLongread.tsx` | кейс-лонгрид (`/cases/[slug]`, данные `lib/cases.ts`): hero с фактами и ролями-чипами, липкая `ChapterNav` (IO-подсветка, desktop), блоки «номер font-display + текст + медиа-сетка»; пустой `src` медиа → GenerativeCover-плейсхолдер «[ медиа · скоро ]»; mobile-медиа — узкая колонка 9/16 |
| `BlogRail` | `components/blog/BlogRail.tsx` | правая колонка статьи блога: липкие (sticky top-24, lg+) тёмные баннеры #17121f на светлой теме — подписка на тг-канал (tg_subscribe) и расчёт проекта с ценой (kp_click); статья = 8 из 12 колонок (текст без max-w, ширину задаёт грид), рейл = 4; на мобиле рейл падает под статью |

## 8. Грамматика страниц

- **Секции**: тёмные full-bleed (`.runtime`-семейство) чередуются со светлыми (белый + сетка); глазок-эйбрау формата `[ тема · уточнение ]` (`.tech-label`, lowercase).
- Контейнер: `max-w-[1180px]` (контент) / `max-w-[1640px]` (широкие сцены), паддинги секций 30–80px (lg).
- **Лендинг продукта/направления** (шаблон ServiceDetail): hero (тёмный, 3D/арт) → боли/задачи → «как это работает» (шаги) → доказательства (кейсы/цифры) → сравнение → FAQ → CTA-секция с формой.
- **Статья**: обложка (GenerativeCover + тег + заголовок) → MarkdownLite body → related. SEO: canonical, OG per-page, JSON-LD (образец в `blog/[slug]/page.tsx`).
- Кейс-страница: расширение карточки showcase (те же данные + лонгрид-блоки).
- Числа/статы — Unbounded; вордмарка в заголовках — Unbounded-span.

## 9. Моушен

- Изинги: контент/треки `cubic-bezier(0.65,0,0.35,1)` (easeInOut); кнопки/лифты — spring `cubic-bezier(.34,1.56,.64,1)`.
- Анимируем только `transform`/`opacity` (+`filter` на кнопках). Никогда — `backdrop-filter`, layout-свойства.
- Канвас-циклы: seeded PRNG (mulberry32), никакого `Math.random` в рендере; пауза вне вьюпорта/скрытой вкладки; reduced-motion → статичный кадр.
- Лендинги услуг: плашки шагов «порядка работы» — 01-06 фиолетовые (#9747ff, белые цифры), 07+ циановые (#5fd9f5, цифры #302055); пайплайн-схема — labtech-лоадер («// loading», заполняющийся бар фиолет→циан); FAQ-аккордеон — класс `faq-acc` (плавное раскрытие).
- **BootSequence — только desktop (≥lg)**: на мобиле оверлей скрыт чистым CSS (`hidden lg:flex`) ради LCP — boot в SSR перекрывал hero, и мобильный LCP доходил до 8,7 с (PSI 66). Не возвращать boot на мобилку и не переносить display в inline-стиль.

## 10. Голос и копирайт

- Русский; глазки и tech-лейблы — lowercase; заголовки — короткие панчи без точки (кроме хиро «…бренда.»).
- Терминология: «кейсы · избранное», «что было сделано:», «Смотреть кейс», «Получить КП», «Обсудить проект», «бриф · 2 мин».
- Легенда бренда: киберлаборатория AICS-93, «данные, а не догадки», человек-студия.

## 11. Анти-правила

- Не смешивать шрифты вопреки §2; не делать pill-кнопки; не добавлять пульсирующие glow; не эмодзи (только inline-SVG иконки stroke 1.5–2px); не цветные заливки стекла; не убирать specular; не ставить backdrop в трек; не «AI-template» градиентные рамки.

## 12. Верификация (обязательный цикл перед «готово»)

- Прод-сборка: `npm run build` → `npx next start -p 3020`.
- Дебаг-хуки: `?nav=1` (форс-шапка), `?still=1` (без Lenis), `?quiz=1`, `?cubestate=net`, `?cuberot=<rad>`.
- Скролл-скриншоты на иммерсивной главной ненадёжны → temp-route `src/app/case-check/page.tsx` с компонентом сверху (удалять перед коммитом).
- Анимации в фоновой вкладке browser-pane не тикают → headless Chrome `--virtual-time-budget`, двухкадровый diff.
- Computed-стили (шрифты/радиусы/цвета) проверять JS-ом, не глазами.

## 13. Открытые слоты (заполнить по мере поступления)

- ✅ Telegram-отправка форм: `POST /api/lead` (бот @cntnm_clawbot; env
  `TELEGRAM_BOT_TOKEN`+`TELEGRAM_CHAT_ID` в Vercel Production и `.env.local`).
  Клиент — `lib/lead.ts → sendLead()`; успех-экран только после доставки;
  honeypot `_hp`. Новые формы подключать через sendLead, не напрямую.
- ✅ Телеграм: `legal.telegram = https://t.me/ximik_ai` (личка — кнопки TG/связь);
  `legal.telegramChannel = https://t.me/aics93` (канал — баннер «Подписаться» в квизе, цель `tg_subscribe`).
- Тексты статей (5 шт) и структуры новых лендингов — от Василия или генерим по шаблону §8 и согласуем.
- Кейсы 02–03: контент по модели `lib/showcase.ts` (для химички образец готов).
