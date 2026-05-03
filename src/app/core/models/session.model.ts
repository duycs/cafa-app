import { Product } from './product.model';
import { Transaction } from './transaction.model';

export interface AllocationSession {
  id: string;
  date: string;
  coordinator: string;
  minStock: number;
  transactions: Transaction[];
  beforeState: Product[];
  afterState: Product[];
}
