import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environments';
import {
  BehaviorSubject,
  catchError,
  filter,
  interval,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import {
  Alert,
  AlertDistribution,
  DashboardFilters,
  KpiData,
  PaginatedResponse,
  SystemMetric,
  TimeSeriesPoint,
} from '@core/models/dashboard.model';
import { SortState } from '@core/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = environment.apiUrl;

  private filtersSubject = new BehaviorSubject<DashboardFilters>({
    search: '',
    severity: 'all',
    status: 'all',
    dateRange: { start: null, end: null },
  });

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getKpiData(): Observable<KpiData> {
    return interval(environment.refreshInterval).pipe(
      startWith(0),
      switchMap(() => {
        this.loadingSubject.next(true);
        return this.http.get<KpiData>(`${this.apiUrl}/dashboard/kpi`).pipe(
          catchError((error) => {
            this.errorSubject.next('Failed to load KPI data');
            console.error('Error fetching KPI data:', error);
            return of({
              totalAlerts: 0,
              activeUsers: 0,
              systemHealth: 0,
              responseTime: 0,
            } as KpiData);
          })
        );
      }),
      map((data) => {
        // console.log('Fetched KPI data:', data);
        this.loadingSubject.next(false);
        this.errorSubject.next(null);
        return data;
      }),
      shareReplay(1)
    );
  }

  getTimeSeriesData(): Observable<TimeSeriesPoint[]> {
    return interval(environment.refreshInterval).pipe(
      startWith(0),
      switchMap(() =>
        this.http
          .get<TimeSeriesPoint[]>(`${this.apiUrl}/dashboard/timeseries`)
          .pipe(catchError(() => of([] as TimeSeriesPoint[])))
      ),
      shareReplay(1)
    );
  }

  getSystemMetrics(): Observable<SystemMetric[]> {
    return this.http.get<SystemMetric[]>(`${this.apiUrl}/dashboard/metrics`).pipe(
      catchError((error) => {
        this.errorSubject.next('Failed to load system metrics');
        console.error('Metrics fetch Error', error);
        return of([] as SystemMetric[]);
      })
    );
  }

  getAlertDistribution(): Observable<AlertDistribution[]> {
    return this.http.get<AlertDistribution[]>(`${this.apiUrl}/dashboard/distribution`).pipe(
      catchError((error) => {
        this.errorSubject.next('Failed to load alert metrics');
        console.error('Alert fetch Error', error);
        return of([] as AlertDistribution[]);
      })
    );
  }

  getAlerts(
    page: number,
    pageSize: number,
    sort?: SortState,
    filters?: DashboardFilters
  ): Observable<PaginatedResponse<Alert>> {
    let params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());

    if (sort) {
      params = params.set('sortBy', sort.column).set('sortDir', sort.direction);
    }

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.severity !== 'all') params = params.set('severity', filters.severity);
      if (filters.status !== 'all') params = params.set('status', filters.status);
    }

    this.loadingSubject.next(true);

    return this.http
      .get<PaginatedResponse<Alert>>(`${this.apiUrl}/dashboard/alerts`, { params })
      .pipe(
        map((response) => {
          console.log(response, 'Search');
          this.loadingSubject.next(false);
          return response;
        }),
        catchError((error) => {
          this.loadingSubject.next(false);
          this.errorSubject.next('Failed to load');
          console.error('Alerts', error);
          return of({ data: [], total: 0, page: 1, pageSize: 10 } as PaginatedResponse<Alert>);
        })
      );
  }

  updateFilters(filters: Partial<DashboardFilters>): void {
    // This method can be used to update filters if needed
    const currentFilters = this.filtersSubject.getValue();
    this.filtersSubject.next({ ...currentFilters, ...filters });
  }

  resetFilters(): void {
    this.filtersSubject.next({
      search: '',
      severity: 'all',
      status: 'all',
      dateRange: { start: null, end: null },
    });
  }
}
