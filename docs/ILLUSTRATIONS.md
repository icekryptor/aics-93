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
palette on dark purple, subtle bloom, sharp focus, 8k, ultra-detailed. No readable text
anywhere.

Aspect ratio 16:9.
```

Правила:

- Монохром: фиолет/лаванда/белый на тёмном индиго. Циан из UI-палитры сайта в иллюстрации не тянем.
- Поток всегда читаемый: слева направо или по кругу; этапы соединяют светящиеся PCB-дорожки.
- Смысловые объекты — стеклянные, с подсвеченной начинкой (механизмы, экраны, документы).
- Без читаемого текста в кадре; UI на экранах — абстрактные блоки/графики.
- Анти-правило: плоский 2D-wireframe/blueprint-стиль (первая итерация) — примитивно, не использовать.

## Реестр сгенерированного

| Файл | Статья | Сцена |
|---|---|---|
| `ii-konvejer-sborka-v2.webp` | kak-ii-konvejer-sobiraet-sajt | база знаний → конвейер с 3 станциями-агентами (шестерни/оптика/манипулятор), панели wireframe→готовый UI → монитор |
| `petlya-doobucheniya-v2.webp` | kak-ii-konvejer-sobiraet-sajt | стеклянная рука со стилусом правит экран, лента света уходит в стопку инструкций, PCB-дорожка замыкает кольцо |
