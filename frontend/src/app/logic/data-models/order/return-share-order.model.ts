import { OrderDetail, OrderType, Share } from "../data-models";

export interface ReturnShareOrder {
    depotId: string,
    amount: number,
    type: OrderType,
    detail: OrderDetail,
    limit?: number,
    stop?: number,
    stopLimit?: number,
    market?: string,
    orderId?: string,
    share?: Share,
    costValue?: number,
    isLp?: boolean,
}
