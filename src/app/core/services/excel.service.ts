import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Product } from '../models/product.model';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class ExcelService {

  parseFile(file: File): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target!.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: 'array' });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: 0 });
          resolve(this.parseRows(rows));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  exportComparison(before: Product[], after: Product[], transactions: Transaction[]): void {
    const ws1Data = [
      ['Mã hàng', 'Tên hàng', 'Kho tổng(Trước)', 'Kho tổng(Sau)', 'Shopee(Trước)', 'Shopee(Sau)',
       'Modul A(Trước)', 'Modul A(Sau)', 'Modul B(Trước)', 'Modul B(Sau)',
       'Modul C(Trước)', 'Modul C(Sau)', 'Modul D(Trước)', 'Modul D(Sau)',
       'Modul E(Trước)', 'Modul E(Sau)'],
      ...before.map((b, i) => {
        const a = after[i];
        return [b.code, b.name, b.hq, a.hq, b.shopee, a.shopee,
                b.modA, a.modA, b.modB, a.modB, b.modC, a.modC,
                b.modD, a.modD, b.modE, a.modE];
      }),
    ];

    const ws2Data = [
      ['STT', 'Mã hàng', 'Từ', 'Đến', 'Số lượng', 'Lý do'],
      ...transactions.map((t, i) => [i + 1, t.code, t.from, t.to, t.quantity, t.reason]),
    ];

    const summaryMap = new Map<string, { export: number; import: number }>();
    for (const t of transactions) {
      if (!summaryMap.has(t.from)) summaryMap.set(t.from, { export: 0, import: 0 });
      if (!summaryMap.has(t.to))   summaryMap.set(t.to,   { export: 0, import: 0 });
      summaryMap.get(t.from)!.export += t.quantity;
      summaryMap.get(t.to)!.import   += t.quantity;
    }
    const ws3Data = [
      ['Cửa hàng', 'Tổng xuất', 'Tổng nhập'],
      ...[...summaryMap.entries()].map(([store, v]) => [store, v.export, v.import]),
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ws1Data), 'Truoc_Sau');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ws2Data), 'Nhat_ky_dieu_phoi');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ws3Data), 'Tong_hop_nhap_xuat');
    XLSX.writeFile(wb, `Dieu_phoi_${new Date().toISOString().slice(0, 19)}.xlsx`);
  }

  private parseRows(rows: unknown[][]): Product[] {
    if (!rows || rows.length < 2) throw new Error('File không có dữ liệu');

    const headers = rows[0] as string[];
    const idx = { code: -1, name: -1, hq: -1, shopee: -1, modA: -1, modB: -1, modC: -1, modD: -1, modE: -1 };

    headers.forEach((h, i) => {
      const s = String(h).toLowerCase().trim();
      if (s.includes('mã') || s.includes('code'))              idx.code   = i;
      else if (s.includes('tên') || s.includes('name'))        idx.name   = i;
      else if (s.includes('kho tổng') || s.includes('hq'))     idx.hq     = i;
      else if (s.includes('shopee'))                           idx.shopee = i;
      else if (s.includes('modul a') || s.includes('module a')) idx.modA  = i;
      else if (s.includes('modul b') || s.includes('module b')) idx.modB  = i;
      else if (s.includes('modul c') || s.includes('module c')) idx.modC  = i;
      else if (s.includes('modul d') || s.includes('module d')) idx.modD  = i;
      else if (s.includes('modul e') || s.includes('module e')) idx.modE  = i;
    });

    const required: (keyof typeof idx)[] = ['code', 'hq', 'shopee', 'modA', 'modB', 'modC', 'modD', 'modE'];
    const missing = required.filter(k => idx[k] === -1);
    if (missing.length) throw new Error(`File thiếu cột: ${missing.join(', ')}`);

    return rows.slice(1)
      .filter(row => row[idx.code])
      .map(row => ({
        code:   String(row[idx.code]).trim(),
        name:   idx.name !== -1 ? String(row[idx.name] ?? '').trim() : '',
        hq:     Number(row[idx.hq])     || 0,
        shopee: Number(row[idx.shopee]) || 0,
        modA:   Number(row[idx.modA])   || 0,
        modB:   Number(row[idx.modB])   || 0,
        modC:   Number(row[idx.modC])   || 0,
        modD:   Number(row[idx.modD])   || 0,
        modE:   Number(row[idx.modE])   || 0,
      }));
  }
}
