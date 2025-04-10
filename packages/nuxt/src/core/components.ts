import { addComponent } from "@nuxt/kit";

export const resolveComponents = (config: any, filePath: string) => {

    const { components, prefix } = config;
    const allComponents = [
        'AreaChart',
        'AreaStackedChart',
        'LineChart',
        'BarChart',
        'DonutChart'
    ]

    allComponents.forEach(component => {
        console.log(component, 'component')
        if (typeof component === 'string') {
            addComponent({
                export: component,
                name: prefix + component,
                filePath
            })
        } else if (Array.isArray(component)) {
            addComponent({
                export: component[0],
                name: prefix + component[1],
                filePath
            })
        }
    })
}
