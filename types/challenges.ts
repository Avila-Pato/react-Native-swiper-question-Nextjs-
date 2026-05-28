import { ImageSourcePropType } from "react-native";

export type ChallengeType =
  | "adivina_concepto"
  | "identifica_patron"
  | "verdad_mito"
  | "completa_reflexion";

export type ChallengeQuestion = {
  id: string;
  statement: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Challenge = {
  id: ChallengeType;
  title: string;
  emoji: ImageSourcePropType;
  color: string;
  questions: ChallengeQuestion[];
  borderColor: string;
};
