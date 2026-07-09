import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CategoryDistribution from '../../../app/components/lib/CategoryDistribution/CategoryDistribution.vue'
import { testA11y } from '../../utils/test-helpers'

describe('CategoryDistribution Component', () => {
  const defaultStubs = {
    UCard: {
      template: '<div class="u-card"><slot /></div>'
    }
  }

  const defaultCategories = [
    { label: 'Category A', percentage: 40, color: '#10b981', value: 400 },
    { label: 'Category B', percentage: 35, color: '#f59e0b', value: 350 },
    { label: 'Category C', percentage: 25, color: '#ef4444', value: 250 }
  ]

  const defaultProps = {
    primaryValue: '1,000',
    categories: defaultCategories
  }

  describe('Rendering', () => {
    it('renders with required props', () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })
      expect(wrapper.find('.u-card').exists()).toBe(true)
    })

    it('displays primary value', () => {
      const wrapper = mount(CategoryDistribution, {
        props: { ...defaultProps, primaryValue: '$5,234' },
        global: { stubs: defaultStubs }
      })
      expect(wrapper.text()).toContain('$5,234')
    })

    it('displays primary value as number', () => {
      const wrapper = mount(CategoryDistribution, {
        props: { ...defaultProps, primaryValue: 1234 },
        global: { stubs: defaultStubs }
      })
      expect(wrapper.text()).toContain('1234')
    })
  })

  describe('Distribution Bar', () => {
    it('renders bar segments for each category', () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })
      const bars = wrapper.findAll('.rounded-full.transition-all')
      expect(bars.length).toBe(3)
    })

    it('applies correct width percentages', () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })
      const bars = wrapper.findAll('.rounded-full.transition-all')

      expect(bars[0].attributes('style')).toContain('width: 40%')
      expect(bars[1].attributes('style')).toContain('width: 35%')
      expect(bars[2].attributes('style')).toContain('width: 25%')
    })

    it('applies correct background colors', () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })
      const bars = wrapper.findAll('.rounded-full.transition-all')

      // Colors can be in hex or rgb format depending on the browser
      expect(bars[0].attributes('style')).toContain('#10b981')
      expect(bars[1].attributes('style')).toContain('#f59e0b')
      expect(bars[2].attributes('style')).toContain('#ef4444')
    })

    it('handles single category', () => {
      const wrapper = mount(CategoryDistribution, {
        props: {
          primaryValue: '100',
          categories: [{ label: 'Only One', percentage: 100, color: '#10b981' }]
        },
        global: { stubs: defaultStubs }
      })
      const bars = wrapper.findAll('.rounded-full.transition-all')
      expect(bars.length).toBe(1)
      expect(bars[0].attributes('style')).toContain('width: 100%')
    })

    it('handles many categories', () => {
      const manyCategories = Array(10).fill(null).map((_, i) => ({
        label: `Cat ${i}`,
        percentage: 10,
        color: `#${i}${i}${i}${i}${i}${i}`
      }))

      const wrapper = mount(CategoryDistribution, {
        props: { primaryValue: '100', categories: manyCategories },
        global: { stubs: defaultStubs }
      })
      const bars = wrapper.findAll('.rounded-full.transition-all')
      expect(bars.length).toBe(10)
    })
  })

  describe('Legend', () => {
    it('renders legend items for each category', () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })
      // Legend items have color dots
      const legendDots = wrapper.findAll('.h-2.w-2.rounded-full')
      expect(legendDots.length).toBe(3)
    })

    it('displays category labels (first word only by default)', () => {
      const wrapper = mount(CategoryDistribution, {
        props: {
          primaryValue: '100',
          categories: [
            { label: 'First Category', percentage: 50, color: '#10b981' },
            { label: 'Second Category', percentage: 50, color: '#ef4444' }
          ]
        },
        global: { stubs: defaultStubs }
      })
      expect(wrapper.text()).toContain('First')
      expect(wrapper.text()).toContain('Second')
    })

    it('applies legend colors correctly', () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })
      const legendDots = wrapper.findAll('.h-2.w-2.rounded-full')

      // Colors can be in hex format
      expect(legendDots[0].attributes('style')).toContain('#10b981')
      expect(legendDots[1].attributes('style')).toContain('#f59e0b')
    })

    it('applies custom legendClass', () => {
      const wrapper = mount(CategoryDistribution, {
        props: { ...defaultProps, legendClass: 'custom-legend-class' },
        global: { stubs: defaultStubs }
      })
      const legend = wrapper.find('.custom-legend-class')
      expect(legend.exists()).toBe(true)
    })
  })

  describe('Trend Indicator', () => {
    it('displays trend value when provided', () => {
      const wrapper = mount(CategoryDistribution, {
        props: {
          ...defaultProps,
          trend: { value: '+12%', direction: 'up' as const }
        },
        global: { stubs: defaultStubs }
      })
      expect(wrapper.text()).toContain('+12%')
    })

    it('applies success class for upward trend', () => {
      const wrapper = mount(CategoryDistribution, {
        props: {
          ...defaultProps,
          trend: { value: '+5%', direction: 'up' as const }
        },
        global: { stubs: defaultStubs }
      })
      const trendElement = wrapper.find('.text-success')
      expect(trendElement.exists()).toBe(true)
    })

    it('applies error class for downward trend', () => {
      const wrapper = mount(CategoryDistribution, {
        props: {
          ...defaultProps,
          trend: { value: '-3%', direction: 'down' as const }
        },
        global: { stubs: defaultStubs }
      })
      const trendElement = wrapper.find('.text-error')
      expect(trendElement.exists()).toBe(true)
    })

    it('applies muted class for neutral trend', () => {
      const wrapper = mount(CategoryDistribution, {
        props: {
          ...defaultProps,
          trend: { value: '0%', direction: 'neutral' as const }
        },
        global: { stubs: defaultStubs }
      })
      const trendElement = wrapper.find('.text-muted')
      expect(trendElement.exists()).toBe(true)
    })

    it('does not render trend when not provided', () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })
      // Check that trend-specific classes are not present
      const successTrend = wrapper.find('.text-success.text-sm')
      const errorTrend = wrapper.find('.text-error.text-sm')
      expect(successTrend.exists()).toBe(false)
      expect(errorTrend.exists()).toBe(false)
    })
  })

  describe('Gap Variants', () => {
    it('applies small gap class by default', () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })
      const barContainer = wrapper.find('.flex.h-2.w-full')
      expect(barContainer.classes()).toContain('gap-1')
    })

    it('applies small gap class for gap="sm"', () => {
      const wrapper = mount(CategoryDistribution, {
        props: { ...defaultProps, gap: 'sm' as const },
        global: { stubs: defaultStubs }
      })
      const barContainer = wrapper.find('.flex.h-2.w-full')
      expect(barContainer.classes()).toContain('gap-1')
    })

    it('applies large gap class for gap="lg"', () => {
      const wrapper = mount(CategoryDistribution, {
        props: { ...defaultProps, gap: 'lg' as const },
        global: { stubs: defaultStubs }
      })
      const barContainer = wrapper.find('.flex.h-2.w-full')
      expect(barContainer.classes()).toContain('gap-2')
    })

    it('applies extra-large gap class for gap="xl"', () => {
      const wrapper = mount(CategoryDistribution, {
        props: { ...defaultProps, gap: 'xl' as const },
        global: { stubs: defaultStubs }
      })
      const barContainer = wrapper.find('.flex.h-2.w-full')
      expect(barContainer.classes()).toContain('gap-4')
    })
  })

  describe('Tooltip', () => {
    it('shows tooltip on mouseenter', async () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })

      const firstBar = wrapper.findAll('.rounded-full.transition-all')[0]
      await firstBar.trigger('mouseenter', {
        clientX: 100,
        clientY: 100
      })

      await nextTick()

      // Tooltip should be visible
      const tooltip = wrapper.find('.pointer-events-none.fixed')
      expect(tooltip.exists()).toBe(true)
    })

    it('displays category label in tooltip', async () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })

      const firstBar = wrapper.findAll('.rounded-full.transition-all')[0]
      await firstBar.trigger('mouseenter', {
        clientX: 100,
        clientY: 100
      })

      await nextTick()

      expect(wrapper.text()).toContain('Category A')
    })

    it('displays category value in tooltip', async () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })

      const firstBar = wrapper.findAll('.rounded-full.transition-all')[0]
      await firstBar.trigger('mouseenter', {
        clientX: 100,
        clientY: 100
      })

      await nextTick()

      expect(wrapper.text()).toContain('400')
    })

    it('hides tooltip on mouseleave', async () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })

      const firstBar = wrapper.findAll('.rounded-full.transition-all')[0]

      // Show tooltip
      await firstBar.trigger('mouseenter', { clientX: 100, clientY: 100 })
      await nextTick()

      // Hide tooltip
      await firstBar.trigger('mouseleave')
      await nextTick()

      const tooltip = wrapper.find('.pointer-events-none.fixed')
      expect(tooltip.exists()).toBe(false)
    })

    it('updates tooltip position on mousemove', async () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })

      const firstBar = wrapper.findAll('.rounded-full.transition-all')[0]

      await firstBar.trigger('mouseenter', { clientX: 100, clientY: 100 })
      await nextTick()

      await firstBar.trigger('mousemove', { clientX: 200, clientY: 150 })
      await nextTick()

      const tooltip = wrapper.find('.pointer-events-none.fixed')
      // Tooltip position should be updated (offset by 12px)
      expect(tooltip.attributes('style')).toContain('left: 212px')
      expect(tooltip.attributes('style')).toContain('top: 162px')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty categories array', () => {
      const wrapper = mount(CategoryDistribution, {
        props: { primaryValue: '0', categories: [] },
        global: { stubs: defaultStubs }
      })
      expect(wrapper.find('.u-card').exists()).toBe(true)
      const bars = wrapper.findAll('.rounded-full.transition-all')
      expect(bars.length).toBe(0)
    })

    it('handles categories without value property', async () => {
      const wrapper = mount(CategoryDistribution, {
        props: {
          primaryValue: '100',
          categories: [
            { label: 'No Value', percentage: 100, color: '#10b981' }
          ]
        },
        global: { stubs: defaultStubs }
      })

      const bar = wrapper.find('.rounded-full.transition-all')
      await bar.trigger('mouseenter', { clientX: 100, clientY: 100 })
      await nextTick()

      // Should still show tooltip without crashing
      expect(wrapper.find('.pointer-events-none.fixed').exists()).toBe(true)
    })

    it('handles percentages that do not add up to 100', () => {
      const wrapper = mount(CategoryDistribution, {
        props: {
          primaryValue: '100',
          categories: [
            { label: 'A', percentage: 30, color: '#10b981' },
            { label: 'B', percentage: 30, color: '#ef4444' }
          ] // Only 60%
        },
        global: { stubs: defaultStubs }
      })

      const bars = wrapper.findAll('.rounded-full.transition-all')
      expect(bars.length).toBe(2)
      // Bars should render with their specified widths
      expect(bars[0].attributes('style')).toContain('width: 30%')
      expect(bars[1].attributes('style')).toContain('width: 30%')
    })

    it('handles very small percentages', () => {
      const wrapper = mount(CategoryDistribution, {
        props: {
          primaryValue: '100',
          categories: [
            { label: 'Tiny', percentage: 0.5, color: '#10b981' },
            { label: 'Rest', percentage: 99.5, color: '#ef4444' }
          ]
        },
        global: { stubs: defaultStubs }
      })

      const bars = wrapper.findAll('.rounded-full.transition-all')
      expect(bars[0].attributes('style')).toContain('width: 0.5%')
    })
  })

  describe('Reactive Updates', () => {
    it('updates when primaryValue changes', async () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })

      expect(wrapper.text()).toContain('1,000')

      await wrapper.setProps({ primaryValue: '2,500' })
      expect(wrapper.text()).toContain('2,500')
    })

    it('updates bars when categories change', async () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })

      let bars = wrapper.findAll('.rounded-full.transition-all')
      expect(bars.length).toBe(3)

      await wrapper.setProps({
        categories: [
          { label: 'New A', percentage: 50, color: '#10b981' },
          { label: 'New B', percentage: 50, color: '#ef4444' }
        ]
      })

      bars = wrapper.findAll('.rounded-full.transition-all')
      expect(bars.length).toBe(2)
    })

    it('updates trend when it changes', async () => {
      const wrapper = mount(CategoryDistribution, {
        props: {
          ...defaultProps,
          trend: { value: '+5%', direction: 'up' as const }
        },
        global: { stubs: defaultStubs }
      })

      expect(wrapper.find('.text-success').exists()).toBe(true)

      await wrapper.setProps({
        trend: { value: '-5%', direction: 'down' as const }
      })

      expect(wrapper.find('.text-error').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const wrapper = mount(CategoryDistribution, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })
      await testA11y(wrapper)
    })
  })
})
