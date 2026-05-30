import { Compass, Heart, Sparkles, Star } from "lucide-react-native";
import { Dimensions } from "react-native";

export const { width: W, height: H } = Dimensions.get("window");

export const NODE_RADIUS    = 42;
export const SNAP_THRESHOLD = 58;
export const COMPASS_X      = W * 0.5;
export const COMPASS_Y      = H * 0.47;

export const ORBIT: { x: number; y: number }[] = [
  { x: -W * 0.27, y: -H * 0.13 },
  { x:  W * 0.27, y: -H * 0.13 },
  { x: -W * 0.27, y:  H * 0.13 },
  { x:  W * 0.27, y:  H * 0.13 },
];

export const ACCENT        = "#6B5A9E";
export const ACCENT_LIGHT  = "#8B7AB8";
export const ACCENT_MUTED  = "rgba(107,90,158,0.12)";
export const ACCENT_BORDER = "rgba(107,90,158,0.22)";
export const TEXT_DARK     = "#1A1A38";
export const TEXT_MID      = "#585878";
export const TEXT_MUTED    = "#8888A8";
export const CARD_BG       = "rgba(255,255,255,0.82)";
export const CARD_BORDER   = "rgba(170,160,210,0.35)";

export const CARD_W       = W * 0.82;
export const STAT_LABEL_W = 90;
export const STAT_PCT_W   = 34;
export const STAT_BAR_W   = CARD_W - 36 - STAT_LABEL_W - STAT_PCT_W - 12;

export const GRADIENT_COLORS = ["#EAE8F2", "#F2F0F8", "#EBE8F5", "#F0EFF8"] as const;
export const STORAGE_KEY = "purpose_completed_ids";

export type Stat = { label: string; value: number };
export type CompassItem = {
  id: string; title: string; subtitle: string; quote: string;
  reflexion: string; futureAction: string; stats: [Stat, Stat, Stat];
};

export const ITEMS: CompassItem[] = [
  { id: "p1", title: "La Vocación Oculta", subtitle: "Lo que el mundo necesita que tú hagas", quote: "Quien tiene un porqué para vivir puede soportar casi cualquier cómo. — Viktor Frankl", reflexion: "Frankl sobrevivió cuatro campos de concentración nazis y en ese infierno descubrió lo que ningún verdugo podía quitarle: la libertad de elegir su actitud. Tu vocación no es lo que haces bien. Es lo que harías incluso si nadie te pagara ni te viera. La tensión que sientes cuando no la sigues no es ansiedad: es brújula.", futureAction: "Cierra los ojos. Tu yo de 80 años te mira y pregunta: ¿lo hiciste? Escucha la respuesta. Luego toma hoy una sola decisión que acorte esa distancia. Tu valor guía es la Autenticidad.", stats: [{ label: "Claridad", value: 78 }, { label: "Autenticidad", value: 92 }, { label: "Impacto", value: 65 }] },
  { id: "p2", title: "El Legado del Futuro", subtitle: "Lo que quedará cuando ya no estés", quote: "El hombre no debe preguntar cuál es el sentido de su vida, sino reconocer que es él quien recibe esa pregunta. — Viktor Frankl", reflexion: "El Ikigai japones enseña que el propósito vive en la intersección de cuatro preguntas: que amas, en que eres bueno, que necesita el mundo y por que te pagarían. Tu legado no es monumental. Es la suma de tus actos cotidianos repetidos con intención.", futureAction: "Escribe la carta que tu yo de 80 años le envía a tu yo de hoy. Dile que decision tomaste que mas marco a quienes amabas. Leela mañana en voz alta.", stats: [{ label: "Impacto", value: 88 }, { label: "Trascendencia", value: 81 }, { label: "Continuidad", value: 74 }] },
  { id: "p3", title: "El Porqué Diario", subtitle: "Sentido en lo pequeño, grandeza en lo cotidiano", quote: "Entre el estimulo y la respuesta hay un espacio. En ese espacio esta nuestro poder de elegir. — Viktor Frankl", reflexion: "Los ancianos de Okinawa que viven hasta los 100 años no tienen un propósito épico: tienen razones pequeñas y concretas para levantarse cada mañana. Tu porqué no necesita ser grandioso para ser real. Solo necesita ser tuyo.", futureAction: "Identifica una cosa que harás mañana alineada con tus valores mas profundos, no lo urgente sino lo que importa. Comprométete con esa sola cosa. El propósito se construye acto a acto.", stats: [{ label: "Constancia", value: 84 }, { label: "Presencia", value: 77 }, { label: "Gratitud", value: 71 }] },
];

export const NODE_DEFS = [
  { id: "n1", label: "Lo que amo",  Icon: Heart,    colors: ["#7B6AB0", "#9B8AD0"] as [string, string] },
  { id: "n2", label: "Mis Valores", Icon: Star,     colors: ["#5A7090", "#7A90B0"] as [string, string] },
  { id: "n3", label: "Mi Vocación", Icon: Compass,  colors: ["#7B6AB0", "#9B8AD0"] as [string, string] },
  { id: "n4", label: "Mi Legado",   Icon: Sparkles, colors: ["#6878A8", "#8898C8"] as [string, string] },
];

export const BG_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  x: (i * 73 + 19) % (W - 10),
  size: (i % 3) + 1,
  duration: 16000 + ((i * 1200) % 8000),
  delay: (i * 700) % 8000,
  color: i % 3 === 0 ? "rgba(160,145,210,0.45)" : i % 3 === 1 ? "rgba(200,195,235,0.35)" : "rgba(140,160,220,0.4)",
}));
