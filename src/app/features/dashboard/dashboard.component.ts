import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { KpiData } from '@core/models/dashboard.model';
import { DashboardService } from '@core/services/dashboard.service';
import { KpiCardComponent } from '@shared/components/kpi-card/kpi-card.component';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,KpiCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy  {
  private destroy$ = new Subject<void>();
  //kpi data
  kpiData: KpiData = {
    totalAlerts: 0,
    activeUsers: 0,
    systemHealth: 0,
    responseTime: 0,
  };

  constructor(private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadKpiData();
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
}
