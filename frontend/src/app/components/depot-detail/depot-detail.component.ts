import { Position } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EChartsOption, SeriesModel, SeriesOption, } from 'echarts';
import { ToastrService } from 'ngx-toastr';
import { Depot, DepotPosition, HistoricalData, JobWrapper, LpPosition, LpRegister, ReturnShareOrder, Share } from 'src/app/logic/data-models/data-models';
import { DepotService } from 'src/app/logic/services/depot.service';
import { ShareService } from 'src/app/logic/services/share.service';
import { HelperService } from 'src/app/logic/services/helper.service';


@Component({
  selector: 'app-depot-detail',
  templateUrl: './depot-detail.component.html',
  styleUrls: ['./depot-detail.component.scss']
})
export class DepotDetailComponent implements OnInit {
  public lpForm: FormGroup;

  public pieChartOption: EChartsOption;
  public chartOption: EChartsOption;

  public depot: Depot;
  public depotId: string;
  public orderId: string;
  public shares: Array<Share> = []
  public histories: Array<HistoricalData> = []
  public fromDate: Date = new Date();
  public toDate: Date = new Date();

  public positionArray: Array<DepotPosition> = [];
  public returnShareOrderArray: Array<ReturnShareOrder> = [];
  public jobWrapperArray: Array<JobWrapper> = [];
  public lpPositionArray: Array<LpPosition> = [];
  public date: Date;
  public positionModalLp: DepotPosition;
  public positionLp: LpPosition;

  constructor(
    public helperService: HelperService,
    private depotService: DepotService,
    private shareService: ShareService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.depotId = this.route.snapshot.paramMap.get('depotId');
    this.fromDate.setDate(this.toDate.getDate() - 30)

    this.depotService.getDepotById(this.depotId).subscribe(depot => {
      this.depot = depot;
      this.positionArray = depot.positions;
      this.positionArray?.forEach(position => {
        this.shareService.getShareHistory({ shareId: position.share.shareId, fromDate: this.fromDate, toDate: this.toDate })
          .toPromise()
          .then(
            data => {
              this.histories.push(data);
              this.createChart();
            }
          );
      });
      this.createPieChart();
    });

    this.positionArray?.forEach(position => {
      this.shareService.getShareHistory({ shareId: position.share.shareId, fromDate: this.fromDate, toDate: this.toDate })
        .toPromise()
        .then(
          data => {
            this.histories.push(data);
            this.createChart();
          }
        );
    });

    this.getLps();
    this.getCompletedOrders();
    this.getPendingOrders();
    this.createForm();
  }

  public createForm(): void {
    this.lpForm = new FormGroup({
      lqQuote: new FormControl('', [Validators.required, Validators.max(100), Validators.min(1), Validators.pattern(/^[0-9]\d*$/)])
    });
  }

  public onLpSubmit(): void {
    this.depotService.registerAsLp(this.positionModalLp.depotId,
      this.positionModalLp.share.shareId,
      this.lpForm.controls.lqQuote.value / 100).subscribe(
        (data) => { },
        (error) => this.toastr.error(error.error.message, 'Registrierung als Liquiditätsspender ist fehlgeschlagen.')
      )
  }

  public onEndLpSubmit(): void {
    // this.depotService.cancelLp(lpId).subscribe((data) => {})
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

  private getLps(): void {
    this.depotService.getLpBy(this.depotId).subscribe(data =>
      this.lpPositionArray = data
    );
  }

  public isLp(position: DepotPosition): boolean {
    let lpPosition = this.lpPositionArray.find(lpPosition => lpPosition.share.isin == position.share.isin);
    if (lpPosition) {
      this.positionLp = lpPosition;
      return true;
    }
    return false;
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
    let series: Array<any> = []

    this.histories?.forEach(history => {
      let newSeries
      let data = []
      history.chartValues.forEach(value => {
        data.push([value.recordedAt, value.recordedValue])
      })
      newSeries = {
        name: history.share.shareName,
        data: data,
        smooth: false,
        symbol: 'none',
        type: 'line',
      },
        series.push(newSeries)
    });


    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000'
        },
      },
      xAxis: {
        type: 'time',
      },
      yAxis: {
        type: 'value',
      },
      dataZoom: [{
        type: 'inside',
        filterMode: 'filter'

      }, {
        filterMode: 'empty'
      }],
      series: [
      ],
    };

    this.chartOption.series = series
  }


}

