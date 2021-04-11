import { OrderDetail, OrderType, JobPlaceOrder, JobDeleteOrder, Share } from "../data-models";

export interface JobWrapper {
  id: string,
  placeOrder?: JobPlaceOrder,
  deleteOrder?: JobDeleteOrder,
  depotId: string,
  share: Share,
  detail: OrderDetail,
  exchangeOrderId: string,
  orderValidity: string,
  jobType: OrderType,
  market: string,
  isLpJob: boolean,
  costValue?: number,
  isLp?: boolean,
}