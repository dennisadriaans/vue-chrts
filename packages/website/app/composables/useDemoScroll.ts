export const useDemoScroll = () => {
  const toast = useToast()

  const startScroll = () => {
    const findScrollable = () => {
      const elements = document.querySelectorAll('.overflow-y-auto')
      for (const el of elements) {
        if (el.scrollHeight > el.clientHeight) return el
      }
      return document.documentElement
    }

    const scrollableElement = findScrollable()

    // Reset to top
    scrollableElement.scrollTo({ top: 0, behavior: 'smooth' })

    setTimeout(async () => {
      // Your specific stop markers
      const stops = [618, 1962, 3206, 4349, 5256, 6680, 7694, 9000]
      const scrollHeight = scrollableElement.scrollHeight
      const clientHeight = scrollableElement.clientHeight
      const maxPossibleScroll = scrollHeight - clientHeight

      if (maxPossibleScroll <= 0) {
        toast.add({ title: 'Nothing to scroll', color: 'warning' })
        return
      }

      for (let i = 0; i < stops.length; i++) {
        // Clamp the target to the actual page height to avoid "dead" scrolls
        const targetScroll = Math.min(stops[i], maxPossibleScroll)

        // Only scroll if the target is further than where we currently are
        if (targetScroll <= scrollableElement.scrollTop + 5) continue

        // Perform the move
        await performNaturalScroll(scrollableElement, targetScroll)

        // Wait at least 4 seconds before moving to the next section
        // 4000ms (fixed) + 0-1500ms (random variation for "human" feel)
        const pauseDuration = 2000 + Math.random() * 750

        // Don't wait after the very last stop
        if (i < stops.length - 1 && scrollableElement.scrollTop < maxPossibleScroll - 10) {
          await new Promise(resolve => setTimeout(resolve, pauseDuration))
        }
      }
    }, 1000) // 1s buffer to ensure the "reset to top" is finished
  }

  const performNaturalScroll = (el: Element, target: number) => {
    return new Promise<void>((resolve) => {
      const startPos = el.scrollTop
      const distance = target - startPos

      // Speed: ~1.2s to 2s depending on distance
      const duration = Math.max(700, Math.min(1400, Math.abs(distance) * 1.2))

      let startTime: number | null = null
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / duration, 1)

        const easedProgress = easeInOutCubic(progress)
        el.scrollTo(0, startPos + (distance * easedProgress))

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })
  }

  return { startScroll }
}
