import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Location } from '@angular/common';
import { ControlsMap, Depot, HistoricalData, OrderDetail, OrderType, PlaceShareOrder, Share } from 'src/app/logic/data-models/data-models';
import { DepotService } from 'src/app/logic/services/depot.service';
import { ShareService } from 'src/app/logic/services/share.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MetaService } from 'src/app/logic/services/meta.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/logic/services/helper.service';

@Component({
  selector: 'app-buy-sell',
  templateUrl: './buy-sell.component.html',
  styleUrls: ['./buy-sell.component.scss']
})
export class BuySellComponent implements OnInit {
  public orderForm: FormGroup;
  public orderType: OrderType;
  public share: Share;
  public detailDepot: Depot;

  public depotArray: Array<Depot> = [];
  public orderDetailsArray: Array<{ name: string, value: string }>;
  public expiredDateArray: Array<{ name: string, value: Date }>;
  public algorithmTypesArray: Array<{ name: string, value: number }>;

  // Pop up values
  public currentPrice: number;
  public sharePrice: number;

  // statistic values 
  public chartOption: EChartsOption;
  private historicalData: HistoricalData;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private shareId: string;


  constructor(
    public helperService: HelperService,
    private _location: Location,
    private depotService: DepotService,
    private shareService: ShareService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.fromDate.setDate(this.fromDate.getDate() - 30)
    this.orderType = OrderType[this.route.snapshot.paramMap.get('orderType')];
    this.shareId = this.route.snapshot.paramMap.get('shareId');
    this.orderDetailsArray = this.helperService.orderDetailsArray
    this.helperService.getAlgArray()
      .then(data => this.algorithmTypesArray = data)

    this.depotService.getAllDepotsBySession().subscribe(depots => {
      this.depotArray = depots;
    });
    this.shareService.getShareById(this.shareId).subscribe(share => this.share = share);
    this.shareService.getShareHistory({ shareId: this.shareId, fromDate: this.fromDate, toDate: this.toDate })
      .toPromise()
      .then(
        data => {
          this.historicalData = data;
          this.createChart();
        }
      );
    this.buildExpiredDateArray();
    this.createForm();

  }

  buildExpiredDateArray() {
    let today: Date = new Date();
    let tomorrow: Date = new Date(today);
    let sevenDays: Date = new Date(today);
    let fourteenDays: Date = new Date(today);
    let thirtyDays: Date = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setDate(tomorrow.getHours() + 6);
    sevenDays.setDate(sevenDays.getDate() + 7);
    fourteenDays.setDate(sevenDays.getDate() + 14);
    thirtyDays.setDate(sevenDays.getDate() + 30);

    this.expiredDateArray = [
      { name: 'Morgen', value: tomorrow },
      { name: '7 Tage', value: sevenDays },
      { name: '14 Tage', value: fourteenDays },
      { name: '30 Tage', value: thirtyDays },
    ];
  }

  public createForm(): void {
    this.orderForm = new FormGroup({
      depot: new FormControl('', Validators.required),
      orderDetail: new FormControl('', Validators.required),
      sharePrice: new FormControl({ value: '', disabled: true }, Validators.required),
      limitPrice: new FormControl({ value: 0, disabled: true }, [Validators.required, Validators.min(1)]),
      maxPrice: new FormControl({ value: 0, disabled: true }, Validators.required),
      minPrice: new FormControl({ value: 0, disabled: true }, Validators.required),
      dateOfExpiry: new FormControl('', Validators.required),
      numberOfShares: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100000)]),
      algorithmicTradingType: new FormControl('', Validators.required),
    });

    this.orderForm.controls.orderDetail.valueChanges.subscribe(orderDetail => {
      if (orderDetail == this.orderDetailsArray[0]) {
        this.orderForm.controls.limitPrice.disable();
        this.orderForm.controls.maxPrice.disable();
        this.orderForm.controls.minPrice.disable();
      } else if (orderDetail == this.orderDetailsArray[1]) {
        this.orderForm.controls.limitPrice.enable();
        this.orderForm.controls.maxPrice.disable();
        this.orderForm.controls.minPrice.disable();
      } else if (orderDetail == this.orderDetailsArray[2]) {
        this.orderForm.controls.limitPrice.disable();
        this.orderForm.controls.maxPrice.enable();
        this.orderForm.controls.minPrice.enable();
      }
    });
  }

  public onOrderSubmit(): void {
    let order: PlaceShareOrder = {
      shareId: this.shareId,
      depotId: this.orderValue.depot.value.depotId,
      type: this.orderType,
      detail: this.orderValue.orderDetail.value.value,
      amount: this.orderValue.numberOfShares.value,
      validity: this.orderValue.dateOfExpiry.value.value.toISOString().slice(0, 19).replace('T', ' '),
      limit: this.orderValue.limitPrice.value,
    };

    this.depotService.createOrder(order, this.orderValue.algorithmicTradingType.value.value)
      .subscribe(
        (data) => {
          this.router.navigate(['depot-detail', this.orderValue.depot.value.depotId]);
          this.toastr.success('', 'Order wurde platziert.')
        },
        (error) => this.toastr.error(error.error.message, 'Order konnte nicht erstellt werden.')
      )
  }

  public get orderValue(): ControlsMap<AbstractControl> {
    return this.orderForm.controls;
  }

  public getDepotDetail(): void {
    this.depotService.getDepotById(this.orderValue.depot.value.depotId).subscribe(
      data => this.detailDepot = data)
  }

  public getShareAmount(): number {
    if (this.detailDepot) {
      return this.detailDepot.positions.find(position => position.share.isin === this.share?.isin).amount
    }
    return 100001;
  }

  public isValidForm(): boolean {
    return (this.orderForm.invalid || ((this.getShareAmount() < this.orderValue.numberOfShares.value) && this.orderType == OrderType.sell))
  }

  public cancel(): void {
    this._location.back()
  }

  public calculateSharePrice(): void {
    if (this.orderValue.orderDetail.value == this.orderDetailsArray[1]) {
      this.currentPrice = +this.orderForm.controls.limitPrice.value;
    } else if (this.orderValue.orderDetail.value == this.orderDetailsArray[2]) {
      let maxPrice: number = +this.orderForm.controls.maxPrice.value;
      let minPrice: number = +this.orderForm.controls.minPrice.value;
      this.currentPrice = (maxPrice + minPrice) / 2;
    } else {
      this.currentPrice = this.share.lastRecordedValue;
    }

    this.sharePrice = this.orderForm.controls.numberOfShares.value * this.currentPrice;
  }

  public createChart(): void {
    let x: Array<Date> = [];
    let y: Array<number> = [];
    let data: Array<any> = [];

    //this sorts the data. should not be necessary, would be best if the backend does this
    this.historicalData.chartValues = this.historicalData.chartValues.sort((n1, n2) => {
      if (n1.recordedAt > n2.recordedAt) {
        return 1;
      }
      if (n1.recordedAt < n2.recordedAt) {
        return -1;
      }
      return 0;
    });

    this.historicalData?.chartValues.forEach(element => {
      x.push(element.recordedAt);
      y.push(element.recordedValue);
      data.push([element.recordedAt, element.recordedValue])
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
        boundaryGap: false,
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
        {
          name: this.historicalData.share.shareName,
          data: data,
          smooth: false,
          symbol: 'none',
          areaStyle: {},
          type: 'line',
        },
      ],
    };
  }
}