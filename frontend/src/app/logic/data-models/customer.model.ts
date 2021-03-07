import { Company } from "./data-models";

export interface Customer {
    customerId?: string,
    firstName: string,
    lastName: string,
    email: string,
    company?: Company,
    password?: string,
    companyCode?: string
}
