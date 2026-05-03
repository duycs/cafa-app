import { Component, Input, computed, signal } from '@angular/core';
import { InvoiceGroup } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-invoice-card',
  standalone: true,
  templateUrl: './invoice-card.component.html',
  styleUrls: ['./invoice-card.component.scss'],
})
export class InvoiceCardComponent {
  @Input({ required: true }) group!: InvoiceGroup;
  @Input() coordinator = '';
  @Input() date = '';

  get counterparts(): string {
    return [...new Set(this.group.items.map(i => i.counterpart))].join(', ');
  }
}
