import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Location } from '@angular/common';
import { ControlsMap, Depot, HistoricalData, MetaConst, OrderDetail, OrderType, PlaceShareOrder, Share } from 'src/app/logic/data-models/data-models';
import { DepotService } from 'src/app/logic/services/depot.service';
import { ShareService } from 'src/app/logic/services/share.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MetaService } from 'src/app/logic/services/meta.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss']
})

export class BuyComponent implements OnInit {
  public buyForm: FormGroup;
  public chartOption: EChartsOption;
  public depotArray: Array<Depot> = [];
  public share: Share;
  public metaConst: MetaConst;
  public expiredDateArray: Array<{ name: string, value: Date }>;
  public algorithmTypesArray: Array<{ name: string, value: number }>;
  public selectedAlgorithm: any;
  public algorithmName: string;

  // Pop up values
  public currentPrice: number;
  public sharePrice: number;

  // statistic values
  private historicalData: HistoricalData;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private shareId: string;


  constructor(
    private location: Location,
    private depotService: DepotService,
    private shareService: ShareService,
    private metaService: MetaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.buildExpiredDateArray();
  }

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

  ngOnInit(): void {
    this.fromDate.setDate(this.fromDate.getDate() - 30)
    this.depotService.getAllDepotsBySession().subscribe(depots => {
      this.depotArray = depots;
    });
    this.shareId = this.route.snapshot.paramMap.get('shareId');
    this.shareService.getShareById(this.shareId).subscribe(share => this.share = share);
    this.shareService.getShareHistory({ shareId: this.shareId, fromDate: this.fromDate, toDate: this.toDate })
      .toPromise()
      .then(
        data => {
          this.historicalData = data;
          this.createChart();
        }
      );
    this.metaService.getMetaConsts()
      .toPromise()
      .then(
        data => {
          this.metaConst = data;
          this.buildAlgArray()
        }
      )
    this.createForm();
  }

  buildExpiredDateArray() {
    let today: Date = new Date();
    let tomorrow: Date = new Date(today);
    let sevenDays: Date = new Date(today);
    let fourteenDays: Date = new Date(today);
    let thirtyDays: Date = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);
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

  private buildAlgArray() {
    this.algorithmTypesArray = [
      {
        name: "Kein Algorithmus",
        value: this.metaConst.ALGORITHMS.NO_ALG
      },
      {
        name: "Split Algorithmus",
        value: this.metaConst.ALGORITHMS.SPLIT_ALG
      }
    ];
  }

  public createForm(): void {
    this.buyForm = new FormGroup({
      depot: new FormControl('', Validators.required),
      orderDetail: new FormControl('', Validators.required),
      sharePrice: new FormControl({ value: '', disabled: true }, Validators.required),
      limitPrice: new FormControl({ value: 0, disabled: true }, [Validators.required, Validators.min(1)]),
      maxPrice: new FormControl({ value: '', disabled: true }, Validators.required),
      minPrice: new FormControl({ value: '', disabled: true }, Validators.required),
      dateOfExpiry: new FormControl('', Validators.required),
      numberOfShares: new FormControl('', Validators.required),
      algorithmicTradingType: new FormControl('', Validators.required),
    });

    this.buyForm.controls.orderDetail.valueChanges.subscribe(orderDetail => {
      if (orderDetail == this.orderDetailsArray[0]) {
        this.buyForm.controls.limitPrice.disable();
        this.buyForm.controls.maxPrice.disable();
        this.buyForm.controls.minPrice.disable();
      } else if (orderDetail == this.orderDetailsArray[1]) {
        this.buyForm.controls.limitPrice.enable();
        this.buyForm.controls.maxPrice.disable();
        this.buyForm.controls.minPrice.disable();
      } else if (orderDetail == this.orderDetailsArray[2]) {
        this.buyForm.controls.limitPrice.disable();
        this.buyForm.controls.maxPrice.enable();
        this.buyForm.controls.minPrice.enable();
      }
    });
  }

  public onBuySubmit(): void {
    let order: PlaceShareOrder = {
      shareId: this.shareId,
      depotId: this.buyValue.depot.value.depotId,
      type: OrderType.buy,
      detail: this.buyValue.orderDetail.value.value,
      amount: this.buyValue.numberOfShares.value,
      validity: this.buyValue.dateOfExpiry.value.value.toISOString().slice(0, 19).replace('T', ' '),
      limit: this.buyValue.limitPrice.value,
    };



    this.depotService.createOrder(order, this.buyValue.algorithmicTradingType.value.value)
      .subscribe(data => {
        this.router.navigate(['depot-detail', this.buyValue.depot.value.depotId]);
      })
  }

  public get buyValue(): ControlsMap<AbstractControl> {
    return this.buyForm.controls;
  }

  public onorderDetailSelected(event: any): void {
    // if selected order type is markt price
    if (this.buyValue.orderDetail.value == this.orderDetailsArray[0]) {
      this.buyForm.patchValue({
        minPrice: "",
        maxPrice: "",
        limitPrice: "",
        numberOfShares: "",
        sharePrice: ""
      });
    }
    // if selected order type is limit price
    else if (this.buyValue.orderDetail.value == this.orderDetailsArray[1]) {
      this.buyForm.patchValue({
        minPrice: "",
        maxPrice: "",
        numberOfShares: "",
        sharePrice: ""
      });
    }
    // if selected order type is stop price
    else if (this.buyValue.orderDetail.value == this.orderDetailsArray[2]) {
      this.buyForm.patchValue({
        limitPrice: "",
        numberOfShares: "",
        sharePrice: ""
      });
    }
  }

  // TODO
  public cancel(): void {
    //this.location.back()
  }

  public calculateSharePrice(): void {
    if (this.buyValue.orderDetail.value == this.orderDetailsArray[1]) {
      this.currentPrice = +this.buyForm.controls.limitPrice.value;
    } else if (this.buyValue.orderDetail.value == this.orderDetailsArray[2]) {
      let maxPrice: number = +this.buyForm.controls.maxPrice.value;
      let minPrice: number = +this.buyForm.controls.minPrice.value;
      this.currentPrice = (maxPrice + minPrice) / 2;
    } else {
      this.currentPrice = this.share.lastRecordedValue;
    }

    this.sharePrice = this.buyForm.controls.numberOfShares.value * this.currentPrice;
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