import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { Transaction, InvoiceGroup } from '../models/transaction.model';
import { AllocationService } from './allocation.service';

@Injectable({ providedIn: 'root' })
export class AllocationStore {

  // --- Primary state signals ---
  readonly products       = signal<Product[]>([]);
  readonly beforeSnapshot = signal<Product[]>([]);
  readonly transactions   = signal<Transaction[]>([]);
  readonly minStock       = signal<number>(10);
  readonly coordinator    = signal<string>('Nguyễn Thị Hậu Cần');
  readonly date           = signal<string>(todayIso());
  readonly productFilter  = signal<string>('');
  readonly isAllocated    = signal<boolean>(false);

  // --- Derived (computed) ---
  readonly filteredProducts = computed(() => {
    const f = this.productFilter().trim();
    if (!f) return this.products();
    return this.products().filter(p => p.code.includes(f) || p.name.includes(f));
  });

  readonly smartWarnings = computed(() =>
    this.allocationService.buildWarnings(this.products(), this.minStock())
  );

  readonly invoiceGroups = computed<InvoiceGroup[]>(() => {
    const txns = this.transactions();
    const outMap = new Map<string, InvoiceGroup>();
    const inMap  = new Map<string, InvoiceGroup>();

    for (const t of txns) {
      if (!outMap.has(t.from)) {
        outMap.set(t.from, { store: t.from, type: 'export', items: [], totalQty: 0 });
      }
      if (!inMap.has(t.to)) {
        inMap.set(t.to, { store: t.to, type: 'import', items: [], totalQty: 0 });
      }
      const out = outMap.get(t.from)!;
      out.items.push({ code: t.code, quantity: t.quantity, counterpart: t.to });
      out.totalQty += t.quantity;

      const inp = inMap.get(t.to)!;
      inp.items.push({ code: t.code, quantity: t.quantity, counterpart: t.from });
      inp.totalQty += t.quantity;
    }

    return [...outMap.values(), ...inMap.values()];
  });

  readonly productCodes = computed(() =>
    [...new Set(this.products().map(p => p.code))]
  );

  constructor(private allocationService: AllocationService) {}

  loadProducts(products: Product[]): void {
    this.products.set(products.map(p => ({ ...p })));
    this.beforeSnapshot.set(products.map(p => ({ ...p })));
    this.transactions.set([]);
    this.isAllocated.set(false);
  }

  runAllocation(): void {
    const snap = this.products().map(p => ({ ...p }));
    this.beforeSnapshot.set(snap);
    const result = this.allocationService.run(snap, this.minStock());
    this.products.set(result.products);
    this.transactions.set(result.transactions);
    this.isAllocated.set(true);
  }

  restoreSession(before: Product[], after: Product[], txns: Transaction[]): void {
    this.beforeSnapshot.set(before);
    this.products.set(after);
    this.transactions.set(txns);
    this.isAllocated.set(true);
  }
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
