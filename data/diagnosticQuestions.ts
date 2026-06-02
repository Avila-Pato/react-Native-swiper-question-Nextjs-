export type DiagnosticQuestion = {
  id: string;
  text: string;
  area: string;
  inverted?: boolean; // true = puntuación alta indica desafío
};

const BANK: DiagnosticQuestion[] = [
  // ── Emociones ──
  { id: "em1", area: "emociones", text: "Puedo identificar y nombrar lo que siento cuando algo me afecta." },
  { id: "em2", area: "emociones", text: "Me permito sentir emociones difíciles sin juzgarme por ello." },
  { id: "em3", area: "emociones", text: "Reacciono de forma impulsiva cuando me siento herido o frustrado.", inverted: true },
  { id: "em4", area: "emociones", text: "Cuando algo me preocupa, puedo calmarlo sin que me desborde." },

  // ── Límites ──
  { id: "lm1", area: "limites", text: "Me cuesta decir que no cuando no quiero hacer algo.", inverted: true },
  { id: "lm2", area: "limites", text: "Priorizo las necesidades de otros por encima de las mías con frecuencia.", inverted: true },
  { id: "lm3", area: "limites", text: "Me siento cómodo expresando lo que no estoy dispuesto a aceptar." },
  { id: "lm4", area: "limites", text: "Siento culpa cuando antepongo mis necesidades a las de otros.", inverted: true },

  // ── Relaciones ──
  { id: "re1", area: "relaciones", text: "Me siento genuinamente comprendido por las personas cercanas a mí." },
  { id: "re2", area: "relaciones", text: "Puedo pedir ayuda cuando la necesito sin sentirme débil." },
  { id: "re3", area: "relaciones", text: "Me cuesta confiar en las personas fácilmente.", inverted: true },
  { id: "re4", area: "relaciones", text: "Mis relaciones cercanas son recíprocas y me nutren." },

  // ── Autoestima ──
  { id: "ae1", area: "autoestima", text: "Me hablo con amabilidad cuando cometo errores." },
  { id: "ae2", area: "autoestima", text: "Me cuesta recibir halagos o reconocimientos sin minimizarlos.", inverted: true },
  { id: "ae3", area: "autoestima", text: "Siento que merezco las cosas buenas que me suceden." },
  { id: "ae4", area: "autoestima", text: "Me comparo frecuentemente con otros y salgo perdiendo.", inverted: true },

  // ── Estrés y ansiedad ──
  { id: "es1", area: "estres", text: "Con frecuencia siento que tengo demasiadas cosas en la mente.", inverted: true },
  { id: "es2", area: "estres", text: "Me cuesta dejar de pensar en los problemas antes de dormir.", inverted: true },
  { id: "es3", area: "estres", text: "Cuando algo se acumula, tengo formas efectivas de gestionarlo." },
  { id: "es4", area: "estres", text: "El estrés afecta mi cuerpo de forma visible (tensión, insomnio, dolores).", inverted: true },

  // ── Mindfulness ──
  { id: "mi1", area: "mindfulness", text: "Logro estar presente en el momento sin distraerme con el pasado o futuro." },
  { id: "mi2", area: "mindfulness", text: "Tengo ritmos o espacios de calma integrados en mi rutina." },
  { id: "mi3", area: "mindfulness", text: "Noto las señales de mi cuerpo antes de llegar al agotamiento." },
  { id: "mi4", area: "mindfulness", text: "Mi mente tiende a irse al pasado o al futuro con mucha frecuencia.", inverted: true },

  // ── Propósito ──
  { id: "pr1", area: "proposito", text: "Lo que hago cada día tiene sentido y significado para mí." },
  { id: "pr2", area: "proposito", text: "Sé con claridad qué valores guían mis decisiones importantes." },
  { id: "pr3", area: "proposito", text: "Me siento conectado a algo más grande que mis problemas cotidianos." },
  { id: "pr4", area: "proposito", text: "Siento que voy a la deriva, sin una dirección clara.", inverted: true },

  // ── Comunicación ──
  { id: "co1", area: "comunicacion", text: "Expreso lo que siento y pienso de forma directa y honesta." },
  { id: "co2", area: "comunicacion", text: "Escucho activamente a los demás sin pensar en mi respuesta mientras hablan." },
  { id: "co3", area: "comunicacion", text: "Me cuesta confrontar a alguien cuando algo me molesta.", inverted: true },
  { id: "co4", area: "comunicacion", text: "En un conflicto, puedo expresar mi perspectiva sin atacar a la otra persona." },

  // ── Generales (siempre incluidas) ──
  { id: "gn1", area: "general", text: "En general, me siento bien con la persona que estoy siendo." },
  { id: "gn2", area: "general", text: "Tengo personas en mi vida con quienes puedo ser completamente yo." },
  { id: "gn3", area: "general", text: "Siento que estoy creciendo como persona en este momento de mi vida." },
  { id: "gn4", area: "general", text: "Hay aspectos de mí mismo que me gustaría cambiar pero no sé cómo.", inverted: true },
];

/**
 * Selecciona ~20 preguntas personalizadas según las áreas y objetivos del usuario.
 * Siempre incluye 4 preguntas generales + 2-3 por área seleccionada.
 */
export function selectQuestions(
  areas: string[],
  goals: string[],
  total = 20,
): DiagnosticQuestion[] {
  const generals = BANK.filter((q) => q.area === "general");

  // Mapear goals a áreas adicionales
  const goalAreaMap: Record<string, string> = {
    crecimiento: "autoestima",
    relaciones: "relaciones",
    equilibrio: "estres",
    autoestima: "autoestima",
    sanacion: "emociones",
  };
  const extraAreas = goals.map((g) => goalAreaMap[g]).filter(Boolean);
  const allAreas = [...new Set([...areas, ...extraAreas])];

  const perArea = Math.max(2, Math.floor((total - generals.length) / Math.max(allAreas.length, 1)));

  const selected: DiagnosticQuestion[] = [...generals];

  for (const area of allAreas) {
    const pool = BANK.filter((q) => q.area === area);
    const pick = pool.slice(0, perArea);
    selected.push(...pick);
    if (selected.length >= total) break;
  }

  // Rellenar si faltan con preguntas de áreas no seleccionadas
  if (selected.length < total) {
    const ids = new Set(selected.map((q) => q.id));
    const filler = BANK.filter((q) => !ids.has(q.id) && q.area !== "general");
    selected.push(...filler.slice(0, total - selected.length));
  }

  return selected.slice(0, total);
}

export type { DiagnosticQuestion as Question };
