const IS_SERVER = typeof window === "undefined";

/**
 * Whether a series animates in. Never on the server, where the animation
 * runtime has no DOM to drive and the first frame would ship as the HTML.
 */
export function isAnimated(duration: number | undefined): boolean {
  return !IS_SERVER && duration !== undefined && duration !== 0;
}
