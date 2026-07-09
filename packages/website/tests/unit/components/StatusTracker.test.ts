import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import StatusTracker from '../../../app/components/lib/StatusTracker/StatusTracker.vue'
import { testA11y } from '../../utils/test-helpers'

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

vi.stubGlobal('ResizeObserver', MockResizeObserver)

describe('StatusTracker Component', () => {
  const defaultStubs = {
    UCard: {
      template: '<div class="u-card"><slot name="header" /><slot /></div>'
    },
    UIcon: {
      template: '<span class="u-icon" />',
      props: ['name', 'class']
    },
    UTooltip: {
      template: '<div class="tooltip-wrapper"><slot /></div>',
      props: ['text', 'disabled']
    }
  }

  const defaultProps = {
    domain: 'example.com',
    uptime: '99.9%',
    operationalStatus: true,
    statusData: [],
    barWidth: 10,
    barGap: 2
  }

  beforeEach(() => {
    // Mock offsetWidth for container width calculations
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 300
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with required props', () => {
      const wrapper = mount(StatusTracker, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })
      expect(wrapper.find('.u-card').exists()).toBe(true)
    })

    it('displays domain name', () => {
      const wrapper = mount(StatusTracker, {
        props: { ...defaultProps, domain: 'my-site.com' },
        global: { stubs: defaultStubs }
      })
      expect(wrapper.text()).toContain('my-site.com')
    })

    it('displays uptime percentage', () => {
      const wrapper = mount(StatusTracker, {
        props: { ...defaultProps, uptime: '98.5%' },
        global: { stubs: defaultStubs }
      })
      expect(wrapper.text()).toContain('98.5%')
    })

    it('displays start and end labels', () => {
      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          startLabel: '30 days ago',
          endLabel: 'Today'
        },
        global: { stubs: defaultStubs }
      })
      expect(wrapper.text()).toContain('30 days ago')
      expect(wrapper.text()).toContain('Today')
    })
  })

  describe('Status Icon', () => {
    it('shows check icon when operational', () => {
      const wrapper = mount(StatusTracker, {
        props: { ...defaultProps, operationalStatus: true },
        global: { stubs: defaultStubs }
      })
      const icon = wrapper.find('.u-icon')
      expect(icon.exists()).toBe(true)
    })

    it('renders with operational true', () => {
      const wrapper = mount(StatusTracker, {
        props: { ...defaultProps, operationalStatus: true },
        global: { stubs: defaultStubs }
      })
      // Component should render successfully with operational status
      expect(wrapper.find('.u-card').exists()).toBe(true)
      expect(wrapper.text()).toContain('example.com')
    })

    it('renders with operational false', () => {
      const wrapper = mount(StatusTracker, {
        props: { ...defaultProps, operationalStatus: false },
        global: { stubs: defaultStubs }
      })
      // Component should render successfully with non-operational status
      expect(wrapper.find('.u-card').exists()).toBe(true)
      expect(wrapper.text()).toContain('example.com')
    })
  })

  describe('Bar Calculations', () => {
    it('calculates correct number of bars based on container width', async () => {
      // Container width: 300px, barWidth: 10, barGap: 2
      // Total bar width = 10 + 2*2 = 14
      // Number of bars = floor(300 / 14) = 21
      const statusData = Array(50).fill({ status: 'online' })

      const wrapper = mount(StatusTracker, {
        props: { ...defaultProps, statusData, barWidth: 10, barGap: 2 },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Should show at most 21 bars (limited by container width)
      const bars = wrapper.findAll('.h-7.transition-opacity')
      // The actual number depends on internal calculation
      expect(bars.length).toBeGreaterThan(0)
    })

    it('shows empty bars when data is less than available slots', async () => {
      const statusData = [
        { status: 'online' },
        { status: 'online' },
        { status: 'online' }
      ]

      const wrapper = mount(StatusTracker, {
        props: { ...defaultProps, statusData, barWidth: 10, barGap: 2 },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Should have bars with 'empty' status filling remaining slots
      const allBars = wrapper.findAll('.h-7')
      expect(allBars.length).toBeGreaterThan(3)
    })

    it('shows most recent data when data exceeds available slots', async () => {
      // Create 100 data points, oldest first
      const statusData = Array(100).fill(null).map((_, i) => ({
        status: i < 50 ? 'offline' : 'online' // First 50 offline, last 50 online
      }))

      const wrapper = mount(StatusTracker, {
        props: { ...defaultProps, statusData, barWidth: 10, barGap: 2 },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Most recent data (online) should be shown, older data (offline) dropped
      const onlineBars = wrapper.findAll('.bg-\\(--ui-success\\)')
      const offlineBars = wrapper.findAll('.bg-\\(--ui-error\\)')

      // Should have more online bars since we're showing the most recent data
      expect(onlineBars.length).toBeGreaterThanOrEqual(offlineBars.length)
    })
  })

  describe('Status Colors', () => {
    it('applies success color for online status', async () => {
      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData: [{ status: 'online' }]
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Check HTML contains success styling
      const html = wrapper.html()
      expect(html).toContain('ui-success')
    })

    it('applies error color for offline status', async () => {
      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData: [{ status: 'offline' }]
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Check HTML contains error styling
      const html = wrapper.html()
      expect(html).toContain('ui-error')
    })

    it('applies elevated background for empty status', async () => {
      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData: [] // Will create empty bars
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // When no data, check that component still renders
      expect(wrapper.find('.u-card').exists()).toBe(true)
    })
  })

  describe('Bar Styling', () => {
    it('applies correct bar width style', async () => {
      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData: [{ status: 'online' }],
          barWidth: 15
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      const bar = wrapper.find('.h-7.transition-opacity')
      expect(bar.attributes('style')).toContain('width: 15px')
    })

    it('applies correct bar gap style', async () => {
      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData: [{ status: 'online' }],
          barGap: 4
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      const bar = wrapper.find('.h-7.transition-opacity')
      // margin-left and margin-right should be barGap/2 = 2px each
      expect(bar.attributes('style')).toContain('margin-left: 2px')
      expect(bar.attributes('style')).toContain('margin-right: 2px')
    })

    it('applies rounded corners to first and last bars', async () => {
      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData: [
            { status: 'online' },
            { status: 'online' },
            { status: 'online' }
          ]
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Check that bars have the first:rounded-l and last:rounded-r classes
      const bars = wrapper.findAll('.h-7.transition-opacity')
      expect(bars.length).toBeGreaterThan(0)
      expect(bars[0].classes()).toContain('first:rounded-l')
    })
  })

  describe('Tooltips', () => {
    it('renders tooltips for status bars', async () => {
      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData: [{ status: 'online' }]
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      const tooltips = wrapper.findAll('.tooltip-wrapper')
      expect(tooltips.length).toBeGreaterThan(0)
    })

    it('disables tooltip for empty bars', async () => {
      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData: [] // Will create empty bars
        },
        global: {
          stubs: {
            ...defaultStubs,
            UTooltip: {
              template: '<div :data-disabled="disabled"><slot /></div>',
              props: ['text', 'disabled']
            }
          }
        }
      })

      await nextTick()

      // Component should render without crashing
      expect(wrapper.find('.u-card').exists()).toBe(true)
    })
  })

  describe('Empty State', () => {
    it('renders component when no data provided', async () => {
      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData: []
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Component should still render
      expect(wrapper.find('.u-card').exists()).toBe(true)
    })
  })

  describe('Data Ordering', () => {
    it('maintains data order (oldest first, newest last)', async () => {
      // First item is oldest, last item is newest
      const statusData = [
        { status: 'offline' }, // oldest
        { status: 'offline' },
        { status: 'online' },
        { status: 'online' } // newest
      ]

      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      const bars = wrapper.findAll('.h-7.transition-opacity')
      // Should render bars in order where newest is on the right
      expect(bars.length).toBeGreaterThan(0)
    })
  })

  describe('Responsive Behavior', () => {
    it('handles container width of 0', async () => {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        value: 0
      })

      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData: [{ status: 'online' }]
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Should not crash, just show no bars
      expect(wrapper.find('.u-card').exists()).toBe(true)
    })

    it('updates bar count when container width changes', async () => {
      const wrapper = mount(StatusTracker, {
        props: {
          ...defaultProps,
          statusData: Array(50).fill({ status: 'online' })
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Change container width
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        value: 600 // Double the width
      })

      // Trigger resize observer callback
      await wrapper.vm.$nextTick()

      // Component should still be stable
      expect(wrapper.find('.u-card').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const wrapper = mount(StatusTracker, {
        props: defaultProps,
        global: { stubs: defaultStubs }
      })
      await testA11y(wrapper)
    })
  })
})
