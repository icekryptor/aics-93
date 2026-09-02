"use client";

import { useEffect } from "react";

// <html lang> живёт в корневом layout (lang="ru"); Next не даёт переопределить
// его на сегменте. Для /en выставляем атрибут крошечным клиентским эффектом
// и возвращаем "ru" при уходе из раздела.
export default function SetDocumentLang({ lang }: { lang: string }) {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.lang;
    html.lang = lang;
    return () => {
      html.lang = prev || "ru";
    };
  }, [lang]);
  return null;
}
