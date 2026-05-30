import { Dimensions } from "react-native";

export const { width: W, height: H } = Dimensions.get("window");
export const MIRROR_H = 230;
export const PROGRESS_W = W - 44;

export const ROWS = 3;
export const COLS = 3;
export const TOTAL_CELLS = ROWS * COLS;
export const REQUIRED_CLEARED = Math.ceil(TOTAL_CELLS * 0.8);

export const GRADIENT_COLORS = ["#E8ECEF", "#F4F7FA", "#EBF2F8", "#F0F4F8"] as const;

export type MirrorItem = { id: string; situation: string; mirrorLaw: string; zenAction: string };

export const MIRROR_DATA: MirrorItem[] = [
  { id: "m1", situation: "Me frustra que los demás no valoren mi tiempo ni mi trabajo", mirrorLaw: "El espejo te muestra que tú no estás valorando tu propio tiempo. Buscas fuera el respeto que tú mismo te niegas.", zenAction: "Hoy estableceré un límite claro para mi tiempo y celebraré mis avances sin esperar el aplauso ajeno." },
  { id: "m2", situation: "Me molesta que las personas no sean honestas conmigo", mirrorLaw: "¿Hay una verdad que tú mismo no te estás diciendo? La honestidad que exiges fuera es la que te niegas adentro.", zenAction: "Hoy me diré una verdad incómoda que he estado evitando. La honradez empieza en el diálogo conmigo mismo." },
  { id: "m3", situation: "Siento que nadie me escucha de verdad cuando hablo", mirrorLaw: "El espejo pregunta: ¿cuándo fue la última vez que te escuchaste a ti? ¿Que le prestaste atención a tu propia voz interior sin juzgarla?", zenAction: "Dedicaré 10 minutos diarios a escribir sin censura lo que siento. Primero escucharme a mí." },
  { id: "m4", situation: "Me irrita que la gente sea tan egoísta e indiferente", mirrorLaw: "El espejo muestra una necesidad tuya sin atender. Lo que llamas egoísmo en otros puede ser el permiso que tú nunca te das.", zenAction: "Hoy haré algo solo para mí, sin culpa y sin justificarlo ante nadie. Cuidarme no es egoísmo." },
  { id: "m5", situation: "Nadie confía en mi criterio ni en mis decisiones", mirrorLaw: "El espejo pregunta: ¿confías tú en tu propio criterio? Buscas en otros la validación que tú mismo no te otorgas.", zenAction: "Tomaré una decisión importante hoy basándome solo en mi criterio, sin consultar ni esperar aprobación." },
  { id: "m6", situation: "Me frustra que las personas no cumplen sus promesas", mirrorLaw: "El espejo muestra los compromisos que tú has hecho contigo mismo y no has cumplido. La exigencia externa refleja la interna.", zenAction: "Elegiré un compromiso conmigo mismo que llevo postergando y lo cumpliré hoy, aunque sea en pequeño." },
];

export const BG_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 53 + 19) % (W - 10),
  size: (i % 3) + 1,
  duration: 14000 + ((i * 1100) % 8000),
  delay: (i * 900) % 7000,
  color: i % 3 === 0 ? "rgba(180,215,255,0.65)" : i % 3 === 1 ? "rgba(220,235,255,0.5)" : "rgba(200,220,250,0.45)",
}));

export const REVEAL_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: (i * 41 + 11) % (W - 10),
  size: (i % 4) + 2,
  duration: 3800 + ((i * 400) % 1800),
  delay: i * 120,
  color: i % 2 === 0 ? "rgba(200,230,255,0.9)" : "rgba(255,255,255,0.85)",
}));
