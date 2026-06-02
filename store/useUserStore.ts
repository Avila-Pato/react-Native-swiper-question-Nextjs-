import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { RoleScores } from "@/types/roleTest";
export type { RoleScores };

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface OnboardingData {
  goals: string[];
  areas: string[];
  nombre: string;
}

export interface AssessmentData {
  completed: boolean;
  scores: RoleScores;
  completedAt: string;
}

export interface DiagnosticResult {
  completed: boolean;
  completedAt: string;
  scores: Record<string, number>; // area → avg score 1-5
  strengths: string[];            // areas con score >= 3.5
  challenges: string[];           // areas con score <= 2.5
}

interface UserState {
  user: GoogleUser | null;
  onboarding: OnboardingData | null;
  assessment: AssessmentData | null;
  diagnostic: DiagnosticResult | null;

  setUser: (user: GoogleUser | null) => void;
  saveOnboarding: (data: OnboardingData) => void;
  saveAssessment: (scores: RoleScores) => void;
  saveDiagnostic: (result: Omit<DiagnosticResult, "completed" | "completedAt">) => void;
  clearAll: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      onboarding: null,
      assessment: null,
      diagnostic: null,

      setUser: (user) => set({ user }),

      saveOnboarding: (data) => set({ onboarding: data }),

      saveAssessment: (scores) =>
        set({
          assessment: {
            completed: true,
            scores,
            completedAt: new Date().toISOString(),
          },
        }),

      saveDiagnostic: (result) =>
        set({
          diagnostic: {
            ...result,
            completed: true,
            completedAt: new Date().toISOString(),
          },
        }),

      clearAll: () =>
        set({ user: null, onboarding: null, assessment: null, diagnostic: null }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
