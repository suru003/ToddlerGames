import { Component, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart | undefined;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'stats-graph',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})

export class StatsComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<any>;
  dndScores: number[];
  tnpScores: number[];
  stbScores: number[];

  constructor() {
    var x = localStorage.getItem("game1EasyScore");
    var y = localStorage.getItem("game1MedScore");
    var z = localStorage.getItem("game1HardScore");
    var X: number = x == null ? 0 : +x;
    var Y: number = y == null ? 0 : +y;
    var Z: number = z == null ? 0 : +z;
    this.dndScores = [X, Y, Z];
    x = localStorage.getItem("game2EasyScore");
    y = localStorage.getItem("game2MedScore");
    z = localStorage.getItem("game2HardScore");
    X = x == null ? 0 : +x;
    Y = y == null ? 0 : +y;
    Z = z == null ? 0 : +z;
    this.tnpScores = [X, Y, Z];
    x = localStorage.getItem("game3EasyScore");
    y = localStorage.getItem("game3MedScore");
    z = localStorage.getItem("game3HardScore");
    X = x == null ? 0 : +x;
    Y = y == null ? 0 : +y;
    Z = z == null ? 0 : +z;
    this.stbScores = [X, Y, Z];
    this.chartOptions = {
      series: [{
        name: 'Easy',
        data: [this.dndScores[0], this.tnpScores[0], this.stbScores[0]]
      }, {
        name: 'Medium',
        data: [this.dndScores[1], this.tnpScores[1], this.stbScores[1]]
      }, {
        name: 'Hard',
        data: [this.dndScores[2], this.tnpScores[2], this.stbScores[2]]
      }],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      title: {
        text: 'Fiction Books Sales'
      },
      xaxis: {
        categories: ['Drag and Drop', 'Type N Pop', 'Stack the Bricks'],
        labels: {
          formatter: function (val: string) {
            return val
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        },
      },
      tooltip: {
        y: {
          formatter: function (val: string) {
            return val + " out of 100"
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
      }
    };
  }
}

