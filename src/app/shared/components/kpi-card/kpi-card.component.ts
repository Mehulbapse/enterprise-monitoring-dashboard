import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
})
export class KpiCardComponent {
  @Input() title = '';
  @Input() value: number = 0;
  @Input() icon = 'info';
  @Input() colorClass: string = 'color-blue';
  @Input() suffix?: string;

  @Input() trend?: number;
  @Input() format: 'number' | 'percentage' | 'ms' = 'number';


  constructor() {

    console.log('KPI Card initialized with value:', this.value);
  }
  get formattedValue(): string {
    switch (this.format) {
      case 'percentage':
        return `${this.value}%`;
      case 'ms':
        return `${this.value} ms`;
      default:
        return this.value >= 1000 ? `${(this.value / 1000).toFixed(1)}k` : this.value.toString();
    }
  }
}
