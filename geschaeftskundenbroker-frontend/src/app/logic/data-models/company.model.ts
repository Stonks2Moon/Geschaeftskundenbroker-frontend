import { Address } from "./data-models";

export interface Company {
    companyId: string,
    companyCode: string,
    companyName: string,
    address: Address,
    addressId?: number
}
