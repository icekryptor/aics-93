// Клиентский помощник отправки заявок → POST /api/lead → Telegram.
// Возвращает true при подтверждённой доставке (формы показывают «успех»
// только после него — лид не теряется молча).
export async function sendLead(source: string, data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, data }),
    });
    const j = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    return Boolean(res.ok && j?.ok);
  } catch {
    return false;
  }
}
