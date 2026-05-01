import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { ChartConfig, KpiData } from '@core/models/dashboard.model';
import { ChartDataset } from 'chart.js';
import { DashboardService } from '@core/services/dashboard.service';
import { ChartComponent } from '@shared/components/chart/chart.component';
import { KpiCardComponent } from '@shared/components/kpi-card/kpi-card.component';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, KpiCardComponent, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  //kpi data
  kpiData: KpiData = {
    totalAlerts: 0,
    activeUsers: 0,
    systemHealth: 0,
    responseTime: 0,
  };

  //chart config
  lineChartConfig: ChartConfig | null = null;
  barChartConfig: ChartConfig | null = null;
  pieChartConfig: ChartConfig | null = null;

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadKpiData();
    this.loadChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadKpiData(): void {
    this.dashboardService
      .getKpiData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.kpiData = data;
        this.cdr.markForCheck();
        console.log('KPI data updated in component:', this.kpiData);
      });
  }

  private loadChart(): void {
    this.dashboardService
      .getTimeSeriesData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((points) => {
        console.log(points, 'points');
        this.lineChartConfig = {
          labels: points.map((p) => p.label || ''),
          datasets: [
            {
              label: 'System Load %',
              data: points.map((p) => p.value),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59 , 130,246,0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
            },
          ],
        };
        console.log(this.lineChartConfig, 'lineconfig');
      });

    this.dashboardService
      .getSystemMetrics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((metrics) => {
        this.barChartConfig = {
          labels: metrics.map((m) => m.name),
          datasets: [
            { label: 'CPU %', data: metrics.map((m) => m.cpu), backgroundColor: '#3b82f6' },
            { label: 'Memory %', data: metrics.map((m) => m.memory), backgroundColor: '#22c55e' },
            { label: 'Disk %', data: metrics.map((m) => m.disk), backgroundColor: '#f97316' },
          ],
        };
      });

    this.dashboardService
      .getAlertDistribution()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dist) => {
        console.log(dist, 'dist');
        this.pieChartConfig = {
          labels: dist.map((p) => p.category || ''),
          datasets: [
            {
              label: 'Alerts',
              data: dist.map((p) => p.count),
              backgroundColor: dist.map((d) => d.color),
            },
          ],
        };
      });
  }
}
