export interface KpiData {
  totalAlerts: number;
  activeUsers: number;
  systemHealth: number;
  responseTime: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface ChartConfig {
  labels: string[];
  datasets: ChartDataset[];
}

export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface SystemMetric {
  name: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export interface AlertDistribution {
  category: string;
  count: number;
  color: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'badge' | 'number';
  width?: string;
}

export interface SortState {
  column: string;
  direction: 'asc' | 'desc';
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  source: string;
  timestamp: Date;
  assignee?: string;
}

export interface DashboardFilters {
  search: string;
  severity: AlertSeverity | 'all';
  status: AlertStatus | 'all';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
