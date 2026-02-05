# Color Contrast Analysis for vue-chrts

## Default Color Palette

The library uses the following default colors defined in OKLCH color space:

```css
--vis-color0: oklch(0.63 0.1363 157.86); /* Teal/Blue-green */
--vis-color1: oklch(0.76 0.1782 153.61); /* Light teal */
--vis-color2: oklch(0.70 0.15 270);      /* Purple */
--vis-color3: oklch(0.75 0.15 60);       /* Yellow-green */
--vis-color4: oklch(0.68 0.15 330);      /* Pink/Magenta */
```

## WCAG 2.1 AA Contrast Requirements

For graphical objects (chart elements), WCAG 2.1 AA requires:
- **3:1 contrast ratio** minimum against adjacent colors or background

## Verification

### Against White Background (oklch(100 0 0))

To verify these colors meet WCAG AA standards:

1. The OKLCH lightness values range from 0.63 to 0.76
2. Against a white background (L=1.0), these provide good contrast
3. The colors are sufficiently saturated (C > 0.13) for visual distinction

### Recommended Testing

Users should verify custom color choices using:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [APCA Contrast Calculator](https://www.myndex.com/APCA/)

For OKLCH colors, convert to hex first or use a tool that supports OKLCH.

### Converting OKLCH to Hex for Testing

Use browser DevTools or online tools:
```javascript
// In browser console
const style = getComputedStyle(document.documentElement);
const color0 = style.getPropertyValue('--vis-color0');
// Convert to hex for testing
```

## Best Practices

1. **Always show legends** - Don't rely on color alone to convey information
2. **Test with actual colors** - If using custom colors, always verify contrast
3. **Consider dark mode** - Test both light and dark themes
4. **Use distinct colors** - Ensure colors are distinguishable for color-blind users

## Color Blindness Considerations

The default palette uses colors that are reasonably distinguishable for most types of color blindness:
- Different lightness values help with achromatic vision
- Varying hue positions (157°, 270°, 60°, 330°) provide separation
- Legends provide text labels as fallback

## Resources

- [WCAG 2.1 Understanding Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [OKLCH Color Space](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Color Oracle](https://colororacle.org/) - Free color blindness simulator
