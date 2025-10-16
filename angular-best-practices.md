# Modern Angular Development Guidelines

## Core Principles

1. **Signals-First Approach**
   - Use `signal()` for all reactive state management
   - Replace `BehaviorSubject` and observables with signals where possible
   - Use `computed()` for derived state instead of manual calculations
   - Use `effect()` sparingly, only for side effects (logging, DOM manipulation, external system sync)
   - Never mutate signal values directly; always use `.set()` or `.update()`

2. **Standalone Components**
   - Always create standalone components with `standalone: true`
   - Never create or use NgModules for new code
   - Import dependencies directly in component metadata using `imports` array
   - Use `bootstrapApplication()` in main.ts instead of `bootstrapModule()`
   - Provide services using `providers` array in component or route config

3. **Modern Control Flow Syntax**
   - Use `@if`, `@else`, `@else if` instead of `*ngIf`
   - Use `@for` with mandatory `track` expression instead of `*ngFor`
   - Use `@switch`, `@case`, `@default` instead of `*ngSwitch`
   - Use `@defer` for lazy loading components and code splitting
   - Add `@placeholder`, `@loading`, and `@error` blocks to `@defer` for better UX
   - Use `@empty` block with `@for` to handle empty arrays

4. **Dependency Injection**
   - Use `inject()` function inside class properties instead of constructor injection
   - Avoid constructors entirely unless you need inheritance or complex initialization
   - Leverage `providedIn: 'root'` for singleton services
   - Use functional guards instead of class-based guards
   - Use functional resolvers instead of class-based resolvers
   - Use functional interceptors with `HttpInterceptorFn`

5. **Input and Output Signals**
   - Use `input()` function instead of `@Input()` decorator
   - Use `input.required()` for mandatory inputs
   - Provide default values with `input(defaultValue)`
   - Use `output()` function instead of `@Output()` decorator
   - Call `.emit()` on outputs to emit values

6. **Resource API for Async Data**
   - Use `resource()` for loading async data that depends on signals
   - Define `request` function that returns reactive dependencies
   - Define `loader` function that performs the actual data fetching
   - Access loading state with `.isLoading()`
   - Access data with `.value()`
   - Access errors with `.error()`

7. **RxJS Integration**
   - Convert observables to signals using `toSignal()`
   - Provide `initialValue` or use `{ requireSync: true }` with `toSignal()`
   - Convert signals to observables using `toObservable()` when needed
   - Prefer signals over RxJS for simple state management
   - Keep RxJS for complex async operations (retry, debounce, combineLatest, merge, etc.)
   - Keep RxJS for event streams and HTTP requests

8. **Router**
   - Define routes using `Routes` array
   - Use `loadComponent` for lazy loading instead of `loadChildren`
   - Use functional guards with `canActivate`, `canActivateChild`, `canDeactivate`
   - Use functional resolvers
   - Use `withComponentInputBinding()` to bind route params to component inputs
   - Use `provideRouter()` in app.config.ts

9. **Effects Usage**
   - Only use `effect()` for side effects, not for deriving state
   - Never update signals inside effects that the effect reads (creates infinite loops)
   - Use `computed()` instead if you're deriving one signal from another
   - Use `allowSignalWrites: true` option carefully if you must write signals in effects
   - Consider using `effect()` in services for logging, analytics, localStorage sync

10. **Forms**
    - Use reactive forms over template-driven forms
    - Consider using typed forms with `FormControl<T>`, `FormGroup<T>`
    - Import `ReactiveFormsModule` in standalone components
    - Use signals to manage form state when appropriate
    - Use `toSignal()` to convert form value changes to signals

## What to AVOID

- NgModules (except for legacy library compatibility)
- `*ngIf`, `*ngFor`, `*ngSwitch` structural directives
- Constructor injection pattern
- `@Input()` and `@Output()` decorators
- Class-based guards, resolvers, and interceptors
- Excessive use of `effect()` for state derivation
- Using RxJS `BehaviorSubject` for simple component state
- Mutating signal values directly
- Creating components without `standalone: true`
- Forgetting `track` expression in `@for` loops

## When to Still Use RxJS

- Complex async operations (retry logic, exponential backoff)
- Combining multiple streams (combineLatest, merge, zip)
- Event handling with operators (debounceTime, throttleTime, distinctUntilChanged)
- HTTP requests (Angular's HttpClient returns observables)
- WebSocket or SSE streams
- Complex state machines with many transitions

## Best Practices

- Keep components small and focused
- Use `computed()` for any derived state
- Use `effect()` only for side effects outside Angular's scope
- Always provide `track` function in `@for` loops (use unique IDs)
- Use `@defer` for heavy components to improve initial load time
- Use signal inputs/outputs for better type safety and reactivity
- Convert observables to signals at component boundaries
- Use `resource()` for data fetching tied to reactive dependencies
- Provide services at the appropriate level (root, route, component)
- Use functional programming patterns (pure functions, immutability)