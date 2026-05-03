import { Component, OnInit, inject } from '@angular/core';
import { AllocationStore } from '../../core/services/allocation-store';
import { HistoryService } from '../../core/services/history.service';
import { ExcelService } from '../../core/services/excel.service';
import { SAMPLE_PRODUCTS } from '../../core/services/sample-data';
import { AllocationSession } from '../../core/models/session.model';

import { InventoryToolbarComponent } from '../inventory/toolbar/inventory-toolbar.component';
import { InventoryTableComponent } from '../inventory/table/inventory-table.component';
import { SmartAlertComponent } from '../allocation/smart-alert/smart-alert.component';
import { AllocationLogComponent } from '../allocation/log/allocation-log.component';
import { InvoiceListComponent } from '../invoices/invoice-list/invoice-list.component';
import { HistoryListComponent } from '../history/history-list.component';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    InventoryToolbarComponent,
    InventoryTableComponent,
    SmartAlertComponent,
    AllocationLogComponent,
    InvoiceListComponent,
    HistoryListComponent,
    SectionTitleComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  readonly store   = inject(AllocationStore);
  private history  = inject(HistoryService);
  private excel    = inject(ExcelService);

  ngOnInit(): void {
    this.loadSampleData();
  }

  loadSampleData(): void {
    this.store.loadProducts(SAMPLE_PRODUCTS);
  }

  runAllocation(): void {
    this.store.runAllocation();
    this.history.save({
      date:         this.store.date(),
      coordinator:  this.store.coordinator(),
      minStock:     this.store.minStock(),
      transactions: this.store.transactions(),
      beforeState:  this.store.beforeSnapshot(),
      afterState:   this.store.products(),
    });
  }

  exportExcel(): void {
    this.excel.exportComparison(
      this.store.beforeSnapshot(),
      this.store.products(),
      this.store.transactions()
    );
  }

  restoreSession(session: AllocationSession): void {
    this.store.coordinator.set(session.coordinator);
    this.store.date.set(session.date);
    this.store.minStock.set(session.minStock);
    this.store.restoreSession(session.beforeState, session.afterState, session.transactions);
  }
}
