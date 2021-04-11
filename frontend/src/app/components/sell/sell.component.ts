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
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {
  public sellForm: FormGroup;
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
    this.sellForm = new FormGroup({
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

    this.sellForm.controls.orderDetail.valueChanges.subscribe(orderDetail => {
      if (orderDetail == this.orderDetailsArray[0]) {
        this.sellForm.controls.limitPrice.disable();
        this.sellForm.controls.maxPrice.disable();
        this.sellForm.controls.minPrice.disable();
      } else if (orderDetail == this.orderDetailsArray[1]) {
        this.sellForm.controls.limitPrice.enable();
        this.sellForm.controls.maxPrice.disable();
        this.sellForm.controls.minPrice.disable();
      } else if (orderDetail == this.orderDetailsArray[2]) {
        this.sellForm.controls.limitPrice.disable();
        this.sellForm.controls.maxPrice.enable();
        this.sellForm.controls.minPrice.enable();
      }
    });
  }

  public onSellSubmit(): void {
    let order: PlaceShareOrder = {
      shareId: this.shareId,
      depotId: this.sellValue.depot.value.depotId,
      type: OrderType.sell,
      detail: this.sellValue.orderDetail.value.value,
      amount: this.sellValue.numberOfShares.value,
      validity: this.sellValue.dateOfExpiry.value.value.toISOString().slice(0, 19).replace('T', ' '),
      limit: this.sellValue.limitPrice.value,
    };

    this.depotService.createOrder(order, this.sellValue.algorithmicTradingType.value.value)
      .subscribe(data => {
        console.log(data)
        this.router.navigate(['depot-detail', this.sellValue.depot.value.depotId]);
      })
  }

  public get sellValue(): ControlsMap<AbstractControl> {
    return this.sellForm.controls;
  }

  public onorderDetailSelected(event: any): void {
    // if selected order type is markt price
    if (this.sellValue.orderDetail.value == this.orderDetailsArray[0]) {
      this.sellForm.patchValue({
        minPrice: "",
        maxPrice: "",
        limitPrice: "",
        numberOfShares: "",
        sharePrice: ""
      });
    }
    // if selected order type is limit price
    else if (this.sellValue.orderDetail.value == this.orderDetailsArray[1]) {
      this.sellForm.patchValue({
        minPrice: "",
        maxPrice: "",
        numberOfShares: "",
        sharePrice: ""
      });
    }
    // if selected order type is stop price
    else if (this.sellValue.orderDetail.value == this.orderDetailsArray[2]) {
      this.sellForm.patchValue({
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
    if (this.sellValue.orderDetail.value == this.orderDetailsArray[1]) {
      this.currentPrice = +this.sellForm.controls.limitPrice.value;
    } else if (this.sellValue.orderDetail.value == this.orderDetailsArray[2]) {
      let maxPrice: number = +this.sellForm.controls.maxPrice.value;
      let minPrice: number = +this.sellForm.controls.minPrice.value;
      this.currentPrice = (maxPrice + minPrice) / 2;
    } else {
      this.currentPrice = this.share.lastRecordedValue;
    }

    this.sharePrice = this.sellForm.controls.numberOfShares.value * this.currentPrice;
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
