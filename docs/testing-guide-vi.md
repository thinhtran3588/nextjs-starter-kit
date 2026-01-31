# Testing Guide

Tài liệu này mô tả cách tiếp cận testing frontend. Cách làm căn cứ theo Clean Architecture trong `docs/architecture.md` và yêu cầu chặt chẽ tương đương hướng dẫn testing backend.

## Mục lục

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

Frontend dùng **Vitest** cho testing, **React Testing Library** cho UI tests. Chiến lược theo hướng layered, modular:

- **Unit Tests**: Kiểm tra logic domain, application và infrastructure trong cô lập.
- **Component Tests**: Kiểm tra component presentation khi người dùng tương tác với UI.
- **Integration Tests**: Kiểm tra luồng module kết hợp application logic, API client và UI.
- **E2E Tests (nếu cấu hình)**: Kiểm tra hành trình người dùng đầy đủ trong môi trường browser.

### Key Testing Principles

1. **100% Coverage Mandatory**: Mọi lines, functions, branches và statements phải được cover.
2. **Test Close to the User**: Ưu tiên kiểm tra hành vi và kết quả thay vì chi tiết implementation.
3. **Isolation First**: Mock dịch vụ bên ngoài và API trong unit/component tests.
4. **Readable Tests**: Tên test rõ, cấu trúc nhất quán và kỳ vọng rõ ràng.

## Test Configuration

Cấu hình test nên đặt trong `vitest.config.ts`. Cài đặt frontend thường gồm:

- **Environment**: `jsdom` cho DOM APIs
- **Setup file**: `src/__tests__/test-utils/setup.ts` để đăng ký `@testing-library/jest-dom`, mock browser APIs và biến môi trường
- **Coverage thresholds**: 100% cho mọi metric
- **Path aliases**: Khớp với alias của app (vd. `@/` → `src/`)

Khi không chắc, tham chiếu cấu hình trong `vitest.config.ts` và script trong `package.json`.

## Test Types

### Unit Tests

**Purpose**: Test logic thuần và hàm không cần render React.

**Targets**:

- Domain types và Zod schemas
- Application use cases và stores
- Infrastructure API client helpers và utilities

**Tools**: `vitest`, `vi.fn()`, `vi.mock()`

### Component Tests

**Purpose**: Kiểm tra hành vi UI và tương tác người dùng.

**Targets**:

- Page-level components trong `src/modules/{module}/pages/`
- Shared components trong `src/common/components/`
- Form flows dùng React Hook Form và Zod

**Tools**: React Testing Library, `user-event`, `@testing-library/jest-dom`

### Integration Tests

**Purpose**: Kiểm tra luồng module qua nhiều layer.

**Targets**:

- Phối hợp component + application use case + API client
- Error handling và validation surfaces
- Luồng theo module (auth, settings, dashboard)

**Tools**: React Testing Library + mocked API (nên dùng MSW)

### E2E Tests (Optional)

Nếu cấu hình, E2E test kiểm tra hành trình người dùng đầy đủ trên browser thật với công cụ như Playwright hoặc Cypress. Cần cover:

- Authentication flows
- Đường điều hướng quan trọng
- Form submission end-to-end

## Test Organization

Tổ chức test phản chiếu cấu trúc production:

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

- Test kết thúc bằng `.test.ts` hoặc `.spec.ts`
- Khớp tên và vị trí file nguồn khi có thể
- Ví dụ: `login-form.tsx` → `login-form.test.tsx`

## Test Coverage Requirements

**100% coverage là bắt buộc** cho:

- **Lines**
- **Functions**
- **Branches**
- **Statements**

### Branch Coverage Notes

Mọi nhánh điều kiện phải được test, gồm:

- Nullish coalescing (`??`)
- Ternary (`? :`)
- Optional chaining (`?.`)
- Logical operators (`&&`, `||`)

### Coverage Exclusions

Chỉ bỏ qua test cho:

- Pure type definitions và enums
- Configuration files
- Test utilities

## Writing Tests

### Structure Pattern

Dùng mẫu Arrange-Act-Assert (AAA):

1. **Arrange**: Chuẩn bị input, mocks và môi trường
2. **Act**: Thực hiện hành vi
3. **Assert**: Kiểm tra kết quả và side effects

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

- Mặc định **Server Components**; chỉ Client Components dùng hooks.
- Trong test, tập trung vào **output** và **hành vi** của component.
- Giữ boundary `use client` nhỏ và test phần client tối thiểu.

## Test Utilities and Helpers

Tạo helper dùng chung trong `src/__tests__/test-utils/`:

- `render.tsx`: Bọc component với providers (i18n, theme, store)
- `fixtures.ts`: Dữ liệu test dùng chung
- `setup.ts`: Setup toàn cục (jest-dom, mocks)

Các helper giảm boilerplate và giữ test nhất quán.

## Running Tests

Script thường dùng (xem `package.json` để biết tên chính xác):

```bash
npm test
npm run test:watch
npm run test:coverage
npm run test:ui
npm run validate
```

## Best Practices

1. **Test behavior, not implementation**
2. **Ưu tiên query theo role/label** thay vì `data-testid`
3. **Mock external APIs** với MSW để test ổn định
4. **Tránh snapshot dễ vỡ** trừ khi mang lại giá trị rõ
5. **Giữ test nhanh**; dành E2E cho luồng quan trọng
6. **Cover edge cases** (null, giá trị rỗng, input không hợp lệ)
7. **Duy trì 100% coverage** cho mọi metric

## Summary

Hướng dẫn này thiết lập chuẩn testing frontend phù hợp Clean Architecture của dự án:

1. **100% coverage** là bắt buộc
2. **Tổ chức test** phản chiếu cấu trúc module
3. **Unit, component, integration và E2E (tùy chọn)** mỗi loại có vai trò riêng
4. **Utilities nhất quán** giúp viết và bảo trì test dễ hơn

Chi tiết thêm:

- [Architecture Guide](./architecture.md)
- [Development Guide](./development-guide.md)
- [README](../README.md)
