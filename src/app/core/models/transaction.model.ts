export interface Transaction {
  from: string;
  to: string;
  code: string;
  quantity: number;
  reason: string;
}

export interface InvoiceGroup {
  store: string;
  type: 'export' | 'import';
  items: { code: string; quantity: number; counterpart: string }[];
  totalQty: number;
}
