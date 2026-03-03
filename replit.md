# Project Overview

A React + TypeScript + Vite single-page application — a ride-hailing / taxi service landing page and app (appears to be in Portuguese, targeting Brazilian market).

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v3 with shadcn/ui components
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **Maps**: @react-google-maps/api
- **UI Components**: Radix UI primitives (40+ shadcn components)

## Project Structure

```
src/
  App.tsx              - Root React component
  main.tsx             - Entry point
  index.css            - Global styles
  App.css              - App-specific styles
  components/          - Reusable components (UI + feature)
    ui/                - shadcn/ui components
  contexts/            - React contexts (Auth, Corrida/Ride)
  hooks/               - Custom hooks
  lib/                 - Utilities (maps, storage, utils)
  pages/               - Page components (Admin, Cliente, Motorista)
  sections/            - Landing page sections (Hero, FAQ, Footer, etc.)
  types/               - TypeScript type definitions
```

## Development

- Dev server runs on `0.0.0.0:5000`
- All hosts allowed for Replit proxy compatibility
- Workflow: `npm run dev`

## Deployment

- Target: Static site
- Build: `npm run build`
- Public dir: `dist`
