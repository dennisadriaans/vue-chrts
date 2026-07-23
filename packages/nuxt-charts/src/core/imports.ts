import { addImportsSources, createResolver } from "@nuxt/kit";
import type { ModuleOptions } from "../module";

export const resolveImports = (config: ModuleOptions, filePath: string) => {
    if (!config.autoImports) {
        return
    }

    const { resolve } = createResolver(filePath)
    // Local shim — see runtime/types.ts. Avoids bare `vue-chrts/types` which
    // has no runtime export condition and breaks Vite SFC transforms.
    const typesFrom = resolve("./runtime/types")

    // Map-specific types are always provided (v2-only, no v3 equivalent).
    const mapTypes = ['MapRegion', 'MapPin']
    // Shared types also exported by nuxt-charts-next; skip when sharedImports=false.
    const sharedTypes = ['BulletLegendItemInterface', 'MarkerConfig', 'CrosshairConfig', 'AxisConfig', 'TooltipConfig']
    addImportsSources({
        from: typesFrom,
        type: true,
        imports: config.sharedImports === false ? [...mapTypes] : [...sharedTypes, ...mapTypes]
    })

    if (config.sharedImports !== false) {
        const enumImports = ['CurveType', 'LegendPosition', 'Orientation']
        addImportsSources({
            from: "vue-chrts/enums",
            imports: [...enumImports]
        })

        addImportsSources({
            from: "vue-chrts",
            imports: ['DonutType']
        })
    }

    // Map helpers are v2-only; always auto-imported when autoImports is on.
    const runtimeImports = ['getMap', 'getPin']
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