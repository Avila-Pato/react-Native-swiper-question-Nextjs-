import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import { BG, MUTED, P_AMBER, P_GOLD, P_SLATE, P_TEAL, TEXT } from "@/constants/theme";
import { WEEKLY_CHALLENGES } from "@/data/weeklyData";
import { getAllProgress } from "@/store/challengeProgress";
import { Challenge, ChallengeType } from "@/types/challenges";
import { router, useFocusEffect } from "expo-router";
import { ArrowUpRight, Braces, Bug, Globe, Lightbulb } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type LucideIcon = typeof Globe;

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - SPACING * 2 * 2 - SPACING * 1.5) / 2;
const BAR_HEIGHT = TAB_ITEM_SIZE + SPACING * 1.5;
const ACCENT = "#34D59A";

type IconConfig = { Icon: LucideIcon; bg: string; color: string };

const ICON_MAP: Record<string, IconConfig> = {
  adivina_lenguaje: { Icon: Globe,     bg: P_TEAL.bg,  color: P_TEAL.fg  },
  encuentra_bug:    { Icon: Bug,       bg: P_AMBER.bg, color: P_AMBER.fg },
  verdad_mito:      { Icon: Lightbulb, bg: P_GOLD.bg,  color: P_GOLD.fg  },
  completa_codigo:  { Icon: Braces,    bg: P_SLATE.bg, color: P_SLATE.fg },
};


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
  const pctDone = totalDone / WEEKLY_CHALLENGES.length;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
      <ScreenHeader title="Retos" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: BAR_HEIGHT + bottom + SPACING * 2 }}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.titleBlock}>
            <Text style={styles.eyebrow}>Retos de la semana</Text>
            <Text style={styles.heroTitle}>Pon a prueba{"\n"}tu nivel.</Text>
            <Text style={styles.heroSub}>
              4 desafíos para medir tus habilidades en el ecosistema tech.
            </Text>
            <View style={styles.iconStrip}>
              {(["adivina_lenguaje","encuentra_bug","verdad_mito","completa_codigo"] as ChallengeType[]).map((id) => {
                const { Icon, bg, color } = ICON_MAP[id];
                return (
                  <View key={id} style={[styles.iconChip, { backgroundColor: bg }]}>
                    <Icon size={18} color={color} strokeWidth={1.6} />
                  </View>
                );
              })}
            </View>
          </View>

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
              <View style={styles.dotsRow}>
                {WEEKLY_CHALLENGES.map((c) => {
                  const done = (progress[c.id] ?? 0) >= c.questions.length;
                  return <View key={c.id} style={[styles.dot, done ? styles.dotDone : styles.dotPending]} />;
                })}
              </View>
              <Text style={styles.statLabel}>progreso</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
            onPress={() => openDetail(featured.id)}
          >
            <Text style={styles.ctaText}>
              {featuredStarted ? "Continuar reto" : "Comenzar reto"}
            </Text>
            <ArrowUpRight size={18} color={MUTED} strokeWidth={2} />
          </Pressable>
        </View>

        {/* ── Grid retos ── */}
        <View style={styles.gridSection}>
          <Text style={styles.listLabel}>Todos los retos</Text>
          <View style={styles.grid}>
            {WEEKLY_CHALLENGES.map((c) => {
              const done = progress[c.id] ?? 0;
              const total = c.questions.length;
              const isComplete = done >= total;
              const { bg, color } = ICON_MAP[c.id] ?? { bg: "#F3F4F6", color: MUTED };

              return (
                <Pressable
                  key={c.id}
                  style={({ pressed }) => [styles.gridCard, { backgroundColor: bg }, pressed && { opacity: 0.82 }]}
                  onPress={() => openDetail(c.id)}
                >
                  <Text style={[styles.cardTitle, { color }]}>{c.title}</Text>
                  <View style={[styles.cardDiff, { backgroundColor: color + "22" }]}>
                    <Text style={[styles.cardDiffText, { color }]}>{c.difficulty}</Text>
                  </View>
                  <Text style={styles.cardEmoji}>{c.emoji}</Text>
                  <View style={styles.cardBottom}>
                    {isComplete && (
                      <View style={[styles.doneChip, { backgroundColor: color + "33" }]}>
                        <Text style={[styles.doneChipText, { color }]}>✓ Listo</Text>
                      </View>
                    )}
                    <View style={[styles.arrowBtn, { backgroundColor: color }]}>
                      <ArrowUpRight size={16} color="#fff" strokeWidth={2.5} />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
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
  statValue: { fontSize: 20, fontWeight: "800", color: TEXT, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: MUTED, fontWeight: "500" },
  statDivider: { width: 1, height: 32, backgroundColor: "#F3F4F6" },
  dotsRow: { flexDirection: "row", gap: 5, alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotDone: { backgroundColor: ACCENT },
  dotPending: { backgroundColor: "#E5E7EB" },

  /* CTA */
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: SPACING * 1.6,
    paddingHorizontal: SPACING * 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  ctaText: { fontSize: 15, fontWeight: "700", color: TEXT },

  /* ── Grid ── */
  gridSection: {
    marginHorizontal: SPACING * 2,
    marginBottom: SPACING * 2,
  },
  listLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: SPACING * 1.2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING * 1.5,
  },
  gridCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 24,
    padding: SPACING * 1.4,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
    maxWidth: "80%",
  },
  cardDiff: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: SPACING * 0.4,
  },
  cardDiffText: { fontSize: 10, fontWeight: "700" },
  cardEmoji: {
    position: "absolute",
    bottom: SPACING * 4.5,
    right: SPACING * 1.2,
    fontSize: 52,
    opacity: 0.2,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  doneChip: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  doneChipText: { fontSize: 11, fontWeight: "700" },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },
});
