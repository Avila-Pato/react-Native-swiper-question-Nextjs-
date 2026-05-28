import { ChallengeSheet } from "@/components/challenges/ChallengeSheet";
import { SPACING } from "@/constants/constants";
import { BG, MUTED, TEXT } from "@/constants/theme";
import { getQuestionsForConcepts } from "@/data/languageQuestions";
import { VERDAD_MITO_TOPICS, VerdadMitoTopic } from "@/data/verdadMitoTopics";
import { WEEKLY_CHALLENGES } from "@/data/weeklyData";
import { getBestScore, recordResult } from "@/store/challengeProgress";
import { getSelectedLangs } from "@/store/languagePrefs";
import { Challenge, ChallengeQuestion, ChallengeType } from "@/types/challenges";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import { useMemo, useState } from "react";
import {
  Dimensions,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_W } = Dimensions.get("window");

const DESCRIPTIONS: Record<ChallengeType, string> = {
  adivina_concepto:
    "Identifica el concepto de bienestar a partir de una situación. Las preguntas cambian según las áreas que elijas.",
  identifica_patron:
    "Analiza la situación y elige qué patrón de comportamiento se está dando. Entrena tu percepción.",
  verdad_mito:
    "¿Sabes distinguir los hechos reales de los mitos sobre salud mental y bienestar?",
  completa_reflexion:
    "Elige la opción correcta para completar la reflexión o concepto de bienestar.",
};

type IconCfg = { image: ImageSourcePropType; bg: string; color: string };
const CHALLENGE_ICON: Record<string, IconCfg> = {
  adivina_concepto: { image: require("@/assets/icons/Dialog.svg"), bg: "#EDE9F8", color: "#7B6BB5" },
  identifica_patron: { image: require("@/assets/icons/Surveillance.svg"), bg: "#F5E8EF", color: "#9E5C72" },
  verdad_mito: { image: require("@/assets/icons/Approval.svg"), bg: "#E8F0EE", color: "#4D8B7A" },
  completa_reflexion: { image: require("@/assets/icons/Documentation.svg"), bg: "#E8E8F5", color: "#5A5CA0" },
};

const TOPIC_CARD_W = (SCREEN_W - SPACING * 4 - SPACING) / 2;

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();

  const base: Challenge | undefined = WEEKLY_CHALLENGES.find((c) => c.id === id);

  const challenge: Challenge | undefined = useMemo(() => {
    if (!base) return undefined;
    if (base.id !== "adivina_concepto") return base;
    const langs = getSelectedLangs();
    const dynamic: ChallengeQuestion[] =
      langs.length > 0 ? getQuestionsForConcepts(langs, 5) : base.questions;
    return { ...base, questions: dynamic };
  }, [base]);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetChallenge, setSheetChallenge] = useState<Challenge | null>(null);
  const [stat, setStat] = useState(() => getBestScore(id ?? ""));

  if (!challenge) return null;

  const isVerdadMito = challenge.id === "verdad_mito";

  const cfg = CHALLENGE_ICON[challenge.id] ?? {
    image: require("@/assets/icons/Dialog.svg"),
    bg: "#F3F4F6",
    color: challenge.color,
  };

  const total = challenge.questions.length;
  const bestPct = Math.round(stat.bestScore * 100);

  const handleSheetClose = (correct: number, sessionTotal: number) => {
    if (sessionTotal > 0) {
      recordResult(challenge.id, correct, sessionTotal);
      setStat(getBestScore(challenge.id));
    }
    setSheetOpen(false);
    setSheetChallenge(null);
  };

  const handleStart = () => {
    setSheetChallenge(challenge);
    setSheetOpen(true);
  };

  const handleTopicPress = (topic: VerdadMitoTopic) => {
    setSheetChallenge({ ...challenge, questions: topic.questions });
    setSheetOpen(true);
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tab)/two");
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
      {/* Back */}
      <Pressable style={styles.backBtn} onPress={handleBack}>
        <ChevronLeft size={22} color={TEXT} />
        <Text style={styles.backText}>Retos</Text>
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottom + (isVerdadMito ? SPACING * 3 : SPACING * 10) },
        ]}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: challenge.color + "12" }]}>
          <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
            <Image
              source={cfg.image}
              style={{ width: 44, height: 44 }}
              tintColor={cfg.color}
              contentFit="contain"
            />
          </View>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.description}>{DESCRIPTIONS[challenge.id]}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {isVerdadMito ? VERDAD_MITO_TOPICS.length * 5 : total}
            </Text>
            <Text style={styles.statLabel}>preguntas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: challenge.color }]}>
              {stat.timesPlayed > 0 ? `${bestPct}%` : "—"}
            </Text>
            <Text style={styles.statLabel}>mejor resultado</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stat.timesPlayed}</Text>
            <Text style={styles.statLabel}>jugadas</Text>
          </View>
        </View>

        {/* Concept note (adivina_concepto) */}
        {challenge.id === "adivina_concepto" && getSelectedLangs().length > 0 && (
          <View style={styles.langNote}>
            <Text style={styles.langNoteText}>
              Explorando:{" "}
              <Text style={{ fontWeight: "700" }}>
                {getSelectedLangs().join(", ")}
              </Text>
            </Text>
          </View>
        )}

        {/* Topic grid (verdad_mito) */}
        {isVerdadMito && (
          <View style={styles.topicSection}>
            <Text style={styles.topicHeading}>Elige un tema</Text>
            <View style={styles.topicGrid}>
              {VERDAD_MITO_TOPICS.map((topic) => (
                <Pressable
                  key={topic.id}
                  style={({ pressed }) => [
                    styles.topicCard,
                    { borderTopColor: topic.color, opacity: pressed ? 0.85 : 1 },
                  ]}
                  onPress={() => handleTopicPress(topic)}
                >
                  <View style={[styles.topicIconBox, { backgroundColor: topic.bg }]}>
                    <Image
                      source={topic.icon}
                      style={{ width: 22, height: 22 }}
                      tintColor={topic.color}
                      contentFit="contain"
                    />
                  </View>
                  <Text style={styles.topicTitle} numberOfLines={1}>{topic.title}</Text>
                  <Text style={styles.topicDesc} numberOfLines={2}>{topic.description}</Text>
                  <View style={styles.topicFooter}>
                    <Text style={[styles.topicCount, { color: topic.color }]}>
                      {topic.questions.length} preguntas
                    </Text>
                    <ChevronRight size={14} color={topic.color} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer (non-verdad_mito only) */}
      {!isVerdadMito && (
        <View style={[styles.footer, { paddingBottom: bottom + SPACING }]}>
          <Pressable
            style={[styles.startBtn, { backgroundColor: challenge.color }]}
            onPress={handleStart}
          >
            <Text style={styles.startBtnText}>
              {stat.timesPlayed > 0 ? "Jugar de nuevo →" : "Comenzar →"}
            </Text>
          </Pressable>
        </View>
      )}

      {sheetOpen && sheetChallenge && (
        <ChallengeSheet challenge={sheetChallenge} onClose={handleSheetClose} />
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

  scrollContent: {
    gap: SPACING * 2,
  },

  hero: {
    alignItems: "center",
    paddingVertical: SPACING * 3.5,
    paddingHorizontal: SPACING * 3,
    gap: SPACING * 1.2,
    marginHorizontal: SPACING * 2,
    borderRadius: 24,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING * 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: TEXT,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 21,
    textAlign: "center",
  },

  statsCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: SPACING * 2,
    paddingVertical: SPACING * 1.8,
    paddingHorizontal: SPACING * 2,
  },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.5,
  },
  statLabel: { fontSize: 11, color: MUTED, fontWeight: "500" },
  statDivider: { width: 1, backgroundColor: "#F3F4F6", marginVertical: 4 },

  langNote: {
    marginHorizontal: SPACING * 2,
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    paddingHorizontal: SPACING * 1.5,
    paddingVertical: SPACING,
  },
  langNoteText: { fontSize: 13, color: "#15803D", lineHeight: 19 },

  // ── Topic grid ────────────────────────────────────────────────
  topicSection: {
    paddingHorizontal: SPACING * 2,
    gap: SPACING * 1.5,
  },
  topicHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  topicGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING,
  },
  topicCard: {
    width: TOPIC_CARD_W,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderTopWidth: 3,
    padding: SPACING * 1.5,
    gap: SPACING * 0.6,
  },
  topicIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING * 0.4,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.3,
  },
  topicDesc: {
    fontSize: 11,
    color: MUTED,
    lineHeight: 16,
  },
  topicFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING * 0.5,
  },
  topicCount: {
    fontSize: 11,
    fontWeight: "700",
  },

  // ── Footer ────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  startBtn: {
    borderRadius: 18,
    paddingVertical: SPACING * 1.8,
    alignItems: "center",
  },
  startBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
