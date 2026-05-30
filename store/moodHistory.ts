import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "mood_history";

export type MoodHistory = Record<string, number>; // "2026-05-29" → mood index 0-4

export function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function saveMood(dateStr: string, moodIndex: number): Promise<void> {
  const raw = await AsyncStorage.getItem(KEY);
  const history: MoodHistory = raw ? JSON.parse(raw) : {};
  history[dateStr] = moodIndex;
  await AsyncStorage.setItem(KEY, JSON.stringify(history));
}

export async function getMoodHistory(): Promise<MoodHistory> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as MoodHistory) : {};
}
