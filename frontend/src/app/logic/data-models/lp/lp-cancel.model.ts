import { CustomerSession } from "../data-models";

export interface LpCancel {
  lpId: number,
  customerSession: CustomerSession
}