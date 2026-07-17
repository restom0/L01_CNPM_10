import { IoMoon, IoSunny } from "react-icons/io5";
import { useTheme } from "../../theme";
import { useI18n } from "../../i18n";
import { classes } from "../../styles/classes";

/**
 * Render theme toggle button.
 *
 * @returns {JSX.Element} Theme switcher.
 */
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
      className={classes.toolbarButton}
    >
      {isDark ? <IoMoon size={16} /> : <IoSunny size={16} />}
      <span>{isDark ? t("theme.dark") : t("theme.light")}</span>
    </button>
  );
}
