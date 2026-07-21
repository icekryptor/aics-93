# Иллюстрации — канон генерации

Стиль утверждён 2026-07-21 (референс — Gemini-рендер «мозг → шестерни-кубы → дашборды»).
Генератор: Higgsfield MCP, модель `nano_banana_pro`, `aspect_ratio: 16:9`, `resolution: 2k`.
Постобработка: `sharp` → resize 1600px → webp q88 → `public/assets/blog/*.webp`. PNG-оригиналы в репо не кладём.

## Мастер-шаблон промпта

Каждый промпт собирается из этих блоков (по-английски), меняется только содержимое зон:

```
Isometric 3D render, dimetric ~30° angle, premium minimalist tech illustration.
<Horizontal left-to-right | Circular clockwise> flow composition.

LEFT / CENTER / RIGHT (или зоны по смыслу): <герой-объекты сцены — что стоит, что светится,
что внутри; каждый объект из матового стекла, механизмы внутри кубов/арок должны быть
distinct and clearly recognizable through the glass>.

FLOW: energy reads clearly <направление>: <этап → этап → этап>. Clean orthogonal
right-angle PCB traces with soft neon-violet glow and light bloom, small circuit nodes
along the paths.

MATERIAL & LIGHT: everything is semi-transparent frosted glass with crisp edges, violet
rim-light and a purple neon underglow beneath each object. Soft studio lighting, gentle
soft shadows on the ground.

BACKGROUND: seamless deep desaturated indigo-purple (#2c2545), smooth gradient, minimal,
no clutter.

STYLE: clean, high-end, cinematic product render, cohesive violet / lavender / white
palette on dark purple, with cyan (#5fd9f5) glow accents on screens, scan beams and key
traces, and small lime (#c8ff4d) highlight accents on circuit nodes and indicator details.
Subtle bloom, sharp focus, 8k, ultra-detailed. No readable text anywhere.

Aspect ratio 16:9.
```

Правила:

- Палитра (v3, решение юзера 2026-07-21): база — фиолет/лаванда/белый на тёмном индиго; акценты — циан #5fd9f5 (экраны, лучи сканирования, ключевые дорожки) и точечный лайм #c8ff4d (узлы схем, индикаторы, мелкие детали). Лайм — микроакцент, не заливка.
- Поток всегда читаемый: слева направо или по кругу; этапы соединяют светящиеся PCB-дорожки.
- Смысловые объекты — стеклянные, с подсвеченной начинкой (механизмы, экраны, документы).
- Без читаемого текста в кадре; UI на экранах — абстрактные блоки/графики.
- Анти-правило: плоский 2D-wireframe/blueprint-стиль (первая итерация) — примитивно, не использовать.

## Обложки статей (covers)

`public/assets/blog/covers/<slug>.webp` (sharp resize 2048 + q85) → `BlogPost.cover` → `BlogCover`
(hero статьи, карточки индекса, BlogTeaser; фолбэк — GenerativeCover). Композиция обложки:
один иконичный герой-объект в ПРАВОЙ трети, левые ⅔ — спокойная тёмная зона под заголовок
(текст ложится поверх), запас сверху/снизу под object-cover кропы. Промпт = мастер-шаблон
с блоком COMPOSITION «SINGLE iconic hero group in the RIGHT third … LEFT two-thirds calm dark».
Обложек 13 — по одной на статью, имя файла = slug.

## Реестр сгенерированного

| Файл | Статья | Сцена |
|---|---|---|
| `ii-konvejer-sborka-v3.webp` | kak-ii-konvejer-sobiraet-sajt | база знаний → конвейер с 3 станциями-агентами (шестерни/оптика/манипулятор), панели wireframe→готовый UI → монитор |
| `petlya-doobucheniya-v3.webp` | kak-ii-konvejer-sobiraet-sajt | стеклянная рука со стилусом правит экран, лента света уходит в стопку инструкций, PCB-дорожка замыкает кольцо |
| `ii-kontur-brenda.webp` | ai-v-processy-brenda | мозг-чип → 4 куба-отдела (график/чат/корзина/шестерни) → общий дашборд |
| `rebrending-dnk.webp` | rebranding-kak-perepisyvanie-dnk | манипулятор меняет тусклый сегмент ДНК на светящийся, дорожки к носителям бренда |
| `dannye-vs-dogadki.webp` | dannye-a-ne-dogadki | весы: хрустальный шар догадок легче плиток с данными; вес уходит в решение на дашборде |
| `vizual-otstrojka.webp` | vizual-kotoryj-otstraivaet | полка одинаковых карточек, одна светится под прожектором с лайм-меткой |
| `rynok-sajtov-segmenty.webp` | skolko-stoit-sajt-2026 | 3 пьедестала: шаблон → студийный сайт → машинерия, кристаллы-цены растут |
| `most-s-marketplejsa.webp` | kak-ujti-s-marketplejsov | склад с шестернями комиссий → мост-караван кубов → свой магазин с сейфом |
| `firstil-prizma.webp` | skolko-stoit-firmennyj-stil | призма-ядро бренда преломляет луч в носители (лого/палитра/визитки/док/апп) |
| `crm-moduli.webp` | svoya-crm-protiv-korobki | запечатанная коробка с монетоприёмником vs модульная сборка кубов манипулятором |
| `dizajn-sistema-plitki.webp` | dizajn-sistema-dlya-malogo-biznesa | плата компонентов-плиток → десктоп/планшет/телефон из одних деталей |
| `chat-bot-yadro.webp` | skolko-stoit-chat-bot | чат-пузырь с шестернями и чипом-мозгом, телефон с перепиской, монитор + стопки монет |
| `sajt-v-razreze.webp` | chem-dorogoj-sajt-otlichaetsya | 3 сайта в разрезе: пустая оболочка / половина / плотная машинерия с антенной и лайм-лампой |
| `agentnyj-prosmotr.webp` | sajt-dlya-ii-agentov | дрон-агент сканирует план сайта циан-лучом, блоки подсвечиваются лаймом, панель 3/3 |
