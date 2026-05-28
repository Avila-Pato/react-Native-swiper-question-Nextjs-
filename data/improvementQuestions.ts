import { ChallengeQuestion } from "@/types/challenges";

const q = (
  id: string,
  statement: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  code?: string,
): ChallengeQuestion => ({ id, statement, options, correctIndex, explanation, code });

// ── Por concepto (para adivina_concepto) ──────────────────────────────────

export const IMPROVEMENT_BY_CONCEPT: Record<string, ChallengeQuestion[]> = {
  Límites: [
    q("il1", "Según Nedra Tawwab, ¿cuál es el principal beneficio de poner límites sanos?",
      ["Alejar a las personas problemáticas", "Proteger tu bienestar y mejorar tus relaciones", "Ganar poder en las relaciones", "Evitar todo conflicto"],
      1, "Tawwab explica que los límites sanos protegen tu energía, tiempo y valores, y paradójicamente fortalecen las relaciones al fomentar la honestidad y el respeto mutuo."),
    q("il2", "¿Cuál de estos es un ejemplo de límite sano?",
      ["'Nunca te voy a ayudar con nada'", "'Puedo ayudarte mañana, hoy no tengo tiempo'", "'Si me pides eso, nunca más te hablo'", "'Haz lo que quieras, me da igual'"],
      1, "Un límite sano es claro, específico y comunicado sin agresividad. Dice qué puedes y qué no puedes hacer en un momento dado, sin atacar ni dramaturgia."),
    q("il3", "¿Qué señal frecuente indica que necesitas poner un límite?",
      ["Sentirte agradecido", "Sentirte resentido después de decir sí", "Querer pasar más tiempo con alguien", "Tener ganas de ayudar"],
      1, "El resentimiento es una señal de que dijiste sí cuando querías decir no. Es una alarma interna que indica que se cruzó un límite propio."),
  ],
  Comunicación: [
    q("ic1", "¿Cuál es la diferencia clave entre comunicación asertiva y agresiva?",
      ["La asertiva es más silenciosa", "La asertiva expresa necesidades sin atacar a la otra persona", "La agresiva es más honesta", "No hay diferencia real"],
      1, "La asertividad busca expresar lo propio con claridad y respeto. La agresividad impone a costa del otro. La pasividad cede a costa de uno mismo."),
    q("ic2", "¿Qué es la escucha activa?",
      ["Escuchar y preparar tu respuesta al mismo tiempo", "Prestar atención plena sin interrumpir ni juzgar", "Repetir exactamente lo que dijo el otro", "Dar consejos mientras escuchas"],
      1, "La escucha activa implica estar presente, sin interrumpir ni preparar la respuesta. Es una de las formas más poderosas de mostrar respeto y conexión."),
    q("ic3", "¿Por qué usar el lenguaje en primera persona ('yo siento...') reduce el conflicto?",
      ["Hace que el otro se sienta culpable", "Expresa el impacto sin acusar directamente, generando menos defensividad", "Evita que el otro entienda el problema", "Es más fácil de ignorar"],
      1, "Cuando dices 'yo me siento...', el otro puede escucharte sin sentirse atacado. Cuando dices 'tú siempre...', se pone a la defensiva y el diálogo se bloquea."),
  ],
  Autoestima: [
    q("ia1", "¿Qué es la autocompasión según la psicología?",
      ["Darse excusas para no mejorar", "Pensar que eres mejor que los demás", "Tratarte con amabilidad cuando cometes errores, como lo harías con un amigo", "Ignorar tus errores"],
      2, "La autocompasión —popularizada por Kristin Neff— implica reconocer el error con amabilidad en lugar de atacarte. Es más efectiva para el cambio que la autocrítica severa."),
    q("ia2", "¿Cuál de estas frases refleja una autoestima más sana?",
      ["'Si cometo un error, soy un fracasado'", "'Cometí un error; eso no me define como persona'", "'Nunca cometo errores'", "'Lo que piensan los demás de mí es lo más importante'"],
      1, "Una autoestima sana separa el error del valor propio. Reconoces que fallaste sin concluir que 'eres' un fracaso como persona."),
    q("ia3", "¿De qué depende principalmente la autoestima sana?",
      ["De los logros y el éxito externo", "De la aprobación de los demás", "De un sentido interno de valor que no depende de los resultados", "De ser mejor que los demás"],
      2, "La autoestima basada en logros es frágil porque colapsa ante los fracasos. La autoestima sana surge de un valor interno que no oscila tanto con las circunstancias externas."),
  ],
  Relaciones: [
    q("ir1", "¿Cuál es una característica clave de una relación emocionalmente sana?",
      ["Ausencia total de conflictos", "Que ambas personas mantengan su autonomía e identidad", "Que uno de los dos siempre ceda", "Que pasen todo el tiempo juntos"],
      1, "Las relaciones sanas permiten que ambas personas mantengan su identidad, amistades y proyectos. La fusión total —perder la individualidad— suele generar resentimiento."),
    q("ir2", "¿Cómo se diferencia el apego seguro de la dependencia emocional?",
      ["El apego seguro genera ansiedad al separarse", "La dependencia emocional permite la autonomía", "El apego seguro permite estar bien tanto juntos como separados", "No hay diferencia"],
      2, "El apego seguro significa que puedes conectar profundamente y también funcionar bien de forma independiente. La dependencia emocional genera ansiedad cuando la otra persona no está presente."),
    q("ir3", "¿Qué indica el resentimiento acumulado en una relación?",
      ["Que la relación está terminada", "Que hay necesidades o límites que no se están comunicando", "Que la otra persona es tóxica", "Que debes alejarte de inmediato"],
      1, "El resentimiento suele ser una señal de que hay algo que no se ha comunicado: un límite que se cruza repetidamente, una necesidad que no se expresa o un acuerdo que no se cumple."),
  ],
  Emociones: [
    q("ie1", "¿Qué es la regulación emocional?",
      ["Suprimir las emociones para no mostrarlas", "La capacidad de reconocer y manejar las emociones sin ser controlado por ellas", "Expresar todas las emociones en el momento en que surgen", "Ignorar las emociones negativas"],
      1, "La regulación emocional es la habilidad de reconocer lo que sientes, entender por qué y elegir cómo responder. No es suprimir; es gestionar conscientemente."),
    q("ie2", "¿Por qué es importante no suprimir las emociones difíciles?",
      ["Porque expresarlas siempre resuelve el problema", "Porque suprimirlas las acumula y pueden emerger con más intensidad después", "Porque las emociones siempre dicen la verdad", "Porque mostrarlas genera conexión inmediata"],
      1, "Las emociones suprimidas no desaparecen; se acumulan y suelen emerger de forma más intensa o en momentos poco apropiados. Procesarlas —no necesariamente expresarlas de inmediato— es la clave."),
    q("ie3", "¿Cuál de estas es una función adaptativa de la tristeza?",
      ["Hacernos sentir inferiores a los demás", "Señalarnos pérdidas o necesidades no cubiertas para que podamos atenderlas", "Paralizarnos indefinidamente", "No tiene ninguna función útil"],
      1, "La tristeza señala pérdidas o necesidades no cubiertas. Aunque incómoda, cumple la función de dirigir nuestra atención hacia algo que importa y necesita ser procesado."),
  ],
  Mindfulness: [
    q("im1", "¿Cuál es la esencia de la práctica del mindfulness?",
      ["Vaciar la mente de todo pensamiento", "Prestar atención deliberada al momento presente sin juzgar", "Meditar al menos una hora al día", "Ignorar los pensamientos negativos"],
      1, "El mindfulness es prestar atención plena al momento presente sin juzgar lo que surge. No se trata de vaciar la mente, sino de observar lo que ocurre con curiosidad y sin reactividad."),
    q("im2", "¿En qué situaciones cotidianas se puede practicar el mindfulness?",
      ["Solo en sesiones formales de meditación", "Solo cuando estás relajado", "En cualquier actividad: comer, caminar, escuchar, respirar", "Solo en situaciones de estrés"],
      2, "El mindfulness no requiere tiempo especial ni postura específica. Puede practicarse en cualquier momento: al comer con atención, al caminar sintiéndote andar, al escuchar sin preparar la respuesta."),
    q("im3", "¿Qué haces cuando notas que tu mente divagó durante la práctica de mindfulness?",
      ["Te castigas por distraerte", "Abandonas la práctica", "Regresas gentilmente la atención al presente sin juzgarte", "Intentas forzarte a no pensar"],
      2, "Notar que la mente se fue y regresar suavemente al presente —sin juzgarte— es la práctica misma. La mente divaga; el entrenamiento está en ese regreso consciente."),
  ],
};

// ── Por tipo de reto ────────────────────────────────────────────────────────

export const IMPROVEMENT_BY_CHALLENGE: Record<string, ChallengeQuestion[]> = {
  identifica_patron: [
    q("iip1", "¿Cuál de estas es una señal de comunicación pasivo-agresiva?",
      ["Expresar directamente lo que molesta", "Usar el silencio o la frialdad para mostrar malestar sin decirlo", "Pedir tiempo para pensar antes de responder", "Escuchar sin interrumpir"],
      1, "La comunicación pasivo-agresiva expresa el malestar de forma indirecta: silencios, ironías, olvidos convenientes. No resuelve nada; genera más tensión."),
    q("iip2", "¿Qué es la generalización excesiva como patrón de pensamiento?",
      ["Analizar una situación desde varios ángulos", "Sacar conclusiones globales y absolutas a partir de eventos aislados", "Evaluar el pasado de forma objetiva", "Identificar patrones repetidos con evidencia"],
      1, "La generalización excesiva usa palabras como 'nunca', 'siempre', 'jamás' para convertir un evento en una regla absoluta. Distorsiona la realidad y alimenta la desesperanza."),
    q("iip3", "¿Cómo se diferencia una interpretación catastrófica de una preocupación realista?",
      ["No hay diferencia; ambas son igualmente válidas", "La catastrófica asume el peor escenario sin verificar la información", "La realista siempre lleva a evitar la situación", "La catastrófica es más precisa"],
      1, "La interpretación catastrófica salta al peor escenario posible sin buscar información que lo confirme o lo descarte. La preocupación realista evalúa la situación con evidencia disponible."),
  ],
  verdad_mito: [
    q("ivm1", "¿Cuál es la diferencia entre el bienestar y la felicidad según la psicología?",
      ["Son exactamente lo mismo", "El bienestar es un estado más amplio que incluye propósito, relaciones y gestión emocional", "La felicidad es más duradera que el bienestar", "El bienestar solo incluye la salud física"],
      1, "El bienestar (wellbeing) es un constructo más amplio que la felicidad. Incluye propósito de vida, relaciones significativas, logro, emoción positiva y compromiso con lo que haces."),
    q("ivm2", "¿Por qué los mitos sobre salud mental pueden ser dañinos?",
      ["No son dañinos si la gente los cree libremente", "Pueden impedir que las personas busquen ayuda o expresen lo que sienten", "Solo afectan a quienes ya tienen problemas mentales", "Son inofensivos si se conocen como mitos"],
      1, "Los mitos como 'la terapia es para locos' o 'las emociones son debilidad' hacen que las personas no busquen ayuda, supriman lo que sienten y se aíslen cuando más lo necesitan."),
    q("ivm3", "¿Cuándo se considera que la ansiedad pasa de adaptativa a problemática?",
      ["Cuando aparece antes de cualquier evento importante", "Cuando es desproporcionada, persistente e interfiere en el funcionamiento cotidiano", "Cuando la siente más de una vez al mes", "Cuando produce cualquier malestar físico"],
      1, "Toda ansiedad es adaptativa en dosis apropiadas. Cuando es desproporcionada al contexto, persiste sin estímulo claro o interfiere en el trabajo, relaciones o vida cotidiana, requiere atención."),
  ],
  completa_reflexion: [
    q("icr1", "¿Cuál es la idea central del libro 'Como el Hombre Piensa' de James Allen?",
      ["El éxito depende principalmente de la suerte", "Los pensamientos moldean el carácter y las circunstancias de la vida", "Las emociones son más importantes que los pensamientos", "El entorno determina completamente quién somos"],
      1, "Allen sostiene que los pensamientos son las semillas del carácter y el destino. Cambiar el pensamiento —cultivar pensamientos más puros y constructivos— es la base del cambio real."),
    q("icr2", "¿Qué propone Nedra Tawwab sobre los límites en las relaciones?",
      ["Los límites dañan las relaciones cercanas", "Los límites son reglas rígidas que nunca deben cambiar", "Los límites son necesarios para la salud emocional y mejoran las relaciones", "Solo las personas inseguras necesitan límites"],
      2, "Tawwab explica que los límites no alejan a las personas; las atraen. Cuando comunicas claramente lo que necesitas, generas relaciones más honestas, respetuosas y duraderas."),
    q("icr3", "¿Qué significa que el autoconocimiento sea la base del cambio personal?",
      ["Que conocerte resuelve todos tus problemas", "Que sin entender tus patrones, emociones y valores, los cambios suelen ser superficiales o temporales", "Que debes conocerte antes de relacionarte con otros", "Que el pasado determina el futuro"],
      1, "Sin autoconocimiento, cambias comportamientos superficialmente sin modificar los patrones subyacentes. Conocer tus emociones, valores y mecanismos de defensa es el punto de partida del cambio real."),
  ],
};

export function getImprovementQuestionsForConcepts(
  concepts: string[],
  count = 3,
): ChallengeQuestion[] {
  const pool: ChallengeQuestion[] = [];
  for (const concept of concepts) {
    const qs = IMPROVEMENT_BY_CONCEPT[concept] ?? [];
    pool.push(...qs);
  }
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

export function getImprovementQuestionsForChallenge(
  challengeId: string,
  count = 3,
): ChallengeQuestion[] {
  const pool = IMPROVEMENT_BY_CHALLENGE[challengeId] ?? [];
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}
