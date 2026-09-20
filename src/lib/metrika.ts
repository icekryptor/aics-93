// Яндекс.Метрика — общий id счётчика + безопасный хелпер целей.
// reachGoal ничего не делает, если счётчик не загружен (dev / ещё не готов).

// Счётчик домена aics-93.ru (прежний 110384489 остался на умершем aistov.space)
export const YM_ID = 112837220;

export function reachGoal(goal: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.ym !== "function") return;
  window.ym(YM_ID, "reachGoal", goal, params);
}
