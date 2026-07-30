import { createHash } from "node:crypto";

/* Токен доступа harness-панели: sha256(пароль+соль). Смена PANEL_PASSWORD
   в env мгновенно инвалидирует все выданные куки. */
export const tokenFor = (password: string) =>
  createHash("sha256").update(`aics-panel:${password}`).digest("hex");
