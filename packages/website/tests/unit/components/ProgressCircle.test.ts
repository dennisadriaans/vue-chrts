import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressCircle from '../../../app/components/lib/ProgressCircle/ProgressCircle.vue'
import { testA11y } from '../../utils/test-helpers'

describe('ProgressCircle Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50 }
      })
      expect(wrapper.find('svg').exists()).toBe(true)
      expect(wrapper.text()).toContain('50%')
    })

    it('renders the correct value text', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 75 }
      })
      expect(wrapper.text()).toContain('75%')
    })

    it('applies custom size', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, size: 100 }
      })
      const container = wrapper.find('div')
      expect(container.attributes('style')).toContain('width: 100px')
      expect(container.attributes('style')).toContain('height: 100px')
    })

    it('uses default size of 50px', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50 }
      })
      const container = wrapper.find('div')
      expect(container.attributes('style')).toContain('width: 50px')
      expect(container.attributes('style')).toContain('height: 50px')
    })
  })

  describe('SVG Calculations', () => {
    it('calculates correct viewBox based on size', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, size: 100 }
      })
      const svg = wrapper.find('svg')
      // getAttribute returns the actual attribute, attributes() normalizes to lowercase
      const viewBox = svg.element.getAttribute('viewBox')
      expect(viewBox).toBe('0 0 100 100')
    })

    it('calculates correct radius (size/2 - strokeWidth)', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, size: 100, strokeWidth: 10 }
      })
      const circles = wrapper.findAll('circle')
      // radius = 100/2 - 10 = 40
      expect(circles[0].attributes('r')).toBe('40')
    })

    it('calculates correct center point', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, size: 80 }
      })
      const circles = wrapper.findAll('circle')
      // center = 80/2 = 40
      expect(circles[0].attributes('cx')).toBe('40')
      expect(circles[0].attributes('cy')).toBe('40')
    })

    it('calculates correct stroke-dasharray for 0%', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 0, size: 50, strokeWidth: 5 }
      })
      const progressCircle = wrapper.findAll('circle')[1]
      const dasharray = progressCircle.attributes('stroke-dasharray')

      // radius = 50/2 - 5 = 20
      // circumference = 2 * PI * 20 ≈ 125.66
      // strokeDasharray = "0 125.66..."
      expect(dasharray).toMatch(/^0\s/)
    })

    it('calculates correct stroke-dasharray for 100%', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 100, size: 50, strokeWidth: 5 }
      })
      const progressCircle = wrapper.findAll('circle')[1]
      const dasharray = progressCircle.attributes('stroke-dasharray')

      // At 100%, first number should equal circumference
      const values = dasharray!.split(' ').map(parseFloat)
      expect(values[0]).toBeCloseTo(values[1], 1) // Both should be ~equal (circumference)
    })

    it('calculates correct stroke-dasharray for 50%', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, size: 50, strokeWidth: 5 }
      })
      const progressCircle = wrapper.findAll('circle')[1]
      const dasharray = progressCircle.attributes('stroke-dasharray')

      // At 50%, first number should be half of circumference
      const values = dasharray!.split(' ').map(parseFloat)
      expect(values[0]).toBeCloseTo(values[1] / 2, 1)
    })
  })

  describe('Color Thresholds', () => {
    it('uses emerald color for values >= 75', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 75 }
      })
      const progressCircle = wrapper.findAll('circle')[1]
      expect(progressCircle.classes()).toContain('stroke-emerald-500')
    })

    it('uses emerald color for values = 100', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 100 }
      })
      const progressCircle = wrapper.findAll('circle')[1]
      expect(progressCircle.classes()).toContain('stroke-emerald-500')
    })

    it('uses amber color for values between 51-74', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 60 }
      })
      const progressCircle = wrapper.findAll('circle')[1]
      expect(progressCircle.classes()).toContain('stroke-amber-500')
    })

    it('uses amber color for value = 51', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 51 }
      })
      const progressCircle = wrapper.findAll('circle')[1]
      expect(progressCircle.classes()).toContain('stroke-amber-500')
    })

    it('uses rose color for values <= 50', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50 }
      })
      const progressCircle = wrapper.findAll('circle')[1]
      expect(progressCircle.classes()).toContain('stroke-rose-500')
    })

    it('uses rose color for value = 0', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 0 }
      })
      const progressCircle = wrapper.findAll('circle')[1]
      expect(progressCircle.classes()).toContain('stroke-rose-500')
    })

    it('uses rose color for value = 25', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 25 }
      })
      const progressCircle = wrapper.findAll('circle')[1]
      expect(progressCircle.classes()).toContain('stroke-rose-500')
    })
  })

  describe('Text Size', () => {
    it('applies custom textSize style', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, textSize: '24px' }
      })
      const text = wrapper.find('text')
      expect(text.attributes('style')).toContain('font-size: 24px')
    })

    it('applies default text-xs class when no textSize', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50 }
      })
      const text = wrapper.find('text')
      expect(text.classes()).toContain('text-xs')
    })

    it('does not apply text-xs when custom textSize is provided', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, textSize: '20px' }
      })
      const text = wrapper.find('text')
      expect(text.classes()).not.toContain('text-xs')
    })
  })

  describe('Text Color', () => {
    it('applies custom textColor class', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, textColor: 'fill-blue-500' }
      })
      const text = wrapper.find('text')
      expect(text.classes()).toContain('fill-blue-500')
    })

    it('uses default fill colors when no textColor', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50 }
      })
      const text = wrapper.find('text')
      expect(text.classes()).toContain('fill-gray-700')
    })
  })

  describe('Stroke Width', () => {
    it('applies custom strokeWidth', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, strokeWidth: 10 }
      })
      const circles = wrapper.findAll('circle')
      expect(circles[0].attributes('stroke-width')).toBe('10')
      expect(circles[1].attributes('stroke-width')).toBe('10')
    })

    it('uses default strokeWidth of 5', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50 }
      })
      const circles = wrapper.findAll('circle')
      expect(circles[0].attributes('stroke-width')).toBe('5')
    })
  })

  describe('Edge Cases', () => {
    it('handles value of 0 correctly', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 0 }
      })
      expect(wrapper.text()).toContain('0%')
      const progressCircle = wrapper.findAll('circle')[1]
      expect(progressCircle.classes()).toContain('stroke-rose-500')
    })

    it('handles value of 100 correctly', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 100 }
      })
      expect(wrapper.text()).toContain('100%')
      const progressCircle = wrapper.findAll('circle')[1]
      expect(progressCircle.classes()).toContain('stroke-emerald-500')
    })

    it('handles very small size', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, size: 20, strokeWidth: 2 }
      })
      expect(wrapper.find('svg').exists()).toBe(true)
    })

    it('handles very large size', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, size: 500, strokeWidth: 20 }
      })
      const container = wrapper.find('div')
      expect(container.attributes('style')).toContain('width: 500px')
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50 }
      })
      await testA11y(wrapper)
    })

    it('has proper text anchor for centering', () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50 }
      })
      const text = wrapper.find('text')
      expect(text.attributes('text-anchor')).toBe('middle')
      expect(text.attributes('dominant-baseline')).toBe('central')
    })
  })

  describe('Reactive Updates', () => {
    it('updates display when value changes', async () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 25 }
      })
      expect(wrapper.text()).toContain('25%')

      await wrapper.setProps({ value: 75 })
      expect(wrapper.text()).toContain('75%')
    })

    it('updates color when value crosses threshold', async () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50 }
      })

      let progressCircle = wrapper.findAll('circle')[1]
      expect(progressCircle.classes()).toContain('stroke-rose-500')

      await wrapper.setProps({ value: 75 })
      progressCircle = wrapper.findAll('circle')[1]
      expect(progressCircle.classes()).toContain('stroke-emerald-500')
    })

    it('updates size when prop changes', async () => {
      const wrapper = mount(ProgressCircle, {
        props: { value: 50, size: 50 }
      })

      await wrapper.setProps({ size: 100 })
      const container = wrapper.find('div')
      expect(container.attributes('style')).toContain('width: 100px')
    })
  })
})
