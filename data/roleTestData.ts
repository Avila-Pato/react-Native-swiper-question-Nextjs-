import { RoleInfo, RoleQuestion } from "@/types/roleTest";

export const ROLES: RoleInfo[] = [
  {
    key: "limites",
    label: "Límites",
    emoji: "🛡️",
    color: "#7C3AED",
    description: "Tu área principal de crecimiento es aprender a comunicar y sostener límites sanos. Decir no sin culpa, proteger tu energía y expresar tus necesidades son tus próximos pasos más importantes.",
    stack: "Nedra Tawwab · Comunicación asertiva · Autorespeto · Límites físicos y emocionales",
  },
  {
    key: "autoconocimiento",
    label: "Autoconocimiento",
    emoji: "🔍",
    color: "#0284C7",
    description: "Tu impulso natural es entenderte a ti mismo: por qué piensas, sientes y actúas como lo haces. La introspección, la terapia y el trabajo interior son tus herramientas más poderosas.",
    stack: "Psicología profunda · Journaling · Mindfulness · Trabajo con sombra · Terapia",
  },
  {
    key: "vinculos",
    label: "Vínculos",
    emoji: "🤝",
    color: "#4D8B7A",
    description: "Las relaciones son tu centro. Buscas conexiones genuinas, profundas y recíprocas. Tu camino pasa por mejorar cómo te comunicas, escuchas y te vinculas con las personas que importan.",
    stack: "Apego seguro · Escucha activa · Comunicación emocional · Relaciones sanas",
  },
  {
    key: "felicidad",
    label: "Felicidad",
    emoji: "☀️",
    color: "#F59E0B",
    description: "Buscas el bienestar cotidiano: esa sensación de que la vida vale y tiene color. Gratitud, mindfulness y hábitos positivos son tus herramientas principales para florecer cada día.",
    stack: "Psicología positiva · Gratitud · Mindfulness · James Allen · Hábitos de bienestar",
  },
  {
    key: "proposito",
    label: "Propósito",
    emoji: "🧭",
    color: "#7B6BB5",
    description: "Necesitas un 'para qué' claro que guíe tus decisiones. Clarificar tus valores, definir tu visión de vida y actuar desde el significado son tus próximos grandes pasos.",
    stack: "Ikigai · Valores personales · Viktor Frankl · Visión de vida · Toma de decisiones",
  },
];

// 20 preguntas: 16 Likert + 4 choice (en posiciones 5, 10, 15, 20)
export const QUESTIONS: RoleQuestion[] = [
  // Q1–Q4: una por perfil (Likert)
  { id: 1, type: "likert", role: "limites",        text: "Me cuesta decir no, incluso cuando sé que decir sí me afectará negativamente." },
  { id: 2, type: "likert", role: "autoconocimiento", text: "Me interesa entender por qué pienso, siento y actúo de la forma en que lo hago." },
  { id: 3, type: "likert", role: "vinculos",       text: "Las relaciones significativas son una de las cosas que más le dan sentido a mi vida." },
  { id: 4, type: "likert", role: "felicidad",      text: "Busco activamente pequeñas cosas cotidianas que me generen alegría o gratitud." },

  // Q5: CHOICE #1
  {
    id: 21, type: "choice",
    text: "¿Cuál de estas situaciones te genera más inquietud o resonancia?",
    options: [
      { text: "Que las personas de mi entorno no respetan mis tiempos o necesidades",      role: "limites" },
      { text: "No entender bien por qué reacciono de cierta forma bajo presión",           role: "autoconocimiento" },
      { text: "Sentir que mis relaciones más importantes no son tan profundas como quisiera", role: "vinculos" },
      { text: "Hacer muchas cosas pero sentir que nada tiene suficiente significado",      role: "proposito" },
    ],
  },

  // Q6–Q9
  { id: 5,  type: "likert", role: "limites",        text: "Frecuentemente termino haciendo cosas que no quería hacer por no saber cómo negarme." },
  { id: 6,  type: "likert", role: "autoconocimiento", text: "Cuando algo me afecta emocionalmente, necesito entender exactamente qué lo causó." },
  { id: 7,  type: "likert", role: "felicidad",      text: "Creo que el bienestar cotidiano tiene más que ver con la mentalidad que con las circunstancias." },
  { id: 8,  type: "likert", role: "proposito",      text: "Necesito sentir que lo que hago tiene un impacto o significado más allá de mí mismo." },

  // Q10: CHOICE #2
  {
    id: 22, type: "choice",
    text: "¿Qué te gustaría trabajar más en este momento de tu vida?",
    options: [
      { text: "Aprender a poner límites sin sentir culpa ni conflicto",               role: "limites" },
      { text: "Entender mejor mis patrones emocionales y de comportamiento",          role: "autoconocimiento" },
      { text: "Mejorar la calidad de mis conversaciones y conexiones con otros",      role: "vinculos" },
      { text: "Encontrar qué actividades me dan más energía y sentido",               role: "felicidad" },
    ],
  },

  // Q11–Q14
  { id: 10, type: "likert", role: "vinculos",       text: "Soy de las personas que dan mucha importancia a la profundidad de sus amistades." },
  { id: 11, type: "likert", role: "autoconocimiento", text: "Prácticas como la meditación, el journaling o la terapia me parecen valiosas." },
  { id: 12, type: "likert", role: "felicidad",      text: "Practicar la gratitud o el mindfulness me genera un impacto real en mi día a día." },
  { id: 9,  type: "likert", role: "limites",        text: "A veces me siento resentido/a con personas a quienes nunca les dije cómo me afectaban." },

  // Q15: CHOICE #3
  {
    id: 23, type: "choice",
    text: "¿Cuál de estos escenarios te genera más energía si imaginas que lo estás viviendo?",
    options: [
      { text: "Tener una conversación difícil pero honesta con alguien importante",   role: "limites" },
      { text: "Identificar exactamente qué emoción siento en un momento difícil",     role: "autoconocimiento" },
      { text: "Conectar profundamente con alguien en una conversación inesperada",    role: "vinculos" },
      { text: "Definir claramente qué tipo de vida quiero construir de aquí a 5 años", role: "proposito" },
    ],
  },

  // Q16–Q19
  { id: 16, type: "likert", role: "vinculos",       text: "Cuando alguien atraviesa algo difícil, mi instinto es estar presente y escuchar." },
  { id: 17, type: "likert", role: "proposito",      text: "Siento que necesito un 'para qué' claro para sostener el esfuerzo en lo que hago." },
  { id: 14, type: "likert", role: "felicidad",      text: "Me gusta observar mis hábitos y ajustarlos hacia una vida más plena y satisfactoria." },
  { id: 19, type: "likert", role: "proposito",      text: "Me pregunto con frecuencia si estoy viviendo de acuerdo con lo que realmente valoro." },

  // Q20: CHOICE #4 (última pregunta)
  {
    id: 24, type: "choice",
    text: "Si pudieras hacer un proceso de crecimiento personal este año, ¿cuál elegirías?",
    options: [
      { text: "Un taller de comunicación asertiva y puesta de límites",               role: "limites" },
      { text: "Un proceso de terapia o retiro de autoexploración profunda",            role: "autoconocimiento" },
      { text: "Un espacio de conexión genuina: círculos de conversación o grupos de apoyo", role: "vinculos" },
      { text: "Un proceso de clarificación de propósito y valores de vida",            role: "proposito" },
    ],
  },
];
