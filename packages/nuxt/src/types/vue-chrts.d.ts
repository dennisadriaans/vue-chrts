declare module 'vue-chrts' {
    export interface BulletLegendItemInterface {
        name: string
        color: string
    }

    export interface AreaChartItem {
        month: string
        [key: string]: number | string
    }
} 