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

## Next.js Notes

This app was bootstrapped with `create-next-app` and uses the App Router.
Routing files live under `app/[locale]/`, while feature UI lives in `src/`.
Update the landing page in `src/modules/landing-page/pages/home/page.tsx`.

The project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to automatically optimize and load Geist.

## Documentation

- [Architecture Guide](docs/architecture.md)
- [Development Guide](docs/development-guide.md)
- [Testing Guide](docs/testing-guide.md)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub repository](https://github.com/vercel/next.js)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the
[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
for more details.

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
