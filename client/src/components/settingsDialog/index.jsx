import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import LanguageSwitcher from "../languageSwitcher";
import ThemeSwitcher from "../themeSwitcher";
import { useI18n } from "../../i18n";
import { classes } from "../../styles/classes";

/**
 * Render settings side drawer for language and theme controls.
 *
 * @param {{open: boolean, onClose: Function}} props - Dialog state props.
 * @returns {JSX.Element} Settings dialog.
 */
export default function SettingsDialog({ open, onClose }) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <DialogPanel className="flex h-full w-screen max-w-sm flex-col gap-y-[var(--spacing-section)] bg-white p-[var(--spacing-body)] shadow-xl">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-textGray">
              {t("settings.title")}
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("common.cancel")}
              className={classes.dialogIconButton}
            >
              <IoClose size={22} />
            </button>
          </div>

          <div className="flex flex-col gap-y-[var(--spacing-y)]">
            <div className="flex items-center justify-between gap-x-[var(--spacing-x)]">
              <span className="text-sm font-semibold text-textGray">
                {t("language.label")}
              </span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-between gap-x-[var(--spacing-x)]">
              <span className="text-sm font-semibold text-textGray">
                {t("theme.label")}
              </span>
              <ThemeSwitcher />
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
