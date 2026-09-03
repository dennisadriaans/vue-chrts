import { defineComponent, watch, type PropType } from "vue";
import { useOffset } from "vccs";

/**
 * Reports the legend-aware plot-area centre and radius budget back to a polar
 * chart root.
 *
 * vccs' `selectPolarViewBox` derives `cx`/`cy` from the raw chart width/height,
 * so a bottom legend shrinks the radius but never moves the centre — the
 * polygon slides down and closes the gap the legend inset reserved. Pie/Donut
 * don't have this problem because they centre inside the offset box.
 *
 * `maxRadius` mirrors vccs' own `getMaxRadius` — half the shorter side of the
 * offset box — so the parent can size the polygon in pixels instead of a blind
 * percentage.
 *
 * Renders nothing; the parent feeds the reported values back as `cx`/`cy`.
 * That is not a render loop: the offset depends on margins, axes and legend
 * size, never on the centre.
 */
export default defineComponent({
  name: "PolarCenterSync",
  props: {
    onCenter: {
      type: Function as PropType<
        (center: { cx: number; cy: number; maxRadius: number }) => void
      >,
      required: true,
    },
  },
  setup(props) {
    const offset = useOffset();

    watch(
      offset,
      (next) => {
        if (!next || next.width <= 0 || next.height <= 0) return;
        props.onCenter({
          cx: next.left + next.width / 2,
          cy: next.top + next.height / 2,
          maxRadius: Math.min(next.width, next.height) / 2,
        });
      },
      { immediate: true },
    );

    return () => null;
  },
});
