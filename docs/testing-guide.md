# Testing Guide

This document describes the frontend testing approach for the Cognimap web
application. It aligns with the modular Clean Architecture in
`docs/architecture.md` and mirrors the rigor of the backend testing guide.

## Table of Contents

1. [Overview](#overview)
2. [Test Configuration](#test-configuration)
3. [Test Types](#test-types)
4. [Test Organization](#test-organization)
5. [Test Coverage Requirements](#test-coverage-requirements)
6. [Writing Tests](#writing-tests)
7. [Test Utilities and Helpers](#test-utilities-and-helpers)
8. [Running Tests](#running-tests)
9. [Best Practices](#best-practices)

## Overview

The frontend uses **Vitest** for testing, with **React Testing Library** for UI
tests. The strategy follows a layered, modular approach:

- **Unit Tests**: Validate domain, application, and infrastructure logic in
  isolation.
- **Component Tests**: Validate presentation components as users interact with
  the UI.
- **Integration Tests**: Validate module flows that combine application logic,
  API client, and UI.
- **E2E Tests (if configured)**: Validate full user journeys in a browser
  environment.

### Key Testing Principles

1. **100% Coverage Mandatory**: All lines, functions, branches, and statements
   must be covered.
2. **Test Close to the User**: Prefer testing behavior and outcomes rather than
   implementation details.
3. **Isolation First**: Mock external services and API calls in unit/component
   tests.
4. **Readable Tests**: Clear test names, consistent structure, and explicit
   expectations.

## Test Configuration

The test configuration should live in `vitest.config.ts`. Typical frontend
settings include:

- **Environment**: `jsdom` for DOM APIs
- **Setup file**: `src/__tests__/test-utils/setup.ts` to register
  `@testing-library/jest-dom`, mock browser APIs, and set environment variables
- **Coverage thresholds**: 100% across all metrics
- **Path aliases**: Align with application aliases (e.g. `@/` → `src/`)

When in doubt, refer to the project configuration in `vitest.config.ts` and the
current `package.json` scripts.

## Test Types

### Unit Tests

**Purpose**: Test pure logic and functions without React rendering.

**Targets**:

- Domain types and Zod schemas
- Application use cases and stores
- Infrastructure API client helpers and utilities

**Tools**: `vitest`, `vi.fn()`, `vi.mock()`

### Component Tests

**Purpose**: Validate UI behavior and user interactions.

**Targets**:

- Page-level components in `src/modules/{module}/pages/`
- Shared components in `src/common/components/`
- Form flows using React Hook Form and Zod

**Tools**: React Testing Library, `user-event`, `@testing-library/jest-dom`

### Integration Tests

**Purpose**: Validate module flows that cross multiple layers.

**Targets**:

- Component + application use case + API client coordination
- Error handling and validation surfaces
- Module-specific flows (auth, settings, dashboard)

**Tools**: React Testing Library + mocked API (MSW recommended)

### E2E Tests (Optional)

If configured, E2E tests validate full user journeys in a real browser using a
tool like Playwright or Cypress. These tests should cover:

- Authentication flows
- Critical navigation paths
- End-to-end form submission

## Test Organization

Organize tests to mirror the production structure:

```
src/__tests__/
├── unit/
│   ├── common/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   └── modules/
│       └── {module-name}/
│           ├── domain/
│           ├── application/
│           ├── infrastructure/
│           └── presentation/
├── integration/
│   └── modules/{module-name}/
├── e2e/                       # If configured
└── test-utils/
    ├── setup.ts
    ├── render.tsx
    └── fixtures.ts
```

### File Naming Convention

- Tests end in `.test.ts` or `.spec.ts`
- Match the source file name and location when possible
- Example: `login-form.tsx` → `login-form.test.tsx`

## Test Coverage Requirements

**100% coverage is mandatory** for:

- **Lines**
- **Functions**
- **Branches**
- **Statements**

### Branch Coverage Notes

Every conditional branch must be tested, including:

- Nullish coalescing (`??`)
- Ternary operators (`? :`)
- Optional chaining (`?.`)
- Logical operators (`&&`, `||`)

### Coverage Exclusions

Skip tests only for:

- Pure type definitions and enums
- Configuration files
- Test utilities

## Writing Tests

### Structure Pattern

Use the Arrange-Act-Assert (AAA) pattern:

1. **Arrange**: Set up inputs, mocks, and environment
2. **Act**: Execute the behavior
3. **Assert**: Verify output and side effects

### Example: Component Test

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/modules/auth/pages/login/components/login-form';

describe('LoginForm', () => {
  it('submits valid credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'ValidPass123!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      screen.getByText(/signing in/i)
    ).toBeInTheDocument();
  });
});
```

### Testing Server vs Client Components

- Default to **Server Components**; only Client Components can use hooks.
- For tests, focus on the **component output** and the **behavior**.
- Keep `use client` boundaries minimal and test the smallest client surface.

## Test Utilities and Helpers

Create shared test helpers in `src/__tests__/test-utils/`:

- `render.tsx`: Wraps components with providers (i18n, theme, store)
- `fixtures.ts`: Shared test data
- `setup.ts`: Global test setup (jest-dom, mocks)

These helpers reduce boilerplate and keep tests consistent.

## Running Tests

Common scripts (check `package.json` for exact names):

```bash
npm test
npm run test:watch
npm run test:coverage
npm run test:ui
npm run validate
```

## Best Practices

1. **Test behavior, not implementation**
2. **Prefer queries by role/label** over `data-testid`
3. **Mock external APIs** with MSW for stable tests
4. **Avoid brittle snapshots** unless they add clear value
5. **Keep tests fast**; reserve E2E for critical flows
6. **Cover edge cases** (null, empty values, invalid inputs)
7. **Maintain 100% coverage** for all metrics

## Summary

This guide establishes frontend testing standards aligned with the project's
Clean Architecture:

1. **100% coverage** is mandatory
2. **Test organization** mirrors the module structure
3. **Unit, component, integration, and optional E2E** tests each have a role
4. **Consistent utilities** make tests easier to write and maintain

For more details, see:

- [Architecture Guide](./architecture.md)
- [Development Guide](./development-guide.md)
- [README](../README.md)
