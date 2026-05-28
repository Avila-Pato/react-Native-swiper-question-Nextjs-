export type RoleKey = "limites" | "autoconocimiento" | "vinculos" | "felicidad" | "proposito";

export type QuestionOption = {
  text: string;
  role: RoleKey;
};

export type RoleQuestion = {
  id: number;
  text: string;
  type?: "likert" | "choice";
  role?: RoleKey;
  options?: QuestionOption[];
};

export type RoleInfo = {
  key: RoleKey;
  label: string;
  emoji: string;
  color: string;
  description: string;
  stack: string;
};

export type RoleScores = Record<RoleKey, number>;
