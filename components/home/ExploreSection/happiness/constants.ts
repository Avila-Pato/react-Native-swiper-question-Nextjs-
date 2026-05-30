import { Dimensions } from "react-native";

export const { width: W, height: H } = Dimensions.get("window");

export const GRADIENT_COLORS = ["#FDF0E8", "#F9F3FF", "#FFF0F8", "#F3EFF8"] as const;

export type Fact = { id: string; label: string; sabotaje: string; destello: string };
export type Superpower = { id: string; label: string; destelloSuffix: string };
export type Chemical = { id: string; molecule: string; label: string; description: string; accent: string };
export type SlotResult = { fact: Fact; superpower: Superpower; chemical: Chemical };

export const FACTS: Fact[] = [
  { id: "f1", label: "Una llamada con alguien que quiero", sabotaje: "Estuvo bien... pero la conversación fue corta y no se sabe cuándo volverá a llamar.", destello: "Sentiste que importas y que alguien pensó en ti hoy" },
  { id: "f2", label: "Dormí bien toda la noche", sabotaje: "Una noche no cambia nada. Mañana seguro me desvelo de nuevo.", destello: "Tu cuerpo encontró la calma para descansar y repararse por completo" },
  { id: "f3", label: "Terminé una tarea de casa yo solo/a", sabotaje: "Tardé más que antes... ya no soy tan rápido/a como era.", destello: "Pusiste en marcha tu voluntad y completaste lo que te propusiste" },
  { id: "f4", label: "Disfruté de verdad una comida", sabotaje: "Qué pequeñez... otros tienen problemas reales y yo celebrando una comida.", destello: "Tu cuerpo recibió cuidado y tú estuviste presente para saborearlo" },
  { id: "f5", label: "Un rato de sol o de aire fresco", sabotaje: "Solo fue un rato. No sirve de mucho con todo lo que tengo pendiente.", destello: "Le diste a tu cuerpo y a tu mente el respiro que necesitaban" },
  { id: "f6", label: "Recordé algo con claridad", sabotaje: "Suerte. Cada vez me cuesta más recordar las cosas importantes.", destello: "Tu mente sigue activa y tus recuerdos siguen siendo tuyos" },
  { id: "f7", label: "Ayudé a alguien hoy", sabotaje: "No fue gran cosa. Cualquiera lo hubiera hecho en mi lugar.", destello: "Usaste tu experiencia y tu corazón para hacer la vida de alguien más fácil" },
  { id: "f8", label: "Me reí de verdad", sabotaje: "Un momento tonto... enseguida vuelve la rutina de siempre.", destello: "Tu cuerpo y tu mente se aliviaron juntos. Eso no pasa por casualidad" },
];

export const SUPERPOWERS: Superpower[] = [
  { id: "s1", label: "Sabiduría de Años", destelloSuffix: "con una sabiduría que solo se gana viviendo lo que tú has vivido." },
  { id: "s2", label: "Gratitud Auténtica", destelloSuffix: "reconociendo lo bueno cuando el mundo dice que no hay nada que celebrar." },
  { id: "s3", label: "Paciencia Ganada", destelloSuffix: "con la calma que solo tiene quien ha aprendido a esperar sin rendirse." },
  { id: "s4", label: "Generosidad del Corazón", destelloSuffix: "dando de ti sin calcular lo que recibirás a cambio." },
  { id: "s5", label: "Resiliencia Probada", destelloSuffix: "apoyándote en todo lo que has superado para seguir adelante hoy." },
  { id: "s6", label: "Presencia Plena", destelloSuffix: "estando completamente aquí, en este momento, sin huir hacia el pasado ni el futuro." },
];

export const CHEMICALS: Chemical[] = [
  { id: "c1", molecule: "Dopamina",  label: "Motivación",    description: "Tu cerebro acaba de marcar esto como valioso. Te empujará a repetirlo.", accent: "#F59E0B" },
  { id: "c2", molecule: "Serotonina",label: "Paz Interior",  description: "Regulador maestro del humor. Tu sistema nervioso ahora descansa.",      accent: "#10B981" },
  { id: "c3", molecule: "Endorfina", label: "Alivio",        description: "El analgésico natural. Disuelve la tensión acumulada desde adentro.",    accent: "#8B5CF6" },
  { id: "c4", molecule: "Oxitocina", label: "Conexión",      description: "La molécula del vínculo. Tu cuerpo refuerza que no estás solo en esto.", accent: "#EC4899" },
  { id: "c5", molecule: "GABA",      label: "Calma",         description: "El freno del sistema nervioso. Señal de que puedes soltar el control.",  accent: "#3B82F6" },
];

export const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: (i * 57 + 17) % (W - 10),
  size: (i % 4) + 2,
  duration: 11000 + ((i * 970) % 6000),
  delay: (i * 730) % 5500,
  color: i % 3 === 0 ? "rgba(255,215,80,0.85)" : i % 3 === 1 ? "rgba(255,185,165,0.8)" : "rgba(230,220,255,0.8)",
}));

export const JACKPOT_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  x: (i * 43 + 31) % (W - 10),
  size: (i % 3) + 3,
  duration: 4500 + ((i * 400) % 2000),
  delay: (i * 180) % 800,
  color: i % 2 === 0 ? "rgba(255,220,50,0.95)" : "rgba(255,200,130,0.9)",
}));
