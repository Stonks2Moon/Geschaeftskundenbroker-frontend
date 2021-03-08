import { ChartValue, Share } from "./data-models";

export interface HistoricalData {
    share: Share,
    chartValues: Array<ChartValue>,
}
