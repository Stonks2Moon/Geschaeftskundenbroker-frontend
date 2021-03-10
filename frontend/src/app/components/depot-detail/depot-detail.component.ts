import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EChartsOption } from 'echarts';
import { Depot, DepotPosition } from 'src/app/logic/data-models/data-models';
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


  ngOnInit(): void {
    this.depotId = this.route.snapshot.paramMap.get('depotId');
    this.depotService.getDepotById(this.depotId).subscribe(depot => {

      this.depot = depot;
      this.createChart();
      this.createPieChart();

    });

  }
  public createPieChart(): void {

    let data: Array<any> = [];

    this.depot.positions?.forEach(element => {
      let dataObj = { value: element.amount, name: element.share.shareName }
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
  };
}
