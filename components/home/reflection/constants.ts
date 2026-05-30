import { Dimensions } from "react-native";

export const { width: W, height: H } = Dimensions.get("window");

export const REFLECTIONS = [
  "Hoy me permito sentir sin juzgar lo que siento.",
  "Cada respiración me acerca más a mí mismo.",
  "Lo que vivo hoy tiene valor, aunque no lo entienda aún.",
  "Soy suficiente como soy en este momento.",
  "El silencio también es una forma de escucharse.",
  "Hoy elijo pausar, respirar y volver a mí.",
  "Mis emociones son mensajes, no mi identidad.",
];

export const GRADIENT_COLORS = ["#F4EBE0", "#FDF5EE", "#EDE8F5", "#F7EFF5"] as const;

export const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 47 + 23) % (W - 10),
  size: (i % 4) + 2.5,
  duration: 9000 + ((i * 800) % 6000),
  delay: (i * 600) % 5000,
}));
