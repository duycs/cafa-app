import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Transaction } from '../models/transaction.model';

export interface AllocationResult {
  products: Product[];
  transactions: Transaction[];
}

export const PRIORITY_ORDER: { key: keyof Omit<Product, 'code' | 'name' | 'hq'>; label: string }[] = [
  { key: 'modA', label: 'Modul A' },
  { key: 'modB', label: 'Modul B' },
  { key: 'modC', label: 'Modul C' },
  { key: 'modD', label: 'Modul D' },
  { key: 'modE', label: 'Modul E' },
  { key: 'shopee', label: 'Shopee' },
];

@Injectable({ providedIn: 'root' })
export class AllocationService {

  run(data: Product[], minStock: number): AllocationResult {
    const products = data.map(p => ({ ...p }));
    const transactions: Transaction[] = [];

    for (const item of products) {
      const needs = this.calculateNeeds(item, minStock);

      // Phase 1: allocate from main warehouse (hq)
      let remainingHq = item.hq;
      for (const p of PRIORITY_ORDER) {
        if (needs[p.key] > 0 && remainingHq > 0) {
          const allocate = Math.min(needs[p.key], remainingHq);
          (item[p.key] as number) += allocate;
          transactions.push({
            from: 'KHO TỔNG (H1G018)',
            to: p.label,
            code: item.code,
            quantity: allocate,
            reason: `Bổ sung theo ngưỡng ${minStock}`,
          });
          remainingHq -= allocate;
          needs[p.key] -= allocate;
        }
      }
      item.hq = remainingHq;

      // Phase 2: cross-transfer when hq is exhausted
      if (item.hq === 0) {
        for (let i = 0; i < PRIORITY_ORDER.length; i++) {
          const target = PRIORITY_ORDER[i];
          if (needs[target.key] === 0) continue;
          for (let j = i + 1; j < PRIORITY_ORDER.length; j++) {
            const source = PRIORITY_ORDER[j];
            const stock = item[source.key] as number;
            const surplus = Math.max(0, stock - minStock);
            if (surplus > 0 && needs[target.key] > 0) {
              const transfer = Math.min(needs[target.key], surplus);
              (item[source.key] as number) -= transfer;
              (item[target.key] as number) += transfer;
              transactions.push({
                from: source.label,
                to: target.label,
                code: item.code,
                quantity: transfer,
                reason: `Điều chuyển từ nơi dư (còn ${stock})`,
              });
              needs[target.key] -= transfer;
              if (needs[target.key] === 0) break;
            }
          }
        }
      }
    }

    return { products, transactions };
  }

  buildWarnings(data: Product[], minStock: number): string[] {
    const warnings: string[] = [];
    const totalHq = data.reduce((s, item) => s + item.hq, 0);
    if (totalHq < 100) {
      warnings.push(`KHO TỔNG chỉ còn ${totalHq} chiếc, đề xuất nhập thêm hàng!`);
    }
    for (const item of data) {
      for (const p of PRIORITY_ORDER) {
        const val = item[p.key] as number;
        const deficit = minStock - val;
        if (val < minStock && deficit > minStock * 0.3) {
          warnings.push(`${p.label} thiếu ${deficit} chiếc (còn ${val}, ngưỡng ${minStock}) - Mã: ${item.code}`);
        }
      }
    }
    return warnings;
  }

  private calculateNeeds(item: Product, minStock: number): Record<string, number> {
    const needs: Record<string, number> = {};
    for (const p of PRIORITY_ORDER) {
      const val = item[p.key] as number;
      needs[p.key] = val < minStock ? minStock - val : 0;
    }
    return needs;
  }
}
