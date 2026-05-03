import { Component, Input } from '@angular/core';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-allocation-log',
  standalone: true,
  templateUrl: './allocation-log.component.html',
  styles: [`
    .log-area {
      background: #fef4e8;
      border-radius: 20px;
      padding: 14px 20px;
      margin: 4px 0;
      font-family: monospace;
      font-size: 0.8rem;
      border-left: 6px solid #f59e0b;
      max-height: 250px;
      overflow-y: auto;
    }
    .log-empty { color: #888; }
  `],
})
export class AllocationLogComponent {
  @Input({ required: true }) transactions!: Transaction[];
  @Input() coordinator = '';
  @Input() date = '';
}
