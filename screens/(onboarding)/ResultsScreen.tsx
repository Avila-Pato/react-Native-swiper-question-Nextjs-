import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useUserStore } from "@/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
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

// ── Data ─────────────────────────────────────────────────────

const AREA_META: Record<
  string,
  { label: string; short: string; color: string; bg: string; insight: string }
> = {
  emociones: {
    label: "Emociones",
    short: "Emoc.",
    color: "#C45E7A",
    bg: "#FFF0F5",
    insight:
      "Tus emociones son profundas e intensas. Necesitas espacio para procesarlas sin juzgarte.",
  },
  limites: {
    label: "Límites",
    short: "Límites",
    color: "#4A80C4",
    bg: "#EAF4FF",
    insight:
      "Decir que no te cuesta energía. Establecer límites sanos es tu mayor oportunidad.",
  },
  relaciones: {
    label: "Relaciones",
    short: "Relac.",
    color: "#7B68BF",
    bg: "#F4EEFA",
    insight:
      "Los vínculos son centrales en tu vida. Nutrir conexiones auténticas te impulsa.",
  },
  autoestima: {
    label: "Autoestima",
    short: "Autoest.",
    color: "#C49030",
    bg: "#FFFAEC",
    insight:
      "Tu relación contigo mismo/a es el punto de partida. Reconocer tu valor es el primer paso.",
  },
  estres: {
    label: "Estrés",
    short: "Estrés",
    color: "#C46030",
    bg: "#FFF4EE",
    insight:
      "La presión del día a día te afecta más de lo que muestras. Necesitas herramientas reales.",
  },
  mindfulness: {
    label: "Mindfulness",
    short: "Mindful",
    color: "#3B9A5A",
    bg: "#EEF7F1",
    insight:
      "Estar presente te resulta difícil. Tu mente viaja al pasado o al futuro con frecuencia.",
  },
  proposito: {
    label: "Propósito",
    short: "Propós.",
    color: "#8980B8",
    bg: "#F4EEFA",
    insight:
      "Necesitas sentir que lo que haces tiene dirección. El significado diario te motiva.",
  },
  comunicacion: {
    label: "Comunicación",
    short: "Comunic.",
    color: "#5B9EC9",
    bg: "#EAF4FF",
    insight:
      "Expresar lo que sientes o necesitas a veces se bloquea. Tu voz merece ser escuchada.",
  },
};

type ArchetypeEntry = {
  tipo: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  tagline: string;
  desc: string;
  color: string;
  bg: string;
};

const ARCHETYPE: Record<string, ArchetypeEntry> = {
  emociones: {
    tipo: "El Sensible",
    icon: "water",
    tagline: "Siente profundo, vive auténtico.",
    desc: "Tienes una capacidad emocional que pocos comprenden. Tu reto es aprender a fluir con eso sin desbordarte.",
    color: "#C45E7A",
    bg: "#FFF0F5",
  },
  relaciones: {
    tipo: "El Conector",
    icon: "people",
    tagline: "Tu fuerza vive en los vínculos.",
    desc: "Eres alguien que nutre a quienes lo rodean. Aprender a recibir tanto como das es tu próximo paso.",
    color: "#7B68BF",
    bg: "#F4EEFA",
  },
  autoestima: {
    tipo: "El Buscador",
    icon: "star",
    tagline: "Tu camino empieza en ti.",
    desc: "Estás en un proceso poderoso de reconocer tu valor. Cada pequeño avance en esa dirección importa.",
    color: "#C49030",
    bg: "#FFFAEC",
  },
  estres: {
    tipo: "El Resiliente",
    icon: "flash",
    tagline: "La presión te fortalece.",
    desc: "Has aprendido a funcionar bajo tensión, pero tu cuerpo y mente necesitan más que sobrevivir.",
    color: "#C46030",
    bg: "#FFF4EE",
  },
  mindfulness: {
    tipo: "El Presente",
    icon: "leaf",
    tagline: "Aquí y ahora es donde vives.",
    desc: "La calma no está lejos. Está en el acto simple de pausar y observar, un momento a la vez.",
    color: "#3B9A5A",
    bg: "#EEF7F1",
  },
  limites: {
    tipo: "El Guardián",
    icon: "shield-checkmark",
    tagline: "Proteger tu energía es un acto de amor.",
    desc: "Tienes un corazón generoso. Aprender cuándo decir no es la habilidad que más te liberará.",
    color: "#4A80C4",
    bg: "#EAF4FF",
  },
  proposito: {
    tipo: "El Visionario",
    icon: "compass",
    tagline: "Cada día puede tener sentido.",
    desc: "Buscas que lo que haces tenga dirección real. Encontrar ese hilo conductor es tu trabajo ahora.",
    color: "#8980B8",
    bg: "#F4EEFA",
  },
  comunicacion: {
    tipo: "El Expresivo",
    icon: "chatbubbles",
    tagline: "Tu voz tiene algo importante que decir.",
    desc: "Sabes lo que sientes, pero encontrar las palabras para expresarlo es donde creces más.",
    color: "#5B9EC9",
    bg: "#EAF4FF",
  },
};

// ── Bar column ───────────────────────────────────────────────

const BAR_MAX_H = 100;
const GRID_FRACS = [0, 0.33, 0.66, 1];

function BarColumn({
  area,
  score,
  maxScore,
  delay,
  isTop,
}: {
  area: string;
  score: number;
  maxScore: number;
  delay: number;
  isTop: boolean;
}) {
  const meta = AREA_META[area];
  const targetH = maxScore > 0 ? (score / maxScore) * BAR_MAX_H : 0;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const scoreOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: targetH,
          duration: 650,
          easing: Easing.out(Easing.back(1.3)),
          useNativeDriver: false,
        }),
        Animated.timing(scoreOp, {
          toValue: 1,
          duration: 350,
          delay: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!meta) return null;

  return (
    <View style={bc.col}>
      <Animated.Text
        style={[bc.scoreVal, { color: meta.color, opacity: scoreOp }]}
      >
        {score}
      </Animated.Text>
      <View style={bc.track}>
        <Animated.View
          style={[
            bc.fill,
            {
              height: heightAnim,
              backgroundColor: meta.color,
              shadowColor: meta.color,
              shadowOpacity: isTop ? 0.4 : 0.15,
              shadowOffset: { width: 0, height: -2 },
              shadowRadius: isTop ? 8 : 3,
              elevation: isTop ? 5 : 2,
            },
          ]}
        />
      </View>
      <Text
        style={[
          bc.label,
          {
            color: isTop ? meta.color : "rgba(28,27,41,0.38)",
            fontWeight: isTop ? "700" : "500",
          },
        ]}
        numberOfLines={1}
      >
        {meta.short}
      </Text>
    </View>
  );
}

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

  const maxScore = sortedAreas[0]?.[1] ?? 1;
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
            <View style={s.chartArea}>
              {/* Grid lines */}
              <View style={s.gridLines} pointerEvents="none">
                {GRID_FRACS.map((frac) => (
                  <View
                    key={frac}
                    style={[s.gridLine, { bottom: frac * BAR_MAX_H }]}
                  />
                ))}
              </View>
              {/* Bars */}
              <View style={s.barsRow}>
                {sortedAreas.map(([area, score], i) => (
                  <BarColumn
                    key={area}
                    area={area}
                    score={score}
                    maxScore={maxScore}
                    delay={i * 80}
                    isTop={i === 0}
                  />
                ))}
              </View>
            </View>
          </Animated2.View>
        )}
      </ScrollView>

      {/* Fixed bottom button */}
      <Animated2.View style={[s.btnWrap, { paddingBottom: insets.bottom + 10 }, btnStyle]}>
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

const bc = StyleSheet.create({
  col: { flex: 1, alignItems: "center", gap: 5 },
  scoreVal: { fontSize: 12, fontWeight: "800", letterSpacing: -0.3 },
  track: {
    width: "58%",
    height: BAR_MAX_H,
    borderRadius: 8,
    backgroundColor: "rgba(137,128,184,0.09)",
    justifyContent: "flex-end",
    overflow: "visible",
  },
  fill: { borderRadius: 8, width: "100%" },
  label: { fontSize: 9.5, textAlign: "center" },
});

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
  chartArea: {
    height: BAR_MAX_H + 30,
    position: "relative",
    justifyContent: "flex-end",
  },
  gridLines: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    height: BAR_MAX_H,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(137,128,184,0.09)",
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: BAR_MAX_H + 30,
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
