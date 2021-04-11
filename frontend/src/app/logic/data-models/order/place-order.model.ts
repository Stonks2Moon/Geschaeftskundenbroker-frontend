import { CustomerSession, PlaceShareOrder } from "../data-models";

export interface PlaceOrder {
    customerSession: CustomerSession,
    order: PlaceShareOrder,
    tradeAlgorithm?: number;
}
