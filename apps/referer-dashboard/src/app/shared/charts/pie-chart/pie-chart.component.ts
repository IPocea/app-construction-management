import {
  Component,
  ViewChild,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ColorsService } from 'app/services/colors/colors.service';
import { ChartType,ChartOptions, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit ,OnDestroy{
  @ViewChild(BaseChartDirective) public chart: any;
  
  @Input() chartDataValue: any;
  @Input() chartDataLabels: any;
  @Input() chartTitle: any;
  colorSub: Subscription;
  
  updateChart() {
    this.chart.chart.update(); // This re-renders the canvas element.
  }
  dynamicColors() {
    let compStyle = window.getComputedStyle(document.querySelector('body'));
    return compStyle;
  }
  primary = this.dynamicColors().getPropertyValue('color');
  secondary = this.dynamicColors().getPropertyValue('background-color');
  ternary = this.dynamicColors().getPropertyValue('border-color');
  public pieChartOptions: ChartOptions;
  public pieChartData: ChartData<'pie'>;
  public chartType: ChartType = 'pie';

  constructor(private color: ColorsService,) {
    this.colorSub = this.color.getComputedStyle().subscribe({
      next: (data) => {
          this.primary = data.getPropertyValue('color');
          this.secondary = data.getPropertyValue('background-color');
          this.ternary = data.getPropertyValue('border-color');
          this.updateChart();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
ngOnInit(): void {
    // Start PieChart
    this.pieChartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: this.chartTitle,
          font: {
            size: 22,
            family: 'Arial',
          },
          color: this.ternary,
        },
        legend: {
          position: 'bottom',
        },
      },
    };
  
    this.pieChartData = {
      labels: this.chartDataLabels,
      datasets: [
        {
          data: this.chartDataValue,
          borderWidth: 1,
          backgroundColor: [this.primary],
        },
      ],
    };
}
  ngOnDestroy(): void {
    this.colorSub.unsubscribe();
  }
}
