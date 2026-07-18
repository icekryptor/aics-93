"use client";

import { reachGoal } from "@/lib/metrika";

// Ссылка с целью Метрики — клиентский островок для серверных компонентов
// (SeeAlso, layout services-зоны и т.п.). Все пропсы <a> проксируются.
type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  goal: string;
  goalParams?: Record<string, unknown>;
};

export default function GoalLink({ goal, goalParams, onClick, children, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        reachGoal(goal, goalParams);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
