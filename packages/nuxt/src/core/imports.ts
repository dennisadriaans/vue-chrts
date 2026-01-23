import { addImportsSources } from "@nuxt/kit";
import type { ModuleOptions } from "../module";

export const resolveImports = (config: ModuleOptions, filePath: string) => {
    if (!config.autoImports) {
        return
    }

    const allTypes = ['BulletLegendItemInterface', 'MarkerConfig', 'CrosshairConfig', 'AxisConfig', 'MapRegion', 'MapPin']
    addImportsSources({
        from: filePath,
        type: true,
        imports: [...allTypes]
    })

    const allImports = ['CurveType', 'LegendPosition', 'Orientation', 'DonutType', 'getMap', 'getPin']
    addImportsSources({
        from: filePath,
        imports: [...allImports]
    })
}