# Vexyn

Official repository for Vexyn's corporate web presence. A high-performance, component-based application focused on precision engineering and architectural design.

## Technical Stack

- **Core**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Animation**: GSAP (ScrollTrigger)
- **3D Engine**: React Three Fiber (Three.js)
- **Testing**: Vitest + Playwright
- **Styling**: Vanilla CSS Modules (Standardized via Swiss Grid)

## Development

### Prerequisites
- Node.js (Latest LTS recommended)
- npm

### Installation
```bash
npm install
```

### Commands
- `npm run dev`: Start the development server.
- `npm run build`: Build the production application.
- `npm test`: Run unit and integration tests.
- `npm run lint`: Execute ESLint for code quality checks.

## Project Architecture

The project follows a modular architecture based on the International Typographic Style (Swiss Grid).

- **Structure**: Core components are located in `src/components/`, split into `layout` (e.g., Sidebar, Footer) and `sections` (e.g., Hero, Services, Results).
- **Layout & Styling**: Spacing systems and typographic scale are defined globally in `src/index.css` using HSL variables and clamp sizing.
- **Animations**: Centered timeline controls and ScrollTrigger pinning are managed in `src/App.tsx`.

