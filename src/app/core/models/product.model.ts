export interface Product {
  code: string;
  name: string;
  hq: number;
  shopee: number;
  modA: number;
  modB: number;
  modC: number;
  modD: number;
  modE: number;
}

export interface ProductComparison {
  before: Product;
  after: Product;
}
