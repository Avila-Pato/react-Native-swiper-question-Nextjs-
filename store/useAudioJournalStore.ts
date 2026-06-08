import { CARTAS, CategoriaDetectada, JournalResult } from "@/data/journalData";
import { create } from "zustand";

export type { CartaRecompensa, CategoriaDetectada, JournalResult, TagBienestar, TipoContenido } from "@/data/journalData";

export type JournalStep = "idle" | "recording" | "analyzing" | "reward";

export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

interface AudioJournalState {
  currentStep: JournalStep;
  result: JournalResult | null;
  error: string | null;

  setRecording: () => void;
  setAnalyzing: () => void;
  setResult: (result: JournalResult) => void;
  setError: (msg: string) => void;
  reset: () => void;
}

export const useAudioJournalStore = create<AudioJournalState>()((set) => ({
  currentStep: "idle",
  result: null,
  error: null,

  setRecording: () => set({ currentStep: "recording", error: null }),
  setAnalyzing: () => set({ currentStep: "analyzing" }),
  setResult: (result) => set({ currentStep: "reward", result }),
  setError: (error) => set({ currentStep: "idle", error }),
  reset: () => set({ currentStep: "idle", result: null, error: null }),
}));

// ── Clasificación por palabras clave (fallback si no hay backend) ──────────

export function classifyText(text: string): CategoriaDetectada {
  const t = text.toLowerCase();
  if (/cansad|agotad|sin energ|desmotiv|floj|no tengo ganas|sueño|dormir/.test(t))
    return "CANSANCIO_APATIA";
  if (/ansiedad|estr[eé]s|presi[oó]n|agobiad|nervios|agitad|abrumad|mil cosas|no alcanzo/.test(t))
    return "ESTRES_ANSIEDAD";
  if (/triste|tristeza|llor|sol[oa]|perdid|nostalgia|extra[ñn]|duelo|vac[ií]o/.test(t))
    return "TRISTEZA_MELANCOLIA";
  if (/confundid|no s[eé]|dud|incertidumbre|qu[eé] hago|indecis|no entiendo/.test(t))
    return "CONFUSION_INCERTIDUMBRE";
  return "ALEGRIA_MOTIVACION";
}

const TODAS_CATEGORIAS: CategoriaDetectada[] = [
  "ESTRES_ANSIEDAD",
  "CANSANCIO_APATIA",
  "ALEGRIA_MOTIVACION",
  "TRISTEZA_MELANCOLIA",
  "CONFUSION_INCERTIDUMBRE",
];

export function buildResultFromText(transcripcion: string): JournalResult {
  if (transcripcion.trim().length > 0) {
    const categoria = classifyText(transcripcion);
    return { categoria_detectada: categoria, carta_recompensa: CARTAS[categoria] };
  }
  const categoria = TODAS_CATEGORIAS[Math.floor(Math.random() * TODAS_CATEGORIAS.length)];
  return { categoria_detectada: categoria, carta_recompensa: CARTAS[categoria] };
}

export function buildResultFromCategoria(categoria: CategoriaDetectada): JournalResult {
  return { categoria_detectada: categoria, carta_recompensa: CARTAS[categoria] };
}
