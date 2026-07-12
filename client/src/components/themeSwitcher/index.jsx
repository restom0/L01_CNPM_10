import { IoMoon, IoSunny } from "react-icons/io5";
import { useTheme } from "../../theme";
import { useI18n } from "../../i18n";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t("theme.label")}
      aria-pressed={isDark}
      className="inline-flex min-h-[44px] items-center gap-x-[calc(var(--spacing-x)/2)] rounded-md bg-white px-[var(--spacing-x)] text-sm font-semibold text-textGray shadow-sm ring-1 ring-black/5 outline-none hover:ring-mainBlue/40 focus-visible:ring-2 focus-visible:ring-mainBlue"
    >
      {isDark ? <IoMoon size={16} /> : <IoSunny size={16} />}
      <span>{isDark ? t("theme.dark") : t("theme.light")}</span>
    </button>
  );
}
