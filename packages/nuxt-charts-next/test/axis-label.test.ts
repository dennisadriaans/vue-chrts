import { describe, expect, it } from "vitest";
import { toAxisLabel } from "../src/runtime/utils/axis";

describe("toAxisLabel", () => {
  it("returns undefined for empty text", () => {
    expect(toAxisLabel(undefined, "insideBottom")).toBeUndefined();
  });

  it("places x titles below tick values inside the axis slot", () => {
    expect(toAxisLabel("Time (24h)", "insideBottom")).toEqual({
      value: "Time (24h)",
      position: "insideBottom",
      offset: 4,
      fill: "var(--vc-axis-label-color)",
      fontSize: "var(--vc-axis-label-size)",
      fontWeight: "var(--vc-axis-label-weight)",
    });
  });

  it("places y titles on the left, rotated away from tick values", () => {
    expect(toAxisLabel("Usage %", "insideLeft", { angle: -90 })).toEqual({
      value: "Usage %",
      position: "insideLeft",
      offset: 8,
      angle: -90,
      textAnchor: "middle",
      fill: "var(--vc-axis-label-color)",
      fontSize: "var(--vc-axis-label-size)",
      fontWeight: "var(--vc-axis-label-weight)",
    });
  });
});
