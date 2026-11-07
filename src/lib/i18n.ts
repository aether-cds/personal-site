export type Language = "en" | "np";
export type TimeZoneMode = "npt" | "local";

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "np", label: "ने" },
];

export const TIMEZONE_OPTIONS: { value: TimeZoneMode; label: string }[] = [
  { value: "npt", label: "NPT" },
  { value: "local", label: "Local" },
];

export const NEPALI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

/** Convert Western digits in a string to Devanagari when `lang` is Nepali. */
export function toNumerals(value: string | number, lang: Language): string {
  const text = String(value);
  if (lang === "en") return text;
  return text.replace(/\d/g, (digit) => NEPALI_DIGITS[Number(digit)]);
}

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export const copy = {
  work: { en: "WORK", np: "काम" },
  hour: { en: "HOUR", np: "घण्टा" },
  minute: { en: "MINUTE", np: "मिनेट" },
  month: { en: "BS MONTH", np: "बि.सं. महिना" },
  day: { en: "BS DAY", np: "बि.सं. गते" },
  scroll: { en: "Scroll to about", np: "परिचयमा जानुहोस्" },
} as const;
