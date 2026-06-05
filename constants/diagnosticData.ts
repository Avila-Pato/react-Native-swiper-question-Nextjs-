// @/constants/diagnosticData.ts
import { Ionicons } from "@expo/vector-icons";

export interface AreaMetaEntry {
  label: string;
  short: string;
  color: string;
  bg: string;
  insight: string;
}

export interface ArchetypeEntry {
  tipo: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  tagline: string;
  desc: string;
  mejorar: string | undefined;
  color: string;
  bg: string;
}

export const AREA_META: Record<string, AreaMetaEntry> = {
  emociones: {
    label: "Emociones",
    short: "Emoc.",
    color: "#C45E7A",
    bg: "#FFF0F5",
    insight: "Tus emociones son profundas e intensas. Necesitas espacio para procesarlas sin juzgarte.",
  },
  limites: {
    label: "Límites",
    short: "Límites",
    color: "#4A80C4",
    bg: "#EAF4FF",
    insight: "Decir que no te cuesta energía. Establecer límites sanos es tu mayor oportunidad.",
  },
  relaciones: {
    label: "Relaciones",
    short: "Relac.",
    color: "#7B68BF",
    bg: "#F4EEFA",
    insight: "Los vínculos son centrales en tu vida. Nutrir conexiones auténticas te impulsa.",
  },
  autoestima: {
    label: "Autoestima",
    short: "Autoest.",
    color: "#C49030",
    bg: "#FFFAEC",
    insight: "Tu relación contigo mismo/a es el punto de partida. Reconocer tu valor es el primer paso.",
  },
  estres: {
    label: "Estrés",
    short: "Estrés",
    color: "#C46030",
    bg: "#FFF4EE",
    insight: "La presión del día a día te afecta más de lo que muestras. Necesitas herramientas reales.",
  },
  mindfulness: {
    label: "Mindfulness",
    short: "Mindful",
    color: "#3B9A5A",
    bg: "#EEF7F1",
    insight: "Estar presente te resulta difícil. Tu mente viaja al pasado o al futuro con frecuencia.",
  },
  proposito: {
    label: "Propósito",
    short: "Propós.",
    color: "#8980B8",
    bg: "#F4EEFA",
    insight: "Necesitas sentir que lo que haces tiene dirección. El significado diario te motiva.",
  },
  comunicacion: {
    label: "Comunicación",
    short: "Comunic.",
    color: "#5B9EC9",
    bg: "#EAF4FF",
    insight: "Expresar lo que sientes o necesitas a veces se bloquea. Tu voz merece ser escuchada.",
  },
};
export const ARCHETYPE: Record<string, ArchetypeEntry> = {
  emociones: { 
    tipo: "El Sensible", 
    icon: "water", 
    tagline: "Siente profundo, vive auténtico.", 
    desc: "Tienes una capacidad emocional que pocos comprenden. Tu reto es aprender a fluir con eso sin desbordarte.", 
    mejorar: "Aprender a canalizar la intensidad emocional mediante la autoobservación sin juzgarte.",
    color: "#C45E7A", 
    bg: "#FFF0F5" 
  },
  relaciones: { 
    tipo: "El Conector", 
    icon: "people", 
    tagline: "Tu fuerza vive en los vínculos.", 
    desc: "Eres alguien que nutre a quienes lo rodean. Aprender a recibir tanto como das es tu próximo paso.", 
    mejorar: "Establecer una reciprocidad saludable y evitar postergar tus necesidades por priorizar a otros.",
    color: "#7B68BF", 
    bg: "#F4EEFA" 
  },
  autoestima: { 
    tipo: "El Buscador", 
    icon: "star", 
    tagline: "Tu camino empieza en ti.", 
    desc: "Estás en un proceso poderoso de reconocer tu valor. Cada pequeño avance en esa dirección importa.", 
    mejorar: "Reducir la autocrítica severa y empezar a celebrar tus pequeños logros diarios.",
    color: "#C49030", 
    bg: "#FFFAEC" 
  },
  estres: { 
    tipo: "El Resiliente", 
    icon: "flash", 
    tagline: "La presión te fortalece.", 
    desc: "Has aprendido a funcionar bajo tensión, pero tu cuerpo y mente necesitan más que sobrevivir.", 
    mejorar: "Integrar pausas activas obligatorias en tu rutina antes de llegar al punto de agotamiento físico.",
    color: "#C46030", 
    bg: "#FFF4EE" 
  },
  mindfulness: { 
    tipo: "El Presente", 
    icon: "leaf", 
    tagline: "Aquí y ahora es donde vives.", 
    desc: "La calma no está lejos. Está en el acto simple de pausar y observar, un momento a la vez.", 
    mejorar: "Sostener la constancia en tus momentos de silencio y evitar que el ruido externo dicte tu ritmo.",
    color: "#3B9A5A", 
    bg: "#EEF7F1" 
  },
  limites: { 
    tipo: "El Guardián", 
    icon: "shield-checkmark", 
    tagline: "Proteger tu energía es un acto de amor.", 
    desc: "Tienes un corazón generoso. Aprender cuándo decir no es la habilidad que más te liberará.", 
    mejorar: "Perder el miedo a la incomodidad o al rechazo ajeno cuando decides marcar un límite claro.",
    color: "#4A80C4", 
    bg: "#EAF4FF" 
  },
  proposito: { 
    tipo: "El Visionario", 
    icon: "compass", 
    tagline: "Cada día puede tener sentido.", 
    desc: "Buscas que lo que haces tenga dirección real. Encontrar ese hilo conductor es tu trabajo ahora.", 
    mejorar: "Traducir las grandes ideas abstractas en micro-acciones concretas que puedas ejecutar hoy.",
    color: "#8980B8", 
    bg: "#F4EEFA" 
  },
  comunicacion: { 
    tipo: "El Expresivo", 
    icon: "chatbubbles", 
    tagline: "Tu voz tiene algo importante que decir.", 
    desc: "Sabes lo que sientes, pero encontrar las palabras para expresarlo es donde creces más.", 
    mejorar: "Expresar lo que te molesta de manera oportuna, evitando acumular silencios que luego explotan.",
    color: "#5B9EC9", 
    bg: "#EAF4FF" 
  },
};