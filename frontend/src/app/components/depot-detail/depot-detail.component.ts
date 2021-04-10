import { Position } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EChartsOption } from 'echarts';
import { Depot, DepotPosition, JobWrapper, ReturnShareOrder, Share } from 'src/app/logic/data-models/data-models';
import { DepotService } from 'src/app/logic/services/depot.service';


@Component({
  selector: 'app-depot-detail',
  templateUrl: './depot-detail.component.html',
  styleUrls: ['./depot-detail.component.scss']
})
export class DepotDetailComponent implements OnInit {

  constructor(private depotService: DepotService,
    private route: ActivatedRoute,) {

  }
  public pieChartOption: EChartsOption;

  public depot: Depot;
  public depotId: string;
  public orderId: string;

  public positionArray: Array<DepotPosition> = [];
  public returnShareOrderArray: Array<ReturnShareOrder> = [];
  public jobWrapperArray: Array<JobWrapper> = [];
  public date: Date;
  public positionModalLp: DepotPosition;


  ngOnInit(): void {
    this.depotId = this.route.snapshot.paramMap.get('depotId');

    this.depotService.getDepotById(this.depotId).subscribe(depot => {
      this.depot = depot;
      this.positionArray = depot.positions;
      this.createChart();
      this.createPieChart();
    });
    this.getCompletedOrders();
    this.depotService.getPendingOrdersByDepotIdAndSession(this.depotId).subscribe(data => {
      this.jobWrapperArray = data;
    });

  }
  public createPieChart(): void {

    let data: Array<any> = [];

    this.depot.positions?.forEach(position => {
      let dataObj = { value: position.amount, name: position.share.shareName }
      data.push(dataObj);
    });

    this.pieChartOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Anzahl',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    }
  }
  public createChart(): void {

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
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  }

  public cancelJobWrapper(orderId: string) {
    console.log("hallo");
    this.depotService.deleteOrderBySession(orderId).subscribe(data => console.log(data));
    this.getCompletedOrders();
  }

  private getCompletedOrders(): void {
    this.depotService.getCompletedOrdersByDepotIdAndSession(this.depotId).subscribe(data => {
      this.returnShareOrderArray = data;
    });
  }

  public openModalLp(position: DepotPosition): void {  
    this.positionModalLp = position;
  }
}

