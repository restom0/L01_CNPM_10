import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { IoChevronDown } from "react-icons/io5";
import { useI18n } from "../../i18n";
import { classes } from "../../styles/classes";

/**
 * Render language picker and update current language.
 *
 * @returns {JSX.Element} Language switcher.
 */
export default function LanguageSwitcher() {
  const { language, languages, setLanguage, t } = useI18n();
  const current = languages.find((item) => item.code === language) || languages[0];

  return (
    <Listbox value={language} onChange={setLanguage}>
      <ListboxButton
        aria-label={t("language.label")}
        className={classes.toolbarButton}
      >
        <span>
          {current.flag} {current.countryCode}
        </span>
        <IoChevronDown aria-hidden size={14} className="opacity-60" />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom end"
        className="z-[60] mt-[calc(var(--spacing-x)/2)] min-w-[8rem] rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 outline-none"
      >
        {languages.map((item) => (
          <ListboxOption
            key={item.code}
            value={item.code}
            className="flex cursor-pointer items-center gap-x-[calc(var(--spacing-x)/2)] px-[var(--spacing-x)] py-2 text-sm text-textGray data-[focus]:bg-lightGray data-[selected]:font-semibold"
          >
            <span>{item.flag}</span>
            <span>{item.countryCode}</span>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
