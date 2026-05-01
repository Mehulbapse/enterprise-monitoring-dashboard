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

export interface AlertDistribution{
  category : string;
  count : number;
  color : string;
}
