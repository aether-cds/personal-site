"use client";

import { useEffect, useMemo, useState } from "react";
import type { Language, TimeZoneMode } from "@/lib/i18n";
import { pad2, toNumerals } from "@/lib/i18n";
import {
  formatAdDate,
  getBsMonthName,
  getZonedDateParts,
  NEPAL_TIME_ZONE,
  toBikramSambat,
  type BikramSambatDate,
} from "@/lib/nepaliDate";

export type NepalTime = {
  mounted: boolean;
  hour: string;
  minute: string;
  second: string;
  hourValue: number;
  minuteValue: number;
  secondValue: number;
  monthName: string;
  day: string;
  year: string;
  adDate: string;
  bs: BikramSambatDate | null;
  zoneLabel: string;
  spoken: string;
};

const PLACEHOLDER: NepalTime = {
  mounted: false,
  hour: "--",
  minute: "--",
  second: "--",
  hourValue: 0,
  minuteValue: 0,
  secondValue: 0,
  monthName: "—",
  day: "--",
  year: "----",
  adDate: "—",
  bs: null,
  zoneLabel: "NPT",
  spoken: "Current Nepal time is loading.",
};

export function useNepalTime(zone: TimeZoneMode, lang: Language): NepalTime {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (!now) return PLACEHOLDER;

    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timeZone =
      zone === "npt" ? NEPAL_TIME_ZONE : localZone || undefined;
    const parts = getZonedDateParts(now, timeZone);
    const bs = toBikramSambat(parts);
    const monthName = getBsMonthName(bs.month, lang);
    const adDate = formatAdDate(parts);
    const zoneLabel = zone === "npt" ? "NPT" : localZone?.split("/").pop()?.replace(/_/g, " ") || "Local";

    return {
      mounted: true,
      hour: toNumerals(pad2(parts.hour), lang),
      minute: toNumerals(pad2(parts.minute), lang),
      second: toNumerals(pad2(parts.second), lang),
      hourValue: parts.hour,
      minuteValue: parts.minute,
      secondValue: parts.second,
      monthName,
      day: toNumerals(bs.day, lang),
      year: toNumerals(bs.year, lang),
      adDate: toNumerals(adDate, lang),
      bs,
      zoneLabel,
      spoken:
        lang === "np"
          ? `अहिलेको समय ${toNumerals(pad2(parts.hour), lang)} बजेर ${toNumerals(parts.minute, lang)} मिनेट, ${monthName} ${toNumerals(bs.day, lang)} गते, ${toNumerals(bs.year, lang)} साल। ${zoneLabel}।`
          : `The current time is ${pad2(parts.hour)}:${pad2(parts.minute)} ${zoneLabel}. Bikram Sambat: ${monthName} ${bs.day}, ${bs.year}. Gregorian: ${adDate}.`,
    };
  }, [now, zone, lang]);
}
