---
name: angular-modern-development
description: Enforces modern Angular (v18+) best practices including Signals, Standalone components, Resource API, and modern control flow. Use when generating or refactoring Angular code.
---

When working on Angular components, services, or architecture, always follow these modern guidelines:

## 1. Signals-First Approach
- Use `signal()` for all reactive state management.
- Replace `BehaviorSubject` and observables with signals where possible.
- Use `computed()` for derived state instead of manual calculations.
- Use `effect()` sparingly, only for side-effects (logging, DOM, external sync).
- Never mutate signals directly; use `.set()` or `.update()`.

## 2. Standalone Components
- Set `standalone: true` for all components.
- Avoid `NgModules` entirely.
- Use `imports: []` in metadata and `inject()` for dependency injection.

## 3. Modern Control Flow & Defer
- Use `@if`, `@else`, `@for` (with `track`), and `@switch` syntax.
- Utilize `@defer` for lazy loading heavy components with `@placeholder` and `@loading` blocks.

## 4. Input and Output Signals
- Use `input()` or `input.required()` instead of `@Input()`.
- Use `output()` instead of `@Output()`.

## 5. Resource API
- Use `resource()` for async data fetching that depends on reactive state.
- Access states via `.isLoading()`, `.value()`, and `.error()`.

## 6. Dependency Injection
- Use the `inject()` function for and properties/dependencies.
- Prefer functional guards, resolvers, and interceptors (`HttpInterceptorFn`).

## 7. RxJS Integration
- Convert observables to signals via `toSignal()` at component boundaries.
- Keep RxJS for complex async logic (retry, debounce, multiple stream combination).

## 8. What to AVOID
- `*ngIf`, `*ngFor` structural directives.
- Constructor injection.
- `@Input()` and `@Output()` decorators.
- Class-based guards and resolvers.
- Mutating signall values directly.

## 9. Best Practices
- Keep components small and focused.
- Always provide a `track` expression in `@for` loops.
- Use typed forms with `FormControl<T>`.
- Provide services with `providedIn: 'root'` or at route level.