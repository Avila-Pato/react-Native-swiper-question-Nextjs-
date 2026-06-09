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

// ── Clasificación por palabras clave ──────────────────────────────────────

export function classifyText(text: string): CategoriaDetectada | null {
  const t = text.toLowerCase();

  // Enojado / Estresado — \b evita coincidencias dentro de otras palabras
  if (/\bansiedad\b|\bansiosa|\bansiosos|\bestres|\bestresad|\bpresionad|\bfurioso|\bfuriosa|\benojad|\benfadad|\brabiosa|\brabioso|\bcolapso|\bdesesperado|\bme ahogo|\bno aguanto|\bno puedo mas\b/.test(t))
    return "ESTRES_ANSIEDAD";

  // Triste
  if (/\btriste|\btristeza|\blloro\b|\bllorando|\bsolo\b|\bsola\b|\bsoledad|\bvac[ií]o|\bvac[ií]a|\bdeprimid|\bnostalgia|\bduelo|\bextra[ñn]o|\bextra[ñn]a|\bme siento mal\b|\bp[eé]simo|\bhorrible|\bme duele|\bme siento perdido/.test(t))
    return "TRISTEZA_MELANCOLIA";

  // Cansado / Sin energía
  if (/\bcansado|\bcansada|\bagotado|\bagotada|\bsin energ|\bdesmotivad|\bno tengo ganas|\bno me dan ganas|\bpereza|\bme da pereza|\bsin fuerzas|\bsin ganas|\bapagado|\bapagada|\bme cuesta|\bmucho sue[ñn]o|\bno me levanto/.test(t))
    return "CANSANCIO_APATIA";

  // Genial / Muy bien — va ANTES que CALMA para capturar "muy bien"
  if (/\bgenial\b|\bfeliz\b|\balegre\b|\balegr[íi]a\b|\bcontento|\bcontenta|\bmotivado|\bmotivada|\bemocionado|\bemocionada|\bexcelente\b|\bmaravilloso|\bmaravillosa|\bfant[aá]stico|\bincre[íi]ble|\bmuy bien\b|\bsuper bien\b|\bde maravilla|\bcon ganas|\banimado|\banimada|\bfelicidad|\bde buen humor/.test(t))
    return "ALEGRIA_MOTIVACION";

  // Bien / Tranquilo (mood 3)
  if (/\bbien\b|\bestoy bien|\bme siento bien|\bnormal\b|\bregular\b|\btranquilo|\btranquila|\bestable\b|\bcalmado|\bcalmada|\bsereno|\bserena|\brelajado|\brelajada|\bm[aá]s o menos|\bequilibrado|\bpaz\b|\btodo bien|\bok\b|\bokay\b|\bnada mal/.test(t))
    return "CALMA_BIENESTAR";

  return null;
}

const TODAS_CATEGORIAS: CategoriaDetectada[] = [
  "ESTRES_ANSIEDAD",
  "CANSANCIO_APATIA",
  "ALEGRIA_MOTIVACION",
  "TRISTEZA_MELANCOLIA",
  "CALMA_BIENESTAR",
];

export function buildResultFromText(transcripcion: string): JournalResult {
  const categoria: CategoriaDetectada =
    classifyText(transcripcion) ??
    TODAS_CATEGORIAS[Math.floor(Math.random() * TODAS_CATEGORIAS.length)];
  return { categoria_detectada: categoria, carta_recompensa: CARTAS[categoria], texto_hablado: transcripcion || undefined };
}

export function buildResultFromCategoria(categoria: CategoriaDetectada, texto?: string): JournalResult {
  return { categoria_detectada: categoria, carta_recompensa: CARTAS[categoria], texto_hablado: texto || undefined };
}
