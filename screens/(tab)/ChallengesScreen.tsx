import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import { BG, MUTED, TEXT } from "@/constants/theme";
import { WEEKLY_CHALLENGES } from "@/data/weeklyData";
import { getAllProgress } from "@/store/challengeProgress";
import { Challenge, ChallengeType, Difficulty } from "@/types/challenges";
import { router, useFocusEffect } from "expo-router";
import { Braces, Bug, Globe, Lightbulb, LucideIcon } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const BAR_HEIGHT = TAB_ITEM_SIZE + SPACING * 1.5;
const ACCENT = "#34D59A";

const DIFF_COLOR: Record<Difficulty, string> = {
  Fácil:   "#16A34A",
  Medio:   "#D97706",
  Difícil: "#DC2626",
};

type IconConfig = { Icon: LucideIcon; bg: string; color: string };

const ICON_MAP: Record<string, IconConfig> = {
  adivina_lenguaje: { Icon: Globe,     bg: "#E0F2FE", color: "#0284C7" },
  encuentra_bug:    { Icon: Bug,       bg: "#FEE2E2", color: "#DC2626" },
  verdad_mito:      { Icon: Lightbulb, bg: "#FEF9C3", color: "#CA8A04" },
  completa_codigo:  { Icon: Braces,    bg: "#EDE9FE", color: "#7C3AED" },
};

const ICON_ORDER: string[] = ["adivina_lenguaje", "encuentra_bug", "verdad_mito", "completa_codigo"];

function openDetail(id: ChallengeType) {
  router.push({ pathname: "/challenge-detail", params: { id } });
}

export default function ChallengesScreen() {
  const { bottom } = useSafeAreaInsets();
  const [progress, setProgressState] = useState<Record<string, number>>({});

  useFocusEffect(
    useCallback(() => {
      setProgressState(getAllProgress());
    }, [])
  );

  const totalDone = WEEKLY_CHALLENGES.filter(
    (c) => (progress[c.id] ?? 0) >= c.questions.length
  ).length;

  const featured: Challenge =
    WEEKLY_CHALLENGES.find((c) => (progress[c.id] ?? 0) < c.questions.length) ??
    WEEKLY_CHALLENGES[0];

  const featuredStarted = (progress[featured.id] ?? 0) > 0;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
      <ScreenHeader title="Retos" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: BAR_HEIGHT + bottom + SPACING * 2 }}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          {/* Title block */}
          <View style={styles.titleBlock}>
            <Text style={styles.eyebrow}>Retos de la semana</Text>
            <Text style={styles.heroTitle}>Pon a prueba{"\n"}tu nivel.</Text>
            <Text style={styles.heroSub}>
              4 desafíos para medir tus habilidades en el ecosistema tech.
            </Text>

            {/* Icon strip */}
            <View style={styles.iconStrip}>
              {ICON_ORDER.map((id) => {
                const { Icon, bg, color } = ICON_MAP[id];
                return (
                  <View key={id} style={[styles.iconChip, { backgroundColor: bg }]}>
                    <Icon size={18} color={color} strokeWidth={1.6} />
                  </View>
                );
              })}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>retos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalDone}</Text>
              <Text style={styles.statLabel}>completados</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              {/* Progress dots */}
              <View style={styles.dotsRow}>
                {WEEKLY_CHALLENGES.map((c) => {
                  const done = (progress[c.id] ?? 0) >= c.questions.length;
                  return (
                    <View key={c.id} style={[styles.dot, done ? styles.dotDone : styles.dotPending]} />
                  );
                })}
              </View>
              <Text style={styles.statLabel}>progreso</Text>
            </View>
          </View>

          {/* CTA */}
          <Pressable
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
            onPress={() => openDetail(featured.id)}
          >
            <Text style={styles.ctaText}>
              {featuredStarted ? "Continuar reto" : "Comenzar reto"}
            </Text>
            <Text style={styles.ctaArrow}>→</Text>
          </Pressable>
        </View>

        {/* ── Retos list ── */}
        <View style={styles.listSection}>
          <Text style={styles.listLabel}>Todos los retos</Text>

          {WEEKLY_CHALLENGES.map((c, i) => {
            const done = progress[c.id] ?? 0;
            const total = c.questions.length;
            const isComplete = done >= total;
            const pct = total > 0 ? done / total : 0;
            const { Icon, bg, color } = ICON_MAP[c.id] ?? { Icon: Globe, bg: "#F3F4F6", color: MUTED };

            return (
              <View key={c.id}>
                <Pressable
                  style={({ pressed }) => [styles.challengeRow, pressed && { opacity: 0.75 }]}
                  onPress={() => openDetail(c.id)}
                >
                  <View style={[styles.challengeIcon, { backgroundColor: bg }]}>
                    <Icon size={17} color={color} strokeWidth={1.6} />
                  </View>

                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>{c.title}</Text>
                    <View style={styles.challengeMeta}>
                      <View style={[styles.diffChip, { backgroundColor: DIFF_COLOR[c.difficulty] + "18" }]}>
                        <Text style={[styles.diffText, { color: DIFF_COLOR[c.difficulty] }]}>
                          {c.difficulty}
                        </Text>
                      </View>
                      <Text style={styles.challengeSub}>{total} preguntas</Text>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${pct * 100}%`, backgroundColor: isComplete ? ACCENT : color },
                        ]}
                      />
                    </View>
                  </View>

                  {isComplete ? (
                    <View style={styles.doneCircle}>
                      <Text style={styles.doneCheck}>✓</Text>
                    </View>
                  ) : (
                    <Text style={[styles.challengeScore, { color }]}>{done}/{total}</Text>
                  )}
                </Pressable>

                {i < WEEKLY_CHALLENGES.length - 1 && <View style={styles.separator} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  /* ── Hero ── */
  hero: {
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 2,
    paddingBottom: SPACING * 3,
    gap: SPACING * 2,
  },

  titleBlock: { gap: SPACING * 0.6 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "600",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -1.5,
    lineHeight: 44,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 20,
    marginTop: SPACING * 0.5,
    textAlign: "center",
  },
  iconStrip: {
    flexDirection: "row",
    gap: SPACING,
    justifyContent: "center",
    marginTop: SPACING * 0.5,
  },
  iconChip: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: SPACING * 1.4,
    paddingHorizontal: SPACING * 2,
  },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.5,
  },
  statLabel: { fontSize: 11, color: MUTED, fontWeight: "500" },
  statDivider: { width: 1, height: 32, backgroundColor: "#F3F4F6" },
  dotsRow: { flexDirection: "row", gap: 5, alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotDone: { backgroundColor: ACCENT },
  dotPending: { backgroundColor: "#E5E7EB" },

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

  /* ── List ── */
  listSection: {
    marginHorizontal: SPACING * 2,
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING * 1.8,
    paddingTop: SPACING * 1.8,
    paddingBottom: SPACING,
  },
  listLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: SPACING * 0.6,
  },

  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING * 1.1,
    gap: SPACING * 1.2,
  },
  challengeIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  challengeInfo: { flex: 1, gap: 4 },
  challengeTitle: { fontSize: 13, fontWeight: "700", color: TEXT },
  challengeMeta: { flexDirection: "row", alignItems: "center", gap: 7 },
  diffChip: { borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  diffText: { fontSize: 10, fontWeight: "700" },
  challengeSub: { fontSize: 11, color: MUTED },
  barTrack: {
    height: 3,
    backgroundColor: "#F3F4F6",
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 2,
  },
  barFill: { height: "100%", borderRadius: 99 },

  challengeScore: { fontSize: 12, fontWeight: "700", flexShrink: 0 },
  doneCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  doneCheck: { fontSize: 12, color: "#16A34A", fontWeight: "800" },
  separator: {
    height: 1,
    backgroundColor: "#F9FAFB",
    marginLeft: 38 + SPACING * 1.2,
  },
});
