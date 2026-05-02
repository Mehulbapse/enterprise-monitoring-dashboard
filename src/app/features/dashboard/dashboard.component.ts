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

import {
  Alert,
  AlertSeverity,
  AlertStatus,
  ChartConfig,
  DashboardFilters,
  KpiData,
  PaginatedResponse,
  SortState,
  TableColumn,
} from '@core/models/dashboard.model';
import { ChartDataset } from 'chart.js';
import { DashboardService } from '@core/services/dashboard.service';
import { ChartComponent } from '@shared/components/chart/chart.component';
import { KpiCardComponent } from '@shared/components/kpi-card/kpi-card.component';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import {
  BehaviorSubject,
  combineLatest,
  debounce,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from 'rxjs';
import { DataTableComponent } from '@shared/components/data-table/data-table.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    KpiCardComponent,
    ChartComponent,
    DataTableComponent,
  ],
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

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'Alert ID', sortable: true, width: '120px' },
    { key: 'message', label: 'Message', sortable: true },
    { key: 'severity', label: 'Severity', sortable: true, type: 'badge', width: '110px' },
    { key: 'status', label: 'Status', sortable: true, type: 'badge', width: '130px' },
    { key: 'source', label: 'Source', sortable: true, width: '140px' },
    { key: 'timestamp', label: 'Time', sortable: true, type: 'date', width: '160px' },
  ];

  alertsData: Record<string, unknown>[] = [];
  totalAlerts = 0;
  currentPage = 1;
  pageSize = 10;
  currentSort: SortState = { column: 'timestamp', direction: 'desc' };
  tableLoading = false;

  //filter controls

  searchControls = new FormControl('');
  severityControls = new FormControl('all');
  statusControls = new FormControl('all');

  private pageSubject = new BehaviorSubject<number>(1);
  private sortSubject = new BehaviorSubject<SortState>({ column: 'timestamp', direction: 'desc' });

  error$;

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {
    this.error$ = this.dashboardService.error$;
  }

  ngOnInit(): void {
    this.loadKpiData();
    this.loadChart();
    this.setupAlertStream();
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
        // console.log('KPI data updated in component:', this.kpiData);
      });
  }

  private loadChart(): void {
    this.dashboardService
      .getTimeSeriesData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((points) => {
        // console.log(points, 'points');
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
        // console.log(this.lineChartConfig, 'lineconfig');
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
        // console.log(dist, 'dist');
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

  private setupAlertStream(): void {
    const search$ = this.searchControls.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith('')
    );

    const severity$ = this.severityControls.valueChanges.pipe(startWith('all'));
    const status$ = this.statusControls.valueChanges.pipe(startWith('all'));

    

    // Main data fetching stream
    combineLatest([search$, severity$, status$, this.pageSubject, this.sortSubject])
      .pipe(
        switchMap(([search, severity, status, page, sort]) => {
          this.tableLoading = true;
          const filters: DashboardFilters = {
            search: search || '',
            severity: (severity || 'all') as AlertSeverity | 'all',
            status: (status || 'all') as AlertStatus | 'all',
            dateRange: { start: null, end: null },
          };
          return this.dashboardService.getAlerts(page, this.pageSize, sort, filters);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response: PaginatedResponse<Alert>) => {
        if (response.data) {
          console.log(response, 'Alerts Response');
          this.alertsData = response.data as unknown as Record<string, unknown>[];
          this.totalAlerts = response.total;
          this.currentPage = response.page;
          this.tableLoading = false;

          this.cdr.markForCheck();
        }
      });
  }

  onSortChange(sort: SortState): void {
    this.currentSort = sort;
    this.sortSubject.next(sort);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.pageSubject.next(page);
  }

  resetFilters(): void {
    this.searchControls.setValue('');
    this.severityControls.setValue('');
    this.statusControls.setValue('');
    this.pageSubject.next(1);
    this.currentPage = 1;
  }

  dismissError(): void {
    this.dashboardService['errorSubject'].next(null);
  }
}
