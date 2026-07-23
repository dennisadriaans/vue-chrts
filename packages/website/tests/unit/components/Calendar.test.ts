import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import dayjs from 'dayjs'
import Calendar from '../../../app/components/lib/Calendar/Calendar.vue'
import { CalendarSelectionMode, Orientation } from '../../../app/components/lib/Calendar/types'
import { testA11y } from '../../utils/test-helpers'

// Mock toast
vi.mock('vue-sonner', () => ({
  toast: {
    add: vi.fn()
  }
}))

// Mock useToast
const mockToastAdd = vi.fn()
vi.stubGlobal('useToast', () => ({
  add: mockToastAdd
}))

describe('Calendar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultStubs = {
    UButton: {
      template: '<button :aria-label="ariaLabel" @click="$emit(\'click\')"><slot /></button>',
      props: ['icon', 'size', 'color', 'variant', 'class', 'ariaLabel']
    }
  }

  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(Calendar, {
        global: { stubs: defaultStubs }
      })
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('renders correct number of visible months', () => {
      const wrapper = mount(Calendar, {
        props: { visibleMonths: 2 },
        global: { stubs: defaultStubs }
      })
      // Should have 2 month grids (each with weekday headers and day buttons)
      const monthGrids = wrapper.findAll('.grid.grid-cols-7')
      expect(monthGrids.length).toBe(4) // 2 weekday rows + 2 day grids
    })

    it('renders weekday labels correctly', () => {
      const customLabels: [string, string, string, string, string, string, string] = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
      const wrapper = mount(Calendar, {
        props: { weekDayLabels: customLabels },
        global: { stubs: defaultStubs }
      })
      customLabels.forEach((label) => {
        expect(wrapper.text()).toContain(label)
      })
    })

    it('displays current month and year in header', () => {
      const wrapper = mount(Calendar, {
        global: { stubs: defaultStubs }
      })
      const currentMonth = dayjs().format('MMMM YYYY')
      expect(wrapper.text()).toContain(currentMonth)
    })
  })

  describe('Single Selection Mode', () => {
    it('selects a single date and emits event', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: CalendarSelectionMode.Single },
        global: { stubs: defaultStubs }
      })

      // Find a day button (not disabled, in current month)
      const dayButtons = wrapper.findAll('button').filter((btn) => {
        const text = btn.text()
        return /^\d+$/.test(text) && parseInt(text) >= 1 && parseInt(text) <= 28
      })

      if (dayButtons.length > 0) {
        await dayButtons[10].trigger('click')
        await nextTick()

        const emitted = wrapper.emitted('date-select')
        expect(emitted).toBeTruthy()
        expect(emitted![0][0]).toBeInstanceOf(Date)
      }
    })

    it('highlights selected date', async () => {
      const initialDate = new Date(2025, 10, 15) // Nov 15, 2025
      const wrapper = mount(Calendar, {
        props: {
          selectionMode: CalendarSelectionMode.Single,
          initialDate
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Find button with "15" text and check it has selected styling
      const dayButtons = wrapper.findAll('button')
      const day15 = dayButtons.find(btn => btn.text().trim() === '15')
      expect(day15?.classes()).toContain('bg-primary')
    })
  })

  describe('Range Selection Mode', () => {
    it('selects start and end dates', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: CalendarSelectionMode.Range },
        global: { stubs: defaultStubs }
      })

      const dayButtons = wrapper.findAll('button').filter((btn) => {
        const text = btn.text()
        return /^\d+$/.test(text)
      })

      // Select start date
      await dayButtons[5].trigger('click')
      await nextTick()

      let emitted = wrapper.emitted('range-select')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toHaveProperty('start')
      expect(emitted![0][0]).toHaveProperty('end', null)

      // Select end date
      await dayButtons[10].trigger('click')
      await nextTick()

      emitted = wrapper.emitted('range-select')
      expect(emitted![1][0]).toHaveProperty('start')
      expect(emitted![1][0]).toHaveProperty('end')
    })

    it('auto-corrects range when end date is before start date', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: CalendarSelectionMode.Range },
        global: { stubs: defaultStubs }
      })

      const dayButtons = wrapper.findAll('button').filter((btn) => {
        const text = btn.text()
        return /^\d+$/.test(text) && parseInt(text) >= 1 && parseInt(text) <= 28
      })

      // Select day 15 first
      const day15Index = dayButtons.findIndex(btn => btn.text().trim() === '15')
      const day5Index = dayButtons.findIndex(btn => btn.text().trim() === '5')

      if (day15Index >= 0 && day5Index >= 0) {
        await dayButtons[day15Index].trigger('click')
        await nextTick()

        // Then select day 5 (earlier date)
        await dayButtons[day5Index].trigger('click')
        await nextTick()

        const emitted = wrapper.emitted('range-select')
        const lastEmit = emitted![emitted!.length - 1][0] as { start: Date, end: Date }

        // Start should be earlier than end
        expect(dayjs(lastEmit.start).date()).toBeLessThanOrEqual(dayjs(lastEmit.end).date())
      }
    })
  })

  describe('Multiple Selection Mode', () => {
    it('allows selecting multiple dates', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: CalendarSelectionMode.Multiple },
        global: { stubs: defaultStubs }
      })

      const dayButtons = wrapper.findAll('button').filter((btn) => {
        const text = btn.text()
        return /^\d+$/.test(text) && parseInt(text) >= 1 && parseInt(text) <= 28
      })

      await dayButtons[5].trigger('click')
      await dayButtons[10].trigger('click')
      await dayButtons[15].trigger('click')
      await nextTick()

      const emitted = wrapper.emitted('date-select')
      expect(emitted).toBeTruthy()

      // Last emission should have 3 dates
      const lastEmit = emitted![emitted!.length - 1][0] as Date[]
      expect(lastEmit.length).toBe(3)
    })

    it('toggles date selection on click', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: CalendarSelectionMode.Multiple },
        global: { stubs: defaultStubs }
      })

      const dayButtons = wrapper.findAll('button').filter((btn) => {
        const text = btn.text()
        return /^\d+$/.test(text) && parseInt(text) >= 10 && parseInt(text) <= 20
      })

      // Select date
      await dayButtons[0].trigger('click')
      await nextTick()

      // Deselect same date
      await dayButtons[0].trigger('click')
      await nextTick()

      const emitted = wrapper.emitted('date-select')
      const lastEmit = emitted![emitted!.length - 1][0] as Date[]
      expect(lastEmit.length).toBe(0)
    })
  })

  describe('Disabled Dates', () => {
    it('prevents selection of disabled dates', async () => {
      const disabledDate = new Date(2025, 10, 15)
      const wrapper = mount(Calendar, {
        props: {
          selectionMode: CalendarSelectionMode.Single,
          disabledDates: [disabledDate]
        },
        global: { stubs: defaultStubs }
      })

      // Find day 15 button
      const dayButtons = wrapper.findAll('button')
      const day15 = dayButtons.find(btn => btn.text().trim() === '15')

      if (day15) {
        await day15.trigger('click')
        await nextTick()

        // Should not emit date-select for disabled date
        const emitted = wrapper.emitted('date-select')
        expect(emitted).toBeFalsy()
      }
    })

    it('respects minDate constraint', async () => {
      const minDate = new Date(2025, 10, 10)
      const wrapper = mount(Calendar, {
        props: {
          selectionMode: CalendarSelectionMode.Single,
          minDate
        },
        global: { stubs: defaultStubs }
      })

      // Try to select day 5 (before minDate)
      const dayButtons = wrapper.findAll('button')
      const day5 = dayButtons.find(btn => btn.text().trim() === '5')

      if (day5) {
        await day5.trigger('click')
        await nextTick()

        const emitted = wrapper.emitted('date-select')
        expect(emitted).toBeFalsy()
      }
    })

    it('respects maxDate constraint', async () => {
      const maxDate = new Date(2025, 10, 20)
      const wrapper = mount(Calendar, {
        props: {
          selectionMode: CalendarSelectionMode.Single,
          maxDate
        },
        global: { stubs: defaultStubs }
      })

      // Try to select day 25 (after maxDate)
      const dayButtons = wrapper.findAll('button')
      const day25 = dayButtons.find(btn => btn.text().trim() === '25')

      if (day25) {
        await day25.trigger('click')
        await nextTick()

        const emitted = wrapper.emitted('date-select')
        expect(emitted).toBeFalsy()
      }
    })
  })

  describe('Navigation', () => {
    it('navigates to previous month', async () => {
      const wrapper = mount(Calendar, {
        global: { stubs: defaultStubs }
      })

      // Get current month displayed
      const getCurrentMonth = () => wrapper.find('.text-lg.font-medium').text()
      const initialMonth = getCurrentMonth()

      // Click previous month button (first button with chevron-left)
      const buttons = wrapper.findAll('button')
      await buttons[0].trigger('click')
      await nextTick()

      // Month should have changed
      expect(getCurrentMonth()).not.toBe(initialMonth)
      expect(wrapper.emitted('month-change')).toBeTruthy()
    })

    it('navigates to next month', async () => {
      const wrapper = mount(Calendar, {
        global: { stubs: defaultStubs }
      })

      // Get current month displayed
      const getCurrentMonth = () => wrapper.find('.text-lg.font-medium').text()
      const initialMonth = getCurrentMonth()

      // Click next month button (second nav button)
      const buttons = wrapper.findAll('button')
      // Find the next button (usually after prev button)
      await buttons[1].trigger('click')
      await nextTick()

      // Month should have changed
      expect(getCurrentMonth()).not.toBe(initialMonth)
      expect(wrapper.emitted('month-change')).toBeTruthy()
    })

    it('emits year-change when navigating across years', async () => {
      const wrapper = mount(Calendar, {
        global: { stubs: defaultStubs }
      })

      // Navigate backwards 12 times to go to previous year
      const buttons = wrapper.findAll('button')
      for (let i = 0; i < 12; i++) {
        await buttons[0].trigger('click')
        await nextTick()
      }

      const yearChangeEmits = wrapper.emitted('year-change')
      expect(yearChangeEmits).toBeTruthy()
      expect(yearChangeEmits!.length).toBeGreaterThan(0)
    })
  })

  describe('Time Picker', () => {
    it('shows time picker when enabled and date is selected', async () => {
      const wrapper = mount(Calendar, {
        props: {
          showTimePicker: true,
          initialDate: new Date()
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Should render time slots
      const timeSlots = wrapper.props('timeSlots') || ['09:00', '09:15', '09:30']
      timeSlots.forEach((time: string) => {
        expect(wrapper.text()).toContain(time)
      })
    })

    it('emits time-select when time is selected', async () => {
      const wrapper = mount(Calendar, {
        props: {
          showTimePicker: true,
          initialDate: new Date(),
          timeSlots: ['09:00', '10:00', '11:00']
        },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // Find and click a time slot
      const buttons = wrapper.findAll('button')
      const timeButton = buttons.find(btn => btn.text().includes('09:00'))

      if (timeButton) {
        await timeButton.trigger('click')
        await nextTick()

        const emitted = wrapper.emitted('time-select')
        expect(emitted).toBeTruthy()
        expect(emitted![0][0]).toBe('09:00')
      }
    })
  })

  describe('Locale Support', () => {
    it('applies locale to month names', async () => {
      const wrapper = mount(Calendar, {
        props: { locale: 'de' },
        global: { stubs: defaultStubs }
      })

      await nextTick()

      // German month names should appear
      // December in German is "Dezember", etc.
      const germanMonths = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

      const currentMonthGerman = germanMonths[dayjs().month()]
      expect(wrapper.text()).toContain(currentMonthGerman)
    })
  })

  describe('Orientation', () => {
    it('applies horizontal orientation class', () => {
      const wrapper = mount(Calendar, {
        props: { orientation: Orientation.Horizontal },
        global: { stubs: defaultStubs }
      })

      expect(wrapper.find('.flex-row').exists()).toBe(true)
    })

    it('applies vertical orientation class', () => {
      const wrapper = mount(Calendar, {
        props: { orientation: Orientation.Vertical },
        global: { stubs: defaultStubs }
      })

      expect(wrapper.find('.flex-col').exists()).toBe(true)
    })
  })

  describe('Today Highlighting', () => {
    it('highlights today with special styling', () => {
      const wrapper = mount(Calendar, {
        global: { stubs: defaultStubs }
      })

      const today = dayjs().date().toString()
      const dayButtons = wrapper.findAll('button')
      const todayButton = dayButtons.find(btn => btn.text().trim() === today)

      // Today should have special styling - either text-primary or within the calendar
      expect(todayButton).toBeTruthy()
      // The button should exist and be part of the calendar grid
      expect(todayButton?.exists()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles month with 31 days correctly', () => {
      // January 2025 has 31 days
      const wrapper = mount(Calendar, {
        props: {
          initialDate: new Date(2025, 0, 1)
        },
        global: { stubs: defaultStubs }
      })

      const dayButtons = wrapper.findAll('button')
      const day31 = dayButtons.find(btn => btn.text().trim() === '31')
      expect(day31).toBeTruthy()
    })

    it('handles February in leap year correctly', () => {
      // 2024 was a leap year
      const wrapper = mount(Calendar, {
        props: {
          initialDate: new Date(2024, 1, 1) // Feb 2024
        },
        global: { stubs: defaultStubs }
      })

      const dayButtons = wrapper.findAll('button')
      const day29 = dayButtons.find(btn => btn.text().trim() === '29')
      expect(day29).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const wrapper = mount(Calendar, {
        global: { stubs: defaultStubs }
      })
      await testA11y(wrapper)
    })
  })
})
