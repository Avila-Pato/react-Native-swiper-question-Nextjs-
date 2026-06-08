export type TagBienestar = "Mente" | "Cuerpo" | "Espacio";
export type TipoContenido = "meditacion" | "micro_ejercicio" | "audio_guia";
export type CategoriaDetectada =
  | "ESTRES_ANSIEDAD"
  | "CANSANCIO_APATIA"
  | "ALEGRIA_MOTIVACION"
  | "TRISTEZA_MELANCOLIA"
  | "CONFUSION_INCERTIDUMBRE";

export type CartaRecompensa = {
  tag_bienestar: TagBienestar;
  titulo: string;
  subtitulo: string;
  tipo_contenido: TipoContenido;
  duracion_estimada: string;
  color_sugerido_hex: string;
};

export type JournalResult = {
  categoria_detectada: CategoriaDetectada;
  carta_recompensa: CartaRecompensa;
};

export const CARTAS: Record<CategoriaDetectada, CartaRecompensa> = {
  ESTRES_ANSIEDAD: {
    tag_bienestar: "Mente",
    titulo: "Pausa de Alivio",
    subtitulo: "Tres minutos para desacelerar el ritmo y recuperar tu centro.",
    tipo_contenido: "meditacion",
    duracion_estimada: "3 min",
    color_sugerido_hex: "#4A6B82",
  },
  CANSANCIO_APATIA: {
    tag_bienestar: "Cuerpo",
    titulo: "Recarga Suave",
    subtitulo: "Un pequeño movimiento para despertar tu energía con amabilidad.",
    tipo_contenido: "micro_ejercicio",
    duracion_estimada: "5 min",
    color_sugerido_hex: "#8B7355",
  },
  ALEGRIA_MOTIVACION: {
    tag_bienestar: "Mente",
    titulo: "Tu Foco de Hoy",
    subtitulo: "Canaliza esta energía hacia lo que más importa ahora mismo.",
    tipo_contenido: "audio_guia",
    duracion_estimada: "4 min",
    color_sugerido_hex: "#4A7C59",
  },
  TRISTEZA_MELANCOLIA: {
    tag_bienestar: "Espacio",
    titulo: "Espacio de Calma",
    subtitulo: "Un lugar seguro para sentir sin juzgar lo que hay en ti.",
    tipo_contenido: "meditacion",
    duracion_estimada: "6 min",
    color_sugerido_hex: "#5C5C8A",
  },
  CONFUSION_INCERTIDUMBRE: {
    tag_bienestar: "Mente",
    titulo: "Ancla al Presente",
    subtitulo: "Una técnica simple para encontrar claridad desde adentro.",
    tipo_contenido: "micro_ejercicio",
    duracion_estimada: "4 min",
    color_sugerido_hex: "#6B6560",
  },
};
