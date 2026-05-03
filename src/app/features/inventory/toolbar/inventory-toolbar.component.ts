import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllocationStore } from '../../../core/services/allocation-store';
import { ExcelService } from '../../../core/services/excel.service';

@Component({
  selector: 'app-inventory-toolbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './inventory-toolbar.component.html',
  styleUrls: ['./inventory-toolbar.component.scss'],
})
export class InventoryToolbarComponent {
  @Output() allocate     = new EventEmitter<void>();
  @Output() resetSample  = new EventEmitter<void>();
  @Output() exportExcel  = new EventEmitter<void>();
  @Output() fileImported = new EventEmitter<void>();

  readonly store = inject(AllocationStore);
  private excel  = inject(ExcelService);

  get minStock()    { return this.store.minStock(); }
  set minStock(v)   { this.store.minStock.set(v); }
  get coordinator() { return this.store.coordinator(); }
  set coordinator(v){ this.store.coordinator.set(v); }
  get date()        { return this.store.date(); }
  set date(v)       { this.store.date.set(v); }
  get filter()      { return this.store.productFilter(); }
  set filter(v)     { this.store.productFilter.set(v); }
  get productCodes(){ return this.store.productCodes(); }

  clearFilter(): void { this.store.productFilter.set(''); }

  async onFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const products = await this.excel.parseFile(file);
      this.store.loadProducts(products);
      this.fileImported.emit();
      (event.target as HTMLInputElement).value = '';
    } catch (err: unknown) {
      alert((err as Error).message ?? 'Import thất bại');
    }
  }
}
