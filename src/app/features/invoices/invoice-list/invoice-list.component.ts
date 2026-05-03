import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { InvoiceGroup } from '../../../core/models/transaction.model';
import { InvoiceCardComponent } from '../invoice-card/invoice-card.component';
import { PdfService } from '../../../core/services/pdf.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [InvoiceCardComponent],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent {
  @Input({ required: true }) groups!: InvoiceGroup[];
  @Input() coordinator = '';
  @Input() date = '';
  @ViewChild('invoiceContainer') containerRef!: ElementRef<HTMLElement>;

  private pdf = inject(PdfService);

  print(): void {
    this.pdf.printElement(this.containerRef.nativeElement);
  }

  async exportPdf(): Promise<void> {
    await this.pdf.exportElement(this.containerRef.nativeElement);
  }
}
