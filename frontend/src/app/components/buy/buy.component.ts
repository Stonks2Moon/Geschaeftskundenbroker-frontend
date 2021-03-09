import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Location } from '@angular/common';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss']
})
export class BuyComponent implements OnInit {

  constructor(private location: Location) {
   }

  ngOnInit(): void {
  }

  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };

  // TODO
  public cancel(): void {
    //this.location.back()
  }
}
