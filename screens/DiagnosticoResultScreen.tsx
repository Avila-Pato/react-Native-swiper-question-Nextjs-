import { SPACING } from "@/constants/constants";
import { BG, MUTED, TEXT } from "@/constants/theme";
import { useUserStore } from "@/store/useUserStore";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const ACCENT = "#8980B8";

const AREA_LABELS: Record<string, string> = {
  emociones:    "Emociones",
  limites:      "Límites",
  relaciones:   "Relaciones",
  autoestima:   "Autoestima",
  estres:       "Estrés y ansiedad",
  mindfulness:  "Mindfulness",
  proposito:    "Propósito",
  comunicacion: "Comunicación",
  general:      "Bienestar general",
};

const AREA_COLORS: Record<string, string> = {
  emociones:    "#E8616A",
  limites:      "#7C3AED",
  relaciones:   "#4D8B7A",
  autoestima:   "#F59E0B",
  estres:       "#3B82F6",
  mindfulness:  "#8980B8",
  proposito:    "#7B6BB5",
  comunicacion: "#059669",
  general:      "#8980B8",
};

const AREA_DESC: Record<string, { strength: string; challenge: string }> = {
  emociones:    { strength: "Tienes buena conciencia emocional. Identificas y procesas lo que sientes.", challenge: "Trabajar tu mundo emocional te dará más estabilidad y claridad interior." },
  limites:      { strength: "Sabes cuidar tu energía y comunicar lo que necesitas.", challenge: "Aprender a poner límites te ayudará a proteger tu bienestar y relaciones." },
  relaciones:   { strength: "Tus vínculos son una fortaleza. Conectas de forma genuina y profunda.", challenge: "Mejorar cómo te relacionas puede transformar tu bienestar significativamente." },
  autoestima:   { strength: "Tienes una relación sana contigo mismo y te valoras como mereces.", challenge: "Fortalecer tu autoestima es el primer paso para todo lo demás." },
  estres:       { strength: "Manejas bien el estrés y tienes recursos para calmarte.", challenge: "Aprender a gestionar el estrés es clave para tu calidad de vida." },
  mindfulness:  { strength: "Vivir el presente es algo natural en ti. Tienes calma interior.", challenge: "Cultivar la presencia plena puede transformar tu experiencia cotidiana." },
  proposito:    { strength: "Sientes claridad sobre tus valores y la dirección de tu vida.", challenge: "Encontrar tu propósito te dará motivación y sentido en cada decisión." },
  comunicacion: { strength: "Te expresas con claridad y escuchas activamente a los demás.", challenge: "Mejorar tu comunicación puede resolver conflictos y profundizar tus vínculos." },
};

interface ResultData {
  scores: Record<string, number>;
  strengths: string[];
  challenges: string[];
}

export default function DiagnosticoResultScreen() {
  const { bottom } = useSafeAreaInsets();
  const { result: raw } = useLocalSearchParams<{ result: string }>();
  const onboarding = useUserStore((s) => s.onboarding);

  const result: ResultData = raw
    ? JSON.parse(raw)
    : { scores: {}, strengths: [], challenges: [] };

  const { scores, strengths, challenges } = result;
  const nombre = onboarding?.nombre;

  const allAreas = Object.keys(scores).filter((a) => a !== "general");

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottom + SPACING * 4 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSub}>Diagnóstico completado</Text>
          <Text style={styles.headerTitle}>
            {nombre ? `${nombre}, esto eres.` : "Tu diagnóstico."}
          </Text>
        </View>

        {/* Barra por área */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Puntaje por área</Text>
          {allAreas.map((area) => {
            const score = scores[area] ?? 0;
            const pct = ((score - 1) / 4) * 100;
            const color = AREA_COLORS[area] ?? ACCENT;
            return (
              <View key={area} style={styles.barRow}>
                <Text style={styles.barLabel}>{AREA_LABELS[area] ?? area}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
                </View>
                <Text style={[styles.barScore, { color }]}>{score.toFixed(1)}</Text>
              </View>
            );
          })}
        </View>

        {/* Fortalezas */}
        {strengths.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>✓ Tus fortalezas</Text>
            {strengths.map((area) => (
              <View key={area} style={[styles.insightRow, { borderLeftColor: AREA_COLORS[area] ?? ACCENT }]}>
                <Text style={[styles.insightArea, { color: AREA_COLORS[area] ?? ACCENT }]}>
                  {AREA_LABELS[area] ?? area}
                </Text>
                <Text style={styles.insightText}>{AREA_DESC[area]?.strength}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Áreas de crecimiento */}
        {challenges.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚡ Áreas de crecimiento</Text>
            {challenges.map((area) => (
              <View key={area} style={[styles.insightRow, { borderLeftColor: AREA_COLORS[area] ?? ACCENT }]}>
                <Text style={[styles.insightArea, { color: AREA_COLORS[area] ?? ACCENT }]}>
                  {AREA_LABELS[area] ?? area}
                </Text>
                <Text style={styles.insightText}>{AREA_DESC[area]?.challenge}</Text>
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.homeBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.replace("/(tab)")}
        >
          <Text style={styles.homeBtnText}>Ir al inicio →</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.retakeBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.replace("/diagnostico-test")}
        >
          <Text style={styles.retakeText}>Repetir evaluación</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { paddingHorizontal: SPACING * 2, paddingTop: SPACING * 2, gap: SPACING * 1.8 },

  header: { gap: 4 },
  headerSub: { fontSize: 12, fontWeight: "600", color: MUTED, textTransform: "uppercase", letterSpacing: 0.8 },
  headerTitle: { fontSize: 28, fontWeight: "900", color: TEXT, letterSpacing: -0.8 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: SPACING * 2,
    gap: SPACING * 1.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 13, fontWeight: "700", color: MUTED, textTransform: "uppercase", letterSpacing: 0.6 },

  barRow: { flexDirection: "row", alignItems: "center", gap: SPACING },
  barLabel: { fontSize: 12, color: TEXT, fontWeight: "600", width: 90 },
  barTrack: { flex: 1, height: 6, backgroundColor: "#F3F4F6", borderRadius: 99, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 99 },
  barScore: { fontSize: 12, fontWeight: "800", width: 28, textAlign: "right" },

  insightRow: {
    borderLeftWidth: 3,
    paddingLeft: SPACING * 1.2,
    gap: 4,
  },
  insightArea: { fontSize: 13, fontWeight: "800" },
  insightText: { fontSize: 12, color: MUTED, lineHeight: 18 },

  homeBtn: {
    backgroundColor: TEXT,
    borderRadius: 16,
    paddingVertical: SPACING * 1.6,
    alignItems: "center",
  },
  homeBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },

  retakeBtn: {
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.3)",
    borderRadius: 14,
    paddingVertical: SPACING * 1.2,
    alignItems: "center",
  },
  retakeText: { fontSize: 13, fontWeight: "600", color: MUTED },
});
