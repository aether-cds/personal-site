export const SHAPE_KINDS = [
  "peak",
  "pagoda",
  "dhaka",
  "flag",
  "mandala",
  "prayer",
  "sunmoon",
] as const;

export type ShapeKind = (typeof SHAPE_KINDS)[number];

export const SHAPE_LABELS: Record<ShapeKind, string> = {
  peak: "Himalayan peak",
  pagoda: "Pagoda roof",
  dhaka: "Dhaka topi tile",
  flag: "Nepali flag",
  mandala: "Mandala",
  prayer: "Prayer flags",
  sunmoon: "Sun and moon",
};
