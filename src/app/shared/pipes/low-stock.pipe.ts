import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'lowStock', standalone: true, pure: true })
export class LowStockPipe implements PipeTransform {
  transform(value: number, minStock: number): boolean {
    return value < minStock;
  }
}
