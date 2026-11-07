import type { Language } from "@/lib/i18n";

type RollingValueProps = {
  value: string;
  lang: Language;
  className?: string;
};

/**
 * Splits a value into glyphs so each changed digit can roll into place.
 * The visual value is hidden from screen readers; the hero exposes a full
 * spoken sentence instead.
 */
export default function RollingValue({
  value,
  lang,
  className,
}: RollingValueProps) {
  return (
    <span
      className={`rolling-value ${className ?? ""}`}
      aria-hidden="true"
      lang={lang === "np" ? "ne" : undefined}
    >
      {Array.from(value).map((character, index) => {
        const isDigit = /\d/.test(character);
        return (
          <span
            key={`${index}-${character}`}
            className={isDigit ? "rolling-digit" : "rolling-char"}
          >
            {character}
          </span>
        );
      })}
    </span>
  );
}
