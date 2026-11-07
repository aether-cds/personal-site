/**
 * Single source of truth for identity details.
 * TODO(Syami): update the role, email, socials and coordinates below.
 */
export const site = {
  name: "Syami",
  initial: "S.",
  role: "Creative Developer",
  location: "Kathmandu, Nepal",
  coordinates: "27.7172° N, 85.3240° E",
  timezone: "NPT UTC+5:45",
  email: "hello@syami.dev",
  availability: "Open to selected projects — 2026",
  intro:
    "I build expressive, tactile interfaces at the meeting point of design and engineering. Born in the Himalayas, working from Kathmandu, and happiest when a website feels like a place you can touch.",
  nepalLine: "Made in Nepal, between the mountains and the monsoon.",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "GSAP",
    "WebGL",
    "Node.js",
    "Figma",
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/syami" },
    { label: "Instagram", href: "https://instagram.com/syami" },
    { label: "LinkedIn", href: "https://linkedin.com/in/syami" },
    { label: "Read.cv", href: "https://read.cv/syami" },
  ],
} as const;

export type Site = typeof site;
