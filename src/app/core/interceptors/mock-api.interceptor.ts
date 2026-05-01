import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { LoginResponse } from '@core/models/auth.model';
import {
  AlertDistribution,
  KpiData,
  SystemMetric,
  TimeSeriesPoint,
} from '@core/models/dashboard.model';
import { Observable, of, delay, pipe } from 'rxjs';

export const mockApiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const url = req.url;
  const method = req.method;
  if (url.endsWith('/auth/login') && method === 'POST') {
    return handleLogin(req);
  }

  if (url.includes('/dashboard/kpi')) {
    return handleKpiData();
  }

  if (url.includes('/dashboard/timeseries')) return handleTimeSeries();
  if (url.includes('/dashboard/metrics')) return handleMetrics();
  if (url.includes('/dashboard/distribution')) return handleDistribution();

  return next(req);
};

function handleLogin(req: HttpRequest<unknown>): Observable<HttpResponse<LoginResponse>> {
  const body = req.body as { username: string; password: string };

  if (body?.username && body?.password) {
    const response: LoginResponse = {
      token: 'mock-jwt-token' + Math.random().toString(36).substring(2),
      user: {
        id: 1,
        username: body.username,
        displayName: body.username.charAt(0).toUpperCase() + body.username.slice(1),
        role: 'admin',
      },
      expiresIn: 3600,
    };
    return of(new HttpResponse({ status: 200, body: response })).pipe(delay(500));
  }

  return of(new HttpResponse({ status: 401, body: null as unknown as LoginResponse })).pipe(
    delay(500)
  );
}

function handleKpiData(): Observable<HttpResponse<KpiData>> {
  const kpi: KpiData = {
    totalAlerts: randomInt(120, 200),
    activeUsers: randomInt(800, 15000),
    systemHealth: randomInt(85, 99),
    responseTime: randomInt(45, 150),
  };
  return of(new HttpResponse({ status: 200, body: kpi })).pipe(delay(200));
}

function handleTimeSeries(): Observable<HttpResponse<TimeSeriesPoint[]>> {
  const now = new Date();
  const points: TimeSeriesPoint[] = [];
  for (let i = 19; i >= 0; i--) {
    points.push({
      timestamp: new Date(now.getTime() - i * 5000),
      value: randomInt(20, 95),
      label: formatTime(new Date(now.getTime() - i * 5000)),
    });
  }
  return of(new HttpResponse({ status: 200, body: points })).pipe(delay(200));
}

function handleMetrics(): Observable<HttpResponse<SystemMetric[]>> {
  const metrics: SystemMetric[] = [
    {
      name: 'Web Server',
      cpu: randomInt(30, 80),
      memory: randomInt(40, 75),
      disk: randomInt(20, 60),
      network: randomInt(10, 50),
    },
    {
      name: 'Database',
      cpu: randomInt(30, 60),
      memory: randomInt(50, 85),
      disk: randomInt(30, 70),
      network: randomInt(15, 45),
    },
    {
      name: 'Cache',
      cpu: randomInt(40, 60),
      memory: randomInt(60, 95),
      disk: randomInt(10, 30),
      network: randomInt(20, 60),
    },
    {
      name: 'API Gateway',
      cpu: randomInt(25, 65),
      memory: randomInt(20, 45),
      disk: randomInt(15, 40),
      network: randomInt(30, 70),
    },
    {
      name: 'Worker',
      cpu: randomInt(20, 95),
      memory: randomInt(50, 65),
      disk: randomInt(25, 55),
      network: randomInt(5, 30),
    },
  ];
  return of(new HttpResponse({ status: 200, body: metrics })).pipe(delay(250));
}

function handleDistribution(): Observable<HttpResponse<AlertDistribution[]>> {
  const distribution: AlertDistribution[] = [
    {
      category: 'Network',
      count: randomInt(15, 40),
      color: '#FF6384',
    },
    {
      category: 'Security',
      count: randomInt(10, 30),
      color: '#36A2EB',
    },
    {
      category: 'Performance',
      count: randomInt(20, 50),
      color: '#FFCE56',
    },
    {
      category: 'Hardware',
      count: randomInt(5, 20),
      color: '#4BC0C0',
    },
    {
      category: 'Software',
      count: randomInt(8, 25),
      color: '#9966FF',
    },
  ];
  return of(new HttpResponse({ status: 200, body: distribution })).pipe(delay(250));
}

function randomInt(arg0: number, arg1: number) {
  return Math.floor(Math.random() * (arg1 - arg0 + 1)) + arg0;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
