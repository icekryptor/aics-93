"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* PanelGate — форма пароля harness-панели. Успех → httpOnly-cookie
   от /api/panel-auth → refresh, сервер отдаёт содержимое. */

export default function PanelGate() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(false);
    const res = await fetch("/api/panel-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    setBusy(false);
    if (res?.ok) {
      router.refresh();
    } else {
      setErr(true);
    }
  };

  return (
    <form onSubmit={submit} className="mt-10 max-w-sm">
      <label htmlFor="panel-pass" className="tech-label block text-[11px] text-runtime-ink-soft">
        [ пароль доступа ]
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id="panel-pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-runtime-line bg-[color-mix(in_srgb,var(--color-runtime)_70%,transparent)] px-4 py-3 text-sm text-runtime-ink outline-none transition-colors focus:border-[color-mix(in_srgb,var(--color-signal)_70%,transparent)]"
        />
        <button
          type="submit"
          disabled={busy || !password}
          className="btn-case shrink-0 px-6 text-sm font-semibold disabled:opacity-60"
        >
          {busy ? "…" : "Войти"}
        </button>
      </div>
      {err && <p className="mt-3 text-[12px] text-[#ff8f73]">неверный пароль</p>}
      <p className="hud mt-4 text-[9px] text-runtime-ink-soft/60">// access restricted · aics-93 harness</p>
    </form>
  );
}
