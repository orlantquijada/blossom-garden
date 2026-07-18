import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { i18n, languages } from "@/lib/i18n";
import type { LanguageCode } from "@/lib/i18n";

const STORAGE_KEY = "bg-lang";

function changeLanguage(code: LanguageCode) {
  document.documentElement.lang = code;
  localStorage.setItem(STORAGE_KEY, code);
  void i18n.changeLanguage(code);
}

export function LanguagePicker() {
  const { t } = useTranslation();
  const language = (i18n.resolvedLanguage ?? "en") as LanguageCode;

  // Applied post-hydration so SSR markup (always English) matches first paint.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;

    if (
      stored &&
      stored !== i18n.resolvedLanguage &&
      languages.some((option) => option.code === stored)
    ) {
      changeLanguage(stored);
    }
  }, []);
  const currentLanguage =
    languages.find((option) => option.code === language) ?? languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t("language")}
          className="border-input bg-card text-foreground hover:border-primary focus-visible:ring-ring flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors outline-none focus-visible:ring-2"
          type="button"
        >
          <span aria-hidden="true">{currentLanguage.flag}</span>
          <span>{currentLanguage.label}</span>
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card">
        <DropdownMenuRadioGroup
          onValueChange={(value) => changeLanguage(value as LanguageCode)}
          value={language}
        >
          {languages.map((option) => (
            <DropdownMenuRadioItem key={option.code} value={option.code}>
              <span aria-hidden="true">{option.flag}</span>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
