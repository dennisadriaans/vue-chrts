import { describe, expectTypeOf, it } from "vitest";
import type { BarChartProps, NumericKeys } from "../src/runtime/types/charts";

interface Row { label: string; value: number; optional?: number; invalid: boolean }

describe("numeric chart contracts", () => {
  it("infers numeric keys including optional numeric fields", () => {
    expectTypeOf<NumericKeys<Row>>().toEqualTypeOf<"value" | "optional">();
    expectTypeOf<BarChartProps<Row>["yAxis"]>().toEqualTypeOf<Array<"value" | "optional">>();
  });
});
