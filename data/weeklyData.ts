import { P_AMBER, P_GOLD, P_SLATE, P_TEAL } from "@/constants/theme";
import { Challenge } from "@/types/challenges";

export const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: "adivina_concepto",
    title: "Adivina el concepto",
    emoji: require("@/assets/svg/tech1.svg"),
    color: P_TEAL.fg,
    borderColor: P_TEAL.fg,
    questions: [
      {
        id: "ac1",
        statement:
          "María siempre dice que sí a todo lo que le piden, aunque esté agotada, por miedo a decepcionar a los demás. ¿Qué describe mejor esta situación?",
        options: [
          "Límite sano",
          "Dificultad para poner límites",
          "Comunicación asertiva",
          "Autoconocimiento",
        ],
        correctIndex: 1,
        explanation:
          "Decir sí compulsivamente por miedo al rechazo es una señal de falta de límites. Poner límites es un acto de autocuidado, no de egoísmo.",
      },
      {
        id: "ac2",
        statement:
          "Pedro expresó calmamente a su compañero: 'Cuando interrumpes mis reuniones me cuesta concentrarme. Me ayudaría que lo comentáramos primero.' ¿Qué habilidad usó?",
        options: [
          "Manipulación",
          "Pasividad",
          "Comunicación asertiva",
          "Agresividad",
        ],
        correctIndex: 2,
        explanation:
          "La comunicación asertiva permite expresar necesidades y sentimientos con claridad y respeto, sin atacar ni someterse. Es una de las habilidades más valiosas para las relaciones sanas.",
      },
      {
        id: "ac3",
        statement:
          "Ana está convencida de que su jefe está enojado con ella, pero en realidad es ella quien está frustrada y lo proyecta en él. ¿Qué mecanismo psicológico ocurre aquí?",
        options: ["Negación", "Proyección", "Racionalización", "Represión"],
        correctIndex: 1,
        explanation:
          "La proyección es atribuir inconscientemente a otros los propios sentimientos o impulsos que no queremos reconocer en nosotros mismos. Es un mecanismo de defensa muy común.",
      },
      {
        id: "ac4",
        statement:
          "Después de cometer un error, Luis se dice: 'Fue difícil, cometí un error, y eso es humano. ¿Qué puedo aprender de esto?' ¿Qué está practicando?",
        options: ["Autocompasión", "Negación", "Perfeccionismo", "Autoexigencia excesiva"],
        correctIndex: 0,
        explanation:
          "La autocompasión es tratarse con la misma amabilidad que tendrías con un amigo cuando comete un error. No es excusa para no mejorar; es el punto de partida para hacerlo.",
      },
      {
        id: "ac5",
        statement:
          "Camila le dijo a su pareja: 'Necesito tiempo para mí los domingos por la tarde. Es importante para mí recargar energía.' Su pareja lo respetó. ¿Qué estableció Camila?",
        options: [
          "Un límite sano",
          "Una conducta egoísta",
          "Dependencia emocional",
          "Aislamiento",
        ],
        correctIndex: 0,
        explanation:
          "Un límite sano comunica claramente lo que necesitas sin agredir. Nedra Tawwab lo define como la forma en que le dices a los demás cómo quieres ser tratado, y es fundamental para el bienestar.",
      },
    ],
  },

  {
    id: "identifica_patron",
    title: "Identifica el patrón",
    emoji: require("@/assets/svg/tech2.svg"),
    color: P_AMBER.fg,
    borderColor: P_AMBER.fg,
    questions: [
      {
        id: "ip1",
        statement:
          "Marco le dice a Laura 'No me importa, haz lo que quieras' pero después la ignora todo el día y responde con monosílabos. ¿Qué patrón muestra Marco?",
        options: [
          "Comunicación asertiva",
          "Comunicación pasivo-agresiva",
          "Escucha activa",
          "Límite sano",
        ],
        correctIndex: 1,
        explanation:
          "La comunicación pasivo-agresiva evita el conflicto directo pero lo expresa de forma indirecta: silencios, frialdad, respuestas cortantes. No resuelve el problema; lo prolonga.",
      },
      {
        id: "ip2",
        statement:
          "Sofía piensa: 'Nunca hago nada bien', 'Siempre me equivoco', 'Jamás voy a mejorar'. ¿Cuál es el patrón de pensamiento?",
        options: [
          "Pensamiento realista",
          "Autoconocimiento",
          "Generalización excesiva",
          "Reflexión constructiva",
        ],
        correctIndex: 2,
        explanation:
          "La generalización excesiva usa palabras absolutas como 'nunca', 'siempre', 'jamás' para sacar conclusiones globales de eventos aislados. Es un patrón cognitivo que distorsiona la realidad.",
      },
      {
        id: "ip3",
        statement:
          "Cuando su amigo cancela planes, Diego se lo toma como señal de que ya no le importa y empieza a alejarse sin decir nada. ¿Qué patrón ocurre?",
        options: [
          "Comunicación directa",
          "Interpretación catastrófica sin verificar",
          "Límite sano",
          "Escucha activa",
        ],
        correctIndex: 1,
        explanation:
          "Sacar conclusiones negativas sin verificarlas ni comunicarlas genera distancia innecesaria. La forma sana es preguntar directamente en lugar de asumir la peor interpretación.",
      },
      {
        id: "ip4",
        statement:
          "Cuando algo sale mal, Valeria no dice nada en el momento pero luego le cuenta a otras personas lo que le molestó, en lugar de hablar con quien corresponde. ¿Qué patrón es?",
        options: [
          "Comunicación indirecta",
          "Asertividad",
          "Empatía profunda",
          "Escucha activa",
        ],
        correctIndex: 0,
        explanation:
          "Comunicar el malestar a terceros en lugar de a la persona involucrada es comunicación indirecta. Aunque alivia en el corto plazo, no resuelve el conflicto y puede generar más tensión.",
      },
    ],
  },

  {
    id: "verdad_mito",
    title: "Mitos del bienestar",
    emoji: require("@/assets/svg/tech3.svg"),
    color: P_GOLD.fg,
    borderColor: P_GOLD.fg,
    questions: [
      {
        id: "vm1",
        statement: "Poner límites en una relación es un acto de egoísmo.",
        options: ["Verdad", "Mito"],
        correctIndex: 1,
        explanation:
          "Los límites son una forma de autocuidado y comunicación sana, no de egoísmo. Nedra Tawwab explica que los límites protegen el bienestar propio y mejoran las relaciones.",
      },
      {
        id: "vm2",
        statement:
          "La terapia psicológica es solo para personas con enfermedades mentales graves.",
        options: ["Verdad", "Mito"],
        correctIndex: 1,
        explanation:
          "Cualquier persona puede beneficiarse de la terapia. Es un espacio para crecer, conocerse mejor, mejorar relaciones o atravesar momentos difíciles, no solo para tratar diagnósticos clínicos.",
      },
      {
        id: "vm3",
        statement:
          "Expresar emociones como la tristeza o el miedo es una señal de debilidad.",
        options: ["Verdad", "Mito"],
        correctIndex: 1,
        explanation:
          "Reconocer y expresar emociones requiere valentía y autoconocimiento. La inteligencia emocional —que incluye expresar lo que sentimos— está relacionada con mayor bienestar y relaciones más sanas.",
      },
      {
        id: "vm4",
        statement:
          "La felicidad es un estado permanente que se alcanza cuando tienes todo en orden.",
        options: ["Verdad", "Mito"],
        correctIndex: 1,
        explanation:
          "La felicidad es una experiencia temporal y variable, no un destino fijo. James Allen señala que el bienestar surge del estado interno de la mente, no de las circunstancias externas.",
      },
      {
        id: "vm5",
        statement:
          "El perdón beneficia principalmente a quien perdona, no a quien cometió el error.",
        options: ["Verdad", "Mito"],
        correctIndex: 0,
        explanation:
          "Perdonar libera el resentimiento propio, no necesariamente absuelve al otro. El perdón es un proceso interno que reduce el peso emocional y mejora el bienestar de quien perdona.",
      },
    ],
  },

  {
    id: "completa_reflexion",
    title: "Completa la reflexión",
    emoji: require("@/assets/svg/tech8.svg"),
    color: P_SLATE.fg,
    borderColor: P_SLATE.fg,
    questions: [
      {
        id: "cr1",
        statement: "Completa esta idea de James Allen: 'Un hombre es literalmente lo que ___, su carácter siendo la suma de todos sus pensamientos.'",
        options: ["piensa", "siente", "dice", "hace"],
        correctIndex: 0,
        explanation:
          "En 'Como el Hombre Piensa', James Allen sostiene que los pensamientos moldean el carácter y el destino. Cambiar el pensamiento es el primer paso para cambiar la vida.",
      },
      {
        id: "cr2",
        statement: "La comunicación asertiva te permite expresar lo que sientes y necesitas sin ___ a los demás.",
        options: ["atacar", "escuchar", "respetar", "ayudar"],
        correctIndex: 0,
        explanation:
          "La asertividad busca el equilibrio entre expresar las propias necesidades y respetar las del otro. Decir lo que sientes sin atacar ni someterte es la base de toda relación sana.",
      },
      {
        id: "cr3",
        statement: "Según Nedra Tawwab, los límites son una expresión de ___ propio, no de rechazo hacia los demás.",
        options: ["amor", "enojo", "miedo", "indiferencia"],
        correctIndex: 0,
        explanation:
          "En 'Pon límites, encuentra la paz', Tawwab explica que establecer límites es una forma de amor propio. Protegen tu energía, tu tiempo y tus valores sin necesitar la aprobación de los demás.",
      },
      {
        id: "cr4",
        statement: "El ___ es el primer paso hacia el cambio personal: sin conocerte, no puedes transformarte.",
        options: ["autoconocimiento", "éxito", "esfuerzo", "talento"],
        correctIndex: 0,
        explanation:
          "Conocerse a uno mismo —fortalezas, limitaciones, emociones, patrones— es la base del crecimiento personal. Sin autoconocimiento, los cambios suelen ser superficiales o temporales.",
      },
    ],
  },
];
