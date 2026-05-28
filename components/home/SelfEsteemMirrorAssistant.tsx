import { BlurView } from "expo-blur";
import * as ExpoClipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Check, Copy, Eye, Sparkles, X } from "lucide-react-native";
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
const MIRROR_H = 230;
const PROGRESS_W = W - 44;

// ─── Configuración de la Matriz Táctil ───────────────────────────────────────
const ROWS = 3;
const COLS = 3;
const TOTAL_CELLS = ROWS * COLS; // 9 sectores
const REQUIRED_CLEARED = Math.ceil(TOTAL_CELLS * 0.8); // 8 de 9

type MirrorItem = {
  id: string;
  situation: string;
  mirrorLaw: string;
  zenAction: string;
};

const MIRROR_DATA: MirrorItem[] = [
  {
    id: "m1",
    situation: "Me frustra que los demás no valoren mi tiempo ni mi trabajo",
    mirrorLaw:
      "El espejo te muestra que tú no estás valorando tu propio tiempo. Buscas fuera el respeto que tú mismo te niegas.",
    zenAction:
      "Hoy estableceré un límite claro para mi tiempo y celebraré mis avances sin esperar el aplauso ajeno.",
  },
  {
    id: "m2",
    situation: "Me molesta que las personas no sean honestas conmigo",
    mirrorLaw:
      "¿Hay una verdad que tú mismo no te estás diciendo? La honestidad que exiges fuera es la que te niegas adentro.",
    zenAction:
      "Hoy me diré una verdad incómoda que he estado evitando. La honradez empieza en el diálogo conmigo mismo.",
  },
  {
    id: "m3",
    situation: "Siento que nadie me escucha de verdad cuando hablo",
    mirrorLaw:
      "El espejo pregunta: ¿cuándo fue la última vez que te escuchaste a ti? ¿Que le prestaste atención a tu propia voz interior sin juzgarla?",
    zenAction:
      "Dedicaré 10 minutos diarios a escribir sin censura lo que siento. Primero escucharme a mí.",
  },
  {
    id: "m4",
    situation: "Me irrita que la gente sea tan egoísta e indiferente",
    mirrorLaw:
      "El espejo muestra una necesidad tuya sin atender. Lo que llamas egoísmo en otros puede ser el permiso que tú nunca te das.",
    zenAction:
      "Hoy haré algo solo para mí, sin culpa y sin justificarlo ante nadie. Cuidarme no es egoísmo.",
  },
  {
    id: "m5",
    situation: "Nadie confía en mi criterio ni en mis decisiones",
    mirrorLaw:
      "El espejo pregunta: ¿confías tú en tu propio criterio? Buscas en otros la validación que tú mismo no te otorgas.",
    zenAction:
      "Tomaré una decisión importante hoy basándome solo en mi criterio, sin consultar ni esperar aprobación.",
  },
  {
    id: "m6",
    situation: "Me frustra que las personas no cumplen sus promesas",
    mirrorLaw:
      "El espejo muestra los compromisos que tú has hecho contigo mismo y no has cumplido. La exigencia externa refleja la interna.",
    zenAction:
      "Elegiré un compromiso conmigo mismo que llevo postergando y lo cumpliré hoy, aunque sea en pequeño.",
  },
];

// ─── Partículas flotantes de fondo ───────────────────────────────────────────
const BG_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 53 + 19) % (W - 10),
  size: (i % 3) + 1,
  duration: 14000 + ((i * 1100) % 8000),
  delay: (i * 900) % 7000,
  color:
    i % 3 === 0
      ? "rgba(180,215,255,0.65)"
      : i % 3 === 1
        ? "rgba(220,235,255,0.5)"
        : "rgba(200,220,250,0.45)",
}));

const REVEAL_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: (i * 41 + 11) % (W - 10),
  size: (i % 4) + 2,
  duration: 3800 + ((i * 400) % 1800),
  delay: i * 120,
  color: i % 2 === 0 ? "rgba(200,230,255,0.9)" : "rgba(255,255,255,0.85)",
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
    outputRange: [0, 0.8, 0.4, 0],
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
        bottom: (size * 20) % (H / 2),
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: size * 3,
        transform: [{ translateY }, { scale }],
        opacity,
      }}
    />
  );
}

// ─── Celda individual de la niebla ───────────────────────────────────────────
function FogCell({ opacity }: { opacity: Animated.Value }) {
  return (
    <Animated.View style={[s.matrixCell, { opacity }]}>
      <LinearGradient
        colors={["rgb(205,221,238)", "rgb(222,237,252)", "rgb(208,225,241)"]}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SelfEsteemMirrorAssistant({ visible, onClose }: Props) {
  const [phase, setPhase] = useState<"intro" | "select" | "mirror">("intro");
  const [selected, setSelected] = useState<MirrorItem | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [revealBurst, setRevealBurst] = useState(false);
  const [cellsCleared, setCellsCleared] = useState(0);

  // ── Matriz de opacidades: 9 Animated.Values estables, una por sector ──────
  const cellOpacities = useRef(
    Array.from({ length: TOTAL_CELLS }, () => new Animated.Value(1)),
  ).current;

  // ── Refs de estado del gesto ──────────────────────────────────────────────
  const mirrorContainerRef = useRef<View>(null);
  const mirrorLayoutRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const isRevealedRef = useRef(false);
  const clearedCellsRef = useRef<Set<number>>(new Set());

  // ── Animated values de la pantalla ───────────────────────────────────────
  const screenFade = useRef(new Animated.Value(0)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlideY = useRef(new Animated.Value(40)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const revealScale = useRef(new Animated.Value(0.92)).current;
  const btnsFade = useRef(new Animated.Value(0)).current;

  // Medir posición absoluta del espejo al entrar en fase mirror.
  // requestAnimationFrame garantiza que el layout ya esté commiteado antes de medir.
  useEffect(() => {
    if (phase !== "mirror") return;
    const frameId = requestAnimationFrame(() => {
      mirrorContainerRef.current?.measureInWindow((x, y, w, h) => {
        mirrorLayoutRef.current = { x, y, width: w, height: h };
      });
    });
    return () => cancelAnimationFrame(frameId);
  }, [phase]);

  // Reset completo al abrir el modal
  useEffect(() => {
    if (visible) {
      setPhase("intro");
      setSelected(null);
      setRevealed(false);
      setCopied(false);
      setAccepted(false);
      setRevealBurst(false);
      setCellsCleared(0);
      isRevealedRef.current = false;
      clearedCellsRef.current.clear();
      cellOpacities.forEach((op) => op.setValue(1));
      progressAnim.setValue(0);
      revealOpacity.setValue(0);
      revealScale.setValue(0.92);
      btnsFade.setValue(0);
      cardFade.setValue(0);
      cardSlideY.setValue(40);
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      screenFade.setValue(0);
    }
    // cellOpacities, progressAnim et al. son refs estables
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Dispara la animación de entrada de la tarjeta zen DESPUÉS de que React
  // la monta en pantalla (revealed=true). Esto evita que la animación avance
  // antes de que el nodo exista, que dejaba la tarjeta semi-transparente.
  useEffect(() => {
    if (!revealed) return;
    Animated.sequence([
      Animated.parallel([
        Animated.timing(revealOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.spring(revealScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 52,
          friction: 9,
        }),
      ]),
      Animated.timing(btnsFade, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  // ── Secuencia de revelado ─────────────────────────────────────────────────
  const onWipeComplete = () => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;
    setRevealBurst(true);

    // Desvanece las celdas remanentes, luego actualiza el estado para montar la tarjeta
    const fadeRemainders = cellOpacities.map((op) =>
      Animated.timing(op, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    );

    Animated.parallel(fadeRemainders).start(() => {
      // La tarjeta se monta aquí — el useEffect([revealed]) arranca la animación
      setRevealed(true);
    });
  };

  // ── Seleccionar situación y entrar a la fase espejo ───────────────────────
  const selectItem = (item: MirrorItem) => {
    setSelected(item);
    setPhase("mirror");
    setCellsCleared(0);
    isRevealedRef.current = false;
    clearedCellsRef.current.clear();
    setRevealed(false);
    setRevealBurst(false);
    cellOpacities.forEach((op) => op.setValue(1));
    progressAnim.setValue(0);
    revealOpacity.setValue(0);
    revealScale.setValue(0.92);
    btnsFade.setValue(0);

    Animated.parallel([
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.spring(cardSlideY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 55,
        friction: 12,
      }),
    ]).start();
  };

  // ── PanResponder con Matriz de Colisión Táctil 3×3 ───────────────────────
  const panResponder = useRef(
    PanResponder.create({
      // Solo reclama el gesto si el espejo no ha sido revelado
      onStartShouldSetPanResponder: () => !isRevealedRef.current,
      onMoveShouldSetPanResponder: () => !isRevealedRef.current,
      // Evita que el ScrollView padre capture el gesto mientras se barre
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: () => {
        // Re-mide en cada nuevo toque para absorber el offset del scroll acumulado
        mirrorContainerRef.current?.measureInWindow((x, y, w, h) => {
          mirrorLayoutRef.current = { x, y, width: w, height: h };
        });
      },

      onPanResponderMove: (evt) => {
        if (isRevealedRef.current) return;
        const touch = evt.nativeEvent.touches[0];
        if (!touch) return;

        const layout = mirrorLayoutRef.current;
        // Protección: ignorar movimientos si las dimensiones aún no están disponibles
        if (!layout.width || !layout.height) return;

        // Coordenadas relativas al contenedor del espejo
        const relX = touch.pageX - layout.x;
        const relY = touch.pageY - layout.y;

        // Descartar si el dedo está fuera de los límites del espejo
        if (
          relX < 0 ||
          relX > layout.width ||
          relY < 0 ||
          relY > layout.height
        )
          return;

        // ── Mapeo geométrico: posición → ID de celda ──────────────────────
        const cellW = layout.width / COLS;
        const cellH = layout.height / ROWS;
        const col = Math.max(0, Math.min(COLS - 1, Math.floor(relX / cellW)));
        const row = Math.max(0, Math.min(ROWS - 1, Math.floor(relY / cellH)));
        const cellId = row * COLS + col;

        // Ignorar la celda si ya fue limpiada (Set evita re-animaciones)
        if (clearedCellsRef.current.has(cellId)) return;

        clearedCellsRef.current.add(cellId);

        // Animación nativa fluida para este sector específico
        Animated.timing(cellOpacities[cellId], {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }).start();

        // Actualizar progreso global
        const cleared = clearedCellsRef.current.size;
        const ratio = cleared / TOTAL_CELLS;
        setCellsCleared(cleared);
        progressAnim.setValue(ratio);

        // Umbral de éxito: 80% de la superficie cubierta
        if (cleared >= REQUIRED_CLEARED) {
          progressAnim.setValue(1);
          setCellsCleared(TOTAL_CELLS);
          onWipeComplete();
        }
      },

      onPanResponderRelease: () => {},
    }),
  ).current;

  // ── Acciones de usuario ───────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!selected) return;
    await ExpoClipboard.setStringAsync(
      `🪞 Mi reflejo interior:\n\n${selected.mirrorLaw}\n\n✨ Mi paso de hoy:\n${selected.zenAction}`,
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
    cardFade.setValue(0);
    cardSlideY.setValue(40);
  };

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PROGRESS_W],
  });

  const progressPct = Math.round((cellsCleared / TOTAL_CELLS) * 100);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[s.overlay, { opacity: screenFade }]}>
        <LinearGradient
          colors={["#E8ECEF", "#F4F7FA", "#EBF2F8", "#F0F4F8"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />

        {BG_PARTICLES.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
        {revealBurst &&
          REVEAL_PARTICLES.map((p, i) => (
            <FloatingParticle key={`r${i}`} {...p} />
          ))}

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={s.header}>
          {phase === "mirror" ? (
            <Pressable style={s.backBtn} onPress={goBack} hitSlop={12}>
              <ArrowLeft size={16} color="#7890A8" strokeWidth={2} />
              <Text style={s.backTxt}>{"Volver"}</Text>
            </Pressable>
          ) : (
            <Text style={s.headerTag}>
              {"LA LEY DEL ESPEJO · YOSHINORI NOGUCHI"}
            </Text>
          )}
          <Pressable style={s.closeBtn} onPress={onClose} hitSlop={12}>
            <X size={18} color="#7890A8" strokeWidth={2} />
          </Pressable>
        </View>

        {/* ── FASE: INTRO ─────────────────────────────────────────────────── */}
        {phase === "intro" && (
          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Badge de autor */}
            <View style={s.introBadge}>
              <Text style={s.introBadgeTxt}>
                {"AUTOESTIMA · LA LEY DEL ESPEJO"}
              </Text>
            </View>

            <Text style={s.heroTitle}>{"El Espejo Interior"}</Text>

            <Text style={s.introBody}>
              {
                "Yoshinori Noguchi, terapeuta japonés, trabajó durante décadas con miles de personas en conflicto con su entorno. Descubrió algo sorprendente: lo que nos molesta profundamente en otros siempre refleja algo que aún no hemos resuelto dentro de nosotros mismos."
              }
            </Text>

            {/* Cita del autor */}
            <View style={s.introQuoteBox}>
              <Text style={s.introQuoteMark}>{"“"}</Text>
              <Text style={s.introQuoteTxt}>
                {
                  "El mundo exterior es un espejo fiel de tu mundo interior. Lo que ves en los demás es lo que aún no has visto en ti."
                }
              </Text>
              <Text style={s.introQuoteAuthor}>
                {"— Yoshinori Noguchi, La Ley del Espejo"}
              </Text>
            </View>

            {/* Cómo funciona */}
            <View style={s.introMechanicBox}>
              <Text style={s.introMechanicLabel}>{"¿CÓMO FUNCIONA?"}</Text>
              <Text style={s.introMechanicTxt}>
                {
                  "Elige la situación que más te incomoda. El espejo aparecerá cubierto de niebla. Desliza el dedo por toda su superficie para limpiarla y descubrir qué mensaje de tu interior refleja esa incomodidad — y cuál es tu paso concreto para hoy."
                }
              </Text>
            </View>

            <Pressable
              style={s.introCta}
              onPress={() => setPhase("select")}
            >
              <Eye size={16} color="#fff" strokeWidth={2.2} />
              <Text style={s.introCtaTxt}>{"Ver mi espejo"}</Text>
            </Pressable>
          </ScrollView>
        )}

        {/* ── FASE: SELECCIÓN ────────────────────────────────────────────── */}
        {phase === "select" && (
          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.heroTitle}>{"El Espejo Interior"}</Text>
            <Text style={s.heroSub}>
              {
                "Lo que te molesta en otros es un mensaje de tu propio interior. Elige la situación que más te quita la paz."
              }
            </Text>
            {MIRROR_DATA.map((item) => (
              <Pressable
                key={item.id}
                style={s.situationCard}
                onPress={() => selectItem(item)}
              >
                <Eye size={15} color="#7890A8" strokeWidth={1.8} />
                <Text style={s.situationCardTxt}>{item.situation}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* ── FASE: ESPEJO ────────────────────────────────────────────────── */}
        {phase === "mirror" && selected && (
          <Animated.View
            style={[
              s.mirrorPhase,
              { opacity: cardFade, transform: [{ translateY: cardSlideY }] },
            ]}
          >
            <ScrollView
              style={s.scroll}
              contentContainerStyle={s.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Badge de situación */}
              <View style={s.situationBadge}>
                <Text style={s.situationBadgeTxt}>{selected.situation}</Text>
              </View>

              {/* ── Contenedor del espejo ─────────────────────────────────── */}
              <View ref={mirrorContainerRef} style={s.mirrorContainer}>

                {/* Capa de verdad: texto visible debajo de la niebla */}
                <View style={s.truthLayer} pointerEvents="none">
                  <Text style={s.truthLabel}>{"EL ESPEJO TE MUESTRA"}</Text>
                  <Text style={s.truthText}>{selected.mirrorLaw}</Text>
                </View>

                {/* ── Niebla matricial ─────────────────────────────────────
                    BlurView difumina la capa de verdad.
                    Las 9 celdas opacas la cubren completamente.
                    Cada celda desaparece individualmente al ser tocada.     */}
                {!revealed && (
                  <View style={StyleSheet.absoluteFill} pointerEvents="none">
                    {/* Base difuminada — se mantiene mientras haya celdas */}
                    <BlurView
                      intensity={90}
                      tint="light"
                      style={StyleSheet.absoluteFill}
                    />

                    {/* Cuadrícula 3×3 de sectores independientes */}
                    <View style={s.matrixGrid}>
                      {cellOpacities.map((opacity, idx) => (
                        <FogCell key={idx} opacity={opacity} />
                      ))}
                    </View>

                    {/* Instrucción inicial — desaparece al primer barrido */}
                    {cellsCleared === 0 && (
                      <View
                        style={[StyleSheet.absoluteFill, s.fogHintLayer]}
                        pointerEvents="none"
                      >
                        <Sparkles
                          size={22}
                          color="rgba(100,130,160,0.55)"
                          strokeWidth={1.5}
                        />
                        <Text style={s.fogHintText}>
                          {
                            "Desliza el dedo por todo el espejo\npara descubrir tu reflejo"
                          }
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Interceptor de gestos: transparente, encima de todo */}
                {!revealed && (
                  <View
                    style={[StyleSheet.absoluteFill, s.wipeLayer]}
                    {...panResponder.panHandlers}
                  />
                )}
              </View>

              {/* ── Barra de progreso ─────────────────────────────────────── */}
              {!revealed && (
                <View style={s.progressRow}>
                  <View style={s.progressBg}>
                    <Animated.View
                      style={[s.progressFill, { width: progressBarWidth }]}
                    />
                  </View>
                  <Text style={s.progressLabel}>
                    {cellsCleared === 0
                      ? "Usa tu dedo para limpiar el espejo"
                      : progressPct >= 100
                        ? "¡Espejo completo!"
                        : `Limpio al ${progressPct}%`}
                  </Text>
                </View>
              )}

              {/* ── Tarjeta zen (revelación) ──────────────────────────────── */}
              {revealed && (
                <Animated.View
                  style={[
                    s.zenCard,
                    {
                      opacity: revealOpacity,
                      transform: [{ scale: revealScale }],
                    },
                  ]}
                >
                  {/* Barra de acento izquierda */}
                  <View style={s.zenAccent} />
                  <Text style={s.zenLabel}>{"✦   TU PASO DE HOY"}</Text>
                  <Text style={s.zenText}>{selected.zenAction}</Text>
                </Animated.View>
              )}

              {/* ── Botones de acción ─────────────────────────────────────── */}
              {revealed && (
                <Animated.View style={[s.actionsRow, { opacity: btnsFade }]}>
                  <Pressable
                    style={[s.actionBtn, accepted && s.actionBtnSuccess]}
                    onPress={handleAccept}
                  >
                    {accepted ? (
                      <Check size={15} color="#fff" strokeWidth={2.5} />
                    ) : (
                      <Eye size={15} color="#fff" strokeWidth={2} />
                    )}
                    <Text style={s.actionBtnTxt}>
                      {accepted ? "¡Aceptado!" : "Aceptar mi reflejo"}
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
                      {copied ? "¡Copiado!" : "Copiar Recordatorio"}
                    </Text>
                  </Pressable>
                </Animated.View>
              )}
            </ScrollView>
          </Animated.View>
        )}
      </Animated.View>
    </Modal>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  overlay: { flex: 1 },
  blob1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(155,190,225,0.18)",
    top: -80,
    right: -80,
  },
  blob2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(170,205,235,0.14)",
    bottom: 60,
    left: -70,
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
  mirrorPhase: { flex: 1 },
  heroTitle: {
    fontSize: 26,
    fontFamily: "Playfair-ExtraBold",
    color: "#1A2A38",
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#7890A8",
    lineHeight: 20,
    marginBottom: 24,
  },
  situationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1.2,
    borderColor: "rgba(170,200,220,0.45)",
    shadowColor: "#A0B8CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 3,
  },
  situationCardTxt: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#2A3D50",
    lineHeight: 21,
  },
  situationBadge: {
    backgroundColor: "rgba(120,144,168,0.09)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(120,144,168,0.16)",
  },
  situationBadgeTxt: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#4A6070",
    lineHeight: 20,
    fontStyle: "italic",
    textAlign: "center",
  },
  // ── Espejo ─────────────────────────────────────────────────────────────────
  mirrorContainer: {
    height: MIRROR_H,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(155,190,220,0.45)",
    backgroundColor: "rgba(238,245,252,0.6)",
    marginBottom: 16,
    shadowColor: "#98B8D0",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  truthLayer: {
    ...StyleSheet.absoluteFillObject,
    padding: 24,
    justifyContent: "center",
  },
  truthLabel: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2,
    color: "#7890A8",
    marginBottom: 12,
  },
  truthText: {
    fontSize: 15,
    fontFamily: "Playfair-ExtraBold",
    color: "#1A2A38",
    lineHeight: 26,
  },
  // ── Niebla matricial ───────────────────────────────────────────────────────
  matrixGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  matrixCell: {
    // Cada celda ocupa exactamente 1/3 del ancho y 1/3 del alto
    width: `${100 / COLS}%` as unknown as number,
    height: `${100 / ROWS}%` as unknown as number,
    overflow: "hidden",
  },
  fogHintLayer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  fogHintText: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "rgba(80,110,140,0.7)",
    textAlign: "center",
    lineHeight: 20,
  },
  wipeLayer: {
    borderRadius: 24,
    backgroundColor: "transparent",
  },
  // ── Progreso ───────────────────────────────────────────────────────────────
  progressRow: { alignItems: "center", marginBottom: 22, gap: 8 },
  progressBg: {
    width: PROGRESS_W,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(155,190,220,0.28)",
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "#7890A8",
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#A0B8C8",
  },
  // ── Revelación ─────────────────────────────────────────────────────────────
  zenCard: {
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 22,
    paddingLeft: 28,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(160,190,215,0.35)",
    shadowColor: "#5A8AAA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  zenAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: "#6899B4",
  },
  zenLabel: {
    fontSize: 9,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2,
    color: "#6899B4",
    marginBottom: 10,
  },
  zenText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#1A2E42",
    lineHeight: 26,
  },
  // ── Botones ────────────────────────────────────────────────────────────────
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
    shadowOpacity: 0.28,
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
  // ── Intro ──────────────────────────────────────────────────────────────────
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
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  introCtaTxt: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
});
