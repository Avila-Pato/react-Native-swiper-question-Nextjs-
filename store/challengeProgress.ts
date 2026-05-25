// Module-level store — persists during the app session
const _progress: Record<string, number> = {};

export function getProgress(id: string): number {
  return _progress[id] ?? 0;
}

export function setProgress(id: string, count: number) {
  _progress[id] = Math.max(_progress[id] ?? 0, count);
}

export function getAllProgress(): Record<string, number> {
  return { ..._progress };
}
