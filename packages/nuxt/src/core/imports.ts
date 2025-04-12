import { addImportsSources } from "@nuxt/kit";
import type { ModuleOptions } from "../module";

export const resolveImports = (_: ModuleOptions, filePath: string) => {
    const allTypes = ['BulletLegendItemInterface']
    addImportsSources({
        from: filePath,
        type: true,
        imports: [...allTypes]
    })

    const allImports = ['CurveType', 'LegendPosition', 'Orientation']
    addImportsSources({
        from: filePath,
        imports: [...allImports]
    })
}
