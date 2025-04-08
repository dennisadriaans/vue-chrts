import { addImportsSources } from "@nuxt/kit";

export const resolveImports = (config: any, filePath: string) => {
    const { imports } = config
    const allImports = imports ? imports : []
    addImportsSources({
        from: filePath,
        imports: ['']
    })
}
