import { OrderType } from "../data-models";

export interface JobPlaceOrder {
    shareId: string,
    amount: number,
    onPlace: string,
    onMatch: string,
    onComplete: string,
    onDelete: string,
    type: OrderType,
    limit: number,
    stop: number
}