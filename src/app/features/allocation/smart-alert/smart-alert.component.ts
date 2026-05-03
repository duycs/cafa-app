import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-smart-alert',
  standalone: true,
  template: `
    @if (warnings.length) {
      <div class="warning-alert no-print">
        <strong>CẢNH BÁO THÔNG MINH:</strong>
        @for (w of warnings; track w) {
          <div>⚠️ {{ w }}</div>
        }
      </div>
    }
  `,
  styles: [`
    .warning-alert {
      background: #fff3cd;
      border-left: 6px solid #ffc107;
      padding: 12px 16px;
      border-radius: 20px;
      margin-bottom: 20px;
      font-size: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  `],
})
export class SmartAlertComponent {
  @Input({ required: true }) warnings!: string[];
}
