import { SPACING } from "@/constants/constants";
import { BG, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { Challenge, ChallengeQuestion } from "@/types/challenges";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_H } = Dimensions.get("window");
const SHEET_H = SCREEN_H * 0.9;
const DISMISS_THRESHOLD = SHEET_H * 0.25;

type Props = {
  challenge: Challenge;
  initialStep: number;
  onClose: (answeredCount: number) => void;
};

type AnswerState = "idle" | "correct" | "wrong";

export function ChallengeSheet({ challenge, initialStep, onClose }: Props) {
  const translateY = useSharedValue(SHEET_H);
  const backdropOpacity = useSharedValue(0);

  const [step, setStep] = useState(initialStep);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const totalSteps = challenge.questions.length;
  const currentQ: ChallengeQuestion | undefined = challenge.questions[step];

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 160,
      mass: 0.85,
    });
    backdropOpacity.value = withTiming(1, { duration: 220 });
  }, []);

  const dismiss = useCallback(
    (answered: number) => {
      translateY.value = withTiming(
        SHEET_H,
        { duration: 420, easing: Easing.in(Easing.cubic) },
        () => runOnJS(onClose)(answered),
      );
      backdropOpacity.value = withTiming(0, { duration: 400 });
    },
    [onClose],
  );

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD || e.velocityY > 1200) {
        runOnJS(dismiss)(step);
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleSelect = (index: number) => {
    if (answerState !== "idle") return;
    setSelected(index);
    const isCorrect = index === currentQ.correctIndex;
    setAnswerState(isCorrect ? "correct" : "wrong");
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    const nextStep = step + 1;
    if (nextStep >= totalSteps) {
      setDone(true);
    } else {
      setStep(nextStep);
      setSelected(null);
      setAnswerState("idle");
    }
  };

  const isVerdadMito = challenge.id === "verdad_mito";

  const optionColor = (index: number): string => {
    if (answerState === "idle") return CARD_BG;
    if (index === currentQ.correctIndex) return "#DCFCE7";
    if (index === selected) return "#FEE2E2";
    return CARD_BG;
  };

  const optionBorder = (index: number): string => {
    if (answerState === "idle") return "#E5E7EB";
    if (index === currentQ.correctIndex) return "#059669";
    if (index === selected) return "#DC2626";
    return "#E5E7EB";
  };

  const optionTextColor = (index: number): string => {
    if (answerState === "idle") return TEXT;
    if (index === currentQ.correctIndex) return "#059669";
    if (index === selected) return "#DC2626";
    return MUTED;
  };

  return (
    <Modal transparent animationType="none" statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Backdrop */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => dismiss(step)}
        >
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </Pressable>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, sheetStyle]}>
            {/* Handle */}
            <View style={styles.handle} />

            {done ? (
              /* ── Results ── */
              <View style={styles.results}>
                <Text style={styles.resultEmoji}>
                  {correctCount === totalSteps
                    ? "🏆"
                    : correctCount >= totalSteps / 2
                      ? "🎯"
                      : "💪"}
                </Text>
                <Text style={styles.resultTitle}>
                  {correctCount === totalSteps
                    ? "¡Perfecto!"
                    : correctCount >= totalSteps / 2
                      ? "¡Bien hecho!"
                      : "¡Sigue practicando!"}
                </Text>
                <Text style={styles.resultScore}>
                  {correctCount} de {totalSteps} correctas
                </Text>
                <View style={styles.starsRow}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Text
                      key={i}
                      style={{
                        fontSize: 28,
                        opacity:
                          i < Math.ceil((correctCount / totalSteps) * 3)
                            ? 1
                            : 0.25,
                      }}
                    >
                      ⭐
                    </Text>
                  ))}
                </View>
                <Pressable
                  style={[styles.nextBtn, { backgroundColor: challenge.color }]}
                  onPress={() => dismiss(totalSteps)}
                >
                  <Text style={styles.nextBtnText}>Cerrar</Text>
                </Pressable>
              </View>
            ) : (
              /* ── Question flow ── */
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
              >
                {/* Progress bar */}
                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(step / totalSteps) * 100}%`,
                          backgroundColor: challenge.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>
                    {step + 1}/{totalSteps}
                  </Text>
                </View>

                {/* Challenge title */}
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: challenge.color + "20" },
                  ]}
                >
                  {/* <Text style={styles.typeBadgeText}>{challenge.emoji} {challenge.title}</Text> */}
                </View>

                {/* Difficulty badge for completa_codigo */}
                {/* {currentQ.difficulty && (
                  <Text style={styles.diffLabel}>{currentQ.difficulty}</Text>
                )} */}

                {/* Statement */}
                <Text style={styles.statement}>{currentQ.statement}</Text>

                {/* Code block */}
                {currentQ.code && (
                  <View style={styles.codeBlock}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <Text style={styles.codeText}>{currentQ.code}</Text>
                    </ScrollView>
                  </View>
                )}

                {/* Options */}
                <View
                  style={isVerdadMito ? styles.optionsRow : styles.optionsCol}
                >
                  {currentQ.options.map((opt, i) => (
                    <Pressable
                      key={i}
                      style={[
                        isVerdadMito ? styles.optionBig : styles.option,
                        {
                          backgroundColor: optionColor(i),
                          borderColor: optionBorder(i),
                        },
                      ]}
                      onPress={() => handleSelect(i)}
                    >
                      {!isVerdadMito && (
                        <View
                          style={[
                            styles.optionLetter,
                            { borderColor: optionBorder(i) },
                          ]}
                        >
                          <Text
                            style={[
                              styles.optionLetterText,
                              { color: optionTextColor(i) },
                            ]}
                          >
                            {String.fromCharCode(65 + i)}
                          </Text>
                        </View>
                      )}
                      <Text
                        style={[
                          isVerdadMito
                            ? styles.optionBigText
                            : styles.optionText,
                          {
                            color: optionTextColor(i),
                            flex: isVerdadMito ? undefined : 1,
                          },
                        ]}
                      >
                        {opt}
                      </Text>
                      {answerState !== "idle" &&
                        i === currentQ.correctIndex && (
                          <Text style={styles.optionCheck}>✓</Text>
                        )}
                      {answerState !== "idle" &&
                        i === selected &&
                        i !== currentQ.correctIndex && (
                          <Text style={styles.optionX}>✗</Text>
                        )}
                    </Pressable>
                  ))}
                </View>

                {/* Explanation + Next */}
                {answerState !== "idle" && (
                  <View
                    style={[
                      styles.explanationBox,
                      {
                        borderLeftColor:
                          answerState === "correct" ? "#059669" : "#DC2626",
                      },
                    ]}
                  >
                    <Text style={styles.explanationTitle}>
                      {answerState === "correct"
                        ? "✅ ¡Correcto!"
                        : "❌ Incorrecto"}
                    </Text>
                    <Text style={styles.explanationText}>
                      {currentQ.explanation}
                    </Text>
                  </View>
                )}

                {answerState !== "idle" && (
                  <Pressable
                    style={[
                      styles.nextBtn,
                      { backgroundColor: challenge.color },
                    ]}
                    onPress={handleNext}
                  >
                    <Text style={styles.nextBtnText}>
                      {step + 1 >= totalSteps
                        ? "Ver resultado →"
                        : "Siguiente →"}
                    </Text>
                  </Pressable>
                )}

                <View style={{ height: 32 }} />
              </ScrollView>
            )}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_H,
    backgroundColor: BG,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  content: {
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING,
    marginBottom: SPACING * 1.5,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
    minWidth: 32,
    textAlign: "right",
  },
  typeBadge: {
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: SPACING,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT,
  },
  diffLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statement: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT,
    lineHeight: 27,
    marginBottom: SPACING * 1.5,
  },
  codeBlock: {
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: SPACING * 1.5,
    marginBottom: SPACING * 2,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#E2E8F0",
    lineHeight: 22,
  },
  optionsCol: {
    gap: SPACING,
    marginBottom: SPACING * 1.5,
  },
  optionsRow: {
    flexDirection: "row",
    gap: SPACING,
    marginBottom: SPACING * 1.5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    padding: SPACING * 1.2,
    gap: SPACING,
  },
  optionBig: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: SPACING * 2,
  },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLetterText: {
    fontSize: 12,
    fontWeight: "800",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  optionBigText: {
    fontSize: 16,
    fontWeight: "800",
  },
  optionCheck: {
    fontSize: 16,
    color: "#059669",
    fontWeight: "900",
    marginLeft: "auto",
  },
  optionX: {
    fontSize: 16,
    color: "#DC2626",
    fontWeight: "900",
    marginLeft: "auto",
  },
  explanationBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderLeftWidth: 4,
    padding: SPACING * 1.5,
    marginBottom: SPACING * 1.5,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 20,
  },
  nextBtn: {
    borderRadius: 16,
    paddingVertical: SPACING * 1.6,
    alignItems: "center",
    marginBottom: SPACING,
  },
  nextBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  // Results
  results: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING * 3,
    gap: SPACING,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: SPACING,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: TEXT,
    textAlign: "center",
  },
  resultScore: {
    fontSize: 16,
    color: MUTED,
    fontWeight: "600",
  },
  starsRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: SPACING,
  },
});
