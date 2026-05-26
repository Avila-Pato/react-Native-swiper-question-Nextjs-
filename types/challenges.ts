import { ImageSourcePropType } from "react-native";

export type ChallengeType =
  | "adivina_lenguaje"
  | "encuentra_bug"
  | "verdad_mito"
  | "completa_codigo";

export type Difficulty = "Fácil" | "Medio" | "Difícil";

export type ChallengeQuestion = {
  id: string;
  statement: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: Difficulty;
};

export type Challenge = {
  id: ChallengeType;
  title: string;
  emoji: ImageSourcePropType;
  color: string;
  difficulty: Difficulty;
  questions: ChallengeQuestion[];
};
