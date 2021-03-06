import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { color, EChartsOption } from 'echarts';
import { ComplexOuterSubscriber } from 'rxjs/internal/innerSubscribe';
import { first, min } from 'rxjs/operators';
import { HistoricalData, Share } from 'src/app/logic/data-models/data-models';
import { Statistics } from 'src/app/logic/data-models/statistics.model';
import { ShareService } from 'src/app/logic/services/share.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {
  public chartOption: EChartsOption;
  public dayChartOption: EChartsOption;
  public share: Share;
  public statistics: Statistics;
  public dataAvailable: number; //0= no Data available, 1= only one Day available, 2= more dates available, 3= only historical data
  public dayView: boolean;
  private shareId: string;
  private historicalData: HistoricalData;
  private todayData: HistoricalData;
  private fromDate: Date = new Date();
  private yesterday: Date = new Date();
  private toDate: Date = new Date();


  constructor(
    private route: ActivatedRoute,
    private shareService: ShareService,
  ) {
    this.fromDate.setDate(this.fromDate.getDate() - 365);
    this.yesterday.setDate(this.fromDate.getDate() - 1);
  }

  ngOnInit(): void {
    this.shareId = this.route.snapshot.paramMap.get('shareId');
    this.shareService.getShareById(this.shareId).subscribe(share => this.share = share);
    try {
      this.shareService.getShareHistory({ shareId: this.shareId, fromDate: this.fromDate, toDate: this.toDate })
        .toPromise()
        .then(
          data => {
            this.historicalData = data;
            this.createChart();
          }
        );
    } catch (err) {
      this.dataAvailable = 0
      console.log(err)
    }
    try {
      this.shareService.getShareHistory({ shareId: this.shareId, fromDate: this.yesterday, toDate: this.toDate })
        .toPromise()
        .then(
          data => {
            this.todayData = data;
          }
        );
    } catch (err) {
      console.log(err)
    }
    try {
      this.shareService.getStatisticsById(this.shareId)
        .toPromise()
        .then(
          data => {
            this.statistics = data;
          }
        );
    } catch (err) {
      console.log(err)
    }

  }

  public changeView(event): void {
    if (event.target.id == "history") {
      this.dayView = false
    } else if (event.target.id == "today") {
      this.dayView = true
    } else {
      console.log("error with viewbutton")
    }
  }

  public createChart(): void {
    let x: Array<Date> = [];
    let y: Array<number> = [];
    let data: Array<any> = [];
    let dates: Array<string> = [];
    let dailyaverages: Array<number> = [];
    let weeklyaverages: Array<number> = [];

    if (this.historicalData.chartValues.length != 0) {
      let firstDate = new Date(this.historicalData.chartValues[0].recordedAt)
      let lastDate = new Date(this.historicalData.chartValues[this.historicalData.chartValues.length - 1].recordedAt)
      if (firstDate.getFullYear() == lastDate.getFullYear() && firstDate.getMonth() == lastDate.getMonth() && firstDate.getDate() == lastDate.getDate()) {
        //nur ein Tag
        this.dataAvailable = 1
        this.createDayChart()
      } else {
        if (this.todayData.chartValues.length == 0) {
          //nur vergangenheitsdaten
          this.dataAvailable = 3
        } else {
          //daten für mehrere tage
          this.dataAvailable = 2
          this.createDayChart()
        }
      }
    } else {
      //keine Daten verfügbar
      this.dataAvailable = 0
    }

    let currentDate = new Date(this.historicalData.chartValues[0].recordedAt)
    let open = 0
    let close = 0
    let lowest = 0
    let highest = 0
    this.historicalData?.chartValues.forEach(element => {
      let newDate = new Date(element.recordedAt)
      if (newDate.getFullYear() == currentDate.getFullYear() && newDate.getMonth() == currentDate.getMonth() && newDate.getDay() == currentDate.getDay()) {
        if (open == 0) {
          open = element.recordedValue
        }
        close = element.recordedValue
        if (lowest == 0 || lowest > element.recordedValue) {
          lowest = element.recordedValue
        }
        if (highest == 0 || highest < element.recordedValue) {
          highest = element.recordedValue
        }
      } else {
        data.push([open, close, lowest, highest])
        let average = (lowest + highest + close + open) / 4
        dailyaverages.push(Number(average.toFixed(2)))
        if (dailyaverages.length <= 7) {
          var weekstart = 0
        } else {
          var weekstart = (dailyaverages.length - 7)
        }
        var count = 0;
        for (var i = weekstart; i < dailyaverages.length; i++) {
          count += dailyaverages[i];
        }
        weeklyaverages.push(Number((count / 7).toFixed(2)))
        open = element.recordedValue
        close = element.recordedValue
        lowest = element.recordedValue
        highest = element.recordedValue
        dates.push([currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()].join('/'))
        currentDate = new Date(element.recordedAt)
      }
    });
    data.push([open, close, lowest, highest])
    let average = (lowest + highest + close + open) / 4
    dailyaverages.push(Number(average.toFixed(2)))
    if (dailyaverages.length <= 7) {
      var weekstart = 0
    } else {
      var weekstart = (dailyaverages.length - 7)
    }
    var count = 0;
    for (var i = weekstart; i < dailyaverages.length; i++) {
      count += dailyaverages[i];
    }
    weeklyaverages.push(Number((count / 7).toFixed(2)))
    dates.push([currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()].join('/'))

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
        min: 'dataMin',
        max: 'dataMax',
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
          itemStyle: {
            color: '#28B557',
            color0: '#B54643',
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
          itemStyle: {
            color: '#B5791F',
            borderColor: '#B5791F',


          },
        },
        {
          name: "Wochendurschnitt",
          data: weeklyaverages,
          type: 'line',
          smooth: false,
          symbol: 'diamond',
          itemStyle: {
            color: '#3A80B5',
            borderColor: '#3A80B5',
          },
        },

      ],
    };
  }


  public createDayChart(): void {
    let x: Array<Date> = [];
    let y: Array<number> = [];
    let data: Array<any> = [];

    let lastDay = new Date(this.historicalData?.chartValues[0].recordedAt)
    this.todayData?.chartValues.forEach(element => {
      data.push([element.recordedAt, element.recordedValue])
    });

    this.dayChartOption = {
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
