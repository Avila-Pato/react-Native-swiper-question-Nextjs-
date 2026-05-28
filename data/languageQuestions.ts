import { ChallengeQuestion } from "@/types/challenges";

export type ConceptQuestion = ChallengeQuestion & { concept: string };

export const CONCEPT_QUESTIONS: ConceptQuestion[] = [
  // ── Límites ────────────────────────────────────────────────────
  {
    id: "lim1",
    concept: "Límites",
    statement:
      "Lucía le dijo a su amiga: 'No puedo ayudarte esta semana, tengo demasiado en mi plato. Podría hacer tiempo la próxima.' Su amiga lo entendió. ¿Qué tipo de límite es?",
    options: ["Límite rígido", "Falta de límite", "Límite sano", "Límite difuso"],
    correctIndex: 2,
    explanation:
      "Un límite sano comunica claramente lo que puedes y no puedes hacer, con amabilidad y sin culpa. No requiere justificaciones extensas ni agresividad.",
  },
  {
    id: "lim2",
    concept: "Límites",
    statement:
      "Carlos dice que sí a todo lo que le piden, incluso cuando sabe que no tiene tiempo ni energía. Luego se siente resentido. ¿Qué refleja este patrón?",
    options: ["Límite sano", "Generosidad extrema", "Dificultad para poner límites", "Asertividad"],
    correctIndex: 2,
    explanation:
      "Decir sí compulsivamente —aunque genere resentimiento— es señal de que los límites no están siendo comunicados. El resentimiento es frecuentemente una señal de un límite que necesita ser puesto.",
  },
  {
    id: "lim3",
    concept: "Límites",
    statement:
      "Ana siente que no puede negarse a ninguna petición de su pareja aunque eso la haga sentir mal. Si lo hace, siente una culpa enorme. ¿Qué concepto describe mejor esto?",
    options: ["Amor incondicional", "Límite difuso o ausente", "Comunicación asertiva", "Empatía"],
    correctIndex: 1,
    explanation:
      "No poder decir no sin sentir culpa intensa indica que los límites están difusos o ausentes. Los límites no son contrarios al amor; son parte de una relación sana y respetuosa.",
  },

  // ── Comunicación ───────────────────────────────────────────────
  {
    id: "com1",
    concept: "Comunicación",
    statement:
      "En una discusión, Carlos dice: 'Tú nunca me haces caso' en lugar de 'Me siento ignorado cuando no me respondes'. ¿Qué diferencia hay?",
    options: [
      "No hay diferencia real",
      "El primero es asertivo, el segundo pasivo",
      "El primero acusa; el segundo expresa sin atacar",
      "El segundo es más agresivo",
    ],
    correctIndex: 2,
    explanation:
      "El lenguaje en primera persona ('yo siento...') comunica el impacto sin acusar directamente. Genera menos defensividad y más apertura para resolver el conflicto.",
  },
  {
    id: "com2",
    concept: "Comunicación",
    statement:
      "Sofía escucha sin interrumpir, mantiene contacto visual y asiente mientras su amiga habla sobre un problema. ¿Qué práctica muestra?",
    options: ["Pasividad", "Escucha activa", "Empatía proyectada", "Comunicación pasiva"],
    correctIndex: 1,
    explanation:
      "La escucha activa implica prestar atención plena: sin interrupciones, con señales de presencia y sin preparar la respuesta mientras el otro habla. Es una de las habilidades más valoradas en las relaciones.",
  },
  {
    id: "com3",
    concept: "Comunicación",
    statement:
      "Luis no dice que está molesto pero usa el silencio y respuestas cortantes para mostrar su malestar. ¿Qué tipo de comunicación es?",
    options: [
      "Comunicación asertiva",
      "Introspección sana",
      "Comunicación pasivo-agresiva",
      "Límite verbal",
    ],
    correctIndex: 2,
    explanation:
      "La comunicación pasivo-agresiva evita el conflicto directo pero lo expresa de forma indirecta. No resuelve nada; genera tensión y distancia en las relaciones.",
  },

  // ── Autoestima ─────────────────────────────────────────────────
  {
    id: "aut1",
    concept: "Autoestima",
    statement:
      "Laura necesita que le digan constantemente que hizo bien su trabajo para sentirse competente. Sin esa validación, duda de sí misma. ¿Qué refleja?",
    options: [
      "Autoestima alta",
      "Dependencia de validación externa",
      "Autocompasión",
      "Autoevaluación objetiva",
    ],
    correctIndex: 1,
    explanation:
      "Depender de la aprobación ajena refleja una autoestima que no está anclada internamente. La autoestima sana incluye un criterio propio que no colapsa con la ausencia de elogios.",
  },
  {
    id: "aut2",
    concept: "Autoestima",
    statement:
      "Después de un error, Diego se dice: 'Soy un fracasado, nunca hago nada bien'. ¿Qué tipo de pensamiento es?",
    options: [
      "Autocrítica constructiva",
      "Autoconocimiento",
      "Autoexigencia sana",
      "Diálogo interno negativo",
    ],
    correctIndex: 3,
    explanation:
      "El diálogo interno negativo y global ('nunca', 'siempre fracaso') daña la autoestima. La autocrítica sana es específica ('en esta situación no lo hice bien') y busca aprender, no atacar.",
  },
  {
    id: "aut3",
    concept: "Autoestima",
    statement:
      "Después de un error, Ana piensa: 'Eso no estuvo bien. ¿Qué puedo hacer diferente la próxima vez?' ¿Qué muestra?",
    options: ["Autocompasión", "Autocrítica constructiva", "Negación", "Perfeccionismo"],
    correctIndex: 1,
    explanation:
      "Reconocer el error sin juzgarse globalmente y buscar aprendizaje es autocrítica constructiva. Fortalece la autoestima porque separa el error del valor propio.",
  },

  // ── Relaciones ─────────────────────────────────────────────────
  {
    id: "rel1",
    concept: "Relaciones",
    statement:
      "Camila solo se siente bien cuando está con su pareja. Cuando están separados, siente ansiedad intensa y no puede concentrarse en nada. ¿Qué concepto describe esto?",
    options: ["Amor incondicional", "Dependencia emocional", "Apego seguro", "Compatibilidad"],
    correctIndex: 1,
    explanation:
      "La dependencia emocional genera ansiedad intensa ante la ausencia de la otra persona y dificulta el funcionamiento autónomo. Es diferente del amor sano, que permite que ambas personas mantengan su identidad.",
  },
  {
    id: "rel2",
    concept: "Relaciones",
    statement:
      "Andrés y su pareja tienen conflictos, pero los resuelven hablando con respeto y llegando a acuerdos que funcionan para ambos. ¿Cómo se describe esta relación?",
    options: [
      "Relación perfecta",
      "Relación con comunicación sana",
      "Codependencia",
      "Evasión del conflicto",
    ],
    correctIndex: 1,
    explanation:
      "Los conflictos son normales en toda relación cercana. Lo que define la salud de un vínculo es cómo se gestionan: con respeto, escucha y disposición a resolver, no evitando el problema.",
  },
  {
    id: "rel3",
    concept: "Relaciones",
    statement:
      "Rosa constantemente intenta cambiar a su pareja para que sea como ella necesita que sea, en lugar de aceptarlo como es. ¿Qué dinámica se da?",
    options: ["Amor romántico", "Control en la relación", "Límite sano", "Comunicación asertiva"],
    correctIndex: 1,
    explanation:
      "Intentar controlar o cambiar a la otra persona genera resentimiento y sofoca la autonomía. El amor sano acepta a la persona tal como es, aunque establece límites sobre conductas que lastiman.",
  },

  // ── Emociones ──────────────────────────────────────────────────
  {
    id: "emo1",
    concept: "Emociones",
    statement:
      "Tomás está triste, fuerza una sonrisa y dice 'estoy bien' aunque por dentro se siente mal. ¿Qué mecanismo está usando?",
    options: [
      "Regulación emocional",
      "Represión emocional",
      "Inteligencia emocional",
      "Resiliencia",
    ],
    correctIndex: 1,
    explanation:
      "Reprimir emociones —fingir que no existen— no las elimina; las acumula. Reconocer y expresar lo que sentimos, aunque sea en un momento apropiado, es parte de la salud emocional.",
  },
  {
    id: "emo2",
    concept: "Emociones",
    statement:
      "Natalia identifica cuándo empieza a ponerse ansiosa y hace una pausa para respirar antes de responder. ¿Qué habilidad practica?",
    options: [
      "Evitación emocional",
      "Impulsividad",
      "Regulación emocional",
      "Represión",
    ],
    correctIndex: 2,
    explanation:
      "Reconocer las señales de una emoción temprano y actuar de forma consciente antes de reaccionar impulsivamente es una habilidad clave de regulación emocional.",
  },
  {
    id: "emo3",
    concept: "Emociones",
    statement:
      "El miedo que siente Miguel antes de una presentación lo lleva a prepararse mejor y estar más alerta. ¿Cómo se puede interpretar este miedo?",
    options: [
      "Ansiedad patológica",
      "Emoción adaptativa",
      "Fobia específica",
      "Trastorno de pánico",
    ],
    correctIndex: 1,
    explanation:
      "Las emociones, incluso las incómodas, cumplen funciones adaptativas. Una dosis de miedo puede aumentar el rendimiento y la preparación. Solo se convierte en problema cuando es desproporcionado o paralizante.",
  },

  // ── Mindfulness ────────────────────────────────────────────────
  {
    id: "min1",
    concept: "Mindfulness",
    statement:
      "Isabel apaga el teléfono durante el desayuno y saborea cada bocado, notando los colores y texturas sin pensar en lo que tiene que hacer después. ¿Qué práctica es?",
    options: [
      "Distracción consciente",
      "Atención plena (mindfulness)",
      "Meditación trascendental",
      "Rutina automática",
    ],
    correctIndex: 1,
    explanation:
      "El mindfulness es prestar atención deliberada al momento presente sin juzgar. No requiere meditación formal; puede aplicarse en cualquier actividad cotidiana.",
  },
  {
    id: "min2",
    concept: "Mindfulness",
    statement:
      "Felipe nota que su mente se fue al pasado mientras trabaja y gentilmente redirige su atención a lo que está haciendo ahora. ¿Qué está haciendo?",
    options: [
      "Distracción controlada",
      "Práctica de atención plena",
      "Memoria involuntaria",
      "Ansiedad",
    ],
    correctIndex: 1,
    explanation:
      "Notar que la mente divagó y regresar suavemente al presente —sin juzgarse— es la esencia del mindfulness. La mente divaga; la práctica está en el regresar.",
  },
  {
    id: "min3",
    concept: "Mindfulness",
    statement:
      "Carmen se da cuenta de que mientras su amigo habla, ella está pensando en lo que va a responder en lugar de escuchar. ¿Qué lo opuesto a esto?",
    options: [
      "Escucha con mente errante",
      "Escucha activa con atención plena",
      "Empatía proyectada",
      "Introspección",
    ],
    correctIndex: 1,
    explanation:
      "La escucha con atención plena implica estar presente en la conversación sin preparar la respuesta mientras el otro habla. Ese tipo de presencia genera una conexión más genuina.",
  },
];

export const CONCEPT_GROUPS = [
  {
    label: "Bienestar personal",
    items: ["Límites", "Autoestima", "Emociones"],
  },
  {
    label: "Relaciones y comunicación",
    items: ["Comunicación", "Relaciones", "Mindfulness"],
  },
];

export function getQuestionsForConcepts(
  concepts: string[],
  count = 5,
): (ChallengeQuestion & { concept: string })[] {
  const pool = CONCEPT_QUESTIONS.filter((q) => concepts.includes(q.concept));
  if (pool.length === 0) return [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
