import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Location } from '@angular/common';
import { Depot, HistoricalData, MetaConst, Share } from 'src/app/logic/data-models/data-models';
import { DepotService } from 'src/app/logic/services/depot.service';
import { ShareService } from 'src/app/logic/services/share.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  public selectedOrderType: string;
  public share: Share;
  public metaConst: MetaConst;
  public expiredDateArray: Array<{}>;
  private shareId: string;
  private historicalData: HistoricalData;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  public sharePrice: number;
  currentPrice: number;
  selectedDepot: any;
  depotName: string;

  constructor(private location: Location,
    private depotService: DepotService,
    private shareService: ShareService,
    private metaService: MetaService,
    private route: ActivatedRoute,
  ) {
    this.buildExpiredDateArray();
  }

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
    this.metaService.getAllMetaData().subscribe(metaConst => this.metaConst = metaConst);
    this.createForm();
  }

  buildExpiredDateArray() {
    let today: Date = new Date();
    let sevenDays: Date = new Date(today);
    let fourteenDays: Date = new Date(today);
    let thirtyDays: Date = new Date(today);

    sevenDays.setDate(sevenDays.getDate() + 7);
    fourteenDays.setDate(sevenDays.getDate() + 14);
    thirtyDays.setDate(sevenDays.getDate() + 30);

    this.expiredDateArray = [
      { name: 'Morgen', value: today },
      { name: '7 Tage', value: sevenDays },
      { name: '14 Tage', value: fourteenDays },
      { name: '30 Tage', value: thirtyDays },
    ];
  }


  public createForm(): void {
    this.buyForm = new FormGroup({
      depot: new FormControl('', Validators.required),
      limitPrice: new FormControl('', Validators.required),
      maxPrice: new FormControl('', Validators.required),
      minPrice: new FormControl('', Validators.required),
      dateOfExpiry: new FormControl('', Validators.required),
      numberOfShares: new FormControl('', Validators.required),
      sharePrice: new FormControl({value: '', disabled: true}, Validators.required),
      algorithmicTradingType: new FormControl('', Validators.required),
    });
  }

  public onBuySubmit(): void {

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

  // TODO
  public cancel(): void {
    //this.location.back()
  }

  onDepotSelected(event: any): void {
    this.selectedDepot = event.target.value;
    this.depotArray.forEach(depot => {
      if (depot.depotId === this.selectedDepot) {
        this.depotName = depot.name;
      }
    });
  }

  onOrderTypeSelected(event: any): void {
    this.selectedOrderType = event.target.value;
    if (this.selectedOrderType === "limitPrice") {
      this.buyForm.patchValue({
        minPrice: "",
        maxPrice: "",
        numberOfShares: "",
        sharePrice: ""
      });
    }
    else if (this.selectedOrderType === "stopPrice") {
      this.buyForm.patchValue({
        limitPrice: "",
        numberOfShares: "",
        sharePrice: ""
      });
    } else if (this.selectedOrderType === "marketPrice") {
      this.buyForm.setValue({
        limitPrice: "",
        minPrice: "",
        maxPrice: "",
        numberOfShares: "",
        sharePrice: ""
      });
    }
  }

  public calculateSharePrice(event: any): void {
    let numberOfShares: number = event.target.value;
    if (this.selectedOrderType === "limitPrice") {
      this.currentPrice = +this.buyForm.controls.limitPrice.value;
    } else if (this.selectedOrderType === "stopPrice") {
      let maxPrice: number = +this.buyForm.controls.maxPrice.value;
      let minPrice: number = +this.buyForm.controls.minPrice.value;
      this.currentPrice = (maxPrice + minPrice) / 2;
    } else {
      this.currentPrice = this.share.lastRecordedValue;
    }

    this.sharePrice = numberOfShares * this.currentPrice;
  }


}
