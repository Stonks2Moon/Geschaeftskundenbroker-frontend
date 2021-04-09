import { CustomerSession } from "../data-models";


export interface LpRegister {
  depotId: string,
  customerSession: CustomerSession,
  shareId: string,
  lqQuote: string
}