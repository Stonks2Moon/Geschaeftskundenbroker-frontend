import { OrderDetail, OrderType } from "../data-models";

export interface PlaceShareOrder {
    depotId: string,
    amount: number,
    type: OrderType,
    detail: OrderDetail,
    limit?: number,
    stop?: number,
    stopLimit?: number,
    market?: string,
    shareId?: number,
}
