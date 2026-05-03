import { Injectable, signal } from '@angular/core';
import { AllocationSession } from '../models/session.model';

const STORAGE_KEY = 'cafa_allocation_history';

@Injectable({ providedIn: 'root' })
export class HistoryService {

  readonly sessions = signal<AllocationSession[]>([]);

  constructor() {
    this.load();
  }

  save(session: Omit<AllocationSession, 'id'>): void {
    const entry: AllocationSession = {
      ...session,
      id: crypto.randomUUID(),
    };
    this.sessions.update(s => [...s, entry]);
    this.persist();
  }

  remove(id: string): void {
    this.sessions.update(s => s.filter(x => x.id !== id));
    this.persist();
  }

  clear(): void {
    this.sessions.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.sessions.set(JSON.parse(raw));
    } catch {
      this.sessions.set([]);
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sessions()));
  }
}
