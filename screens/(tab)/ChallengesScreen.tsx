import { ConceptPickerSheet } from "@/components/challenges/ConceptPickerSheet";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import {
  BG,
  MUTED,
  P_AMBER,
  P_GOLD,
  P_SLATE,
  P_TEAL,
  TEXT,
} from "@/constants/theme";
import { WEEKLY_CHALLENGES } from "@/data/weeklyData";
import { getAllProgress } from "@/store/challengeProgress";
import { setSelectedLangs } from "@/store/languagePrefs";
import { ChallengeType } from "@/types/challenges";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { ArrowUpRight } from "lucide-react-native";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - SPACING * 2 * 2 - SPACING * 1.5) / 2;
const BAR_HEIGHT = TAB_ITEM_SIZE + SPACING * 1.5;
const ACCENT = "#34D59A";

type IconConfig = {
  image: ImageSourcePropType;
  bg: string;
  color: string;
  borderColor: string;
};

const ICON_MAP: Record<string, IconConfig> = {
  adivina_concepto: {
    image: require("@/assets/icons/Dialog.svg"),
    bg: P_TEAL.bg,
    color: P_TEAL.fg,
    borderColor: P_TEAL.fg,
  },
  identifica_patron: {
    image: require("@/assets/icons/Surveillance.svg"),
    bg: P_AMBER.bg,
    color: P_AMBER.fg,
    borderColor: P_AMBER.fg,
  },
  verdad_mito: {
    image: require("@/assets/icons/Approval.svg"),
    bg: P_GOLD.bg,
    color: P_GOLD.fg,
    borderColor: P_GOLD.fg,
  },
  completa_reflexion: {
    image: require("@/assets/icons/Documentation.svg"),
    bg: P_SLATE.bg,
    color: P_SLATE.fg,
    borderColor: P_SLATE.fg,
  },
};
function openDetail(id: ChallengeType) {
  router.push({ pathname: "/challenge-detail", params: { id } });
}

export default function ChallengesScreen() {
  const { bottom } = useSafeAreaInsets();
  const [progress, setProgressState] = useState<Record<string, number>>({});
  const [langPickerOpen, setLangPickerOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setProgressState(getAllProgress());
    }, []),
  );

  function handleCardPress(id: ChallengeType) {
    if (id === "adivina_concepto") {
      setLangPickerOpen(true);
    } else {
      openDetail(id);
    }
  }

  function handleLangConfirm(langs: string[]) {
    setSelectedLangs(langs);
    setLangPickerOpen(false);
    openDetail("adivina_concepto");
  }

  const totalDone = WEEKLY_CHALLENGES.filter(
    (c) => (progress[c.id] ?? 0) >= c.questions.length,
  ).length;

  // const featured: Challenge =
  //   WEEKLY_CHALLENGES.find((c) => (progress[c.id] ?? 0) < c.questions.length) ??
  //   WEEKLY_CHALLENGES[0];

  // const featuredStarted = (progress[featured.id] ?? 0) > 0;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
      <ScreenHeader title="Retos" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: BAR_HEIGHT + bottom + SPACING * 2,
        }}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.titleBlock}>
            <Text style={styles.eyebrow}>Retos de la semana</Text>
            <Text style={styles.heroTitle}>Pon a prueba{"\n"}tu nivel.</Text>
            <Text style={styles.heroSub}>
              4 desafíos para explorar tu bienestar y autoconocimiento.
            </Text>
            <View style={styles.iconStrip}>
              {(
                [
                  "adivina_concepto",
                  "identifica_patron",
                  "verdad_mito",
                  "completa_reflexion",
                ] as ChallengeType[]
              ).map((id) => {
                const { image, bg, color } = ICON_MAP[id];
                return (
                  <View
                    key={id}
                    style={[styles.iconChip, { backgroundColor: bg }]}
                  >
                    <Image
                      source={image}
                      style={{ width: 22, height: 22 }}
                      tintColor={color} // <-- Se pasa como propiedad directa en expo-image
                      contentFit="contain" // <-- expo-image usa 'contentFit' en lugar de 'resizeMode'
                    />
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
                  return (
                    <View
                      key={c.id}
                      style={[
                        styles.dot,
                        done ? styles.dotDone : styles.dotPending,
                      ]}
                    />
                  );
                })}
              </View>
              <Text style={styles.statLabel}>progreso</Text>
            </View>
          </View>
          {/* 
          <Pressable
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
            onPress={() => openDetail(featured.id)}
          >
            <Text style={styles.ctaText}>
              {featuredStarted ? "Continuar reto" : "Comenzar reto"}
            </Text>
            <ArrowUpRight size={18} color={MUTED} strokeWidth={2} />
          </Pressable> */}
        </View>

        {/* ── Grid retos ── */}
        <View style={styles.gridSection}>
          <Text style={styles.listLabel}>Todos los retos</Text>
          <View style={styles.grid}>
            {WEEKLY_CHALLENGES.map((c) => {
              const done = progress[c.id] ?? 0;
              const total = c.questions.length;
              const isComplete = done >= total;
              const { color, borderColor } = ICON_MAP[c.id] ?? {
                color: MUTED,
                borderColor: MUTED,
              };

              return (
                <Pressable
                  key={c.id}
                  style={({ pressed }) => [
                    styles.gridCard,
                    { backgroundColor: "#fff" },
                    { borderColor },
                    pressed && { opacity: 0.82 },
                  ]}
                  onPress={() => handleCardPress(c.id)}
                >
                  <Text style={[styles.cardTitle, { color }]}>{c.title}</Text>
                  <View
                    style={[styles.cardDiff, { backgroundColor: color + "22" }]}
                  >
                    {/* <Text style={[styles.cardDiffText, { color }]}>
                      {c.difficulty}
                    </Text> */}
                  </View>
                  <Image
                    source={c.emoji}
                    style={[styles.cardEmoji, { tintColor: color }]} // <-- Se pasa como propiedad directa en expo-image
                    contentFit="contain"
                  />
                  <View style={styles.cardBottom}>
                    {isComplete && (
                      <View
                        style={[
                          styles.doneChip,
                          { backgroundColor: color + "33" },
                        ]}
                      >
                        <Text style={[styles.doneChipText, { color }]}>
                          ✓ Listo
                        </Text>
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

      {langPickerOpen && (
        <ConceptPickerSheet
          onConfirm={handleLangConfirm}
          onClose={() => setLangPickerOpen(false)}
        />
      )}
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
    marginBottom: SPACING * 1.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING * 1.5,
  },
  gridCard: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.2,
    borderRadius: 24,
    padding: SPACING * 1.8,
    justifyContent: "space-between",
    overflow: "hidden",

    //ajustes para el borde
    borderWidth: 1, // Grosor del borde de color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
    maxWidth: "100%",
    bottom: SPACING * 1.2,
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
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
