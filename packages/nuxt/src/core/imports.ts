import { addImportsSources } from "@nuxt/kit";

export const resolveImports = (config: any, filePath: string) => {
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
