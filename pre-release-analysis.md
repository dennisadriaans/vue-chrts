## Executive verdict

## Release remediation checklist

Work in this order; later tasks depend on the shared contracts introduced by
the earlier ones. A checked item means its implementation and regression tests
have passed, not merely that work has started.

### P0 — stable-release blockers

- [x] Add shared finite-number normalization and an explicit invalid-data policy.
- [x] Apply normalization before every domain and SVG geometry calculation; show an intentional empty state when no valid data remains.
- [x] Add a shared accessible-chart contract (`ariaLabel`, `ariaDescription`, and an optional screen-reader data table) to every chart.
- [x] Add keyboard datum navigation and a non-pointer tooltip/data alternative.
- [x] Define a supported SVG dataset limit, warn in development, and sample dense series before rendering.
- [x] Implement or remove every inert public tooltip/animation prop; use milliseconds consistently.
- [x] Standardize tooltip title formatting across every chart that exposes it.

### P1 — API and architecture hardening

- [x] Narrow Bubble's public contract to the functionality it actually supports.
- [x] Add record-based `data` + `nameKey`/`valueKey` APIs for Donut, Radial Bar, and Funnel while retaining positional-array compatibility.
- [x] Constrain plotted fields with `NumericKeys<T>` and add compile-time contract tests.
- [x] Standardize loading, empty, error, and partial-data states across all chart components.
- [x] Make hidden and zero-sized container behavior consistent, including Candlestick.
- [x] Centralize locale-aware number, currency, percentage, date, and time formatting.

### P2 — release confidence and maintenance

- [x] Replace remaining semantic chart/status colors with documented theme tokens.
- [x] Review component CSS layering and document the host-layering contract.
- [x] Add regression coverage for numeric pathology, accessibility, record-data, type, and sampling contracts.
- [x] Add and document a maintained torture playground page and supported performance limits.
- [x] Explicitly document that this package supports Nuxt; Vue/Vite uses `vue-chrts`.
- [x] Remove duplicate declaration artifacts from packed output and verify the production package build.

  Not production ready for a stable 3.0.0 release. Nuxt 3/4 production builds, packaging, TypeScript, and basic cross-browser rendering work, but
  malformed numeric data can produce invalid SVG geometry, core chart information is not accessible, and large datasets can exhaust memory. Several
  documented public props are silently ignored, creating significant API-stability risk. Continue with beta releases until the P0 findings are
  resolved.

  The repository is clean, and the current package version is 3.0.0-beta.3.

  ## Readiness scorecard

   Area                        Rating     Summary
  ━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Architecture                PARTIAL    Good shared Cartesian frame, but Bubble, polar, funnel, and candlestick logic has drifted or been
                                          duplicated.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Public API / DX             FAIL       Public props are inconsistently implemented; some are complete no-ops.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   TypeScript                  PARTIAL    Declarations and generic keys work, but numeric fields and series relationships are weakly constrained.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Data robustness             FAIL       NaN/Infinity and malformed candlestick data can create invalid SVG.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Formatting                  PARTIAL    Custom formatters exist, but behavior is inconsistent and default formatting is duplicated.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Responsiveness              PARTIAL    Shared charts use ResizeObserver; zero-sized and hidden-container behavior remains inconsistent.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Interactions                PARTIAL    Cartesian interaction is reasonable; custom charts use separate, mostly pointer-only systems.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Accessibility               FAIL       Charts lack usable names, descriptions, keyboard exploration, and accessible data alternatives.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   SSR / hydration             PARTIAL    Production hydration succeeds, but every chart is forced client-only and SSR emits empty placeholders.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Packaging / tree-shaking    PARTIAL    Real tarball works, but manual component imports are unsupported and a simple chart adds substantial
                                          client JS.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Framework compatibility     PARTIAL    Packaged Nuxt 3 and Nuxt 4 consumers build; Vue/Vite is not supported or tested.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Browser compatibility       PARTIAL    Basic BarChart passed Chromium, Firefox, and WebKit; broader interactions and SVG cases remain untested.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Performance                 FAIL       10,000 points are already slow; 50,000 caused a 4 GB Node worker OOM.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Styling / theming           PASS       Strong scoped variables, dark-mode support, and reduced-motion handling; a few hardcoded colors remain.
  ──────────────────────────  ─────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────
   Automated testing           PARTIAL    237 tests pass, but integration, accessibility, pathology, visual, and performance coverage is missing.

  ## Critical issues

  ### P0 — Invalid data can create broken SVG

  - Affected: packages/nuxt-charts-next/src/runtime/components/CandlestickChart.vue:48, Donut and other numeric-series adapters.
  - Evidence: Candlestick values are blindly converted with Number() and passed into Math.min, scales, and geometry. Runtime torture tests produced
    NaN/Infinity geometry for malformed candlestick and donut input.

  - Impact: A single bad API value can make a chart disappear, corrupt SVG attributes, or generate browser warnings.
  - Fix: Add one shared normalization layer with an explicit policy for null, missing, NaN, and infinity. Filter or gap invalid points before domain
    and geometry calculations, and render an intentional empty/error state when nothing valid remains.

  ### P0 — Core chart information is inaccessible

  - Affected: all chart adapters and packages/nuxt-charts-next/src/runtime/components/StatusTrackerChart.vue:116.
  - Evidence: A rendered BarChart exposes role="application" with empty <title> and <desc>. Public props provide no chart label/description or
    accessible data table. Tooltips and custom chart interaction are predominantly pointer-only. StatusTracker places detailed labels beneath a
    role="img" container, whose descendants are generally flattened.

  - Impact: Screen-reader and keyboard users cannot access the primary information.
  - Fix: Add consistent ariaLabel, ariaDescription, and accessible-table support to the chart base API. Provide keyboard datum navigation or a non-
    interactive table equivalent; verify the resulting accessibility tree.

  ### P0 — Large datasets can freeze or exhaust memory

  - Affected: Bar and other SVG-per-point chart implementations.
  - Evidence: The render benchmark measured approximately 191 ms for 500 points, 298 ms for 1,000, and 5.9 seconds for 10,000. A 50,000-point render
    exhausted a 4 GB Node worker after roughly 25 seconds. The DOM grows roughly linearly at about two nodes per datum.

  - Impact: Large datasets can block the UI or crash rendering processes.
  - Fix: Set and document supported limits, warn in development, introduce sampling/aggregation for dense Cartesian series, and investigate a canvas
    or optimized path-based renderer for genuinely large inputs.

  ## High-impact DX issues

  1. Documented props silently do nothing
      - Affected: TooltipConfig (packages/nuxt-charts-next/src/runtime/types/shared.ts:96), chart duration props.
      - Evidence: hideDelay, showDelay, and followCursor are declared but never read. Most charts treat duration only as an animation on/off flag;
        Sankey interprets it as an actual duration.

      - Why it matters: Consumers reasonably believe their configuration is active, making debugging difficult and locking the library into a
        misleading contract.

      - Fix: Implement these props consistently or remove/deprecate them before stable release. Define duration units once and test exact
        propagation.

  2. Tooltip formatter support varies by chart
      - Affected: tooltipTitleFormatter across Donut, Radar, RadialBar, Funnel, and Candlestick.
      - Evidence: The formatter is implemented in the shared Cartesian frame and Bubble but ignored by several other chart types despite appearing
        in their public types.

      - Fix: Create a shared tooltip formatting contract and adapter used by every chart.

  3. Bubble advertises more Cartesian functionality than it supports
      - Affected: BubbleChartProps (packages/nuxt-charts-next/src/runtime/types/charts.ts:392), BubbleChart.vue.
      - Evidence: It extends the complete Cartesian base but duplicates the frame and ignores inherited features such as multiple axes, reference
        lines, synchronization, axis labels, explicit ticks, and background patterns.

      - Fix: Either compose CartesianFrame or expose a deliberately narrower Bubble-specific base type.

  4. Positional data/category APIs are fragile
      - Affected: DonutChartProps (packages/nuxt-charts-next/src/runtime/types/charts.ts:477), RadialBarChartProps (packages/nuxt-charts-next/src/
        runtime/types/charts.ts:612), FunnelChartProps (packages/nuxt-charts-next/src/runtime/types/charts.ts:678).

      - Evidence: Numeric arrays are zipped to the insertion order of a separate categories object.
      - Why it matters: Labels, colors, and values can be mismatched, and ordinary application records require reshaping.
      - Fix: Prefer record-based data with nameKey/valueKey; retain positional arrays only as a compatibility overload.

  5. Type constraints do not prevent invalid series
      - Affected: chart prop definitions in src/runtime/types/charts.ts.
      - Evidence: keyof T accepts non-numeric fields for numeric axes, and category configurations are not tied to selected series keys.
      - Fix: Add NumericKeys<T>, typed series definitions, and type-level contract tests.

  ## Architecture risks

  - Candlestick is effectively a separate chart engine with its own SVG, scale, ticks, resize handling, formatting, and tooltip behavior. Its
    documentation still describes composition with the shared engine.

  - Bubble duplicates Cartesian-frame behavior and has already diverged from its inherited API.
  - Polar charts repeat container, legend, and tooltip coordination instead of sharing an interaction controller.
  - Formatting is distributed across ChartTooltip, candlestick, funnel, and StatusTracker using separate toLocaleString() calls.
  - Interaction state—active datum, active series, pointer position, crosshair, and legend state—is not a library-level abstraction.
  - All components are registered client-only in packages/nuxt-charts-next/src/core/components.ts:24, which prevents meaningful SSR content and
    accessible fallback output.

  ## Missing tests

  Add concrete coverage for:

  - Every chart with empty, null, missing, NaN, infinity, zero-only, negative, mixed-sign, duplicate timestamp, one-point, huge-number, tiny-number,
    Unicode, and long-label data.

  - Assertions that no rendered SVG attribute contains NaN or Infinity.
  - Type tests proving numeric-key inference and rejecting invalid series configurations.
  - Every declared tooltip, axis, animation, and formatter prop—especially currently inert props.
  - Loading, empty, error, and partial-data states for all 11 charts.
  - Accessible names, descriptions, keyboard use, tooltip alternatives, and accessible data tables.
  - SSR output and hydration without warnings.
  - A committed packaged-tarball consumer fixture for minimum and current Nuxt versions.
  - A Vue/Vite fixture, or explicit documentation that the package is Nuxt-only.
  - All chart types and tooltip interactions in Chromium, Firefox, and WebKit.
  - Visual regression in light/dark, narrow/wide, long-label, negative, empty, and active-tooltip states.
  - Repeatable 500/1k/10k/50k render, update, resize, tooltip, and memory benchmarks.
  - A dedicated torture page; the current variants page does not cover pathological inputs.

  ## Recommended release plan

  ### P0 — required before stable

  1. Normalize numeric data and prevent invalid SVG geometry.
  2. Add an accessible chart contract and data alternative.
  3. Establish supported dataset limits and prevent catastrophic large renders.
  4. Remove or implement all silently ignored public props before freezing the v3 API.

  ### P1 — strongly recommended

  1. Move Bubble and Candlestick toward shared frame, formatting, dimensions, and interaction systems.
  2. Replace positional polar/funnel data contracts with record-based APIs.
  3. Add numeric-key TypeScript constraints and type tests.
  4. Standardize loading, empty, error, and partial-data rendering.
  5. Handle hidden/zero-sized containers consistently; Candlestick currently retains its initial 600 px width when measured width is zero.

  ### P2 — improvement

  1. Centralize locale-aware number, currency, percentage, date, and time formatting.
  2. Replace remaining hardcoded series/status colors with documented theme tokens.
  3. Review the layered CSS strategy against unlayered host resets.
  4. Add a maintained torture page and documented performance guidance.
  5. Clean up duplicate declaration artifacts in the packed output.

  ## Small fixes completed

  - Bubble now renders the shared loading skeleton.
  - Bubble’s horizontal and vertical grid-line props now map correctly.
  - Added regression tests for both Bubble fixes.
  - Removed eight lint warnings from optional CubeBar shape props.
  - Updated README/package description for Sankey and missing type documentation.
  - Removed ten unused direct D3 and @types/d3-* dependencies.

  Final verification passed:

  - 237 tests across 13 files
  - ESLint with zero warnings/errors
  - Package and playground TypeScript checks
  - Module and Nuxt production builds
  - Real packed artifact installation/build under Nuxt 3 and Nuxt 4
  - Basic narrow/wide BarChart smoke tests in Chromium, Firefox, and WebKit

  My release recommendation is to keep 3.0.0-beta.3 as a beta and avoid publishing 3.0.0 under latest until the four P0 items are closed.
