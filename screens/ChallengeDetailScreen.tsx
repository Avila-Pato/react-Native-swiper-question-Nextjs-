import { ChallengeSheet } from "@/components/challenges/ChallengeSheet";
import { SPACING } from "@/constants/constants";
import { BG, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { WEEKLY_CHALLENGES } from "@/data/weeklyData";
import { getProgress, setProgress } from "@/store/challengeProgress";
import { Challenge, ChallengeType, Difficulty } from "@/types/challenges";
import { router, useLocalSearchParams } from "expo-router";
import {
  Braces,
  Bug,
  ChevronLeft,
  Globe,
  Lightbulb,
  Lock,
  LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const FOOTER_H = 72;

const DESCRIPTIONS: Record<ChallengeType, string> = {
  adivina_lenguaje:
    "Identifica el lenguaje de programación a partir de fragmentos de código reales. Cada snippet tiene pistas clave si sabes dónde mirar.",
  encuentra_bug:
    "Analiza fragmentos de código con errores reales y elige cuál es el problema. Ideal para afinar tu ojo crítico.",
  verdad_mito:
    "Pon a prueba tus conocimientos del mundo tech. ¿Sabes distinguir los hechos reales de los mitos populares?",
  completa_codigo:
    "Elige la opción correcta para completar el código. Cada pregunta tiene un nivel de dificultad diferente.",
};

type IconCfg = { Icon: LucideIcon; bg: string; color: string };
const CHALLENGE_ICON: Record<string, IconCfg> = {
  adivina_lenguaje: { Icon: Globe, bg: "#E0F2FE", color: "#0284C7" },
  encuentra_bug: { Icon: Bug, bg: "#FEE2E2", color: "#DC2626" },
  verdad_mito: { Icon: Lightbulb, bg: "#FEF9C3", color: "#CA8A04" },
  completa_codigo: { Icon: Braces, bg: "#EDE9FE", color: "#7C3AED" },
};

const DIFF_COLOR: Record<Difficulty, string> = {
  Fácil: "#059669",
  Medio: "#D97706",
  Difícil: "#DC2626",
};

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();
  const challenge: Challenge | undefined = WEEKLY_CHALLENGES.find(
    (c) => c.id === id,
  );

  const [currentProgress, setCurrentProgress] = useState(() =>
    getProgress(id ?? ""),
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetStartStep, setSheetStartStep] = useState(0);

  if (!challenge) {
    return null;
  }

  const total = challenge.questions.length;
  const isComplete = currentProgress >= total;

  const handleOpenSheet = (startStep: number) => {
    setSheetStartStep(startStep);
    setSheetOpen(true);
  };

  const handleSheetClose = (answeredCount: number) => {
    setProgress(challenge.id, answeredCount);
    setCurrentProgress(getProgress(challenge.id));
    setSheetOpen(false);
  };

  const questionStatus = (index: number): "done" | "active" | "locked" => {
    if (index < currentProgress) return "done";
    if (index === currentProgress) return "active";
    return "locked";
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tab)/two");
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
      {/* Back button */}
      <Pressable style={styles.backBtn} onPress={handleBack}>
        <ChevronLeft size={22} color={TEXT} />
        <Text style={styles.backText}>Retos</Text>
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Hero section */}
        <View
          style={[
            styles.heroSection,
            { backgroundColor: challenge.color + "10" },
          ]}
        >
          {(() => {
            const cfg = CHALLENGE_ICON[challenge.id] ?? {
              Icon: Globe,
              bg: "#F3F4F6",
              color: challenge.color,
            };
            return (
              <View style={[styles.emojiCircle, { backgroundColor: cfg.bg }]}>
                <cfg.Icon size={38} color={cfg.color} strokeWidth={1.6} />
              </View>
            );
          })()}
          <Text style={styles.challengeTitle}>{challenge.title}</Text>

          {/* Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{total} Preguntas</Text>
            </View>
            {/* <View
              style={[
                styles.badge,
                { backgroundColor: DIFF_COLOR[challenge.difficulty] + "18" },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: DIFF_COLOR[challenge.difficulty] },
                ]}
              >
                {challenge.difficulty}
              </Text>
            </View> */}
            {isComplete && (
              <View style={[styles.badge, { backgroundColor: "#DCFCE7" }]}>
                <Text style={[styles.badgeText, { color: "#059669" }]}>
                  ✓ Completado
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={styles.description}>{DESCRIPTIONS[challenge.id]}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progreso</Text>
            <Text style={styles.progressCount}>
              {currentProgress}/{total}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(currentProgress / total) * 100}%`,
                  backgroundColor: challenge.color,
                },
              ]}
            />
          </View>
        </View>

        {/* Questions list */}
        <Text style={styles.sectionTitle}>Preguntas</Text>
        <View style={styles.questionList}>
          {challenge.questions.map((q, i) => {
            const status = questionStatus(i);
            const isLocked = status === "locked";
            const isDone = status === "done";
            const isActive = status === "active";

            return (
              <Pressable
                key={q.id}
                style={[
                  styles.questionRow,
                  isActive && {
                    borderColor: challenge.color,
                    borderWidth: 1.5,
                  },
                  isLocked && { opacity: 0.5 },
                ]}
                onPress={() => !isLocked && handleOpenSheet(i)}
                disabled={isLocked}
              >
                {/* Number circle */}
                <View
                  style={[
                    styles.numCircle,
                    isDone && { backgroundColor: "#DCFCE7" },
                    isActive && { backgroundColor: challenge.color },
                  ]}
                >
                  {isDone ? (
                    <Text style={[styles.numText, { color: "#059669" }]}>
                      ✓
                    </Text>
                  ) : (
                    <Text
                      style={[styles.numText, isActive && { color: "#fff" }]}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>

                {/* Question text */}
                <View style={styles.questionBody}>
                  {q.difficulty && (
                    <Text
                      style={[
                        styles.questionDiff,
                        { color: DIFF_COLOR[q.difficulty] },
                      ]}
                    >
                      {q.difficulty}
                    </Text>
                  )}
                  <Text style={styles.questionStatement} numberOfLines={2}>
                    {q.code
                      ? `Código: ${q.code.split("\n")[0]}...`
                      : q.statement}
                  </Text>
                </View>

                {/* Status icon */}
                {isLocked && <Lock size={14} color={MUTED} />}
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: FOOTER_H + bottom + SPACING * 2 }} />
      </ScrollView>

      {/* Fixed bottom button */}
      <View style={[styles.bottomBar, { paddingBottom: bottom + SPACING }]}>
        <Pressable
          style={[
            styles.startBtn,
            { backgroundColor: isComplete ? "#6B7280" : challenge.color },
          ]}
          onPress={() => handleOpenSheet(isComplete ? 0 : currentProgress)}
        >
          <Text style={styles.startBtnText}>
            {isComplete
              ? "Repetir reto"
              : currentProgress > 0
                ? "Continuar →"
                : "Comenzar reto →"}
          </Text>
        </Pressable>
      </View>

      {sheetOpen && (
        <ChallengeSheet
          challenge={challenge}
          initialStep={sheetStartStep}
          onClose={handleSheetClose}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING,
    gap: 4,
  },
  backText: { fontSize: 15, fontWeight: "600", color: TEXT },

  scroll: { paddingBottom: 32 },

  heroSection: {
    alignItems: "center",
    paddingVertical: SPACING * 3,
    paddingHorizontal: SPACING * 2.5,
    gap: SPACING * 1.2,
    marginBottom: SPACING * 2,
  },
  emojiCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING * 0.5,
  },

  challengeTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: TEXT,
    textAlign: "center",
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badge: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#374151" },
  description: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 20,
    textAlign: "center",
  },

  progressSection: {
    paddingHorizontal: SPACING * 2,
    marginBottom: SPACING * 2,
    gap: 8,
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 13, fontWeight: "600", color: MUTED },
  progressCount: { fontSize: 13, fontWeight: "700", color: TEXT },
  progressTrack: {
    height: 7,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 6 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
    paddingHorizontal: SPACING * 2,
    marginBottom: SPACING,
  },

  questionList: { paddingHorizontal: SPACING * 2, gap: SPACING },
  questionRow: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING * 1.3,
    gap: SPACING * 1.2,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  numCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  numText: { fontSize: 13, fontWeight: "800", color: MUTED },
  questionBody: { flex: 1 },
  questionDiff: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  questionStatement: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT,
    lineHeight: 19,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BG,
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  startBtn: {
    borderRadius: 16,
    paddingVertical: SPACING * 1.7,
    alignItems: "center",
  },
  startBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
function expoRouter() {
  throw new Error("Function not implemented.");
}
