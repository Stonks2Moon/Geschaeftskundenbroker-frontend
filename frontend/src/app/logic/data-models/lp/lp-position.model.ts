import { Depot, Share } from "../data-models";

export interface LpPosition {
  lpId: number,
  depot: Depot,
  share: Share,
  lqQuote: number,
}