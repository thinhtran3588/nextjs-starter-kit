# Testing Guide

本文档描述前端测试方式，与 `docs/architecture.md` 中的 Clean Architecture 对齐，并与后端测试指南保持同等严格程度。

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

前端使用 **Vitest** 做测试，**React Testing Library** 做 UI 测试，采用分层、模块化策略：

- **Unit Tests**：在隔离环境下验证 domain、application、infrastructure 逻辑。
- **Component Tests**：验证用户在 UI 上的交互与展示组件行为。
- **Integration Tests**：验证跨 application 逻辑、API client 与 UI 的 module 流程。
- **E2E Tests（若配置）**：在真实浏览器中验证完整用户流程。

### Key Testing Principles

1. **100% Coverage Mandatory**：lines、functions、branches、statements 均需覆盖。
2. **Test Close to the User**：优先测行为与结果，而非实现细节。
3. **Isolation First**：在 unit/component 测试中 mock 外部服务与 API。
4. **Readable Tests**：测试名清晰、结构一致、断言明确。

## Test Configuration

测试配置放在 `vitest.config.ts`。前端常见配置包括：

- **Environment**：`jsdom` 提供 DOM API
- **Setup file**：`src/__tests__/test-utils/setup.ts`，注册 `@testing-library/jest-dom`、mock 浏览器 API 与环境变量
- **Coverage thresholds**：各项指标 100%
- **Path aliases**：与项目别名一致（如 `@/` → `src/`）

有疑问时参考项目中的 `vitest.config.ts` 与 `package.json` 脚本。

## Test Types

### Unit Tests

**Purpose**：在不渲染 React 的情况下测试纯逻辑与函数。

**Targets**：

- Domain types 与 Zod schemas
- Application use cases 与 stores
- Infrastructure API client 的 helpers 与 utilities

**Tools**：`vitest`、`vi.fn()`、`vi.mock()`

### Component Tests

**Purpose**：验证 UI 行为与用户交互。

**Targets**：

- `src/modules/{module}/pages/` 下的页面级 components
- `src/common/components/` 下的共享 components
- 使用 React Hook Form 与 Zod 的表单流程

**Tools**：React Testing Library、`user-event`、`@testing-library/jest-dom`

### Integration Tests

**Purpose**：验证跨多层的 module 流程。

**Targets**：

- component + application use case + API client 的协作
- 错误处理与校验展示
- 按 module 的流程（auth、settings、dashboard 等）

**Tools**：React Testing Library + 被 mock 的 API（推荐 MSW）

### E2E Tests (Optional)

若配置 E2E，用 Playwright 或 Cypress 等在真实浏览器中验证完整用户流程，应覆盖：

- 认证流程
- 关键导航路径
- 端到端表单提交

## Test Organization

测试目录与生产代码结构对应：

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

- 测试文件以 `.test.ts` 或 `.spec.ts` 结尾。
- 尽量与源文件名称和位置对应。
- 示例：`login-form.tsx` → `login-form.test.tsx`。

## Test Coverage Requirements

以下指标**必须达到 100%**：

- **Lines**
- **Functions**
- **Branches**
- **Statements**

### Branch Coverage Notes

所有条件分支都要有测试，包括：

- 空值合并（`??`）
- 三元运算符（`? :`）
- 可选链（`?.`）
- 逻辑运算符（`&&`、`||`）

### Coverage Exclusions

仅对以下内容可排除覆盖：

- 纯类型定义与枚举
- 配置文件
- 测试用工具

## Writing Tests

### Structure Pattern

采用 Arrange-Act-Assert (AAA) 模式：

1. **Arrange**：准备输入、mocks 与环境。
2. **Act**：执行被测行为。
3. **Assert**：断言输出与副作用。

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

- 默认使用 **Server Components**；仅 Client Components 使用 hooks。
- 测试时关注 **输出**与**行为**。
- 尽量缩小 `use client` 边界，只测必要的 client 部分。

## Test Utilities and Helpers

在 `src/__tests__/test-utils/` 下提供共享测试工具：

- `render.tsx`：用 providers（i18n、theme、store）包装组件。
- `fixtures.ts`：共享测试数据。
- `setup.ts`：全局 setup（jest-dom、mocks）。

这些工具有助于减少重复并保持测试风格一致。

## Running Tests

常用脚本（以 `package.json` 为准）：

```bash
npm test
npm run test:watch
npm run test:coverage
npm run test:ui
npm run validate
```

## Best Practices

1. **Test behavior, not implementation**
2. **优先用 role/label 查询**，少用 `data-testid`
3. **用 MSW 等 mock 外部 API**，保证测试稳定
4. **慎用易碎的 snapshot**，除非收益明确
5. **保持测试快速**，E2E 只用于关键流程
6. **覆盖边界情况**（null、空值、非法输入）
7. **维持 100% coverage** 的各项指标

## Summary

本指南在与项目 Clean Architecture 一致的前提下约定前端测试标准：

1. **100% coverage** 为硬性要求
2. **测试组织**与 module 结构对应
3. **Unit、component、integration 与可选的 E2E** 各有分工
4. **统一的 utilities** 便于编写与维护测试

更多参考：

- [Architecture Guide](./architecture.md)
- [Development Guide](./development-guide.md)
- [README](../README.md)
