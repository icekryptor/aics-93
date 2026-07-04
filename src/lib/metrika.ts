// Яндекс.Метрика — общий id счётчика + безопасный хелпер целей.
// reachGoal ничего не делает, если счётчик не загружен (dev / ещё не готов).

export const YM_ID = 110384489;

export function reachGoal(goal: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.ym !== "function") return;
  window.ym(YM_ID, "reachGoal", goal, params);
}
