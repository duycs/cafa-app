import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Product } from '../../../core/models/product.model';

interface Col { key: keyof Product; label: string }

const STORE_COLS: Col[] = [
  { key: 'hq',     label: 'Kho tổng' },
  { key: 'shopee', label: 'Shopee'   },
  { key: 'modA',   label: 'Modul A'  },
  { key: 'modB',   label: 'Modul B'  },
  { key: 'modC',   label: 'Modul C'  },
  { key: 'modD',   label: 'Modul D'  },
  { key: 'modE',   label: 'Modul E'  },
];

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [NgClass],
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss'],
})
export class InventoryTableComponent {
  @Input({ required: true }) before!: Product[];
  @Input({ required: true }) after!: Product[];
  @Input() minStock = 10;

  readonly storeCols = STORE_COLS;

  isLow(val: number): boolean { return val < this.minStock; }
  isChanged(before: number, after: number): boolean { return before !== after; }
}
