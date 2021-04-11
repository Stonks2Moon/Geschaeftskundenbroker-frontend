import { Injectable } from '@angular/core';
import { MetaConst, OrderDetail, OrderType } from '../data-models/data-models';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  public orderDetailsArray: Array<{ name: string, value: string }> = [
    {
      name: "Markt Preis",
      value: OrderDetail.market
    },
    {
      name: "Limit Preis",
      value: OrderDetail.limit
    },
    {
      name: "Stop Preis",
      value: OrderDetail.stop
    },
  ];


  constructor(private metaService: MetaService,) { }

  public getOrderTypeForUi(orderType: OrderType): string {
    let oderTypeUi: string = 'Kaufen'
    if (orderType == OrderType.sell) {
      oderTypeUi = 'Verkaufen'
    }
    return oderTypeUi
  }

  public getOrderDetailForUi(orderDetail: OrderDetail): string {
    return this.orderDetailsArray.find(oD => oD.value = orderDetail).name
  }


  public getAlgArray() {
    let metaConst: MetaConst;
    let algorithmTypesArray: Array<{ name: string, value: number }> = [];

    return this.metaService.getMetaConsts()
      .toPromise()
      .then(
        data => {
          metaConst = data;
          algorithmTypesArray = this.buildAlgArray(algorithmTypesArray, metaConst)
          console.log(algorithmTypesArray)
          return algorithmTypesArray;
        }
      )
  }

  private buildAlgArray(arr: Array<{ name: string, value: number }>, metaConst: MetaConst): Array<{ name: string, value: number }> {
    return arr = [
      {
        name: "Kein Algorithmus",
        value: metaConst.ALGORITHMS.NO_ALG
      },
      {
        name: "Split Algorithmus",
        value: metaConst.ALGORITHMS.SPLIT_ALG
      }
    ];
  }

}
