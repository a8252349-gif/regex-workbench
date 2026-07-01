"use client";

import { useEffect, useState } from "react";
import { localeNames, locales, type Locale } from "@/src/i18n/locales";

export function LanguageSuggestion() {
  const [suggested, setSuggested] = useState<Locale | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const code = navigator.language.split("-")[0] as Locale;
      if ((locales as readonly string[]).includes(code) && code !== "en") setSuggested(code);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!suggested || dismissed) return null;
  return (
    <aside className="language-banner" aria-label="Language suggestion">
      <p>It looks like you prefer {localeNames[suggested]}. Open that version?</p>
      <div className="button-row">
        <a className="button button-primary" href={`/${suggested}/`}>Open {localeNames[suggested]}</a>
        <button className="button button-secondary" onClick={() => setDismissed(true)}>Dismiss</button>
      </div>
    </aside>
  );
}
