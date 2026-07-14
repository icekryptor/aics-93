import { NextResponse } from "next/server";

// POST /api/lead — отправка заявок с форм сайта в Telegram (бот @cntnm_clawbot).
// Креды только в env: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (Vercel / .env.local).

export const runtime = "nodejs";

const MAX_BODY = 6_000; // защита от мусорных полотен
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function fmtValue(v: unknown): string {
  if (v == null || v === "") return "—";
  if (Array.isArray(v)) return v.length ? v.map((x) => String(x)).join(", ") : "—";
  return String(v);
}

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json({ ok: false, error: "telegram env is not configured" }, { status: 500 });
  }

  let payload: { source?: unknown; data?: unknown; _hp?: unknown };
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) throw new Error("too large");
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "bad payload" }, { status: 400 });
  }

  // honeypot: боты заполняют скрытое поле — тихо делаем вид, что всё ок
  if (typeof payload._hp === "string" && payload._hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const source = typeof payload.source === "string" ? payload.source.slice(0, 120) : "неизвестно";
  const data =
    payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)
      ? (payload.data as Record<string, unknown>)
      : {};

  const lines = Object.entries(data)
    .slice(0, 24)
    .map(([k, v]) => `<b>${esc(k)}:</b> ${esc(fmtValue(v)).slice(0, 800)}`);

  const text = [`🟣 <b>Заявка · aistov.space</b>`, `<b>источник:</b> ${esc(source)}`, "", ...lines].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      // не подвешивать форму, если телеграм тупит
      signal: AbortSignal.timeout(8_000),
    });
    const j = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || !j?.ok) {
      return NextResponse.json({ ok: false, error: "telegram rejected" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "telegram unreachable" }, { status: 502 });
  }
}
