import { ChallengeQuestion } from "@/types/challenges";
import { ImageSourcePropType } from "react-native";
const q = (
  id: string,
  statement: string,
  correctIndex: number,
  explanation: string,
): ChallengeQuestion => ({
  id,
  statement,
  options: ["Verdad", "Mito"],
  correctIndex,
  explanation,
});

export type VerdadMitoTopic = {
  id: string;
  title: string;
  description: string;
  color: string;
  bg: string;
  icon: ImageSourcePropType;
  questions: ChallengeQuestion[];
};

export const VERDAD_MITO_TOPICS: VerdadMitoTopic[] = [
  {
    id: "vm_limites",
    title: "Límites",
    description: "Mitos sobre poner límites en las relaciones",
    color: "#7C3AED",
    bg: "#EDE9FE",
    icon: require("@/assets/icons/Documentation.svg"),
    questions: [
      q("vml1", "Poner límites es un acto egoísta.", 1,
        "Los límites son una forma de autocuidado y comunicación honesta. Nedra Tawwab explica que protegen el bienestar propio sin necesitar lastimar a los demás."),
      q("vml2", "Los límites sanos pueden mejorar la calidad de las relaciones.", 0,
        "Cuando comunicas claramente lo que aceptas y lo que no, reduces el resentimiento y construyes relaciones más honestas y duraderas."),
      q("vml3", "Si alguien no respeta tus límites, eres tú quien debe ceder.", 1,
        "Si un límite es ignorado repetidamente, la responsabilidad no es tuya. Ceder refuerza que tu límite no importa. Puedes mantenerlo con firmeza y amabilidad."),
      q("vml4", "Los límites siempre se comunican con enojo o conflicto.", 1,
        "Los límites pueden expresarse con calma, afecto y claridad. La forma en que los comunicas es parte de lo que los hace efectivos o no."),
      q("vml5", "Los límites rígidos —nunca excepciones— son siempre la opción más sana.", 1,
        "Los límites sanos son flexibles según el contexto. Los límites absolutamente rígidos pueden convertirse en muros que aíslan, mientras que los difusos generan confusión."),
    ],
  },
  {
    id: "vm_emociones",
    title: "Emociones",
    description: "Lo real y lo falso sobre la gestión emocional",
    color: "#0284C7",
    bg: "#E0F2FE",
    icon: require("@/assets/icons/Dialog.svg"),
    questions: [
      q("vme1", "La tristeza es una emoción negativa que debemos evitar o suprimir.", 1,
        "La tristeza es una emoción adaptativa que nos señala pérdidas o necesidades no cubiertas. Suprimirla no la elimina; la acumula y puede intensificarla."),
      q("vme2", "Las personas emocionalmente fuertes no lloran ni muestran vulnerabilidad.", 1,
        "La vulnerabilidad es una señal de autenticidad y valentía, no de debilidad. Reconocer y expresar emociones está relacionado con mayor resiliencia y bienestar."),
      q("vme3", "La ansiedad siempre es patológica y debe eliminarse por completo.", 1,
        "Una dosis de ansiedad es adaptativa: nos prepara ante desafíos. Solo se convierte en problema cuando es desproporcionada, persistente e interfiere en la vida cotidiana."),
      q("vme4", "La inteligencia emocional se puede desarrollar con práctica a lo largo de la vida.", 0,
        "A diferencia del CI, la inteligencia emocional es altamente entrenable. Prácticas como la reflexión, la terapia o el mindfulness la fortalecen con el tiempo."),
      q("vme5", "Ignorar las emociones hace que desaparezcan más rápido.", 1,
        "Las emociones ignoradas no desaparecen; se acumulan y suelen emerger de formas más intensas o indirectas. Reconocerlas y procesarlas es la vía más efectiva."),
    ],
  },
  {
    id: "vm_autoestima",
    title: "Autoestima",
    description: "Verdades y mitos sobre quererte a ti mismo",
    color: "#4D8B7A",
    bg: "#E8F0EE",
    icon: require("@/assets/icons/Approval.svg"),
    questions: [
      q("vma1", "La autoestima alta significa pensar que eres mejor que los demás.", 1,
        "La autoestima sana implica reconocer tu valor sin necesitar compararte ni disminuir a otros. No es superioridad; es una valoración interna estable de uno mismo."),
      q("vma2", "La autoestima se forma principalmente en la infancia, pero puede cambiar a lo largo de la vida.", 0,
        "Aunque las bases de la autoestima se construyen en la infancia, puede desarrollarse y fortalecerse en cualquier etapa de la vida a través del autoconocimiento y el trabajo interno."),
      q("vma3", "Criticarte duramente a ti mismo te hace mejorar más rápido.", 1,
        "La autocrítica severa suele generar parálisis, vergüenza y evitación, no mejora. La autocompasión —reconocer el error con amabilidad— es más efectiva para crecer."),
      q("vma4", "El autoconocimiento implica reconocer tanto tus fortalezas como tus áreas de crecimiento.", 0,
        "Conocerse a uno mismo de forma honesta y sin juicio —lo bueno y lo que puede mejorar— es la base del crecimiento personal y de una autoestima realista y sólida."),
      q("vma5", "La autoestima depende principalmente de los logros y el éxito externo.", 1,
        "La autoestima basada solo en logros es frágil: cae cuando llegan los fracasos. La autoestima sana viene de un sentido de valor interno que no depende de los resultados."),
    ],
  },
  {
    id: "vm_comunicacion",
    title: "Comunicación",
    description: "Mitos sobre cómo nos comunicamos",
    color: "#9E5C72",
    bg: "#F5E8EF",
    icon: require("@/assets/icons/Notifications.svg"),
    questions: [
      q("vmc1", "Ser asertivo es lo mismo que ser agresivo o imponer tu opinión.", 1,
        "La asertividad es expresar tus necesidades y opiniones con respeto, sin agredir ni someterte. Es el equilibrio entre la pasividad y la agresividad."),
      q("vmc2", "Escuchar activamente es tan importante como hablar en una conversación.", 0,
        "La escucha activa —prestar atención plena sin interrumpir ni preparar la respuesta— es fundamental para la conexión y la comprensión en cualquier relación."),
      q("vmc3", "Decir 'yo siento...' en lugar de 'tú haces...' puede reducir el conflicto en una discusión.", 0,
        "El lenguaje en primera persona comunica el impacto sin acusar directamente, lo que genera menos defensividad y más apertura para resolver el conflicto."),
      q("vmc4", "La comunicación no verbal no afecta significativamente el mensaje que transmitimos.", 1,
        "El tono de voz, la expresión facial y la postura corporal comunican tanto o más que las palabras. La congruencia entre lo verbal y lo no verbal es clave para la credibilidad."),
      q("vmc5", "Comunicar claramente tus necesidades es una señal de debilidad en una relación.", 1,
        "Expresar necesidades requiere valentía y autoconocimiento. Las relaciones donde ambas personas pueden pedir lo que necesitan son más sanas, honestas y duraderas."),
    ],
  },
  {
    id: "vm_relaciones",
    title: "Relaciones",
    description: "Lo verdadero y lo falso sobre los vínculos",
    color: "#8A7040",
    bg: "#F2ECDD",
    icon: require("@/assets/icons/Information Data.svg"),
    questions: [
      q("vmr1", "Una relación sana no debería tener conflictos.", 1,
        "Los conflictos son inevitables en toda relación cercana. Lo que define la salud de un vínculo es cómo se gestionan: con respeto, escucha y voluntad de resolver."),
      q("vmr2", "La dependencia emocional y el amor profundo son la misma cosa.", 1,
        "El amor sano permite la autonomía de ambas personas. La dependencia emocional genera ansiedad ante la ausencia y dificultad para funcionar de forma independiente."),
      q("vmr3", "El amor romántico no debería requerir esfuerzo ni trabajo constante.", 1,
        "Las relaciones sanas requieren esfuerzo, comunicación y elecciones diarias. La idea de que el amor 'verdadero' es fácil es un mito que genera frustración y abandono prematuro."),
      q("vmr4", "Los vínculos seguros se construyen con consistencia, honestidad y confianza a lo largo del tiempo.", 0,
        "El apego seguro —base de las relaciones sanas— se desarrolla cuando hay presencia consistente, honestidad y confianza mutua. No surge de la intensidad, sino de la constancia."),
      q("vmr5", "Sentirte solo es solo un problema de los introvertidos.", 1,
        "La soledad no depende del tipo de personalidad. Extrovertidos también pueden sentirse profundamente solos. La soledad emocional surge de la falta de conexión significativa, no de la cantidad de personas alrededor."),
    ],
  },
  {
    id: "vm_felicidad",
    title: "Felicidad",
    description: "Verdades sobre el bienestar y los caminos a la felicidad",
    color: "#7B6BB5",
    bg: "#EDE9F8",
    icon: require("@/assets/icons/Speed.svg"),
    questions: [
      q("vmf1", "La felicidad es un estado permanente que se alcanza cuando tienes todo en orden.", 1,
        "La felicidad es transitoria y variable, no un estado fijo. James Allen señala que el bienestar surge del estado interno de la mente, no de las circunstancias externas perfectas."),
      q("vmf2", "El dinero y los logros materiales son la principal fuente de felicidad duradera.", 1,
        "La investigación en bienestar muestra que el dinero aumenta el bienestar hasta cubrir necesidades básicas, pero después el impacto disminuye. Las relaciones, el propósito y la gratitud tienen mayor peso."),
      q("vmf3", "El bienestar incluye tanto el estado físico como el emocional y el social.", 0,
        "La OMS define la salud como bienestar físico, mental y social. Cuidar solo uno de estos aspectos es insuficiente; el bienestar integral requiere atender los tres."),
      q("vmf4", "Practicar la gratitud de forma regular puede mejorar el bienestar mental.", 0,
        "Estudios en psicología positiva muestran que la práctica deliberada de la gratitud activa emociones positivas, reduce el estrés y mejora la perspectiva sobre la propia vida."),
      q("vmf5", "Ser feliz significa nunca sentirse triste, ansioso o frustrado.", 1,
        "El bienestar real convive con toda la gama emocional. Intentar estar feliz todo el tiempo genera más sufrimiento. La clave está en la capacidad de procesar todas las emociones, no en eliminar las difíciles."),
    ],
  },
];
