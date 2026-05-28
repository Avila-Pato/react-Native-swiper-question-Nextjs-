import { SPACING } from "@/constants/constants";
import { BG, MUTED, TEXT } from "@/constants/theme";
import { QUESTIONS, ROLES } from "@/data/roleTestData";
import { RoleKey, RoleScores } from "@/types/roleTest";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
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
const ACCENT = "#34D59A";
const CIRCLE_SIZE = Math.min(52, (W - SPACING * 8) / 5);

const LABELS = ["Totalmente\nen desacuerdo", "Totalmente\nde acuerdo"];
const LETTERS = ["A", "B", "C", "D"];

function computeScores(
  likertAnswers: Record<number, number>,
  choiceAnswers: Record<number, RoleKey>
): RoleScores {
  const scores: RoleScores = { limites: 0, autoconocimiento: 0, vinculos: 0, felicidad: 0, proposito: 0 };
  QUESTIONS.forEach((q) => {
    if (!q.type || q.type === "likert") {
      if (q.role) scores[q.role] = (scores[q.role] ?? 0) + (likertAnswers[q.id] ?? 0);
    } else {
      const chosen = choiceAnswers[q.id];
      if (chosen) scores[chosen] = (scores[chosen] ?? 0) + 4;
    }
  });
  return scores;
}

export default function RoleTestQuestionScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [choiceAnswers, setChoiceAnswers] = useState<Record<number, RoleKey>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [pendingScores, setPendingScores] = useState<string | null>(null);
  const processing = useRef(false);

  useEffect(() => {
    if (pendingScores) {
      router.replace({ pathname: "/role-result", params: { scores: pendingScores } });
    }
  }, [pendingScores]);

  const fadeOpacity = useSharedValue(1);
  const slideX = useSharedValue(0);

  const current = QUESTIONS[step];
  const progress = (step + 1) / QUESTIONS.length;
  const isChoice = current?.type === "choice";

  const animateTransition = (onDone: () => void) => {
    fadeOpacity.value = withTiming(0, { duration: 180 }, () => {
      slideX.value = -20;
      runOnJS(onDone)();
      slideX.value = withSpring(0, { damping: 20, stiffness: 260 });
      fadeOpacity.value = withTiming(1, { duration: 220 });
    });
  };

  const questionStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
    transform: [{ translateX: slideX.value }],
  }));

  const advance = (
    newLikert: Record<number, number>,
    newChoice: Record<number, RoleKey>
  ) => {
    animateTransition(() => {
      if (step + 1 >= QUESTIONS.length) {
        setPendingScores(JSON.stringify(computeScores(newLikert, newChoice)));
      } else {
        setStep((s) => s + 1);
        setSelected(null);
        setAnswers(newLikert);
        setChoiceAnswers(newChoice);
        processing.current = false;
      }
    });
  };

  const handleLikert = (value: number) => {
    if (processing.current) return;
    processing.current = true;
    setSelected(value);
    const newAnswers = { ...answers, [current.id]: value };
    setTimeout(() => advance(newAnswers, choiceAnswers), 280);
  };

  const handleChoice = (idx: number, role: RoleKey) => {
    if (processing.current) return;
    processing.current = true;
    setSelected(idx);
    const newChoice = { ...choiceAnswers, [current.id]: role };
    setTimeout(() => advance(answers, newChoice), 320);
  };

  if (!current) return null;

  const roleColor = ROLES.find((r) => r.key === current.role)?.color ?? ACCENT;

  return (
    <View style={[styles.root, { paddingTop: top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
          <X size={17} color={MUTED} />
        </Pressable>
      </View>

      {/* Step counter */}
      <Text style={styles.stepLabel}>{step + 1} / {QUESTIONS.length}</Text>

      {/* Question */}
      <Animated.View style={[styles.questionWrap, questionStyle]}>
        {isChoice && (
          <View style={styles.choiceBadge}>
            <Text style={styles.choiceBadgeText}>Elige una opción</Text>
          </View>
        )}
        <Text style={styles.questionText}>{current.text}</Text>
      </Animated.View>

      {/* Answer area */}
      {isChoice ? (
        <View style={[styles.choiceList, { paddingBottom: bottom + SPACING * 2 }]}>
          {current.options!.map((opt, idx) => {
            const isSel = selected === idx;
            return (
              <Pressable
                key={idx}
                onPress={() => handleChoice(idx, opt.role)}
                style={({ pressed }) => [
                  styles.choiceCard,
                  isSel && styles.choiceCardSelected,
                  pressed && !isSel && styles.choiceCardPressed,
                ]}
              >
                <View style={[styles.letterBadge, isSel && styles.letterBadgeSelected]}>
                  <Text style={[styles.letterText, isSel && styles.letterTextSelected]}>
                    {LETTERS[idx]}
                  </Text>
                </View>
                <Text style={[styles.optionText, isSel && styles.optionTextSelected]}>
                  {opt.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <>
          <View style={{ flex: 1 }} />
          <View style={[styles.scaleWrap, { paddingBottom: bottom + SPACING * 2 }]}>
            <View style={styles.circlesRow}>
              {[1, 2, 3, 4, 5].map((val) => {
                const isSel = selected === val;
                return (
                  <Pressable key={val} onPress={() => handleLikert(val)} style={styles.circleWrap}>
                    <View
                      style={[
                        styles.circle,
                        { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2 },
                        isSel && { backgroundColor: roleColor, borderColor: roleColor },
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: SPACING * 2.5,
  },

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
  progressFill: {
    height: "100%",
    backgroundColor: ACCENT,
    borderRadius: 99,
  },

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
    gap: SPACING,
  },
  choiceBadge: {
    backgroundColor: "#F3F4F6",
    borderRadius: 99,
    paddingHorizontal: SPACING * 1.2,
    paddingVertical: SPACING * 0.4,
  },
  choiceBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT,
    textAlign: "center",
    lineHeight: 32,
    letterSpacing: -0.3,
  },

  /* ── Choice options ── */
  choiceList: {
    marginTop: SPACING * 2.5,
    gap: SPACING,
  },
  choiceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    padding: SPACING * 1.5,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING * 1.2,
  },
  choiceCardSelected: {
    backgroundColor: "#F0FDF8",
    borderColor: ACCENT,
  },
  choiceCardPressed: {
    backgroundColor: "#F9FAFB",
  },
  letterBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  letterBadgeSelected: {
    backgroundColor: ACCENT,
  },
  letterText: {
    fontSize: 13,
    fontWeight: "700",
    color: MUTED,
  },
  letterTextSelected: {
    color: "#FFFFFF",
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    lineHeight: 20,
  },
  optionTextSelected: {
    fontWeight: "600",
    color: TEXT,
  },

  /* ── Likert scale ── */
  scaleWrap: {
    gap: SPACING * 1.2,
    paddingHorizontal: SPACING * 0.5,
  },
  circlesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circleWrap: { padding: 6 },
  circle: {
    borderWidth: 2.5,
    borderColor: ACCENT,
    backgroundColor: "transparent",
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleLabel: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "500",
    lineHeight: 16,
    maxWidth: 110,
  },
});
