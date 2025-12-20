import { addImportsSources } from "@nuxt/kit";
import type { ModuleOptions } from "../module";

export const resolveImports = (_: ModuleOptions, filePath: string) => {
    const allTypes = ['BulletLegendItemInterface', 'MarkerConfig', 'CrosshairConfig', 'AxisConfig', 'SankeyInputNode', 'SankeyInputLink']
    addImportsSources({
        from: filePath,
        type: true,
        imports: [...allTypes]
    })

    const allImports = ['CurveType', 'LegendPosition', 'Orientation', 'DonutType', 'SankeyNodeAlign', 'Sizing']
    addImportsSources({
        from: filePath,
        imports: [...allImports]
    })
}