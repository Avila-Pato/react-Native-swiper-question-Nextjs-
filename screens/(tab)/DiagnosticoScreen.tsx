import { SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import { BG, MUTED, TEXT } from "@/constants/theme";
import { useUserStore } from "@/store/useUserStore";
import { router } from "expo-router";
import { Brain, Sparkles } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const ACCENT = "#8980B8";
const BAR_HEIGHT = TAB_ITEM_SIZE + SPACING * 1.5;

const AREA_LABELS: Record<string, string> = {
  emociones: "Emociones",
  limites: "Límites",
  relaciones: "Relaciones",
  autoestima: "Autoestima",
  estres: "Estrés y ansiedad",
  mindfulness: "Mindfulness",
  proposito: "Propósito",
  comunicacion: "Comunicación",
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
};

export default function DiagnosticoScreen() {
  const { bottom } = useSafeAreaInsets();
  const onboarding = useUserStore((s) => s.onboarding);
  const diagnostic = useUserStore((s) => s.diagnostic);

  const areas = onboarding?.areas ?? [];
  const nombre = onboarding?.nombre;

  if (diagnostic?.completed) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: BAR_HEIGHT + bottom + SPACING * 2 }}
        >
          <View style={styles.hero}>
            <View style={styles.iconWrap}>
              <Brain size={32} color={ACCENT} strokeWidth={1.6} />
            </View>
            <Text style={styles.eyebrow}>Tu diagnóstico</Text>
            <Text style={styles.heroTitle}>
              {nombre ? `${nombre},\n` : ""}tu mente al descubierto.
            </Text>
            <Text style={styles.heroSub}>
              Completaste tu evaluación el{" "}
              {new Date(diagnostic.completedAt).toLocaleDateString("es", {
                day: "numeric", month: "long",
              })}.
            </Text>
          </View>

          {/* Resultados rápidos */}
          {diagnostic.strengths.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Tus fortalezas</Text>
              {diagnostic.strengths.map((area) => (
                <View key={area} style={[styles.resultRow, { borderLeftColor: AREA_COLORS[area] ?? ACCENT }]}>
                  <View style={[styles.dot, { backgroundColor: AREA_COLORS[area] ?? ACCENT }]} />
                  <Text style={styles.resultText}>{AREA_LABELS[area] ?? area}</Text>
                  <Text style={styles.resultBadge}>✓ Fortaleza</Text>
                </View>
              ))}
            </View>
          )}

          {diagnostic.challenges.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Áreas de oportunidad</Text>
              {diagnostic.challenges.map((area) => (
                <View key={area} style={[styles.resultRow, { borderLeftColor: AREA_COLORS[area] ?? ACCENT }]}>
                  <View style={[styles.dot, { backgroundColor: AREA_COLORS[area] ?? ACCENT }]} />
                  <Text style={styles.resultText}>{AREA_LABELS[area] ?? area}</Text>
                  <Text style={[styles.resultBadge, { color: "#F59E0B" }]}>⚡ Potencial</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
              onPress={() => router.push("/diagnostico-test")}
            >
              <Text style={styles.ctaText}>Ver diagnóstico completo</Text>
              <Text style={styles.ctaArrow}>→</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.retakeBtn, pressed && { opacity: 0.7 }]}
              onPress={() => router.push("/diagnostico-test")}
            >
              <Text style={styles.retakeText}>Repetir evaluación</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: BAR_HEIGHT + bottom + SPACING * 2 }}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.iconWrap}>
            <Sparkles size={32} color={ACCENT} strokeWidth={1.6} />
          </View>
          <Text style={styles.eyebrow}>Diagnóstico personalizado</Text>
          <Text style={styles.heroTitle}>
            {nombre ? `${nombre},\n` : ""}conoce tu mente.
          </Text>
          <Text style={styles.heroSub}>
            20 preguntas adaptadas a ti para identificar tus fortalezas y áreas
            de crecimiento según lo que elegiste.
          </Text>
        </View>

        {/* Áreas que se evaluarán */}
        {areas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Lo que evaluaremos</Text>
            <View style={styles.chipsRow}>
              {areas.map((area) => (
                <View
                  key={area}
                  style={[styles.areaChip, { borderColor: (AREA_COLORS[area] ?? ACCENT) + "44" }]}
                >
                  <View style={[styles.chipDot, { backgroundColor: AREA_COLORS[area] ?? ACCENT }]} />
                  <Text style={styles.chipLabel}>{AREA_LABELS[area] ?? area}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>20</Text>
            <Text style={styles.statLabel}>preguntas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5'</Text>
            <Text style={styles.statLabel}>duración</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>personalizado</Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
            onPress={() => router.push("/diagnostico-test")}
          >
            <Text style={styles.ctaText}>Comenzar diagnóstico</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  hero: {
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 2.5,
    paddingBottom: SPACING * 2,
    gap: SPACING * 0.8,
    alignItems: "center",
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#EDE9F8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING * 0.5,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "600",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -1.2,
    lineHeight: 40,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 300,
    marginTop: SPACING * 0.5,
  },

  section: {
    marginHorizontal: SPACING * 2,
    marginBottom: SPACING * 1.5,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: SPACING,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING * 0.7,
  },
  areaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  chipDot: { width: 7, height: 7, borderRadius: 4 },
  chipLabel: { fontSize: 12, fontWeight: "600", color: TEXT },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: SPACING * 1.4,
    paddingHorizontal: SPACING * 2,
    marginHorizontal: SPACING * 2,
    marginBottom: SPACING * 2,
  },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statValue: { fontSize: 20, fontWeight: "800", color: TEXT, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: MUTED, fontWeight: "500" },
  statDivider: { width: 1, height: 32, backgroundColor: "#F3F4F6" },

  actions: { paddingHorizontal: SPACING * 2, gap: SPACING },

  cta: {
    backgroundColor: TEXT,
    borderRadius: 16,
    paddingVertical: SPACING * 1.6,
    paddingHorizontal: SPACING * 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  ctaArrow: { fontSize: 18, color: ACCENT, fontWeight: "800" },

  retakeBtn: {
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.3)",
    borderRadius: 14,
    paddingVertical: SPACING * 1.2,
    alignItems: "center",
  },
  retakeText: { fontSize: 13, fontWeight: "600", color: MUTED },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: SPACING * 1.2,
    marginBottom: SPACING * 0.7,
    borderLeftWidth: 4,
    gap: SPACING,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  resultText: { flex: 1, fontSize: 14, fontWeight: "600", color: TEXT },
  resultBadge: { fontSize: 12, fontWeight: "700", color: "#4D8B7A" },
});
