import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { color, EChartsOption } from 'echarts';
import { ComplexOuterSubscriber } from 'rxjs/internal/innerSubscribe';
import { min } from 'rxjs/operators';
import { HistoricalData, Share } from 'src/app/logic/data-models/data-models';
import { ShareService } from 'src/app/logic/services/share.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {
  public chartOption: EChartsOption;
  public share: Share;
  private shareId: string;
  private historicalData: HistoricalData;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private shareService: ShareService,
  ) {
    this.fromDate.setDate(this.fromDate.getDate() - 365);
  }

  ngOnInit(): void {
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
  }

  public createChart(): void {
    console.log(this.historicalData);

    let x: Array<Date> = [];
    let y: Array<number> = [];
    let data: Array<any> = [];
    let dates: Array<string> = [];
    let dailyaverages: Array<number> =[];
    let weeklyaverages: Array<number> =[];

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
    let currentDate = new Date(this.historicalData.chartValues[0].recordedAt)
    let open = 0
    let close = 0
    let lowest = 0
    let highest = 0
    console.log(this.historicalData?.chartValues.length)
    this.historicalData?.chartValues.forEach(element => {
      let newDate = new Date(element.recordedAt)
      if(newDate.getFullYear() == currentDate.getFullYear() && newDate.getMonth() == currentDate.getMonth() && newDate.getDay() == currentDate.getDay()){
        if(open == 0){
          open = element.recordedValue
        }
        close = element.recordedValue
        if(lowest == 0 || lowest > element.recordedValue){
          lowest = element.recordedValue
        }
        if(highest == 0 || highest < element.recordedValue){
          highest = element.recordedValue
        }
      }else{
        data.push([open,close,lowest,highest])
        let average = (lowest+highest+close+open)/4
        dailyaverages.push(Number(average.toFixed(2)))
        if(dailyaverages.length <= 7){
          var weekstart = 0
        }else{
          var weekstart = (dailyaverages.length-7)
        }
        var count=0;
          for (var i=weekstart; i<dailyaverages.length; i++) {
              count+=dailyaverages[i];
          }
        weeklyaverages.push(Number((count/7).toFixed(2)))
        open = element.recordedValue
        close = element.recordedValue
        lowest = element.recordedValue
        highest = element.recordedValue
        dates.push([currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()].join('/'))
        currentDate = new Date(element.recordedAt)
      }
    });

    console.log(data)
    this.chartOption = {
      tooltip: {
        trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
    
    },
      toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'

            },
            restore: {},
            saveAsImage: {}
        }
    },
    
      xAxis: {
        type: 'category',
        data: dates,
        min:'dataMin',
        max:'dataMax',
      },
      yAxis: {
        type: 'value',
      },
      dataZoom: [{
        type: 'inside',
        filterMode: 'filter',
        startValue: Math.floor(data.length * 0.8),
        endValue: data.length
        
    }, {
        filterMode: 'empty'
    }],
      series: [
        {
          name: this.historicalData.share.shareName,
          data: data,
          type: 'candlestick',
          itemStyle:{
            color : '#28B557',
            color0 :'#B54643',
            borderColor: '#28B557',
            borderColor0: '#B54643',
            
          },
    
          
        },
        {
          name: "Tagesdurschnitt",
          data: dailyaverages,
          type: 'line',
          smooth: false,
          symbol: 'diamond',
          itemStyle:{
            color : '#B5791F',
            borderColor: '#B5791F',
            
            
          },
          
    
          
        },
        {
          name: "Wochendurschnitt",
          data: weeklyaverages,
          type: 'line',
          smooth: false,
          symbol: 'diamond',
          itemStyle:{
            color : '#3A80B5',
            borderColor: '#3A80B5',
            
            
          },
        },
        
      ],
    };
  }


  /**
   * This is for the small views of the chart, where not much detail is needed
   * public createChart(): void {
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
            axisPointer: {
                type: 'cross'
            },
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
    
    },
      toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
      xAxis: {
        type: 'time',
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
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
   */


}
