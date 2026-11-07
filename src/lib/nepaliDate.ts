import NepaliDate from "nepali-date-converter";
import type { Language } from "@/lib/i18n";

export const NEPAL_TIME_ZONE = "Asia/Kathmandu";
export const NPT_OFFSET_MS = (5 * 60 + 45) * 60 * 1000;

export type DateParts = {
  year: number;
  month: number; // 1–12
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export type BikramSambatDate = {
  year: number;
  month: number; // 0–11
  day: number;
};

export const BS_MONTHS_EN = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
] as const;

export const BS_MONTHS_NE = [
  "बैशाख",
  "जेठ",
  "असार",
  "श्रावण",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फाल्गुन",
  "चैत",
] as const;

/**
 * Read the wall-clock parts of a Date in a specific IANA timezone.
 * Pass no timezone to use the visitor's local timezone.
 */
export function getZonedDateParts(date: Date, timeZone?: string): DateParts {
  if (!timeZone) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    };
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const values: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") values[part.type] = part.value;
  }

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

/**
 * Convert a Gregorian wall-clock date to Bikram Sambat.
 *
 * The converter reads local getters, so we hand it a local-noon Date built
 * from the already-zoned Gregorian parts. Noon avoids DST edge cases and
 * keeps the conversion accurate even when the visitor is in another timezone.
 */
export function toBikramSambat(parts: DateParts): BikramSambatDate {
  const wallClock = new Date(parts.year, parts.month - 1, parts.day, 12, 0, 0, 0);
  const bs = new NepaliDate(wallClock);
  return {
    year: bs.getYear(),
    month: bs.getMonth(),
    day: bs.getDate(),
  };
}

export function getBsMonthName(monthIndex: number, lang: Language): string {
  const names = lang === "np" ? BS_MONTHS_NE : BS_MONTHS_EN;
  return names[monthIndex] ?? names[0];
}

/** Format the Gregorian date without timezone drift or runtime locale surprises. */
export function formatAdDate(parts: DateParts): string {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12));
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
