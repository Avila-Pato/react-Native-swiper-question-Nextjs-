import { SPACING } from "@/constants/constants";
import { CartaRecompensa, CategoriaDetectada } from "@/data/journalData";
import { MOODS } from "@/data/moods";
import { saveMood, todayString } from "@/store/moodHistory";
import { useAudioJournalStore } from "@/store/useAudioJournalStore";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Activity, Feather, Headphones, Sparkles, X } from "lucide-react-native";
import { useEffect } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

// ── Helpers ────────────────────────────────────────────────────────────────

const CATEGORIA_MOOD: Record<CategoriaDetectada, number> = {
  ESTRES_ANSIEDAD:         0, // Enojado
  TRISTEZA_MELANCOLIA:     1, // Triste
  CANSANCIO_APATIA:        2, // Neutro
  CALMA_BIENESTAR: 3, // Bien
  ALEGRIA_MOTIVACION:      4, // Genial
};

const CONSEJO: Record<CategoriaDetectada, string> = {
  ESTRES_ANSIEDAD:         "No tienes que resolver todo ahora. Un momento de pausa ya es avanzar.",
  CANSANCIO_APATIA:        "Date permiso de ir despacio — tu energía no es una deuda pendiente.",
  ALEGRIA_MOTIVACION:      "Este es tu momento. Úsalo para lo que más te importa hoy.",
  TRISTEZA_MELANCOLIA:     "Sentir es válido. No necesitas arreglarlo ni apresurarlo.",
  CALMA_BIENESTAR: "Un paso pequeño en cualquier dirección ya es claridad.",
};

const CATEGORIA_LABEL: Record<CategoriaDetectada, string> = {
  ESTRES_ANSIEDAD:         "Alivio",
  CANSANCIO_APATIA:        "Recarga",
  ALEGRIA_MOTIVACION:      "Enfoque",
  TRISTEZA_MELANCOLIA:     "Calma",
  CALMA_BIENESTAR: "Claridad",
};

function ContentIcon({ tipo, color }: { tipo: CartaRecompensa["tipo_contenido"]; color: string }) {
  const props = { size: 26, color, strokeWidth: 1.6 };
  if (tipo === "meditacion") return <Feather {...props} />;
  if (tipo === "micro_ejercicio") return <Activity {...props} />;
  return <Headphones {...props} />;
}

// ── Component ──────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose?: () => void;
}

export function RewardCard({ visible, onClose }: Props) {
  const result = useAudioJournalStore((s) => s.result);
  const reset = useAudioJournalStore((s) => s.reset);
  const handleClose = () => { reset(); onClose?.(); };

  const flipProgress = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible && result) {
      if (Platform.OS === "web") {
        overlayOpacity.value = 1;
        flipProgress.value = 1;
      } else {
        overlayOpacity.value = withTiming(1, { duration: 300 });
        flipProgress.value = withDelay(200, withTiming(1, { duration: 550 }));
      }
      saveMood(todayString(), CATEGORIA_MOOD[result.categoria_detectada] ?? 2);
    } else {
      overlayOpacity.value = 0;
      flipProgress.value = 0;
    }
  }, [visible, result]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));

  const cardStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [90, 0]);
    const scale = interpolate(flipProgress.value, [0, 1], [0.88, 1]);
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }, { scale }],
      opacity: interpolate(flipProgress.value, [0, 0.3, 1], [0, 0.6, 1]),
    };
  });

  if (!result) return null;

  const { carta_recompensa, categoria_detectada, texto_hablado } = result;
  const { tag_bienestar, titulo, subtitulo, tipo_contenido, duracion_estimada, color_sugerido_hex } = carta_recompensa;

  const categoryLabel = CATEGORIA_LABEL[categoria_detectada] ?? "Bienestar";
  const moodIdx = CATEGORIA_MOOD[categoria_detectada] ?? 2;
  const mood = MOODS[moodIdx];

  const tipoLabel =
    tipo_contenido === "meditacion"
      ? "Meditación guiada"
      : tipo_contenido === "micro_ejercicio"
        ? "Micro-ejercicio"
        : "Audio guía";

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, overlayStyle]}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <Animated.View style={[s.card, cardStyle]}>
          {/* Fondo degradado de la tarjeta */}
          <LinearGradient
            colors={[color_sugerido_hex, color_sugerido_hex + "CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Círculo decorativo top-right */}
          <View style={[s.decorCircle, { backgroundColor: "rgba(255,255,255,0.10)" }]} />

          {/* Header: chips + close en misma fila */}
          <View style={s.cardHeader}>
            <View style={s.chipRow}>
              <View style={s.chip}>
                <Text style={s.chipText}>{tag_bienestar.toUpperCase()}</Text>
              </View>
              <View style={[s.chip, s.chipAlt]}>
                <Text style={s.chipText}>{categoryLabel.toUpperCase()}</Text>
              </View>
            </View>
            <Pressable style={s.closeBtn} onPress={handleClose} hitSlop={10}>
              <X size={16} color={"rgba(255,255,255,0.8)"} strokeWidth={2} />
            </Pressable>
          </View>

          {/* Icon */}
          <View style={s.iconWrap}>
            <ContentIcon tipo={tipo_contenido} color={"rgba(255,255,255,0.95)"} />
          </View>

          {/* Contenido */}
          <Text style={s.titulo}>{titulo}</Text>
          <Text style={s.subtitulo}>{subtitulo}</Text>

          {/* Duración */}
          <View style={s.footer}>
            <View style={s.durationBadge}>
              <Text style={s.durationText}>{duracion_estimada}</Text>
            </View>
            <Text style={s.tipoText}>{tipoLabel}</Text>
          </View>

          {/* Lo que dijiste */}
          {!!texto_hablado && (
            <View style={s.transcriptSection}>
              <Text style={s.transcriptQuote}>{"“"}{texto_hablado}{"”"}</Text>
            </View>
          )}

          {/* Consejo */}
          <View style={s.consejoSection}>
            <Sparkles size={13} color="rgba(255,255,255,0.7)" strokeWidth={1.8} />
            <Text style={s.consejoText}>{CONSEJO[categoria_detectada]}</Text>
          </View>

          {/* Tu humor de hoy */}
          <View style={s.moodSection}>
            <View style={s.moodTextCol}>
              <Text style={s.moodSectionLabel}>{"TU HUMOR DE HOY"}</Text>
              <Text style={s.moodName}>{mood.label}</Text>
            </View>
            <Image source={mood.image} style={s.moodImg} contentFit="contain" />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING * 2.5,
  },

  card: {
    width: "100%",
    borderRadius: 32,
    padding: SPACING * 2.5,
    gap: SPACING * 1.1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.38,
    shadowRadius: 32,
    elevation: 18,
  },

  decorCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -60,
    right: -60,
  },

  closeBtn: {
    alignSelf: "flex-end",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chipRow: { flexDirection: "row", gap: SPACING * 0.6, flex: 1 },
  chip: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipAlt: { backgroundColor: "rgba(255,255,255,0.12)" },
  chipText: { fontSize: 9, fontWeight: "800", color: "rgba(255,255,255,0.9)", letterSpacing: 0.8 },

  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING * 0.3,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  subtitulo: {
    fontSize: 14,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 21,
    fontWeight: "400",
  },

  footer: { flexDirection: "row", alignItems: "center", gap: SPACING },
  durationBadge: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  durationText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  tipoText: { fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: "500" },

  transcriptSection: {
    backgroundColor: "rgba(0,0,0,0.12)",
    borderRadius: 12,
    paddingHorizontal: SPACING * 1.2,
    paddingVertical: SPACING * 0.8,
    borderLeftWidth: 2,
    borderLeftColor: "rgba(255,255,255,0.4)",
  },
  transcriptQuote: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 18,
    fontStyle: "italic",
  },

  consejoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING * 0.7,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    paddingHorizontal: SPACING * 1.2,
    paddingVertical: SPACING * 0.9,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  consejoText: {
    flex: 1,
    fontSize: 12,
    color: "rgba(255,255,255,0.82)",
    lineHeight: 18,
    fontWeight: "500",
  },

  moodSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: SPACING * 1.8,
    paddingVertical: SPACING * 1.4,
    marginTop: SPACING * 0.5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  moodTextCol: { gap: 3 },
  moodSectionLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 1.8,
  },
  moodName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.4,
  },
  moodImg: { width: 56, height: 56 },
});
