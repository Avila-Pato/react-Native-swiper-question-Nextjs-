import { SPACING } from "@/constants/constants";
import { BG, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import {
  getImprovementQuestionsForChallenge,
  getImprovementQuestionsForConcepts,
} from "@/data/improvementQuestions";
import { Challenge, ChallengeQuestion } from "@/types/challenges";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  onClose: (correct: number, total: number) => void;
};

type AnswerState = "idle" | "correct" | "wrong";

type ReviewData = { title: string; body: string };

const REVIEWS: Record<string, Record<"high" | "mid" | "low", ReviewData>> = {
  adivina_concepto: {
    high: {
      title: "Dominas los conceptos",
      body: "Reconoces los conceptos de bienestar con facilidad. Tienes una comprensión sólida de la salud mental y el autoconocimiento.",
    },
    mid: {
      title: "Vas por buen camino",
      body: "Identificas bien algunos conceptos pero hay áreas que aún se te mezclan. Profundiza en los temas que menos reconociste.",
    },
    low: {
      title: "Sigue explorando",
      body: "El autoconocimiento toma tiempo. Sigue reflexionando sobre estos conceptos y considera lecturas o recursos de bienestar.",
    },
  },
  identifica_patron: {
    high: {
      title: "Excelente percepción",
      body: "Detectas los patrones con claridad. Tu capacidad de observar dinámicas relacionales es muy buena.",
    },
    mid: {
      title: "Buen ojo, hay más por ver",
      body: "Encuentras algunos patrones pero otros más sutiles se te escapan. Sigue practicando la observación de las dinámicas en tus relaciones.",
    },
    low: {
      title: "La percepción se entrena",
      body: "Reconocer patrones relacionales es una habilidad que se desarrolla con práctica y reflexión. Cada situación es una oportunidad de aprendizaje.",
    },
  },
  verdad_mito: {
    high: {
      title: "Cultura de bienestar sólida",
      body: "Distingues los hechos de los mitos con facilidad. Tu conocimiento sobre salud mental y bienestar está muy bien fundamentado.",
    },
    mid: {
      title: "Buena base, algunos huecos",
      body: "Tienes conocimiento general pero algunos conceptos sobre salud mental aún te confunden. Explorar fuentes confiables te ayudará.",
    },
    low: {
      title: "Hay mitos que te confunden",
      body: "El mundo del bienestar tiene mucha información incorrecta circulando. Fuentes confiables, libros especializados y terapia pueden orientarte.",
    },
  },
  completa_reflexion: {
    high: {
      title: "Dominas los principios",
      body: "Conoces bien los conceptos y reflexiones clave de bienestar. Eso se nota en cada respuesta.",
    },
    mid: {
      title: "Buen camino, hay más por aprender",
      body: "Tu comprensión general es buena pero hay principios específicos que aún te fallan. Sigue explorando estos conceptos.",
    },
    low: {
      title: "Refuerza los fundamentos",
      body: "Los conceptos básicos de bienestar son la base de todo. Tómate el tiempo para leer y reflexionar sobre ellos.",
    },
  },
};

function getReview(id: string, pct: number): ReviewData {
  const level = pct >= 80 ? "high" : pct >= 50 ? "mid" : "low";
  return (
    REVIEWS[id]?.[level] ?? {
      title: level === "high" ? "Muy bien" : "Sigue practicando",
      body: "Continúa practicando para mejorar tu resultado.",
    }
  );
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildPracticeQuestions(
  challengeId: string,
  mainQuestions: ChallengeQuestion[],
  results: boolean[],
): ChallengeQuestion[] {
  const failedIndices = results.map((ok, i) => ({ ok, i })).filter((r) => !r.ok).map((r) => r.i);
  if (failedIndices.length === 0) return [];

  if (challengeId === "adivina_concepto") {
    const failedConcepts = [
      ...new Set(
        failedIndices
          .map((i) => (mainQuestions[i] as any).concept as string | undefined)
          .filter(Boolean) as string[],
      ),
    ];
    return getImprovementQuestionsForConcepts(failedConcepts, 3);
  }

  return getImprovementQuestionsForChallenge(challengeId, 3);
}

export function ChallengeSheet({ challenge, onClose }: Props) {
  const translateY = useSharedValue(SHEET_H);
  const backdropOpacity = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);

  const [sessionKey, setSessionKey] = useState(0);
  const questions = useMemo<ChallengeQuestion[]>(
    () => shuffle(challenge.questions),
    [sessionKey, challenge.questions],
  );

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  // Práctica de refuerzo
  const [practiceQuestions, setPracticeQuestions] = useState<ChallengeQuestion[]>([]);
  const [practiceStep, setPracticeStep] = useState(0);
  const [practiceSelected, setPracticeSelected] = useState<number | null>(null);
  const [practiceAnswered, setPracticeAnswered] = useState(false);
  const [practiceResults, setPracticeResults] = useState<boolean[]>([]);
  const [practiceDone, setPracticeDone] = useState(false);

  const totalSteps = questions.length;
  const currentQ: ChallengeQuestion = questions[step];
  const correctCount = results.filter(Boolean).length;

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 160, mass: 0.85 });
    backdropOpacity.value = withTiming(1, { duration: 220 });
  }, []);

  const dismiss = useCallback(
    (correct: number, total: number) => {
      translateY.value = withTiming(
        SHEET_H,
        { duration: 420, easing: Easing.in(Easing.cubic) },
        () => runOnJS(onClose)(correct, total),
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
        runOnJS(dismiss)(done ? correctCount : 0, done ? totalSteps : 0);
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

  // ── Main quiz handlers ──────────────────────────────────────────────────
  const handleSelect = (index: number) => {
    if (answerState !== "idle") return;
    setSelected(index);
    setAnswerState(index === currentQ.correctIndex ? "correct" : "wrong");
  };

  const handleNext = () => {
    const isCorrect = selected === currentQ.correctIndex;
    const nextResults = [...results, isCorrect];
    setResults(nextResults);
    scrollRef.current?.scrollTo({ y: 0, animated: false });

    if (step + 1 >= totalSteps) {
      const pqs = buildPracticeQuestions(challenge.id, questions, nextResults);
      setPracticeQuestions(pqs);
      setDone(true);
    } else {
      setStep(step + 1);
      setSelected(null);
      setAnswerState("idle");
    }
  };

  // ── Practice quiz handlers ──────────────────────────────────────────────
  const handlePracticeSelect = (index: number) => {
    if (practiceAnswered) return;
    setPracticeSelected(index);
    setPracticeAnswered(true);
  };

  const handlePracticeNext = () => {
    const isCorrect =
      practiceSelected === practiceQuestions[practiceStep].correctIndex;
    const next = [...practiceResults, isCorrect];
    setPracticeResults(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });

    if (practiceStep + 1 >= practiceQuestions.length) {
      setPracticeDone(true);
    } else {
      setPracticeStep(practiceStep + 1);
      setPracticeSelected(null);
      setPracticeAnswered(false);
    }
  };

  const handleReplay = () => {
    setSessionKey((k) => k + 1);
    setStep(0);
    setSelected(null);
    setAnswerState("idle");
    setResults([]);
    setDone(false);
    setPracticeQuestions([]);
    setPracticeStep(0);
    setPracticeSelected(null);
    setPracticeAnswered(false);
    setPracticeResults([]);
    setPracticeDone(false);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const isVerdadMito = challenge.id === "verdad_mito";

  const optionBg = (i: number, q: ChallengeQuestion, sel: number | null, state: AnswerState) => {
    if (state === "idle") return CARD_BG;
    if (i === q.correctIndex) return "#DCFCE7";
    if (i === sel) return "#FEE2E2";
    return CARD_BG;
  };
  const optionBorder = (i: number, q: ChallengeQuestion, sel: number | null, state: AnswerState) => {
    if (state === "idle") return "#E5E7EB";
    if (i === q.correctIndex) return "#059669";
    if (i === sel) return "#DC2626";
    return "#E5E7EB";
  };
  const optionColor = (i: number, q: ChallengeQuestion, sel: number | null, state: AnswerState) => {
    if (state === "idle") return TEXT;
    if (i === q.correctIndex) return "#059669";
    if (i === sel) return "#DC2626";
    return MUTED;
  };

  const pct = done ? Math.round((correctCount / totalSteps) * 100) : 0;
  const review = done ? getReview(challenge.id, pct) : null;
  const pctColor = pct >= 80 ? "#059669" : pct >= 50 ? challenge.color : "#DC2626";

  const currentPQ = practiceQuestions[practiceStep];
  const practiceState: AnswerState = practiceAnswered
    ? practiceSelected === currentPQ?.correctIndex
      ? "correct"
      : "wrong"
    : "idle";

  const showButtons = !done || practiceDone || practiceQuestions.length === 0;

  return (
    <Modal transparent animationType="none" statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => dismiss(done ? correctCount : 0, done ? totalSteps : 0)}
        >
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </Pressable>

        <Animated.View style={[styles.sheet, sheetStyle]}>
            <GestureDetector gesture={panGesture}>
              <View style={styles.handleArea}>
                <View style={styles.handle} />
              </View>
            </GestureDetector>

            {done ? (
              /* ── Resultado + Práctica ── */
              <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultScroll}
              >
                {/* Porcentaje */}
                <View style={styles.pctBlock}>
                  <Text style={[styles.pctNumber, { color: pctColor }]}>
                    {pct}
                    <Text style={styles.pctSign}>%</Text>
                  </Text>
                  <Text style={styles.pctSub}>
                    {correctCount} de {totalSteps} correctas
                  </Text>
                </View>

                {/* Dots resumen */}
                <View style={styles.dotsRow}>
                  {results.map((ok, i) => (
                    <View
                      key={i}
                      style={[styles.dot, { backgroundColor: ok ? "#059669" : "#DC2626" }]}
                    />
                  ))}
                </View>

                {/* Review card */}
                {review && (
                  <View style={[styles.reviewCard, { borderLeftColor: pctColor }]}>
                    <Text style={styles.reviewTitle}>{review.title}</Text>
                    <Text style={styles.reviewBody}>{review.body}</Text>
                  </View>
                )}

                {/* ── Práctica de refuerzo ── */}
                {practiceQuestions.length > 0 && !practiceDone && (
                  <View style={styles.practiceSection}>
                    <View style={styles.practiceLabelRow}>
                      <View style={styles.practiceLabelDot} />
                      <Text style={styles.practiceLabel}>Refuerza lo que fallaste</Text>
                      <Text style={styles.practiceCounter}>
                        {practiceStep + 1}/{practiceQuestions.length}
                      </Text>
                    </View>
                    <Text style={styles.practiceStatement}>{currentPQ.statement}</Text>

                    {currentPQ.code && (
                      <View style={styles.codeBlock}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <Text style={styles.codeText}>{currentPQ.code}</Text>
                        </ScrollView>
                      </View>
                    )}

                    <View style={styles.optionsCol}>
                      {currentPQ.options.map((opt, i) => (
                        <Pressable
                          key={i}
                          style={[
                            styles.option,
                            {
                              backgroundColor: optionBg(i, currentPQ, practiceSelected, practiceState),
                              borderColor: optionBorder(i, currentPQ, practiceSelected, practiceState),
                            },
                          ]}
                          onPress={() => handlePracticeSelect(i)}
                        >
                          <View
                            style={[
                              styles.optionLetter,
                              { borderColor: optionBorder(i, currentPQ, practiceSelected, practiceState) },
                            ]}
                          >
                            <Text
                              style={[
                                styles.optionLetterText,
                                { color: optionColor(i, currentPQ, practiceSelected, practiceState) },
                              ]}
                            >
                              {String.fromCharCode(65 + i)}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.optionText,
                              {
                                color: optionColor(i, currentPQ, practiceSelected, practiceState),
                                flex: 1,
                              },
                            ]}
                          >
                            {opt}
                          </Text>
                          {practiceAnswered && i === currentPQ.correctIndex && (
                            <Text style={styles.optionCheck}>✓</Text>
                          )}
                          {practiceAnswered &&
                            i === practiceSelected &&
                            i !== currentPQ.correctIndex && (
                              <Text style={styles.optionX}>✗</Text>
                            )}
                        </Pressable>
                      ))}
                    </View>

                    {practiceAnswered && (
                      <>
                        <View
                          style={[
                            styles.explanationBox,
                            {
                              borderLeftColor:
                                practiceSelected === currentPQ.correctIndex
                                  ? "#059669"
                                  : "#DC2626",
                            },
                          ]}
                        >
                          <Text style={styles.explanationTitle}>
                            {practiceSelected === currentPQ.correctIndex
                              ? "Correcto"
                              : "Incorrecto"}
                          </Text>
                          <Text style={styles.explanationText}>
                            {currentPQ.explanation}
                          </Text>
                        </View>
                        <Pressable
                          style={[styles.nextBtn, { backgroundColor: challenge.color }]}
                          onPress={handlePracticeNext}
                        >
                          <Text style={styles.nextBtnText}>
                            {practiceStep + 1 >= practiceQuestions.length
                              ? "Finalizar práctica"
                              : "Siguiente pregunta"}
                          </Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                )}

                {/* Resumen práctica completada */}
                {practiceDone && practiceResults.length > 0 && (
                  <View style={styles.practiceSummary}>
                    <Text style={styles.practiceSummaryTitle}>Práctica completada</Text>
                    <Text style={styles.practiceSummaryText}>
                      {practiceResults.filter(Boolean).length} de {practiceResults.length} correctas en el refuerzo.
                    </Text>
                  </View>
                )}

                {/* Botones finales */}
                {showButtons && (
                  <View style={styles.resultBtns}>
                    <Pressable
                      style={[styles.replayBtn, { borderColor: challenge.color }]}
                      onPress={handleReplay}
                    >
                      <Text style={[styles.replayBtnText, { color: challenge.color }]}>
                        Intentar de nuevo
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.closeBtn, { backgroundColor: challenge.color }]}
                      onPress={() => dismiss(correctCount, totalSteps)}
                    >
                      <Text style={styles.closeBtnText}>Listo</Text>
                    </Pressable>
                  </View>
                )}
              </ScrollView>
            ) : (
              /* ── Pregunta principal ── */
              <ScrollView
                ref={scrollRef}
                style={{ flex: 1 }}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${((step + (answerState !== "idle" ? 1 : 0)) / totalSteps) * 100}%`,
                          backgroundColor: challenge.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>
                    {step + 1}/{totalSteps}
                  </Text>
                </View>

                <Text style={styles.statement}>{currentQ.statement}</Text>

                {currentQ.code && (
                  <View style={styles.codeBlock}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <Text style={styles.codeText}>{currentQ.code}</Text>
                    </ScrollView>
                  </View>
                )}

                <View style={isVerdadMito ? styles.optionsRow : styles.optionsCol}>
                  {currentQ.options.map((opt, i) => (
                    <Pressable
                      key={i}
                      style={[
                        isVerdadMito ? styles.optionBig : styles.option,
                        {
                          backgroundColor: optionBg(i, currentQ, selected, answerState),
                          borderColor: optionBorder(i, currentQ, selected, answerState),
                        },
                      ]}
                      onPress={() => handleSelect(i)}
                    >
                      {!isVerdadMito && (
                        <View
                          style={[
                            styles.optionLetter,
                            { borderColor: optionBorder(i, currentQ, selected, answerState) },
                          ]}
                        >
                          <Text
                            style={[
                              styles.optionLetterText,
                              { color: optionColor(i, currentQ, selected, answerState) },
                            ]}
                          >
                            {String.fromCharCode(65 + i)}
                          </Text>
                        </View>
                      )}
                      <Text
                        style={[
                          isVerdadMito ? styles.optionBigText : styles.optionText,
                          {
                            color: optionColor(i, currentQ, selected, answerState),
                            flex: isVerdadMito ? undefined : 1,
                          },
                        ]}
                      >
                        {opt}
                      </Text>
                      {answerState !== "idle" && i === currentQ.correctIndex && (
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

                {answerState !== "idle" && (
                  <View
                    style={[
                      styles.explanationBox,
                      { borderLeftColor: answerState === "correct" ? "#059669" : "#DC2626" },
                    ]}
                  >
                    <Text style={styles.explanationTitle}>
                      {answerState === "correct" ? "Correcto" : "Incorrecto"}
                    </Text>
                    <Text style={styles.explanationText}>{currentQ.explanation}</Text>
                  </View>
                )}

                {answerState !== "idle" && (
                  <Pressable
                    style={[styles.nextBtn, { backgroundColor: challenge.color }]}
                    onPress={handleNext}
                  >
                    <Text style={styles.nextBtnText}>
                      {step + 1 >= totalSteps ? "Ver resultado" : "Siguiente"}
                    </Text>
                  </Pressable>
                )}

                <View style={{ height: 32 }} />
              </ScrollView>
            )}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
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
  handleArea: {
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
  },
  content: { paddingHorizontal: SPACING * 2, paddingTop: SPACING },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING,
    marginBottom: SPACING * 2,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 4 },
  progressLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
    minWidth: 32,
    textAlign: "right",
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
  codeText: { fontFamily: "monospace", fontSize: 13, color: "#E2E8F0", lineHeight: 22 },
  optionsCol: { gap: SPACING * 1.2, marginBottom: SPACING * 2 },
  optionsRow: { flexDirection: "row", gap: SPACING, marginBottom: SPACING * 2 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    padding: SPACING * 1.6,
    gap: SPACING * 1.2,
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
  optionLetterText: { fontSize: 12, fontWeight: "800" },
  optionText: { fontSize: 14, fontWeight: "600", lineHeight: 22 },
  optionBigText: { fontSize: 16, fontWeight: "800" },
  optionCheck: { fontSize: 16, color: "#059669", fontWeight: "900", marginLeft: "auto" },
  optionX: { fontSize: 16, color: "#DC2626", fontWeight: "900", marginLeft: "auto" },
  explanationBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderLeftWidth: 4,
    padding: SPACING * 1.5,
    marginBottom: SPACING * 1.5,
  },
  explanationTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  explanationText: { fontSize: 13, color: MUTED, lineHeight: 20 },
  nextBtn: {
    borderRadius: 16,
    paddingVertical: SPACING * 1.6,
    alignItems: "center",
    marginBottom: SPACING,
  },
  nextBtnText: { color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: 0.3 },

  // ── Resultado ──────────────────────────────────────────────────
  resultScroll: {
    paddingHorizontal: SPACING * 2.5,
    paddingTop: SPACING * 2,
    paddingBottom: SPACING * 4,
    gap: SPACING * 2,
  },
  pctBlock: {
    alignItems: "center",
    gap: SPACING * 0.5,
    paddingVertical: SPACING * 2,
  },
  pctNumber: {
    fontSize: 80,
    fontWeight: "900",
    letterSpacing: -4,
    lineHeight: 84,
  },
  pctSign: { fontSize: 36, fontWeight: "700", letterSpacing: 0 },
  pctSub: { fontSize: 14, color: MUTED, fontWeight: "600", marginTop: SPACING * 0.5 },
  dotsRow: { flexDirection: "row", gap: 6, justifyContent: "center" },
  dot: { width: 10, height: 10, borderRadius: 5 },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderLeftWidth: 4,
    padding: SPACING * 2,
    gap: SPACING * 0.8,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.3,
  },
  reviewBody: { fontSize: 14, color: MUTED, lineHeight: 22 },

  // ── Sección práctica ───────────────────────────────────────────
  practiceSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: SPACING * 2.5,
    gap: SPACING * 1.8,
  },
  practiceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING * 0.8,
    marginBottom: SPACING * 0.5,
  },
  practiceLabelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F59E0B",
  },
  practiceLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  practiceCounter: { fontSize: 12, fontWeight: "700", color: MUTED },
  practiceStatement: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
    lineHeight: 26,
  },

  practiceSummary: {
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    padding: SPACING * 1.5,
    gap: 4,
  },
  practiceSummaryTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#15803D",
  },
  practiceSummaryText: { fontSize: 13, color: "#166534", lineHeight: 20 },

  resultBtns: { gap: SPACING },
  replayBtn: {
    borderRadius: 16,
    paddingVertical: SPACING * 1.6,
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  replayBtnText: { fontSize: 15, fontWeight: "800" },
  closeBtn: {
    borderRadius: 16,
    paddingVertical: SPACING * 1.6,
    alignItems: "center",
  },
  closeBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
