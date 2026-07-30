import { NextResponse } from "next/server";
import { tokenFor } from "@/lib/panel-auth";

/* Авторизация harness-панели: POST {password} → сверка с PANEL_PASSWORD →
   httpOnly-cookie на 30 дней. */

export async function POST(req: Request) {
  const expected = process.env.PANEL_PASSWORD;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "panel is not configured" }, { status: 500 });
  }
  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    /* пустое тело */
  }
  if (password !== expected) {
    return NextResponse.json({ ok: false, error: "wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("aics_panel", tokenFor(expected), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
