export interface DeckCard {
  id: string;
  area: string;
  areaLabel: string;
  text: string;
  emoji: string;
}

export const AREA_LABELS: Record<string, string> = {
  emociones: "Emociones",
  limites: "Límites",
  relaciones: "Relaciones",
  autoestima: "Autoestima",
  estres: "Estrés",
  mindfulness: "Mindfulness",
  proposito: "Propósito",
  comunicacion: "Comunicación",
};

export const AREA_ICONS: Record<string, string> = {
  emociones: "heart-outline",
  limites: "shield-outline",
  relaciones: "people-outline",
  autoestima: "star-outline",
  estres: "flash-outline",
  mindfulness: "moon-outline",
  proposito: "compass-outline",
  comunicacion: "chatbubbles-outline",
};

export const AREA_COLORS: Record<string, { bg: string; accent: string }> = {
  emociones: { bg: "#F4EEFA", accent: "#7B68BF" },
  limites: { bg: "#EAF4FF", accent: "#4A80C4" },
  relaciones: { bg: "#FFF0F5", accent: "#C45E7A" },
  autoestima: { bg: "#FFFAEC", accent: "#C49030" },
  estres: { bg: "#FFF4EE", accent: "#C46030" },
  mindfulness: { bg: "#EEF7F1", accent: "#3B9A5A" },
  proposito: { bg: "#F0EEFF", accent: "#7060C0" },
  comunicacion: { bg: "#EEF5FF", accent: "#4A70C4" },
};

const RAW: Record<string, Array<{ id: string; text: string; emoji: string }>> = {
  emociones: [
    { id: "emo_1", text: "Me cuesta identificar lo que siento en el momento exacto en que lo siento", emoji: "🌊" },
    { id: "emo_2", text: "Cuando una emoción intensa aparece, mi primer impulso es hacer que desaparezca", emoji: "🌀" },
    { id: "emo_3", text: "Quisiera comprender por qué ciertas situaciones me afectan tanto", emoji: "🔍" },
  ],
  limites: [
    { id: "lim_1", text: "Digo que sí más por no decepcionar a otros que por querer genuinamente hacerlo", emoji: "🚪" },
    { id: "lim_2", text: "Me siento culpable cuando priorizo mis necesidades sobre las de los demás", emoji: "⚖️" },
    { id: "lim_3", text: "Termino agotado después de pasar tiempo con ciertas personas", emoji: "🔋" },
  ],
  relaciones: [
    { id: "rel_1", text: "Siento que nadie me conoce del todo, aunque haya personas cercanas en mi vida", emoji: "🌉" },
    { id: "rel_2", text: "Las peleas y conflictos me generan una tensión que tarda mucho en irse", emoji: "🌪️" },
    { id: "rel_3", text: "Quiero conexiones más profundas y auténticas, no solo superficiales", emoji: "🤝" },
  ],
  autoestima: [
    { id: "aut_1", text: "Me comparo con otros y siento que siempre hay algo en mí que no está a la altura", emoji: "🪞" },
    { id: "aut_2", text: "Cuando algo me sale bien, me cuesta creer que fue por mis capacidades reales", emoji: "⭐" },
    { id: "aut_3", text: "Hay una voz en mi cabeza que suele ser más crítica que amable conmigo", emoji: "💭" },
  ],
  estres: [
    { id: "est_1", text: "Hay momentos en que siento que todo se acumula y ya no puedo más", emoji: "🌊" },
    { id: "est_2", text: "Mi cuerpo carga tensión aunque mi mente diga que todo está bien", emoji: "⚡" },
    { id: "est_3", text: "Quisiera tener más herramientas para calmarme cuando me siento desbordado", emoji: "🌬️" },
  ],
  mindfulness: [
    { id: "min_1", text: "Mi mente suele estar en otro lugar aunque yo esté presente físicamente", emoji: "🌙" },
    { id: "min_2", text: "Vivo más en modo automático que realmente consciente de lo que estoy haciendo", emoji: "🔄" },
    { id: "min_3", text: "Me cuesta disfrutar el momento porque siempre estoy pensando en lo que sigue", emoji: "🎯" },
  ],
  proposito: [
    { id: "pro_1", text: "Siento que me muevo mucho pero no siempre sé hacia dónde ni por qué", emoji: "🧭" },
    { id: "pro_2", text: "Me pregunto si lo que hago día a día realmente me acerca a quien quiero ser", emoji: "🌱" },
    { id: "pro_3", text: "Busco algo que le dé más sentido y dirección a mi vida cotidiana", emoji: "✨" },
  ],
  comunicacion: [
    { id: "com_1", text: "Hay cosas que siento que nunca logro expresar como realmente las vivo", emoji: "💬" },
    { id: "com_2", text: "Me cuesta decir lo que necesito sin miedo a que los demás se molesten", emoji: "🌐" },
    { id: "com_3", text: "Quisiera comunicarme de forma más honesta y directa sin tanto filtro", emoji: "🎤" },
  ],
};

export function buildDeck(areas: string[]): DeckCard[] {
  const deck: DeckCard[] = [];
  for (const area of areas) {
    const cards = RAW[area] ?? [];
    for (const c of cards) {
      deck.push({ ...c, area, areaLabel: AREA_LABELS[area] ?? area });
    }
  }
  return deck;
}
