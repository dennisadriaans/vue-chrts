import { mount, type VueWrapper } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { expect } from 'vitest'
import type { ComponentPublicInstance, Component } from 'vue'

interface WrapperOptions {
  global?: Record<string, unknown>
  props?: Record<string, unknown>
  [key: string]: unknown
}

/**
 * Helper to create a wrapper with common test config
 */
export function createWrapper<T extends ComponentPublicInstance>(
  component: Component,
  options: WrapperOptions = {}
): VueWrapper<T> {
  const { global: globalOptions, ...restOptions } = options
  return mount(component, {
    global: {
      stubs: {
        UCard: {
          template: '<div class="u-card"><slot name="header" /><slot /></div>'
        },
        UIcon: {
          template: '<span class="u-icon" />'
        },
        UTooltip: {
          template: '<div><slot /></div>'
        },
        UButton: {
          template: '<button><slot /></button>'
        },
        USwitch: {
          template: '<input type="checkbox" />'
        },
        USlider: {
          template: '<input type="range" />'
        },
        USelect: {
          template: '<select><slot /></select>'
        },
        UTabs: {
          template: '<div><slot /></div>'
        }
      },
      ...(globalOptions as Record<string, unknown>)
    },
    ...restOptions
  }) as VueWrapper<T>
}

/**
 * Run accessibility tests on a component
 * Note: The 'region' rule is disabled because isolated components are not expected
 * to be wrapped in landmarks - that's a page-level concern.
 */
export async function testA11y(wrapper: VueWrapper<ComponentPublicInstance>): Promise<void> {
  const results = await axe(wrapper.element as HTMLElement, {
    rules: {
      region: { enabled: false }
    }
  })
  // @ts-expect-error: toHaveNoViolations is a custom matcher from vitest-axe
  expect(results).toHaveNoViolations()
}

/**
 * Wait for component to update after reactive changes
 */
export async function waitForUpdate(wrapper: VueWrapper<ComponentPublicInstance>): Promise<void> {
  await wrapper.vm.$nextTick()
}

/**
 * Simulate container resize for components with ResizeObserver
 */
export function mockContainerWidth(width: number): void {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: width
  })
}

/**
 * Create mock status data for StatusTracker tests
 */
export function createMockStatusData(
  count: number,
  pattern: ('online' | 'offline' | 'empty')[] = ['online']
): { status: string }[] {
  return Array.from({ length: count }, (_, i) => ({
    status: pattern[i % pattern.length]
  }))
}

/**
 * Create mock category data for CategoryDistribution tests
 */
export function createMockCategories(count: number) {
  const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']
  return Array.from({ length: count }, (_, i) => ({
    label: `Category ${i + 1}`,
    percentage: Math.floor(100 / count),
    color: colors[i % colors.length],
    value: Math.floor(Math.random() * 1000)
  }))
}
