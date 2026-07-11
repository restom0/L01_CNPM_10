import React from "react";
import { useI18n } from "../../i18n";

export default function LanguageSwitcher() {
  const { language, languages, setLanguage, t } = useI18n();

  return (
    <select
      aria-label={t("language.label")}
      className="min-h-[44px] rounded-md bg-white px-[var(--spacing-x)] py-0 text-sm font-semibold text-textGray shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-mainBlue"
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
    >
      {languages.map((item) => (
        <option key={item.code} value={item.code}>
          {item.flag} {item.countryCode}
        </option>
      ))}
    </select>
  );
}
