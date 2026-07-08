# Home Bundle Builder

A responsive React prototype for building a home security bundle. Shoppers can select cameras, a plan, sensors, and extra protection while a live review panel updates selected items, quantities, pricing, and savings.

## Tech Stack

- React 19
- TypeScript
- Vite
- Axios
- React Icons

The codebase uses a feature-based structure with shared UI components and shared theme tokens.

## Run Locally

From a clean clone:

```bash
npm install
npm run dev
```

Vite will print the local app URL, usually:

```bash
http://localhost:5173/
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Implemented

- Four-step animated accordion builder.
- Data-driven product catalog from `public/data/bundle.json`.
- Axios-based JSON loading.
- Responsive desktop, tablet, and mobile layouts.
- Product cards with variants, steppers, badges, images, and pricing.
- Variant-specific quantity handling.
- Live review panel with synced quantity controls.
- Dynamic totals and savings.
- Save-for-later using localStorage.
- Shareable return link with selected configuration in URL params.
- Save-link modal and checkout success modal.
- Review scroll/highlight interaction.
- Provided SVG assets integrated for steps, plan, delivery, and satisfaction badge.

## Decisions And Tradeoffs

This prototype does not include a full backend. Saved systems are stored locally with localStorage and can also be restored from a shareable URL.

In production, a backend would be better for secure, durable user-specific saved systems, authenticated access, server-side validation, cross-device recovery, and safer catalog/pricing management.

The data structure is extendable, but a production system could normalize products, variants, plans, promotions, and pricing rules further as the bundle logic grows.

## Verification

Checked with:

```bash
npm run lint
npm run build
```
