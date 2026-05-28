type Stat = { bestScore: number; timesPlayed: number };

const _progress: Record<string, number> = {};
const _stats: Record<string, Stat> = {};

export function getProgress(id: string): number {
  return _progress[id] ?? 0;
}

export function setProgress(id: string, count: number) {
  _progress[id] = Math.max(_progress[id] ?? 0, count);
}

export function resetProgress(id: string) {
  _progress[id] = 0;
}

export function getAllProgress(): Record<string, number> {
  return { ..._progress };
}

export function getBestScore(id: string): Stat {
  return _stats[id] ?? { bestScore: 0, timesPlayed: 0 };
}

export function recordResult(id: string, correct: number, total: number) {
  const prev = _stats[id] ?? { bestScore: 0, timesPlayed: 0 };
  _stats[id] = {
    bestScore: Math.max(prev.bestScore, correct / total),
    timesPlayed: prev.timesPlayed + 1,
  };
  _progress[id] = total;
}
