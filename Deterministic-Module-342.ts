// DEM-342 — Deterministic Event Machine
// Beast System 3.0 — Sovereign Autonomous Governance Engine

export class DeterministicModule342 {
  private listeners: Record<string, Array<(payload: any) => void>> = {};

  // Register deterministic listener
  on(event: string, fn: (payload: any) => void): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
    this.sortListeners(event);
  }

  // Deterministic emit
  emit(event: string, payload: any): void {
    const normalized = this.normalize(payload);
    const fns = this.listeners[event] || [];
    for (const fn of fns) fn(normalized);
  }

  // Stable ordering of listeners by function name
  private sortListeners(event: string): void {
    this.listeners[event].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Deterministic normalization
  private normalize(obj: any): any {
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.slice().sort().map(v => this.normalize(v));

    const keys = Object.keys(obj).sort();
    const out: Record<string, any> = {};
    for (const k of keys) out[k] = this.normalize(obj[k]);
    return out;
  }

  // Deterministic snapshot
  snapshot(): Record<string, string[]> {
    const out: Record<string, string[]> = {};
    for (const event of Object.keys(this.listeners)) {
      out[event] = this.listeners[event].map(fn => fn.name);
    }
    return out;
  }
}
