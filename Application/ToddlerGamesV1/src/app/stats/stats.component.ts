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
  chart: ApexChart |undefined;
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

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Drag and Drop",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "Type 'N' Pop",
          data: [76, 85, 66, 98, 87, 44, 91, 22, 94]
        },
        {
          name: "Stack the Bricks",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%"
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Mar-30",
          "Mar-31",
          "Apr-1",
          "Apr-2",
          "Apr-3",
          "Apr-4",
          "Apr-5",
          "Apr-6",
          "Apr-7"
        ]
      },
      yaxis: {
        title: {
          text: "Score"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val:any) {
            return + val + " out of 100";
          }
        }
     }
    };
  }
}

