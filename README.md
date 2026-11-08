# Syami — Creative Developer

A brutalist portfolio built around a live Nepal clock: Nepal Standard Time,
Bikram Sambat dates, a draggable physics field of Himalayan shapes, and a
synthesised singing-bowl soundscape.

Built with Next.js 16, React 19, Tailwind CSS v4, GSAP, Lenis and
`nepali-date-converter`.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Edit your details

- `src/data/site.ts` — name, role, URL, email, location, coordinates,
  availability, intro and social links.
- `src/data/projects.ts` — the four selected-work entries and their case-study
  copy.
- `src/app/icon.svg` — favicon.
- `src/app/opengraph-image.tsx` — 1200×630 social card.

## Notes

- The clock never renders real time during SSR. Placeholders are replaced after
  mount so the server and client HTML match.
- Bikram Sambat conversion is handled by `nepali-date-converter`; there are no
  hand-written month tables.
- Motion and sound respect `prefers-reduced-motion`. The physics field pauses
  when the tab is hidden.
- The hero canvas is loaded with `next/dynamic` and `ssr: false`.
