import { Share } from "../data-models";

export interface DepotPosition {
    depotId: string
    share: Share,
    amount: number,
    costValue: number,
    currentValue: number,
    profit: number,
    percentageChange: number,
}
