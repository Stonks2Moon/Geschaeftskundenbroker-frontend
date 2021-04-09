import { OrderDetail, OrderType, Share } from "../data-models";

export interface JobWrapper {
  depotId: string,
  share: Share,
  detail: OrderDetail,
  exchangeOrderId: string,
  orderValidity: string,
  jobType: OrderType,
  market: string,
}