import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PdfService {

  async exportElement(element: HTMLElement, filename?: string): Promise<void> {
    // Dynamically import to keep initial bundle lean
    const html2pdf = (await import('html2pdf.js')).default;
    const name = filename ?? `Phieu_dieu_phoi_${new Date().toISOString().slice(0, 19)}.pdf`;
    await html2pdf()
      .set({
        margin: 0.5,
        filename: name,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save();
  }

  printElement(element: HTMLElement, title = 'Phiếu điều phối hàng hóa'): void {
    const win = window.open('', '_blank')!;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');
    win.document.write(`
      <html><head><title>${title}</title>${styles}
      <style>body{padding:20px;} .no-print{display:none!important;}</style>
      </head><body><h2>${title}</h2>${element.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  }
}
