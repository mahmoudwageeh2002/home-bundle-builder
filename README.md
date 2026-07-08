# Home Bundle Builder

A responsive React prototype for a multi-step home security bundle builder. The app lets shoppers choose cameras, plans, sensors, and extra protection while a live review panel updates quantities, pricing, savings, and selected items in real time.

## Tech Stack

- React 19
- TypeScript
- Vite
- Axios for loading local JSON data
- React Icons
- CSS modules by feature/shared component convention

## Getting Started

Run the project from a clean clone:

```bash
npm install
npm run dev
```

The dev server will print a local URL, usually:

```bash
http://localhost:5173/
```

## Available Scripts

```bash
npm run dev
```

Starts the local Vite development server.

```bash
npm run build
```

Runs TypeScript checks and creates a production build in `dist/`.

```bash
npm run preview
```

Serves the production build locally after running `npm run build`.

```bash
npm run lint
```

Runs ESLint across the project.

## What Is Implemented

- Four-step accordion builder:
  - Choose your cameras
  - Choose your plan
  - Choose your sensors
  - Add extra protection
- Data-driven product rendering from `public/data/bundle.json`.
- Axios integration for loading the JSON catalog.
- Feature-based folder structure under `src/features/bundle-builder`.
- Shared UI components for buttons, modals, and quantity steppers.
- Shared theme tokens for colors, typography, spacing, radii, and sizing.
- Responsive layouts for desktop, tablet, and mobile.
- Product cards with:
  - product image
  - badge
  - description
  - learn-more link
  - variant chips
  - quantity stepper
  - compare-at and current pricing
- Variant-specific quantity handling.
- Live review panel grouped by category.
- Synced steppers between product cards and review rows.
- Dynamic totals and savings calculation.
- Save-for-later flow using localStorage.
- Shareable return link with the selected configuration encoded in URL params.
- Save-link modal with copy support.
- Checkout success modal with a green confirmation icon.
- Smooth accordion open/close animation.
- Review-section scroll/highlight behavior from the final step.
- Supplied SVG assets integrated for step icons, plan, delivery, and satisfaction badge.

## Data

The product catalog and seeded starting configuration live in:

```bash
public/data/bundle.json
```

The app is intentionally data-driven, so products, steps, prices, variants, and the initial selected state are rendered from JSON instead of being hardcoded into individual card markup.

## Decisions And Tradeoffs

This prototype does not include a full backend. Configuration persistence is handled with localStorage and a shareable URL instead of a server-side user/session store.

For a production version, a backend would be the better path for secure, durable user-specific saved systems. It would allow authenticated saves, server validation, safer sharing, recovery across devices, and better control over catalog/pricing changes. The current local approach keeps the take-home focused on the frontend experience while still supporting reload persistence and return links.

The data structure is designed to be extendable, but a production catalog could be more normalized. For example, products, variants, price rules, promotions, plans, and shipping options could be split into separate resources and validated with schemas. That would make the system easier to maintain as the bundle logic grows.

Product imagery is represented with local SVG artwork where original product assets were not available. The provided SVG assets were used for the required step, plan, delivery, and satisfaction badge visuals.

## Project Structure

```bash
src/
  features/
    bundle-builder/
      components/
      data/
      hooks/
      services/
      types/
      utils.ts
  shared/
    components/
    theme/
public/
  data/
  products/
```

## Verification

The project has been checked with:

```bash
npm run lint
npm run build
```
