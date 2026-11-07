/**
 * Placeholder project data.
 * TODO(Syami): replace these with real projects, then update `href` values.
 */
export type Project = {
  slug: string;
  index: string;
  title: string;
  year: string;
  category: string;
  summary: string;
  description: string;
  role: string;
  stack: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    slug: "himalaya-type",
    index: "01",
    title: "Himalaya Type",
    year: "2026",
    category: "Type / Web",
    summary: "A living specimen for a Devanagari and Latin display typeface.",
    description:
      "A variable-type playground that lets visitors stretch, stack and break a dual-script typeface. Built around a custom canvas renderer and a tiny state machine, the specimen treats letterforms as landscape: peaks, valleys and weather.",
    role: "Design + development",
    stack: ["Next.js", "Canvas", "Type design", "GSAP"],
  },
  {
    slug: "kathmandu-transit",
    index: "02",
    title: "Kathmandu Transit",
    year: "2025",
    category: "Product / Data",
    summary: "A calmer way to read the valley's chaotic bus network.",
    description:
      "A route-finding experiment for Kathmandu's micro-bus system. The interface turns timetables, landmarks and local shortcuts into a single scrollable map, with bilingual labels and offline-first data.",
    role: "Product design + frontend",
    stack: ["React", "TypeScript", "MapLibre", "IndexedDB"],
  },
  {
    slug: "dhaka-grid",
    index: "03",
    title: "Dhaka Grid",
    year: "2025",
    category: "Identity / Tool",
    summary: "A generative tile maker inspired by Dhaka topi weaving.",
    description:
      "An identity system and browser tool that turns traditional Dhaka weaving patterns into generative tiles. Export-ready SVGs, a colour system pulled from prayer flags, and a small library of motion presets.",
    role: "Creative direction + build",
    stack: ["Svelte", "SVG", "Generative design"],
  },
  {
    slug: "singing-bowl",
    index: "04",
    title: "Singing Bowl",
    year: "2024",
    category: "Sound / Experiment",
    summary: "A browser instrument that listens to the shape of your cursor.",
    description:
      "A Web Audio study in slow decay. Dragging shapes across the screen plays synthesised Himalayan bowl tones, with pitch derived from size and position. No samples, no libraries — just sine waves and patience.",
    role: "Concept + engineering",
    stack: ["Web Audio API", "Canvas", "React"],
  },
];
