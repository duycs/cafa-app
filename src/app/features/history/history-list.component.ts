import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HistoryService } from '../../core/services/history.service';
import { AllocationSession } from '../../core/models/session.model';

@Component({
  selector: 'app-history-list',
  standalone: true,
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent {
  @Output() loadSession = new EventEmitter<AllocationSession>();

  readonly historyService = inject(HistoryService);

  get sessions() { return this.historyService.sessions(); }

  load(session: AllocationSession): void {
    this.loadSession.emit(session);
  }

  remove(id: string, event: Event): void {
    event.stopPropagation();
    this.historyService.remove(id);
  }
}
