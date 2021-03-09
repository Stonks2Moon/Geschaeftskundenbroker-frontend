import { CustomerSession } from "../data-models";

export interface CreateDepot {
    session: CustomerSession,
    name: string,
    description?: string,
}
