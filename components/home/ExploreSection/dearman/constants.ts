import { Dimensions } from "react-native";

export const { width: W, height: H } = Dimensions.get("window");

export const GRADIENT_COLORS = ["#F4EBE0", "#FDF5EE", "#EDE8F5", "#F7EFF5"] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContextKey = "profesional" | "interpersonal" | "bienestar";

export type Trigger = {
  id: string;
  tag: string;
  fearResponse: string;
  nedraPhrase: string;
  nedraAction: string;
};

// ─── Contexts ─────────────────────────────────────────────────────────────────

export const CONTEXTS: { key: ContextKey; label: string; icon: number }[] = [
  { key: "profesional",   label: "Profesional",   icon: require("@/assets/icons/ctx_profesional.svg") },
  { key: "interpersonal", label: "Interpersonal",  icon: require("@/assets/icons/ctx_interpersonal.svg") },
  { key: "bienestar",     label: "Bienestar",      icon: require("@/assets/icons/ctx_bienestar.svg") },
];

export const INTROS: Record<ContextKey, {
  quote: string; author: string; book: string; body: string;
  headerTag: string; switchLabel: string;
}> = {
  profesional: {
    quote: "«Los límites saludables en el trabajo no son paredes que te aíslan — son las reglas del juego que hacen posible la colaboración real.»",
    author: "Henry Cloud",
    book: "Límites",
    body: "En el entorno profesional, un límite claro no es un acto de egoísmo. Es lo que separa el compromiso genuino del agotamiento crónico. Aquí aprenderás a decir no sin culpa y sí con intención.",
    headerTag: "LÍMITES · HENRY CLOUD",
    switchLabel: "Límite Cloud",
  },
  interpersonal: {
    quote: "«Cuando defines qué eres responsable de hacer — y qué no — liberas la relación del resentimiento acumulado.»",
    author: "John Townsend",
    book: "Límites",
    body: "Las relaciones más sanas no son las más cómodas — son las más honestas. Aquí identificarás qué dinámicas te están costando más de lo que te están dando.",
    headerTag: "LÍMITES · JOHN TOWNSEND",
    switchLabel: "Límite Townsend",
  },
  bienestar: {
    quote: "«Atreverse a poner límites es tener el coraje de amarnos a nosotros mismos, aunque arriesguemos decepcionar a otros.»",
    author: "Brené Brown",
    book: "Los dones de la imperfección",
    body: "Cuidarte no es un lujo ni una debilidad. Es el acto más responsable que puedes hacer — porque desde el agotamiento no puedes estar presente para nadie, ni para ti.",
    headerTag: "LÍMITES · BRENÉ BROWN",
    switchLabel: "Límite Brené",
  },
};

// ─── Triggers ─────────────────────────────────────────────────────────────────

export const NEDRA_DATA: Record<ContextKey, Trigger[]> = {
  profesional: [
    {
      id: "p1", tag: "Respondo a cualquier hora",
      fearResponse: "Ok, lo veo ahora mismo... (responde a las 11PM mientras acumula resentimiento)",
      nedraPhrase: "Lo que está fuera de mi horario laboral está fuera de mi cerca. No voy a entrar.",
      nedraAction: "Voy a silenciar notificaciones de trabajo después de las 7PM, sin excepciones.",
    },
    {
      id: "p2", tag: "Asumo lo que no me corresponde",
      fearResponse: "Sí, claro que puedo con eso también... (toma responsabilidad de resultados ajenos)",
      nedraPhrase: "Cada quien carga su propio peso. Este no es el mío y no lo voy a levantar.",
      nedraAction: "Voy a delimitarlo por escrito antes de que se convierta en una expectativa.",
    },
    {
      id: "p3", tag: "No puedo decirle no a mi jefe",
      fearResponse: "Claro, lo hago yo... (acepta sin clarificar y luego no cumple bien ninguna tarea)",
      nedraPhrase: "Puedo respetar la autoridad y aun así señalar cuándo algo no es viable.",
      nedraAction: "Voy a pedir una reunión para reorganizar prioridades con criterio real.",
    },
    {
      id: "p4", tag: "La urgencia ajena maneja mi día",
      fearResponse: "Termino esto y te atiendo... (pierde el hilo de su propio trabajo una y otra vez)",
      nedraPhrase: "Su urgencia no es automáticamente la mía. Yo decido qué entra en mi agenda.",
      nedraAction: "Voy a bloquear tiempo de trabajo profundo y no abrirlo a interrupciones.",
    },
  ],
  interpersonal: [
    {
      id: "i1", tag: "Me siento culpable al decir no",
      fearResponse: "Bueno... esta vez sí lo hago... (la culpa gana de nuevo sin que nadie la cuestionara)",
      nedraPhrase: "Sentir culpa no significa que hice algo malo. Es una señal vieja, no una verdad.",
      nedraAction: "Voy a sostener el no aunque la incomodidad llegue, sin dar explicaciones largas.",
    },
    {
      id: "i2", tag: "Cargo con sus emociones",
      fearResponse: "Cuéntame todo, aquí estoy... (rescata otra vez lo que ella/él debería gestionar)",
      nedraPhrase: "Sus sentimientos son suyos. No soy responsable de administrarlos ni de resolverlos.",
      nedraAction: "Voy a escuchar sin rescatar y a poner un límite de tiempo en estas conversaciones.",
    },
    {
      id: "i3", tag: "Cedo para evitar el conflicto",
      fearResponse: "Sí, tienes razón... (cede aunque no lo crea, y el resentimiento se acumula)",
      nedraPhrase: "Evitar el conflicto no es paz — es resentimiento diferido. Prefiero la honestidad.",
      nedraAction: "Voy a decir lo que pienso con calma, aunque incomode, sin pedir disculpas por ello.",
    },
    {
      id: "i4", tag: "Me quedo por miedo a su reacción",
      fearResponse: "No quiero que se enoje... (permanece en algo dañino para no afrontar la reacción)",
      nedraPhrase: "Su reacción a mi límite es información sobre ellos, no una sentencia sobre mí.",
      nedraAction: "Voy a tomar la decisión que necesito, independientemente de cómo lo reciban.",
    },
  ],
  bienestar: [
    {
      id: "b1", tag: "Descansar me genera culpa",
      fearResponse: "Termino esto y descanso... (todo nunca termina y el cuerpo empieza a fallar)",
      nedraPhrase: "El descanso no es un premio al mérito — es parte de vivir con todo el corazón.",
      nedraAction: "Voy a tomar este tiempo ahora, sin justificarlo y sin pedir permiso.",
    },
    {
      id: "b2", tag: "Necesito que me aprueben",
      fearResponse: "¿Estuvo bien? ¿Estoy siendo suficiente?... (espera validación antes de avanzar)",
      nedraPhrase: "Soy suficiente ahora mismo — no cuando los demás lo confirmen.",
      nedraAction: "Voy a tomar una decisión hoy sin consultar si estuvo bien.",
    },
    {
      id: "b3", tag: "El perfeccionismo me paraliza",
      fearResponse: "Cuando esté listo de verdad, lo comparto... (lleva semanas detenida por miedo al juicio)",
      nedraPhrase: "El perfeccionismo no es excelencia — es miedo disfrazado de estándares altos.",
      nedraAction: "Voy a avanzar con lo que tengo hoy, imperfecto y real.",
    },
    {
      id: "b4", tag: "La vergüenza me hace callar",
      fearResponse: "No lo digo para que no piensen mal de mí... (el silencio alimenta la vergüenza)",
      nedraPhrase: "La vergüenza crece en el silencio. Hablar de esto le quita poder sobre mí.",
      nedraAction: "Voy a contárselo a alguien de confianza esta semana, sin editar la historia.",
    },
  ],
};

// ─── Particles ────────────────────────────────────────────────────────────────

export const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 53 + 19) % (W - 10),
  size: (i % 4) + 2,
  duration: 10000 + ((i * 900) % 6000),
  delay: (i * 700) % 5000,
}));
