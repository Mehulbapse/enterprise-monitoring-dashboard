import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
} from '@angular/core';
import { SortState, TableColumn } from '@core/models/dashboard.model';
import { retryWhen } from 'rxjs';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements AfterViewInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: Record<string, unknown>[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() currentPage = 1;
  @Input() pageSize = 10;

  @Input() currentSort: SortState | null = null;

  @Output() sortChange = new EventEmitter<SortState>();
  @Output() pageChange = new EventEmitter<number>();

  ngAfterViewInit(): void {
    console.log(this.data);
  }

  trackByRow: TrackByFunction<Record<string, unknown>> = (index, item) => {
    return (item['id'] as string) || index;
  };

  trackByColumn: TrackByFunction<TableColumn> = (index, col) => col.key;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  onSort(column: string): void {
    const direction =
      this.currentSort?.column === column && this.currentSort?.direction === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ column, direction });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  getAriaSort(columnKey: string): string | null {
    if (this.currentSort?.column !== columnKey) return null;
    return this.currentSort.direction === 'asc' ? 'ascending' : 'descending';
  }
}
