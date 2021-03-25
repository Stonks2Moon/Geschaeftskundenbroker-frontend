import { Company, DepotSummary } from "../data-models";
import { DepotPosition } from "./depot-position.model";

export interface Depot {
    depotId: string,
    company: Company,
    name: string,
    description: string,
    summary?: DepotSummary,
    positions?: Array<DepotPosition>,
}