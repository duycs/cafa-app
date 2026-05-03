import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  standalone: true,
  template: `<div class="section-title">{{ label }}</div>`,
  styles: [`
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 28px 0 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid var(--color-primary);
      display: inline-block;
    }
  `],
})
export class SectionTitleComponent {
  @Input({ required: true }) label!: string;
}
