import { Position } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EChartsOption } from 'echarts';
import { ToastrService } from 'ngx-toastr';
import { Depot, DepotPosition, JobWrapper, LpRegister, ReturnShareOrder, Share } from 'src/app/logic/data-models/data-models';
import { DepotService } from 'src/app/logic/services/depot.service';


@Component({
  selector: 'app-depot-detail',
  templateUrl: './depot-detail.component.html',
  styleUrls: ['./depot-detail.component.scss']
})
export class DepotDetailComponent implements OnInit {
  public lpForm: FormGroup;

  public pieChartOption: EChartsOption;

  public depot: Depot;
  public depotId: string;
  public orderId: string;

  public positionArray: Array<DepotPosition> = [];
  public returnShareOrderArray: Array<ReturnShareOrder> = [];
  public jobWrapperArray: Array<JobWrapper> = [];
  public date: Date;
  public positionModalLp: DepotPosition;

  constructor(
    private depotService: DepotService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.depotId = this.route.snapshot.paramMap.get('depotId');

    this.depotService.getDepotById(this.depotId).subscribe(depot => {
      this.depot = depot;
      this.positionArray = depot.positions;
      this.createChart();
      this.createPieChart();
    });
    this.getCompletedOrders();
    this.getPendingOrders();
    this.createForm();
  }

  public createForm(): void {
    this.lpForm = new FormGroup({
      lqQuote: new FormControl('', [Validators.required])
    });
  }

  public onLpSubmit(): void {
    console.log(this.lpForm.value)
    this.depotService.registerAsLp(this.positionModalLp.depotId,
      this.positionModalLp.share.shareId,
      this.lpForm.controls.lqQuote.value).subscribe(
        (data) => { },
        (error) => this.toastr.error(error.error.message, 'Registrierung als Liquiditätsspender ist fehlgeschlagen.')
      )
  }

  public cancelOrder(orderId: string) {
    this.depotService.deleteOrderBySession(orderId).subscribe(
      (data) => { },
      (error) => this.toastr.error(error.error.message, 'Löschen der Order fehlgeschlagen.')
    );
    this.getPendingOrders();
  }

  private getCompletedOrders(): void {
    this.depotService.getCompletedOrdersByDepotIdAndSession(this.depotId).subscribe(data => {
      this.returnShareOrderArray = data;
    });
  }

  private getPendingOrders(): void {
    this.depotService.getPendingOrdersByDepotIdAndSession(this.depotId).subscribe(data => {
      this.jobWrapperArray = data;
    });
  }

  public openModalLp(position: DepotPosition): void {
    this.positionModalLp = position;
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

}

