import { SPACING } from "@/constants/constants";
import { BG, MUTED, TEXT } from "@/constants/theme";
import { selectQuestions } from "@/data/diagnosticQuestions";
import { useUserStore } from "@/store/useUserStore";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import { useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: W } = Dimensions.get("window");
const ACCENT = "#8980B8";
const CIRCLE_SIZE = Math.min(52, (W - SPACING * 8) / 5);

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

const LABELS = ["Totalmente\nen desacuerdo", "Totalmente\nde acuerdo"];

function computeResults(
  questions: ReturnType<typeof selectQuestions>,
  answers: Record<string, number>,
) {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const q of questions) {
    const raw = answers[q.id];
    if (raw === undefined) continue;
    const score = q.inverted ? 6 - raw : raw; // invertir si aplica
    sums[q.area] = (sums[q.area] ?? 0) + score;
    counts[q.area] = (counts[q.area] ?? 0) + 1;
  }

  const scores: Record<string, number> = {};
  for (const area of Object.keys(sums)) {
    scores[area] = Math.round((sums[area] / counts[area]) * 10) / 10;
  }

  const strengths = Object.entries(scores)
    .filter(([a, v]) => a !== "general" && v >= 3.5)
    .map(([a]) => a);

  const challenges = Object.entries(scores)
    .filter(([a, v]) => a !== "general" && v <= 2.5)
    .map(([a]) => a);

  return { scores, strengths, challenges };
}

export default function DiagnosticoTestScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const onboarding = useUserStore((s) => s.onboarding);
  const saveDiagnostic = useUserStore((s) => s.saveDiagnostic);

  const questions = useRef(
    selectQuestions(onboarding?.areas ?? [], onboarding?.goals ?? []),
  ).current;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const processing = useRef(false);

  const fadeOpacity = useSharedValue(1);
  const slideX = useSharedValue(0);

  const current = questions[step];
  const progress = (step + 1) / questions.length;
  const areaColor = AREA_COLORS[current?.area ?? "general"] ?? ACCENT;

  const questionStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
    transform: [{ translateX: slideX.value }],
  }));

  const animateTransition = (onDone: () => void) => {
    fadeOpacity.value = withTiming(0, { duration: 160 }, () => {
      slideX.value = -20;
      runOnJS(onDone)();
      slideX.value = withSpring(0, { damping: 20, stiffness: 260 });
      fadeOpacity.value = withTiming(1, { duration: 200 });
    });
  };

  const handleAnswer = (value: number) => {
    if (processing.current) return;
    processing.current = true;
    setSelected(value);

    const newAnswers = { ...answers, [current.id]: value };

    setTimeout(() => {
      animateTransition(() => {
        if (step + 1 >= questions.length) {
          const result = computeResults(questions, newAnswers);
          saveDiagnostic(result);
          router.replace({
            pathname: "/diagnostico-result",
            params: { result: JSON.stringify(result) },
          });
        } else {
          setStep((s) => s + 1);
          setSelected(null);
          setAnswers(newAnswers);
          processing.current = false;
        }
      });
    }, 260);
  };

  if (!current) return null;

  return (
    <View style={[styles.root, { paddingTop: top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: areaColor }]}
          />
        </View>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
          <X size={17} color={MUTED} />
        </Pressable>
      </View>

      <Text style={styles.stepLabel}>{step + 1} / {questions.length}</Text>

      <Animated.View style={[styles.questionWrap, questionStyle]}>
        <Text style={[styles.questionText]}>{current.text}</Text>
      </Animated.View>

      <View style={{ flex: 1 }} />

      <View style={[styles.scaleWrap, { paddingBottom: bottom + SPACING * 2 }]}>
        <View style={styles.circlesRow}>
          {[1, 2, 3, 4, 5].map((val) => {
            const isSel = selected === val;
            return (
              <Pressable key={val} onPress={() => handleAnswer(val)} style={styles.circleWrap}>
                <View
                  style={[
                    styles.circle,
                    { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2 },
                    isSel && { backgroundColor: areaColor, borderColor: areaColor },
                    !isSel && { borderColor: areaColor + "66" },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
        <View style={styles.labelsRow}>
          <Text style={styles.scaleLabel}>{LABELS[0]}</Text>
          <Text style={[styles.scaleLabel, { textAlign: "right" }]}>{LABELS[1]}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG, paddingHorizontal: SPACING * 2.5 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING * 1.2,
    paddingVertical: SPACING * 1.5,
  },
  iconBtn: { padding: 4 },
  backArrow: { fontSize: 20, color: MUTED, fontWeight: "600" },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 99 },

  stepLabel: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: MUTED,
    marginTop: SPACING * 2,
    marginBottom: SPACING * 2.5,
    letterSpacing: 0.3,
  },

  questionWrap: {
    alignItems: "center",
    paddingHorizontal: SPACING,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT,
    textAlign: "center",
    lineHeight: 32,
    letterSpacing: -0.3,
  },

  scaleWrap: { gap: SPACING * 1.2, paddingHorizontal: SPACING * 0.5 },
  circlesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circleWrap: { padding: 6 },
  circle: { borderWidth: 2.5, backgroundColor: "transparent" },
  labelsRow: { flexDirection: "row", justifyContent: "space-between" },
  scaleLabel: { fontSize: 11, color: MUTED, fontWeight: "500", lineHeight: 16, maxWidth: 110 },
});
