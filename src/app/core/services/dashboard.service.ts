import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environments';
import { BehaviorSubject, catchError, interval, map, Observable, of, shareReplay, startWith, switchMap } from 'rxjs';
import { KpiData } from '@core/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = environment.apiUrl;
  


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
      }     
     ),
     map((data) => {   

        console.log('Fetched KPI data:', data);
        this.loadingSubject.next(false);
        this.errorSubject.next(null);
        return data;
      }),
      shareReplay(1)
     ); 
  }


}
