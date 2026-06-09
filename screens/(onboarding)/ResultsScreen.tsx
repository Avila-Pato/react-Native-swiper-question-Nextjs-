import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useUserStore } from "@/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated2, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AreaBarChart } from "@/components/charts/AreaBarChart";
import { ARCHETYPE, AREA_META } from "@/constants/diagnosticData";

// ── Screen ───────────────────────────────────────────────────

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    startNode?: string;
    formacion?: string;
    ramas?: string;
  }>();

  const insets = useSafeAreaInsets();
  const diagnostic = useUserStore((s) => s.diagnostic);
  const scores = diagnostic?.scores ?? {};

  const sortedAreas = Object.entries(scores)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a);

  const topArea = sortedAreas[0]?.[0] ?? "emociones";
  const archetype = ARCHETYPE[topArea] ?? ARCHETYPE.emociones;

  // Top 2 areas for insights
  const insightAreas = sortedAreas.slice(0, 2);

  // Entrance animations
  const tagOp = useSharedValue(0);
  const tagY = useSharedValue(12);
  const cardOp = useSharedValue(0);
  const cardY = useSharedValue(20);
  const insightOp = useSharedValue(0);
  const insightY = useSharedValue(20);
  const chartOp = useSharedValue(0);
  const chartY = useSharedValue(24);
  const btnOp = useSharedValue(0);
  const btnY = useSharedValue(18);

  useEffect(() => {
    tagOp.value = withTiming(1, { duration: 380 });
    tagY.value = withSpring(0, { damping: 16, stiffness: 100 });
    cardOp.value = withDelay(180, withTiming(1, { duration: 420 }));
    cardY.value = withDelay(
      180,
      withSpring(0, { damping: 16, stiffness: 100 }),
    );
    insightOp.value = withDelay(380, withTiming(1, { duration: 420 }));
    insightY.value = withDelay(
      380,
      withSpring(0, { damping: 16, stiffness: 100 }),
    );
    chartOp.value = withDelay(540, withTiming(1, { duration: 420 }));
    chartY.value = withDelay(
      540,
      withSpring(0, { damping: 16, stiffness: 100 }),
    );
    btnOp.value = withDelay(750, withTiming(1, { duration: 350 }));
    btnY.value = withDelay(750, withSpring(0, { damping: 16, stiffness: 110 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tagStyle = useAnimatedStyle(() => ({
    opacity: tagOp.value,
    transform: [{ translateY: tagY.value }],
  }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOp.value,
    transform: [{ translateY: cardY.value }],
  }));
  const insightStyle = useAnimatedStyle(() => ({
    opacity: insightOp.value,
    transform: [{ translateY: insightY.value }],
  }));
  const chartStyle = useAnimatedStyle(() => ({
    opacity: chartOp.value,
    transform: [{ translateY: chartY.value }],
  }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOp.value,
    transform: [{ translateY: btnY.value }],
  }));

  const handleContinue = () => {
    router.replace({
      pathname: "/personal",
      params: {
        startNode: params.startNode ?? "",
        formacion: params.formacion ?? "",
        ramas: params.ramas ?? "",
        _rk: Date.now().toString(),
      },
    });
  };

  return (
    <View style={s.root}>
      <OnboardingProgress step={4} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header tag */}
        <Animated2.View style={[s.tagWrap, tagStyle]}>
          <View style={s.tag}>
            <Text style={s.tagText}>✦ Tu perfil emocional</Text>
          </View>
          <Text style={s.tagSub}>Basado en tus respuestas</Text>
        </Animated2.View>

        {/* Archetype card */}
        <Animated2.View
          style={[
            s.archetypeCard,
            { backgroundColor: archetype.bg },
            cardStyle,
          ]}
        >
          <View style={s.archetypeTop}>
            <View
              style={[
                s.iconCircle,
                { backgroundColor: archetype.color + "20" },
              ]}
            >
              <Ionicons
                name={archetype.icon}
                size={24}
                color={archetype.color}
              />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[s.tipoName, { color: archetype.color }]}>
                {archetype.tipo}
              </Text>
              <Text style={[s.tagline, { color: archetype.color + "AA" }]}>
                {archetype.tagline}
              </Text>
            </View>
          </View>
          <Text style={s.desc}>{archetype.desc}</Text>
          {sortedAreas.length > 0 && (
            <View style={s.pills}>
              {sortedAreas.slice(0, 3).map(([area]) => {
                const meta = AREA_META[area];
                if (!meta) return null;
                return (
                  <View
                    key={area}
                    style={[s.pill, { backgroundColor: meta.color + "1C" }]}
                  >
                    <Text style={[s.pillText, { color: meta.color }]}>
                      {meta.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </Animated2.View>

        {/* Personal insights: top 2 areas */}
        {insightAreas.length > 0 && (
          <Animated2.View style={[s.insightsWrap, insightStyle]}>
            <Text style={s.sectionLabel}>Lo que más resuena contigo</Text>
            <View style={s.insightsList}>
              {insightAreas.map(([area], i) => {
                const meta = AREA_META[area];
                if (!meta) return null;
                return (
                  <View
                    key={area}
                    style={[s.insightRow, { borderLeftColor: meta.color }]}
                  >
                    <View style={s.insightHeader}>
                      <View
                        style={[s.insightDot, { backgroundColor: meta.color }]}
                      />
                      <Text style={[s.insightArea, { color: meta.color }]}>
                        {meta.label}
                      </Text>
                      {i === 0 && (
                        <View
                          style={[
                            s.insightBadge,
                            { backgroundColor: meta.color + "18" },
                          ]}
                        >
                          <Text
                            style={[s.insightBadgeText, { color: meta.color }]}
                          >
                            Principal
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={s.insightText}>{meta.insight}</Text>
                  </View>
                );
              })}
            </View>
          </Animated2.View>
        )}

        {/* Bar chart */}
        {sortedAreas.length > 0 && (
          <Animated2.View style={[s.chartCard, chartStyle]}>
            <Text style={s.chartTitle}>Intensidad por área</Text>
            <AreaBarChart areas={sortedAreas} />
          </Animated2.View>
        )}
      </ScrollView>

      {/* Fixed bottom button */}
      <Animated2.View
        style={[s.btnWrap, { paddingBottom: insets.bottom + 10 }, btnStyle]}
      >
        <TouchableOpacity
          style={s.btn}
          onPress={handleContinue}
          activeOpacity={0.82}
        >
          <Text style={s.btnText}>Continuar</Text>
        </TouchableOpacity>
      </Animated2.View>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FAF8F5" },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    gap: 14,
  },

  // Tag header
  tagWrap: { alignItems: "center", gap: 4 },
  tag: {
    backgroundColor: "rgba(137,128,184,0.1)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.2)",
  },
  tagText: {
    color: "#8980B8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  tagSub: {
    fontSize: 11,
    color: "rgba(28,27,41,0.35)",
    fontWeight: "400",
  },

  // Archetype card
  archetypeCard: {
    borderRadius: 22,
    padding: 20,
    gap: 14,
    shadowColor: "#1C1B29",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  archetypeTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  tipoName: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  tagline: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "italic",
  },
  desc: {
    fontSize: 13.5,
    color: "rgba(28,27,41,0.58)",
    lineHeight: 21,
    fontWeight: "400",
  },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  pill: { borderRadius: 20, paddingHorizontal: 11, paddingVertical: 4 },
  pillText: { fontSize: 11, fontWeight: "700" },

  // Insights
  insightsWrap: { gap: 10 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(28,27,41,0.35)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: 2,
  },
  insightsList: { gap: 8 },
  insightRow: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderLeftWidth: 3,
    shadowColor: "#1C1B29",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  insightDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  insightArea: {
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  insightBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  insightBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  insightText: {
    fontSize: 13,
    color: "rgba(28,27,41,0.55)",
    lineHeight: 20,
    fontWeight: "400",
  },

  // Chart
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    paddingBottom: 16,
    gap: 16,
    shadowColor: "#1C1B29",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(28,27,41,0.35)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // Button
  btnWrap: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    paddingTop: 12,
    backgroundColor: "#FAF8F5",
    borderTopWidth: 1,
    borderTopColor: "rgba(137,128,184,0.08)",
    gap: 10,
  },
  btn: {
    backgroundColor: "#8980B8",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#8980B8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  hint: {
    textAlign: "center",
    color: "rgba(28,27,41,0.35)",
    fontSize: 11,
    fontWeight: "400",
  },
});
