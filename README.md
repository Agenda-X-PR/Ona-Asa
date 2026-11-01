# CultureLens · Ọ̀nà Àṣà

A front-end prototype by Team Àṣà for Hack for Humanity Lagos 2026. It lets
people browse sample records of Nigerian craft heritage, read illustrative
artisan profiles, try a workshop booking flow, ask sample questions, and
propose a contribution.

## What is real and what is not

Everything is sample data. There is no backend.

- Records, artisans, workshops and Q&A answers are fixtures in
  `src/data/mockData.ts`. Their names, citations and claims have not been
  independently verified.
- Booking requests and contributions are saved only in the visitor's browser
  (`localStorage`). Nothing is sent to an artisan, reviewer or payment
  provider.
- The Q&A page matches your question against four canned answers. No AI model
  is called, so no API key is needed.

See `TODO.md` for the content and images the team still needs to supply.

## Run it

Requires Node.js 20 or newer.

```sh
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```sh
npm run build      # production build into dist/
npm run preview    # serve the build
npm run lint       # type-check
npm test           # unit and page tests (node:test + jsdom)
```

## Stack

React 19, Vite, Tailwind CSS v4 and TypeScript. Routing is hash based
(`#/discover`, `#/culture/<slug>`), so the build can be served from any static
host without rewrites.

## Layout

- `src/pages/` one component per route
- `src/components/` shared layout and UI pieces
- `src/lib/` routing, booking rules and theme
- `src/utils/search.ts` the search and Q&A matcher
- `src/services/apiService.ts` the fixture-backed stand-in for a real API
- `DESIGN.md` the visual system and its tokens
