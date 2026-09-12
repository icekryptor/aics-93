import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { tokenFor } from "@/lib/panel-auth";
import { clampBrainConfig, BRAIN_CONFIG_KEYS } from "@/components/system/brain-config";

/* «Запушить» со стенда /panel/hero: валидный конфиг коммитится в
   src/lib/brain-config.json ветки main через GitHub Contents API →
   Vercel автодеплоит новую версию визуала. Доступ — кука панели;
   нужен env GITHUB_TOKEN (fine-grained PAT, contents:write на репо). */

const FILE_PATH = "src/lib/brain-config.json";

export async function POST(req: Request) {
  const expected = process.env.PANEL_PASSWORD;
  const cookie = (await cookies()).get("aics_panel")?.value;
  if (!expected || cookie !== tokenFor(expected)) {
    return NextResponse.json({ ok: false, error: "нет доступа" }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO ?? "icekryptor/aics-93";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "GITHUB_TOKEN не настроен в env — добавь fine-grained PAT с contents:write" },
      { status: 500 }
    );
  }

  let raw: unknown = null;
  try {
    raw = ((await req.json()) as { config?: unknown }).config;
  } catch {
    /* пустое/битое тело — clamp вернёт дефолты, но лучше отказать */
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ ok: false, error: "нет конфига в теле запроса" }, { status: 400 });
  }
  // отбрасываем лишние ключи, зажимаем значения в границы стенда
  const cfg = clampBrainConfig(raw);
  const body = JSON.stringify(
    Object.fromEntries(BRAIN_CONFIG_KEYS.map((k) => [k, cfg[k]])),
    null,
    2
  ) + "\n";

  const gh = (path: string, init?: RequestInit) =>
    fetch(`https://api.github.com/repos/${repo}/${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init?.headers ?? {}),
      },
    });

  // sha текущего файла — обязателен для обновления
  const cur = await gh(`contents/${FILE_PATH}?ref=${branch}`);
  if (!cur.ok) {
    return NextResponse.json(
      { ok: false, error: `github: не прочитал текущий конфиг (HTTP ${cur.status})` },
      { status: 502 }
    );
  }
  const { sha } = (await cur.json()) as { sha: string };

  const put = await gh(`contents/${FILE_PATH}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "chore(hero): новая версия визуала мозга — стенд /panel/hero",
      content: Buffer.from(body, "utf8").toString("base64"),
      sha,
      branch,
    }),
  });
  if (!put.ok) {
    const detail = (await put.json().catch(() => null)) as { message?: string } | null;
    return NextResponse.json(
      { ok: false, error: `github: ${detail?.message ?? `HTTP ${put.status}`}` },
      { status: 502 }
    );
  }
  const j = (await put.json()) as { commit?: { html_url?: string } };
  return NextResponse.json({ ok: true, commitUrl: j.commit?.html_url });
}
