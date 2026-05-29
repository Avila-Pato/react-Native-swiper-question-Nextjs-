import * as ExpoClipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Check, Copy, Heart, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// ─── Geometría de los nodos ────────────────────────────────────────────────
const NODE_RADIUS = 38;
const FUSION_THRESHOLD = NODE_RADIUS + 10; // distancia de fusión: 48px
const NODE_Y = H * 0.4;
const NODE_A = { x: W * 0.2, y: NODE_Y };
const NODE_B_INIT = { x: W * 0.8, y: NODE_Y };
const INIT_LEN = Math.sqrt(
  (NODE_B_INIT.x - NODE_A.x) ** 2 + (NODE_B_INIT.y - NODE_A.y) ** 2,
);

// ─── Tipos y datos ─────────────────────────────────────────────────────────
type VinculoItem = {
  id: string;
  label: string;
  tagline: string;
  author: string;
  authorRole: string;
  authorQuote: string;
  reflection: string;
  zenAction: string;
};

const VINCULOS: VinculoItem[] = [
  {
    id: "v1",
    label: "Mi pareja",
    tagline: "El vínculo más íntimo",
    author: "Esther Perel",
    authorRole: "El deseo y la intimidad en pareja",
    authorQuote:
      "El amor es un verbo, no un estado. Lo que sientes por tu pareja lo construyes cada día con tus actos, no con tus expectativas.",
    reflection:
      "Según Perel, la distancia que percibes en tu pareja suele ser el espejo de tu propia dificultad para sostener la intimidad sin perder el yo. Lo que exiges fuera —presencia, atención, deseo— es aquello que tú mismo evitas darle a la relación cuando el miedo aparece.",
    zenAction:
      "Hoy le daré 10 minutos de presencia real: sin pantallas, solo escuchando. Lo que quiero recibir, primero lo ofreceré.",
  },
  {
    id: "v2",
    label: "Mi hijo/a",
    tagline: "El vínculo más puro",
    author: "John Bowlby",
    authorRole: "Teoría del apego · Psiquiatra británico",
    authorQuote:
      "Lo que un niño necesita, antes que cualquier otra cosa, es un lugar seguro desde el cual explorar el mundo. Tú eres ese lugar.",
    reflection:
      "Bowlby demostró que la ansiedad de un padre por el futuro de su hijo/a nace del propio sistema de apego no resuelto. El control excesivo no protege al niño —reproduce el miedo del adulto. La base segura que no recibiste, puedes construirla siendo tú esa base para él/ella.",
    zenAction:
      "Hoy le daré un espacio de autonomía sin intervenir. Confiar en él/ella empieza por confiar en lo que le he transmitido.",
  },
  {
    id: "v3",
    label: "Mi mejor amigo/a",
    tagline: "El vínculo elegido",
    author: "Brené Brown",
    authorRole: "Investigadora de la vulnerabilidad y la pertenencia",
    authorQuote:
      "La conexión verdadera es imposible sin vulnerabilidad. Y la vulnerabilidad empieza por mostrarte tal como eres, no como crees que deberías ser.",
    reflection:
      "Brown encontró que la queja sobre el amigo/a que no da lo suficiente casi siempre esconde el miedo propio a ser el primero en dar sin garantías. Exigir reciprocidad sin arriesgarse primero es una forma de protegerse de la intimidad real.",
    zenAction:
      "Hoy iniciaré el contacto sin esperar que me llamen. Seré el primero en mostrarme —sin calcular si recibiré lo mismo a cambio.",
  },
  {
    id: "v4",
    label: "Mis padres",
    tagline: "El vínculo que me formó",
    author: "Amir Levine",
    authorRole: "Maneras de amar · Estilos de apego en adultos",
    authorQuote:
      "Tu estilo de apego no es un defecto de carácter. Es una estrategia que tu sistema nervioso aprendió de niño para sobrevivir en el entorno que tenías.",
    reflection:
      "Levine explica que el resentimiento hacia los padres surge cuando el sistema de apego ansioso o evitativo —formado en la infancia— sigue activo en el adulto. No es sobre ellos: es sobre el patrón que aprendiste. Reconocerlo no los absuelve, pero te libera a ti.",
    zenAction:
      "Hoy me doy la validación que esperaba de ellos. Me digo: 'Hice lo que pude con lo que tenía. Eso fue suficiente.'",
  },
  {
    id: "v5",
    label: "Un colega",
    tagline: "El vínculo del entorno",
    author: "Walter Riso",
    authorRole: "Apego emocional y límites saludables",
    authorQuote:
      "Desapegarse no significa dejar de querer. Significa dejar de necesitar que las cosas sean de una manera determinada para sentirte bien.",
    reflection:
      "Riso señala que la incomodidad con un colega casi siempre refleja una comparación interna no resuelta. Lo que envidias o criticas en él/ella es una proyección de aquello que deseas para ti y aún no te has permitido. El problema no es el colega —es el juez interno que te compara.",
    zenAction:
      "Hoy reconoceré un logro de ese colega sin compararlo con el mío. La abundancia compartida no me resta —amplía el espacio donde yo también puedo crecer.",
  },
];

// ─── Partículas ────────────────────────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  x: (i * 71 + 23) % (W - 10),
  size: (i % 3) + 1,
  duration: 16000 + ((i * 1300) % 9000),
  delay: (i * 800) % 7000,
  color: i % 2 === 0 ? "rgba(180,215,255,0.5)" : "rgba(210,230,250,0.4)",
}));

const FUSION_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 37 + 15) % (W - 10),
  size: (i % 4) + 2,
  duration: 2600 + ((i * 280) % 1400),
  delay: i * 70,
  color:
    i % 3 === 0
      ? "rgba(180,215,255,0.95)"
      : i % 3 === 1
        ? "rgba(255,255,255,0.9)"
        : "rgba(160,200,240,0.85)",
}));

function FloatingParticle({
  x,
  size,
  duration,
  delay,
  color,
}: {
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(H + 60)],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 0.1, 0.75, 1],
    outputRange: [0, 0.85, 0.45, 0],
  });
  const scale = anim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.3, 1, 0.3],
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: x,
        bottom: (size * 18) % (H / 2),
        width: size * 3,
        height: size * 3,
        borderRadius: (size * 3) / 2,
        backgroundColor: color,
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: size * 4,
        transform: [{ translateY }, { scale }],
        opacity,
      }}
    />
  );
}

// ─── Componente principal ──────────────────────────────────────────────────
interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function VinculosDelHilo({ visible, onClose }: Props) {
  const [phase, setPhase] = useState<"intro" | "select" | "thread" | "fused">(
    "intro",
  );
  const [selected, setSelected] = useState<VinculoItem | null>(null);
  const [fusionBurst, setFusionBurst] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // ── Refs (sin re-renders en el hot path) ─────────────────────────────────
  const isFusedRef = useRef(false);
  const startPosRef = useRef({ x: NODE_B_INIT.x, y: NODE_B_INIT.y });
  const nodeBRef = useRef({ x: NODE_B_INIT.x, y: NODE_B_INIT.y });
  const fusionCenterRef = useRef({ x: W / 2, y: NODE_Y });

  // ── Animated values ───────────────────────────────────────────────────────
  const screenFade = useRef(new Animated.Value(0)).current;
  const revealFade = useRef(new Animated.Value(0)).current;
  const revealSlideY = useRef(new Animated.Value(32)).current;
  const btnsFade = useRef(new Animated.Value(0)).current;

  // Posición nodo B — JS driver (addListener + setValue + spring snap-back)
  const nodeBPos = useRef(
    new Animated.ValueXY({ x: NODE_B_INIT.x, y: NODE_B_INIT.y }),
  ).current;
  const nodeBLeft = Animated.subtract(nodeBPos.x, NODE_RADIUS);
  const nodeBTop = Animated.subtract(nodeBPos.y, NODE_RADIUS);

  // Escala nodo B — native driver
  const nodeBScale = useRef(new Animated.Value(1)).current;

  // Escala / proximidad nodo A — JS driver (setValue desde PanResponder)
  const nodeAScale = useRef(new Animated.Value(1)).current;
  const nodeARingScale = useRef(new Animated.Value(0)).current;
  const nodeARingOpacity = useRef(new Animated.Value(0)).current;

  // Hilo — JS driver (setValue desde onPanResponderMove)
  const threadLeft = useRef(new Animated.Value(0)).current;
  const threadTop = useRef(new Animated.Value(NODE_Y)).current;
  const threadWidth = useRef(new Animated.Value(INIT_LEN)).current;
  const threadAngle = useRef(new Animated.Value(0)).current;
  const threadOpacity = useRef(new Animated.Value(0.55)).current;

  // Fusión — native driver
  const fusionGlowScale = useRef(new Animated.Value(0)).current;
  const fusionGlowOpacity = useRef(new Animated.Value(0)).current;

  // ── Helpers del hilo ─────────────────────────────────────────────────────
  const computeThread = (bx: number, by: number) => {
    const ax = NODE_A.x,
      ay = NODE_A.y;
    const dx = bx - ax,
      dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const midX = (ax + bx) / 2;
    const midY = (ay + by) / 2;

    threadLeft.setValue(midX - len / 2);
    threadTop.setValue(midY);
    threadWidth.setValue(len);
    threadAngle.setValue(angle);

    // Hilo más tenso (opaco) al acercarse
    const proximity = Math.max(0, 1 - len / INIT_LEN);
    threadOpacity.setValue(0.4 + proximity * 0.55);

    // Anillo de proximidad en nodo A
    const ringProx = Math.max(0, 1 - len / (INIT_LEN * 0.6));
    nodeARingScale.setValue(1 + ringProx * 0.9);
    nodeARingOpacity.setValue(ringProx * 0.5);
    nodeAScale.setValue(1 + ringProx * 0.12);
  };

  const initThread = () => {
    computeThread(NODE_B_INIT.x, NODE_B_INIT.y);
    threadOpacity.setValue(0.55);
    nodeARingOpacity.setValue(0);
    nodeARingScale.setValue(1);
    nodeAScale.setValue(1);
  };

  // Sincroniza el hilo con nodeBPos durante la animación de snap-back
  useEffect(() => {
    const id = nodeBPos.addListener(({ x, y }) => computeThread(x, y));
    return () => nodeBPos.removeListener(id);
  }, []);

  // ── Reset al abrir el modal ───────────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      isFusedRef.current = false;
      setPhase("intro");
      setSelected(null);
      setFusionBurst(false);
      setIsDragging(false);
      setCopied(false);
      setAccepted(false);
      nodeBPos.setValue(NODE_B_INIT);
      nodeBRef.current = { ...NODE_B_INIT };
      nodeBScale.setValue(1);
      fusionGlowScale.setValue(0);
      fusionGlowOpacity.setValue(0);
      revealFade.setValue(0);
      revealSlideY.setValue(32);
      btnsFade.setValue(0);
      initThread();
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      screenFade.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Reset del canvas al entrar a la fase thread
  useEffect(() => {
    if (phase !== "thread") return;
    isFusedRef.current = false;
    nodeBPos.setValue(NODE_B_INIT);
    nodeBRef.current = { ...NODE_B_INIT };
    nodeBScale.setValue(1);
    fusionGlowScale.setValue(0);
    fusionGlowOpacity.setValue(0);
    revealFade.setValue(0);
    revealSlideY.setValue(32);
    btnsFade.setValue(0);
    initThread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Animación de revelado al entrar en fase fused
  useEffect(() => {
    if (phase !== "fused") return;
    Animated.sequence([
      Animated.parallel([
        Animated.timing(revealFade, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.spring(revealSlideY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 55,
          friction: 11,
        }),
      ]),
      Animated.timing(btnsFade, {
        toValue: 1,
        duration: 340,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Mecánica de fusión ───────────────────────────────────────────────────
  const triggerFusion = () => {
    if (isFusedRef.current) return;
    isFusedRef.current = true;
    setFusionBurst(true);

    const fusX = (NODE_A.x + nodeBRef.current.x) / 2;
    const fusY = (NODE_A.y + nodeBRef.current.y) / 2;
    fusionCenterRef.current = { x: fusX, y: fusY };

    Animated.parallel([
      // Hilo desaparece
      Animated.timing(threadOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
      // Nodo B se desplaza al centro de fusión
      Animated.spring(nodeBPos, {
        toValue: { x: fusX, y: fusY },
        useNativeDriver: false,
        tension: 220,
        friction: 7,
      }),
      // Nodo A se expande y se desvanece
      Animated.sequence([
        Animated.timing(nodeAScale, {
          toValue: 1.4,
          duration: 130,
          useNativeDriver: false,
        }),
        Animated.timing(nodeAScale, {
          toValue: 0,
          duration: 220,
          useNativeDriver: false,
        }),
      ]),
      // Nodo B se contrae
      Animated.sequence([
        Animated.timing(nodeBScale, {
          toValue: 1.35,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(nodeBScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      // Destello de fusión
      Animated.sequence([
        Animated.parallel([
          Animated.spring(fusionGlowScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 180,
            friction: 6,
          }),
          Animated.timing(fusionGlowOpacity, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(fusionGlowOpacity, {
          toValue: 0,
          duration: 480,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setPhase("fused");
    });
  };

  // ── PanResponder ─────────────────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isFusedRef.current,
      onMoveShouldSetPanResponder: () => !isFusedRef.current,
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: (_evt, _gs) => {
        if (isFusedRef.current) return;
        startPosRef.current = { ...nodeBRef.current };
        setIsDragging(true);
        Animated.spring(nodeBScale, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 260,
          friction: 8,
        }).start();
      },

      onPanResponderMove: (_evt, gs) => {
        if (isFusedRef.current) return;
        const newX = startPosRef.current.x + gs.dx;
        const newY = startPosRef.current.y + gs.dy;
        nodeBRef.current = { x: newX, y: newY };
        nodeBPos.setValue({ x: newX, y: newY });
        computeThread(newX, newY);

        const dx = newX - NODE_A.x;
        const dy = newY - NODE_A.y;
        if (Math.sqrt(dx * dx + dy * dy) < FUSION_THRESHOLD) {
          triggerFusion();
        }
      },

      onPanResponderRelease: () => {
        if (isFusedRef.current) return;
        setIsDragging(false);
        // Rebote elástico de regreso a la posición inicial
        Animated.parallel([
          Animated.spring(nodeBPos, {
            toValue: NODE_B_INIT,
            useNativeDriver: false,
            tension: 40,
            friction: 5,
          }),
          Animated.spring(nodeBScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 200,
            friction: 8,
          }),
        ]).start(() => {
          nodeBRef.current = { ...NODE_B_INIT };
        });
      },
    }),
  ).current;

  // ── Acciones ─────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!selected) return;
    await ExpoClipboard.setStringAsync(
      `🔗 Mi reflejo del vínculo:\n\n${selected.reflection}\n\n✨ Mi acción de hoy:\n${selected.zenAction}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => setAccepted(false), 2200);
  };

  const goBack = () => {
    setPhase("select");
    isFusedRef.current = false;
  };

  const threadRotStr = threadAngle.interpolate({
    inputRange: [-360, 360],
    outputRange: ["-360deg", "360deg"],
  });

  const fus = fusionCenterRef.current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[s.overlay, { opacity: screenFade }]}>
        <LinearGradient
          colors={["#E6EBF0", "#F0F5FA", "#E8F0F7", "#EDF3F9"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />

        {BG_PARTICLES.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
        {fusionBurst &&
          FUSION_PARTICLES.map((p, i) => (
            <FloatingParticle key={`f${i}`} {...p} />
          ))}

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={s.header}>
          {phase === "thread" || phase === "fused" ? (
            <Pressable style={s.backBtn} onPress={goBack} hitSlop={12}>
              <ArrowLeft size={16} color="#7890A8" strokeWidth={2} />
              <Text style={s.backTxt}>{"Volver"}</Text>
            </Pressable>
          ) : (
            <Text style={s.headerTag}>{"VÍNCULOS · LA LEY DEL HILO"}</Text>
          )}
          <Pressable style={s.closeBtn} onPress={onClose} hitSlop={12}>
            <X size={18} color="#7890A8" strokeWidth={2} />
          </Pressable>
        </View>

        {/* ── INTRO ──────────────────────────────────────────────────────── */}
        {phase === "intro" && (
          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={s.introBadge}>
              <Text style={s.introBadgeTxt}>{"VÍNCULOS · AUTOESTIMA"}</Text>
            </View>
            <Text style={s.heroTitle}>“El Hilo que nos une”</Text>

            {/* Autor base: Bowlby */}
            <View style={s.introAuthorBadge}>
              <Text style={s.introAuthorName}>“John Bowlby”</Text>
              <Text style={s.introAuthorRole}>
                “Teoría del Apego · Psiquiatra y psicoanalista británico”
              </Text>
            </View>

            <Text style={s.introBody}>
              “Bowlby demostró que los vínculos que formamos de adultos —con la
              pareja, los hijos, los amigos— son moldeados por los patrones de
              apego que aprendimos en la infancia. No elegimos conscientemente
              cómo nos relacionamos: lo repetimos.\n\nLo que te genera tensión
              en una relación no habla solo de la otra persona. Habla de un
              patrón más profundo que aún no ha sido visto.”
            </Text>
            <View style={s.introQuoteBox}>
              <Text style={s.introQuoteMark}>{"“"}</Text>
              <Text style={s.introQuoteTxt}>
                “La necesidad de apego es tan fundamental en el ser humano como
                la necesidad de comida o abrigo. No es una debilidad —es nuestra
                naturaleza más esencial.”
              </Text>
              <Text style={s.introQuoteAuthor}>
                “— John Bowlby, El vínculo afectivo”
              </Text>
            </View>

            {/* Otros autores del módulo */}
            <View style={s.introAuthorsBox}>
              <Text style={s.introAuthorsLabel}>{"VOCES DE ESTE MÓDULO"}</Text>

              {[
                {
                  name: "Esther Perel",
                  role: "Pareja · Deseo e intimidad",
                  bio: "Terapeuta y escritora belga. Autora de Mating in Captivity. Referente mundial sobre erotismo, intimidad y dinámicas de poder en la pareja moderna.",
                },
                {
                  name: "Brené Brown",
                  role: "Amistad · Vulnerabilidad y pertenencia",
                  bio: "Investigadora y profesora en la Universidad de Houston. Su estudio de 20 años sobre la vergüenza y la conexión humana la convirtió en una de las voces más influyentes del bienestar emocional.",
                },
                {
                  name: "Amir Levine",
                  role: "Padres · Estilos de apego en adultos",
                  bio: "Psiquiatra y neurocientífico israelí-americano. Coautor de Attached. Aplica la teoría del apego de Bowlby a las relaciones adultas con base en investigación clínica.",
                },
                {
                  name: "Walter Riso",
                  role: "Colega · Apego emocional y límites",
                  bio: "Psicólogo clínico colombo-italiano. Autor de más de 30 libros sobre bienestar, apego y amor propio. Figura central en la psicología popular latinoamericana.",
                },
              ].map((a) => (
                <View key={a.name} style={s.introAuthorCard}>
                  <View style={s.introAuthorCardHeader}>
                    <Text style={s.introAuthorRowName}>{a.name}</Text>
                    <Text style={s.introAuthorCardRole}>{a.role}</Text>
                  </View>
                  <Text style={s.introAuthorCardBio}>{a.bio}</Text>
                </View>
              ))}
            </View>

            <View style={s.introMechanicBox}>
              <Text style={s.introMechanicLabel}>“¿CÓMO FUNCIONA?”</Text>
              <Text style={s.introMechanicTxt}>
                “Elige la relación que más te ocupa la mente. Verás dos nodos
                unidos por un hilo: tú y el vínculo. Arrastra el nodo del
                vínculo hacia el tuyo para fusionarlos. En ese momento de unión,
                el espejo revelará —desde la perspectiva del autor asignado— el
                patrón real detrás de esa tensión.”
              </Text>
            </View>
            <Pressable style={s.introCta} onPress={() => setPhase("select")}>
              <Heart size={16} color="#fff" strokeWidth={2.2} />
              <Text style={s.introCtaTxt}>{"Explorar mis vínculos"}</Text>
            </Pressable>
          </ScrollView>
        )}

        {/* ── SELECCIÓN ──────────────────────────────────────────────────── */}
        {phase === "select" && (
          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.heroTitle}>{"¿Con quién sientes tensión?"}</Text>
            <Text style={s.heroSub}>
              {
                "Elige el vínculo que más espacio ocupa en tu mente ahora mismo."
              }
            </Text>
            {VINCULOS.map((item) => (
              <Pressable
                key={item.id}
                style={s.vinculoCard}
                onPress={() => {
                  setSelected(item);
                  setPhase("thread");
                }}
              >
                <View style={s.vinculoCardIcon}>
                  <Heart size={14} color="#7890A8" strokeWidth={1.8} />
                </View>
                <View style={s.vinculoCardText}>
                  <Text style={s.vinculoCardLabel}>{item.label}</Text>
                  <Text style={s.vinculoCardTagline}>{item.tagline}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* ── CANVAS DEL HILO ────────────────────────────────────────────── */}
        {phase === "thread" && selected && (
          <View style={s.canvas} pointerEvents="box-none">
            {/* ── Hilo dinámico ────────────────────────────────────────── */}
            <Animated.View
              pointerEvents="none"
              style={[
                s.thread,
                {
                  left: threadLeft,
                  top: threadTop,
                  width: threadWidth,
                  opacity: threadOpacity,
                  transform: [{ rotate: threadRotStr }],
                },
              ]}
            />

            {/* ── Nodo A — "Yo" (fijo) ─────────────────────────────────── */}
            <Animated.View
              pointerEvents="none"
              style={[
                s.nodeA,
                {
                  left: NODE_A.x - NODE_RADIUS,
                  top: NODE_A.y - NODE_RADIUS,
                  transform: [{ scale: nodeAScale }],
                },
              ]}
            >
              <LinearGradient
                colors={["#C8DFF2", "#A8C8E8"]}
                style={StyleSheet.absoluteFill}
              />
              <Text style={s.nodeALabel}>{"Yo"}</Text>
            </Animated.View>
            {/* Anillo de proximidad alrededor de nodo A */}
            <Animated.View
              pointerEvents="none"
              style={[
                s.nodeARing,
                {
                  left: NODE_A.x - NODE_RADIUS - 12,
                  top: NODE_A.y - NODE_RADIUS - 12,
                  opacity: nodeARingOpacity,
                  transform: [{ scale: nodeARingScale }],
                },
              ]}
            />
            <Text
              style={[
                s.nodeCaption,
                {
                  left: NODE_A.x - 24,
                  top: NODE_A.y + NODE_RADIUS + 10,
                },
              ]}
            >
              {"Yo"}
            </Text>

            {/* ── Nodo B — "Vínculo" (arrastrable) ────────────────────── */}
            {/* Capa externa: solo posición (JS driver — left/top no soportados en native) */}
            <Animated.View
              style={{ position: "absolute", left: nodeBLeft, top: nodeBTop }}
            >
              {/* Capa interna: solo escala (native driver — sin left/top en este nivel) */}
              <Animated.View
                style={[s.nodeB, { transform: [{ scale: nodeBScale }] }]}
                {...panResponder.panHandlers}
              >
                <LinearGradient
                  colors={["#F0C8DC", "#DCA0BC"]}
                  style={StyleSheet.absoluteFill}
                />
                <Heart
                  size={16}
                  color="#9E5C72"
                  strokeWidth={2}
                  fill={"#9E5C72"}
                />
              </Animated.View>
            </Animated.View>
            <Text
              style={[
                s.nodeCaption,
                {
                  left: NODE_B_INIT.x - 40,
                  top: NODE_B_INIT.y + NODE_RADIUS + 10,
                  width: 80,
                  textAlign: "center",
                },
              ]}
            >
              {selected.label}
            </Text>

            {/* ── Destello de fusión ───────────────────────────────────── */}
            <Animated.View
              pointerEvents="none"
              style={[
                s.fusionGlow,
                {
                  left: fus.x - 60,
                  top: fus.y - 60,
                  opacity: fusionGlowOpacity,
                  transform: [{ scale: fusionGlowScale }],
                },
              ]}
            />

            {/* ── Instrucción ──────────────────────────────────────────── */}
            <View style={s.instructionRow} pointerEvents="none">
              <Text style={s.instructionTxt}>
                {isDragging
                  ? "Acércalo al nodo azul para fusionar"
                  : `Arrastra "${selected.label}" hacia ti`}
              </Text>
            </View>
          </View>
        )}

        {/* ── REVELADO (post-fusión) ──────────────────────────────────────── */}
        {phase === "fused" && selected && (
          <Animated.View
            style={[
              s.revealWrapper,
              {
                opacity: revealFade,
                transform: [{ translateY: revealSlideY }],
              },
            ]}
          >
            <ScrollView
              style={s.scroll}
              contentContainerStyle={s.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Badge del vínculo */}
              <View style={s.vinculoBadge}>
                <Heart
                  size={11}
                  color="#7890A8"
                  strokeWidth={2}
                  fill={"#7890A8"}
                />
                <Text style={s.vinculoBadgeTxt}>
                  {selected.label.toUpperCase()}
                </Text>
              </View>

              {/* Tarjeta reflejo con autor */}
              <View style={s.reflectionCard}>
                <View style={s.reflectionAccent} />
                {/* Badge del autor */}
                <View style={s.revealAuthorBadge}>
                  <Text style={s.revealAuthorName}>{selected.author}</Text>
                  <Text style={s.revealAuthorRole}>{selected.authorRole}</Text>
                </View>
                {/* Cita del autor */}
                <Text style={s.revealAuthorQuote}>
                  {`"${selected.authorQuote}"`}
                </Text>
                <View style={s.revealDivider} />
                <Text style={s.reflectionLabel}>
                  {"✦   EL REFLEJO DEL VÍNCULO"}
                </Text>
                <Text style={s.reflectionTxt}>{selected.reflection}</Text>
              </View>

              {/* Tarjeta acción */}
              <View style={s.zenCard}>
                <View
                  style={[s.reflectionAccent, { backgroundColor: "#9E5C72" }]}
                />
                <Text style={[s.reflectionLabel, { color: "#9E5C72" }]}>
                  {"✦   TU ACCIÓN DE HOY"}
                </Text>
                <Text style={s.zenTxt}>{selected.zenAction}</Text>
              </View>

              {/* Botones */}
              <Animated.View style={[s.actionsRow, { opacity: btnsFade }]}>
                <Pressable
                  style={[s.actionBtn, accepted && s.actionBtnSuccess]}
                  onPress={handleAccept}
                >
                  {accepted ? (
                    <Check size={15} color="#fff" strokeWidth={2.5} />
                  ) : (
                    <Heart size={15} color="#fff" strokeWidth={2} />
                  )}
                  <Text style={s.actionBtnTxt}>
                    {accepted ? "¡Integrado!" : "Integrar reflexión"}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    s.actionBtn,
                    s.actionBtnAlt,
                    copied && s.actionBtnSuccess,
                  ]}
                  onPress={handleCopy}
                >
                  {copied ? (
                    <Check size={15} color="#fff" strokeWidth={2.5} />
                  ) : (
                    <Copy size={15} color="#fff" strokeWidth={2} />
                  )}
                  <Text style={s.actionBtnTxt}>
                    {copied ? "¡Copiado!" : "Copiar"}
                  </Text>
                </Pressable>
              </Animated.View>
            </ScrollView>
          </Animated.View>
        )}
      </Animated.View>
    </Modal>
  );
}

// ─── Estilos ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  overlay: { flex: 1 },
  blob1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(140,185,225,0.16)",
    top: -70,
    right: -70,
  },
  blob2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(160,200,235,0.12)",
    bottom: 50,
    left: -60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 58,
    paddingHorizontal: 22,
    paddingBottom: 14,
  },
  headerTag: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 1.8,
    color: "#8AABB8",
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backTxt: { fontSize: 13, fontFamily: "Poppins-Medium", color: "#7890A8" },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A0B8CC",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },

  // ── Intro ─────────────────────────────────────────────────────────────────
  introBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(120,144,168,0.12)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(120,144,168,0.22)",
  },
  introBadgeTxt: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2,
    color: "#7890A8",
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: "Playfair-ExtraBold",
    color: "#1A2A38",
    marginBottom: 10,
  },
  introBody: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#3A5060",
    lineHeight: 23,
    marginBottom: 22,
  },
  introQuoteBox: {
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    borderLeftWidth: 4,
    borderLeftColor: "#7890A8",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(155,190,220,0.35)",
    shadowColor: "#98B8D0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  introQuoteMark: {
    fontSize: 42,
    fontFamily: "Playfair-ExtraBold",
    color: "#7890A8",
    lineHeight: 38,
    marginBottom: 4,
  },
  introQuoteTxt: {
    fontSize: 14,
    fontFamily: "Playfair-ExtraBold",
    color: "#1A2E42",
    lineHeight: 23,
    fontStyle: "italic",
    marginBottom: 12,
  },
  introQuoteAuthor: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#7890A8",
    textAlign: "right",
  },
  introMechanicBox: {
    backgroundColor: "rgba(120,144,168,0.08)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(120,144,168,0.18)",
  },
  introMechanicLabel: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2,
    color: "#7890A8",
    marginBottom: 8,
  },
  introMechanicTxt: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#3A5060",
    lineHeight: 21,
  },
  introCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#3D5A72",
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: "#3D5A72",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  introCtaTxt: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },

  // ── Selección ─────────────────────────────────────────────────────────────
  heroSub: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#7890A8",
    lineHeight: 20,
    marginBottom: 24,
  },
  vinculoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1.2,
    borderColor: "rgba(170,200,220,0.4)",
    shadowColor: "#A0B8CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  vinculoCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(120,144,168,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  vinculoCardText: { flex: 1 },
  vinculoCardLabel: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#1A2E42",
    marginBottom: 2,
  },
  vinculoCardTagline: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#7890A8",
  },

  // ── Canvas ────────────────────────────────────────────────────────────────
  canvas: {
    flex: 1,
    position: "relative",
  },
  thread: {
    position: "absolute",
    height: 2,
    borderRadius: 1,
    backgroundColor: "#7890A8",
    marginTop: -1,
  },
  nodeA: {
    position: "absolute",
    width: NODE_RADIUS * 2,
    height: NODE_RADIUS * 2,
    borderRadius: NODE_RADIUS,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(160,200,230,0.7)",
    shadowColor: "#6899B4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nodeALabel: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#2A4A62",
  },
  nodeARing: {
    position: "absolute",
    width: (NODE_RADIUS + 12) * 2,
    height: (NODE_RADIUS + 12) * 2,
    borderRadius: NODE_RADIUS + 12,
    borderWidth: 2,
    borderColor: "rgba(100,160,220,0.5)",
  },
  nodeB: {
    width: NODE_RADIUS * 2,
    height: NODE_RADIUS * 2,
    borderRadius: NODE_RADIUS,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(220,160,190,0.7)",
    shadowColor: "#9E5C72",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  nodeCaption: {
    position: "absolute",
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#7890A8",
  },
  fusionGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(180,220,255,0.6)",
    shadowColor: "rgba(120,180,255,1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  instructionRow: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionTxt: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#7890A8",
    textAlign: "center",
  },

  // ── Revelado ──────────────────────────────────────────────────────────────
  revealWrapper: { flex: 1 },
  vinculoBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "rgba(120,144,168,0.1)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(120,144,168,0.2)",
  },
  vinculoBadgeTxt: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 1.8,
    color: "#7890A8",
  },
  reflectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 22,
    paddingLeft: 26,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(160,190,215,0.35)",
    shadowColor: "#5A8AAA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 7,
  },
  reflectionAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: "#6899B4",
  },
  reflectionLabel: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2,
    color: "#6899B4",
    marginBottom: 12,
  },
  reflectionTxt: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#1A2E42",
    lineHeight: 23,
  },
  zenCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 22,
    paddingLeft: 26,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(200,160,185,0.35)",
    shadowColor: "#9E5C72",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  zenTxt: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#1A2E42",
    lineHeight: 23,
  },
  actionsRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#3D5A72",
    borderRadius: 14,
    paddingVertical: 13,
    shadowColor: "#3D5A72",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnAlt: { backgroundColor: "#7890A8" },
  actionBtnSuccess: { backgroundColor: "#4CAF82" },
  actionBtnTxt: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },

  // ── Intro: autor base (Bowlby) ─────────────────────────────────────────────
  introAuthorBadge: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderLeftWidth: 4,
    borderLeftColor: "#6899B4",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(155,190,220,0.3)",
    shadowColor: "#98B8D0",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  introAuthorName: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#1A2E42",
    marginBottom: 2,
  },
  introAuthorRole: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#6899B4",
  },

  // ── Intro: lista de voces del módulo ──────────────────────────────────────
  introAuthorsBox: {
    backgroundColor: "rgba(120,144,168,0.07)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(120,144,168,0.15)",
    gap: 10,
  },
  introAuthorsLabel: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2,
    color: "#7890A8",
    marginBottom: 4,
  },
  introAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  introAuthorRowName: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: "#2A3D50",
    width: 120,
  },
  introAuthorRowRole: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#7890A8",
  },
  introAuthorCard: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 12,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(120,144,168,0.12)",
  },
  introAuthorCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  introAuthorCardRole: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    color: "#7890A8",
    flex: 1,
  },
  introAuthorCardBio: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#4A6275",
    lineHeight: 17,
  },

  // ── Reveal: autor en la tarjeta de reflejo ────────────────────────────────
  revealAuthorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  revealAuthorName: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#6899B4",
  },
  revealAuthorRole: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    color: "#A0B8C8",
    flex: 1,
  },
  revealAuthorQuote: {
    fontSize: 13,
    fontFamily: "Playfair-ExtraBold",
    color: "#3A5060",
    lineHeight: 21,
    fontStyle: "italic",
    marginBottom: 14,
  },
  revealDivider: {
    height: 1,
    backgroundColor: "rgba(155,190,220,0.3)",
    marginBottom: 14,
  },
});
