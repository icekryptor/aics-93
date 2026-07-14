<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# aistov-space — AICS-93

Иммерсивный сайт-портфолио/агентство Василия Аистова. Next.js 16 (App Router) +
React 19 + Tailwind v4 → Vercel (aistov.space). Язык UI — русский.

## Правило №1
Перед любой работой над UI прочитай **`docs/DESIGN-SYSTEM.md`** — канон
токенов, типографики, форм, кнопок, стекла, моушена и верификации.
Новые дизайн-решения из чата вноси туда в том же коммите.

## Быстрые факты
- Токены: `src/app/globals.css` (@theme). Кнопки: `.btn-case`, `.btn-case-glass`, `.btn-case-glass-dark`.
- Заголовки — Neue Haas Bold везде; Unbounded — только цифры/аббревиатуры.
- Скролл — Lenis (`?still=1` отключает). Шапка форсится `?nav=1`.
- `backdrop-filter` запрещён внутри анимируемых transform-контейнеров (глючит) — см. DESIGN-SYSTEM §5.
- Прод-проверка: `npm run build && npx next start -p 3020`; скриншоты анимаций — headless Chrome с `--virtual-time-budget`.
- Figma: файл AICS-93, fileKey `r2o8qS0qIkCakbzqlRuDjl`.
- Пуш в main → автодеплой Vercel. Пушить с retry-циклом (сеть рвётся).
