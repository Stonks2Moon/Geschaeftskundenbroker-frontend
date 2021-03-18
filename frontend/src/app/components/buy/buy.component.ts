import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Location } from '@angular/common';
import { Depot, HistoricalData, Share } from 'src/app/logic/data-models/data-models';
import { DepotService } from 'src/app/logic/services/depot.service';
import { ShareService } from 'src/app/logic/services/share.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss']
})
export class BuyComponent implements OnInit {
  public chartOption: EChartsOption;
  public depotArray: Array<Depot> = [];
  selected: string;
  public share: Share;
  private shareId: string;
  private historicalData: HistoricalData;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();

  constructor(private location: Location, private depotService: DepotService,    private shareService: ShareService,private route: ActivatedRoute,) {

   }

  ngOnInit(): void {
    this.fromDate.setDate(this.fromDate.getDate() - 30)
    this.depotService.getAllDepotsBySession().subscribe(depots => {
      this.depotArray = depots;
    });
    this.shareId = this.route.snapshot.paramMap.get('shareId');
    console.log(this.shareId)
    this.shareService.getShareById(this.shareId).subscribe(share => this.share = share);
    this.shareService.getShareHistory({ shareId: this.shareId, fromDate: this.fromDate, toDate: this.toDate })
      .toPromise()
      .then(
        data => {
          this.historicalData = data;
          this.createChart();
        }
      );
  }
  public createChart(): void {
    console.log(this.historicalData);

    let x: Array<Date> = [];
    let y: Array<number> = [];
    let data: Array<any> = [];

    //this sorts the data. should not be necessary, would be best if the backend does this
    this.historicalData.chartValues = this.historicalData.chartValues.sort((n1,n2) => {
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
      data.push([element.recordedAt ,element.recordedValue])
    });

    console.log(data)
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

  onOptionsSelected(event: any){
    this.selected = event.target.value;
  }

  
}
