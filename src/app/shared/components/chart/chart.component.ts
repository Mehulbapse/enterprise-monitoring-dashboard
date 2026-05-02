import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
  viewChild,
  ViewChild,
} from '@angular/core';
import { ChartConfig } from '@core/models/dashboard.model';
import { Theme, ThemeService } from '@core/services/theme.service';

import { ChartType, Chart, registerables, Colors } from 'chart.js';
import { animation } from 'node_modules/@angular/animations/types/_animation_player-chunk';
import { Subject, takeUntil } from 'rxjs';

Chart.register(...registerables);
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() chartType: ChartType = 'line';
  @Input() config!: ChartConfig;
  @Input() height = '300px';

  @ViewChild('chartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private viewReady = false;

  // canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('')

  private chart: Chart | null = null;
  private destroy$ = new Subject<void>();
  private currentTheme: Theme = 'light';

  constructor(private themeService: ThemeService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // console.log(this.canvasRef);
    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe((theme) => {
      this.currentTheme = theme;
      if (this.chart) {
        this.updateChartTheme();
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if ((this.viewReady && changes['config']) || changes['chartType']) {
      this.buildChart();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyChart();
  }

  private updateChartTheme(): void {
    this.buildChart();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private buildChart(): void {
    if (!this.config) return;

    this.destroyChart();

    const textColor = this.currentTheme === 'dark' ? '#e0e0e0' : '#333333';
    const gridColor = this.currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    // console.log(this.canvasRef);
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: this.chartType,
      data: {
        labels: this.config.labels,
        datasets: this.config.datasets.map((ds) => ({ ...ds })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 500,
        },
        plugins: {
          legend: {
            labels: { color: textColor },
          },
        },
        scales:
          this.chartType !== 'pie' && this.chartType !== 'doughnut'
            ? {
                x: {
                  ticks: { color: textColor },
                  grid: { color: gridColor },
                },
                y: {
                  ticks: { color: textColor },
                  grid: { color: gridColor },
                },
              }
            : undefined,
      },
    });

    // this.cdr.markForCheck()
  }
}
