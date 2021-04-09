import { PriceDetails } from "../data-models";

export interface StockExchangePricing {
  entries: Array<PriceDetails>;
  type: string;
}