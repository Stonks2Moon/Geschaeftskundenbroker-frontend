import { CustomerSession, PlaceShareOrder } from "../data-models";

export interface PlaceOrder {
    customreSession: CustomerSession,
    order: PlaceShareOrder,
}
