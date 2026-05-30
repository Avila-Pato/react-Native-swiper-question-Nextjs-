import { Dimensions } from "react-native";

export const { width: W, height: H } = Dimensions.get("window");

export const NODE_RADIUS      = 38;
export const FUSION_THRESHOLD = NODE_RADIUS + 10;
export const NODE_Y           = H * 0.4;
export const NODE_A           = { x: W * 0.2, y: NODE_Y };
export const NODE_B_INIT      = { x: W * 0.8, y: NODE_Y };
export const INIT_LEN         = Math.sqrt(
  (NODE_B_INIT.x - NODE_A.x) ** 2 + (NODE_B_INIT.y - NODE_A.y) ** 2,
);

export const GRADIENT_COLORS = ["#E6EBF0", "#F0F5FA", "#E8F0F7", "#EDF3F9"] as const;

export type VinculoItem = {
  id: string; label: string; tagline: string;
  author: string; authorRole: string; authorQuote: string;
  reflection: string; zenAction: string;
};

export const VINCULOS: VinculoItem[] = [
  { id: "v1", label: "Mi pareja", tagline: "El vínculo más íntimo", author: "Esther Perel", authorRole: "El deseo y la intimidad en pareja", authorQuote: "El amor es un verbo, no un estado. Lo que sientes por tu pareja lo construyes cada día con tus actos, no con tus expectativas.", reflection: "Según Perel, la distancia que percibes en tu pareja suele ser el espejo de tu propia dificultad para sostener la intimidad sin perder el yo. Lo que exiges fuera —presencia, atención, deseo— es aquello que tú mismo evitas darle a la relación cuando el miedo aparece.", zenAction: "Hoy le daré 10 minutos de presencia real: sin pantallas, solo escuchando. Lo que quiero recibir, primero lo ofreceré." },
  { id: "v2", label: "Mi hijo/a", tagline: "El vínculo más puro", author: "John Bowlby", authorRole: "Teoría del apego · Psiquiatra británico", authorQuote: "Lo que un niño necesita, antes que cualquier otra cosa, es un lugar seguro desde el cual explorar el mundo. Tú eres ese lugar.", reflection: "Bowlby demostró que la ansiedad de un padre por el futuro de su hijo/a nace del propio sistema de apego no resuelto. El control excesivo no protege al niño —reproduce el miedo del adulto. La base segura que no recibiste, puedes construirla siendo tú esa base para él/ella.", zenAction: "Hoy le daré un espacio de autonomía sin intervenir. Confiar en él/ella empieza por confiar en lo que le he transmitido." },
  { id: "v3", label: "Mi mejor amigo/a", tagline: "El vínculo elegido", author: "Brené Brown", authorRole: "Investigadora de la vulnerabilidad y la pertenencia", authorQuote: "La conexión verdadera es imposible sin vulnerabilidad. Y la vulnerabilidad empieza por mostrarte tal como eres, no como crees que deberías ser.", reflection: "Brown encontró que la queja sobre el amigo/a que no da lo suficiente casi siempre esconde el miedo propio a ser el primero en dar sin garantías. Exigir reciprocidad sin arriesgarse primero es una forma de protegerse de la intimidad real.", zenAction: "Hoy iniciaré el contacto sin esperar que me llamen. Seré el primero en mostrarme —sin calcular si recibiré lo mismo a cambio." },
  { id: "v4", label: "Mis padres", tagline: "El vínculo que me formó", author: "Amir Levine", authorRole: "Maneras de amar · Estilos de apego en adultos", authorQuote: "Tu estilo de apego no es un defecto de carácter. Es una estrategia que tu sistema nervioso aprendió de niño para sobrevivir en el entorno que tenías.", reflection: "Levine explica que el resentimiento hacia los padres surge cuando el sistema de apego ansioso o evitativo —formado en la infancia— sigue activo en el adulto. No es sobre ellos: es sobre el patrón que aprendiste. Reconocerlo no los absuelve, pero te libera a ti.", zenAction: "Hoy me doy la validación que esperaba de ellos. Me digo: 'Hice lo que pude con lo que tenía. Eso fue suficiente.'" },
  { id: "v5", label: "Un colega", tagline: "El vínculo del entorno", author: "Walter Riso", authorRole: "Apego emocional y límites saludables", authorQuote: "Desapegarse no significa dejar de querer. Significa dejar de necesitar que las cosas sean de una manera determinada para sentirte bien.", reflection: "Riso señala que la incomodidad con un colega casi siempre refleja una comparación interna no resuelta. Lo que envidias o criticas en él/ella es una proyección de aquello que deseas para ti y aún no te has permitido. El problema no es el colega —es el juez interno que te compara.", zenAction: "Hoy reconoceré un logro de ese colega sin compararlo con el mío. La abundancia compartida no me resta —amplía el espacio donde yo también puedo crecer." },
];

export const INTRO_AUTHORS = [
  { name: "Esther Perel",  role: "Pareja · Deseo e intimidad",            bio: "Terapeuta y escritora belga. Autora de Mating in Captivity. Referente mundial sobre erotismo, intimidad y dinámicas de poder en la pareja moderna." },
  { name: "Brené Brown",   role: "Amistad · Vulnerabilidad y pertenencia", bio: "Investigadora y profesora en la Universidad de Houston. Su estudio de 20 años sobre la vergüenza y la conexión humana la convirtió en una de las voces más influyentes del bienestar emocional." },
  { name: "Amir Levine",   role: "Padres · Estilos de apego en adultos",   bio: "Psiquiatra y neurocientífico israelí-americano. Coautor de Attached. Aplica la teoría del apego de Bowlby a las relaciones adultas con base en investigación clínica." },
  { name: "Walter Riso",   role: "Colega · Apego emocional y límites",     bio: "Psicólogo clínico colombo-italiano. Autor de más de 30 libros sobre bienestar, apego y amor propio. Figura central en la psicología popular latinoamericana." },
];

export const BG_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  x: (i * 71 + 23) % (W - 10),
  size: (i % 3) + 1,
  duration: 16000 + ((i * 1300) % 9000),
  delay: (i * 800) % 7000,
  color: i % 2 === 0 ? "rgba(180,215,255,0.5)" : "rgba(210,230,250,0.4)",
}));

export const FUSION_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 37 + 15) % (W - 10),
  size: (i % 4) + 2,
  duration: 2600 + ((i * 280) % 1400),
  delay: i * 70,
  color: i % 3 === 0 ? "rgba(180,215,255,0.95)" : i % 3 === 1 ? "rgba(255,255,255,0.9)" : "rgba(160,200,240,0.85)",
}));
