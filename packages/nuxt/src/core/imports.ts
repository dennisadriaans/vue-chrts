import { addImportsSources } from "@nuxt/kit";

export const resolveImports = (config: any, filePath: string) => {
    const { imports } = config
    const allImports = imports ? imports : ['BulletLegendItemInterface']
    addImportsSources({
        from: filePath,
        type: true,
        imports: [...allImports]
    })
}
