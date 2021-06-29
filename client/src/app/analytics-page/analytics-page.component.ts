import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AbstractComponent} from "../abstract.component";
import {takeUntil} from "rxjs/operators";
import {ChartConfig} from "../shared/interfaces";
import * as Chart from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent extends AbstractComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gainCanvas')
  public gainCanvasRef: ElementRef;
  @ViewChild('ordersCanvas')
  public ordersCanvasRef: ElementRef;

  public average: number;
  public pending: boolean = true;


  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  public ngAfterViewInit(): void {
    const gainConfig: ChartConfig = {
      label: 'Gain',
      color: 'rgb(255, 99, 132)'
    }

    const ordersConfig: ChartConfig = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)'
    }
    this.analyticsService.getAnalytics()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        this.average = response.average;

        gainConfig.labels = response.chart.map(item => item.label);
        gainConfig.data = response.chart.map(item => item.gain);

        ordersConfig.labels = response.chart.map(item => item.label);
        ordersConfig.data = response.chart.map(item => item.order);

        // temp
        // gainConfig.labels.push('23.06.2021');
        // gainConfig.data.push(1500);
        //
        // gainConfig.labels.push('24.06.2021');
        // gainConfig.data.push(1000);
        //
        // ordersConfig.labels.push('23.06.2021');
        // ordersConfig.data.push(8);
        //
        // ordersConfig.labels.push('24.06.2021');
        // ordersConfig.data.push(5);
        // temp

        const gainCtx = this.gainCanvasRef.nativeElement.getContext('2d');
        gainCtx.canvas.height = '300px';

        const orderCtx = this.ordersCanvasRef.nativeElement.getContext('2d');
        orderCtx.canvas.height = '300px';

        // tslint:disable-next-line:no-unused-expression
        new Chart(gainCtx, createChartConfig(gainConfig));

        // tslint:disable-next-line:no-unused-expression
        new Chart(orderCtx, createChartConfig(ordersConfig));

        this.pending = false;
      })
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

}

function createChartConfig(config: ChartConfig) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels: config.labels,
      datasets: [{
        label: config.label,
        data: config.data,
        borderColor: config.color,
        steppedLine: false,
        fill: false
      }]
    }
  }
}
