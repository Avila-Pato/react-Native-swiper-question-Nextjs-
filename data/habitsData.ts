export type Habit = {
  id: string;
  title: string;
  duration: string;
  desc: string;
  color: string;
  accent: string;
  image: number;
};

export const HABITS: Habit[] = [
  {
    id: "1",
    title: "Deja el celular al despertar",
    duration: "30 días",
    desc: "Los primeros 30 minutos sin pantalla. Tu mente empieza el día desde la calma, no desde el ruido.",
    color: "#FEF3C7",
    accent: "#D97706",
    image: require("@/assets/pincel/Group-5.svg"),
  },
  {
    id: "2",
    title: "Di lo que sientes, sin rodeos",
    duration: "21 días",
    desc: "Practicar la honestidad emocional fortalece tus vínculos y reduce la ansiedad acumulada.",
    color: "#EDE9FE",
    accent: "#7C3AED",
    image: require("@/assets/pincel/Group.svg"),
  },
  {
    id: "3",
    title: "Mueve tu cuerpo 20 minutos",
    duration: "60 días",
    desc: "Es un gran paso para tu bienestar. Tu cuerpo libera endorfinas y tu mente se despeja con cada sesión.",
    color: "#E8F4EE",
    accent: "#4D8B7A",
    image: require("@/assets/pincel/Group-3.svg"),
  },
  {
    id: "4",
    title: "Duerme 8 horas cada noche",
    duration: "14 días",
    desc: "El sueño repara tu cuerpo y consolida lo que aprendes. Sin él, todo lo demás cuesta el doble.",
    color: "#E0F2FE",
    accent: "#0284C7",
    image: require("@/assets/pincel/Group-4.svg"),
  },
  {
    id: "5",
    title: "Un límite claro al día",
    duration: "21 días",
    desc: "Di no a una cosa que no quieres hacer. Cada límite que pones es un mensaje de respeto hacia ti mismo.",
    color: "#FCE7F3",
    accent: "#9D174D",
    image: require("@/assets/pincel/Group-2.svg"),
  },
];
