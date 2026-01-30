# Next.js Starter Kit

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)

A production-ready Next.js starter kit with Clean Architecture and a modular
structure for scalable frontend development.

## Overview

This starter kit provides a solid foundation for building modern Next.js
applications with:

- Clean Architecture layering
- Feature-based modules
- Next.js App Router with Server Components by default
- A complete form and validation stack
- Internationalization (i18n) with locale routing
- Comprehensive testing with strict coverage requirements

## Tech Stack

### Core Framework & Language

- **Next.js** (App Router)
- **React**
- **TypeScript** (strict mode)

### UI & Styling

- **Tailwind CSS**
- **shadcn/ui** (Radix-based component library)

### State Management

- **Zustand**

### Forms & Validation

- **React Hook Form**
- **Zod**

### Internationalization

- **next-intl**

### Testing

- **Vitest**
- **React Testing Library**
- **100% coverage requirement**

## Key Features

- **Clean Architecture** with explicit layers and dependency boundaries
- **Modular structure** under `src/modules/` for scalable development
- **App Router routing layer** under `app/` with localized routes
- **Form + validation stack** powered by React Hook Form + Zod
- **i18n-ready** with `next-intl` locale routing
- **Testing-first** culture with mandatory 100% coverage

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm start` - Run the production server
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run validate` - Run lint, format check, and tests

## Documentation

- [Architecture Guide](docs/architecture.md)
- [Development Guide](docs/development-guide.md)
- [Testing Guide](docs/testing-guide.md)

## Project Structure

```
app/                      # Routing layer only (App Router)
└── [locale]/              # Locale segment (next-intl)
    ├── layout.tsx
    ├── page.tsx
    └── auth/...

src/                      # Application code
├── modules/              # Feature modules
│   └── {module-name}/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
├── common/               # Shared code
└── application/          # App-level setup (i18n, providers)
```

## Contributing

Please follow the established workflow:

1. Create a feature branch from `develop`
2. Write/update tests to keep 100% coverage
3. Run `npm run validate` before committing
4. Open a Pull Request targeting `develop`

## License

MIT
