// @/store/useUserStore.ts
import { ARCHETYPE, ArchetypeEntry } from "@/constants/diagnosticData";
import { RoleScores } from "@/types/roleTest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type { RoleScores };

// ... Tus interfaces se mantienen idénticas ...
export interface GoogleUser { id: string; name: string; email: string; picture?: string; }
export interface OnboardingData { goals: string[]; areas: string[]; nombre: string; }
export interface AssessmentData { completed: boolean; scores: RoleScores; completedAt: string; }
export interface DiagnosticResult {
  completed: boolean;
  completedAt: string;
  scores: Record<string, number>;
  strengths: string[];
  challenges: string[];
}

interface UserState {
  user: GoogleUser | null;
  onboarding: OnboardingData | null;
  assessment: AssessmentData | null;
  diagnostic: DiagnosticResult | null;

  setUser: (user: GoogleUser | null) => void;
  saveOnboarding: (data: OnboardingData) => void;
  saveAssessment: (scores: RoleScores) => void;
  resetAssessment: () => void;
  saveDiagnostic: (result: Omit<DiagnosticResult, "completed" | "completedAt">) => void;
  clearAll: () => void;

  // ── NUEVOS SELECTORES COMPUTADOS ──
  getSortedAreas: () => [string, number][];
  getArchetype: () => ArchetypeEntry;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      onboarding: null,
      assessment: null,
      diagnostic: null,

      setUser: (user) => set({ user }),
      saveOnboarding: (data) => set({ onboarding: data }),
      saveAssessment: (scores) => set({
        assessment: { completed: true, scores, completedAt: new Date().toISOString() }
      }),
      resetAssessment: () => set({ assessment: null }),
      saveDiagnostic: (result) => set({
        diagnostic: { ...result, completed: true, completedAt: new Date().toISOString() }
      }),
      clearAll: () => set({ user: null, onboarding: null, assessment: null, diagnostic: null }),

      // Devuelve las áreas con puntaje > 0 ordenadas de mayor a menor
      getSortedAreas: () => {
        const scores = get().diagnostic?.scores ?? {};
        return Object.entries(scores)
          .filter(([, v]) => v > 0)
          .sort(([, a], [, b]) => b - a);
      },

      // Devuelve directamente el arquetipo correspondiente al área con mayor puntaje
      getArchetype: () => {
        const sorted = get().getSortedAreas();
        const topArea = sorted[0]?.[0] ?? "emociones";
        return ARCHETYPE[topArea] ?? ARCHETYPE.emociones;
      }
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);