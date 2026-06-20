import { addImportsSources } from "@nuxt/kit";
import type { ModuleOptions } from "../module";

export const resolveImports = (config: ModuleOptions, filePath: string) => {
    if (!config.autoImports) {
        return
    }

    const allTypes = ['BulletLegendItemInterface', 'MarkerConfig', 'CrosshairConfig', 'AxisConfig', 'TooltipConfig', 'MapRegion', 'MapPin']
    addImportsSources({
        from: "vue-chrts/types",
        type: true,
        imports: [...allTypes]
    })

    const enumImports = ['CurveType', 'LegendPosition', 'Orientation']
    addImportsSources({
        from: "vue-chrts/enums",
        imports: [...enumImports]
    })

    const runtimeImports = ['DonutType', 'getMap', 'getPin']
    addImportsSources({
        from: "vue-chrts",
        imports: [...runtimeImports]
    })

    const geoImports = ['geoMercator']
    addImportsSources({
        from: "vue-chrts",
        imports: [...geoImports]
    })

    const topoJsonImports = [
        'ChinaTopoJSON',
        'FranceTopoJSON',
        'GermanyTopoJSON',
        'IndiaTopoJSON',
        'UKTopoJSON',
        'USATopoJSON',
        'USCountiesTopoJSON',
        'WorldMap110mAlphaTopoJSON',
        'WorldMapSimplestTopoJSON',
        'WorldMapTopoJSON',
    ]
    addImportsSources({
        from: "vue-chrts",
        imports: [...topoJsonImports]
    })
}