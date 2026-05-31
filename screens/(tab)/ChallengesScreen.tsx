import { ConceptPickerSheet } from "@/components/challenges/ConceptPickerSheet";
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
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const BAR_HEIGHT = TAB_ITEM_SIZE + SPACING * 1.5;


type IconConfig = {
  image: ImageSourcePropType;
  bg: string;
  color: string;
  cardImage: ImageSourcePropType;
};

const ICON_MAP: Record<string, IconConfig> = {
  adivina_concepto: {
    image: require("@/assets/icons/Dialog.svg"),
    bg: P_TEAL.bg,
    color: P_TEAL.fg,
    cardImage: require("@/assets/abstracts/Group-11.png"),
  },
  identifica_patron: {
    image: require("@/assets/icons/Surveillance.svg"),
    bg: P_AMBER.bg,
    color: P_AMBER.fg,
    cardImage: require("@/assets/abstracts/Group-6.png"),
  },
  verdad_mito: {
    image: require("@/assets/icons/Approval.svg"),
    bg: P_GOLD.bg,
    color: P_GOLD.fg,
    cardImage: require("@/assets/abstracts/Group-8.png"),
  },
  completa_reflexion: {
    image: require("@/assets/icons/Documentation.svg"),
    bg: P_SLATE.bg,
    color: P_SLATE.fg,
    cardImage: require("@/assets/abstracts/Group-1.png"),
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

  const nextId = (WEEKLY_CHALLENGES.find(
    (c) => (progress[c.id] ?? 0) < c.questions.length,
  )?.id ?? WEEKLY_CHALLENGES[0].id) as ChallengeType;

  const ctaLabel =
    totalDone === 0
      ? "Comenzar reto →"
      : totalDone === 4
        ? "Repasar retos →"
        : "Continuar reto →";

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: BAR_HEIGHT + bottom + SPACING * 2 },
        ]}
      >
        {/* ── Hero card ── */}
        <LinearGradient
          colors={["#E8F0EE", "#EDE9F8", "#F2E8EF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.heroCard}
        >
          {/* Decoraciones esquinas */}
          <Image source={require("@/assets/abstracts/Group-1.png")} style={s.decoTopRight} contentFit="contain" />
          <Image source={require("@/assets/abstracts/Group-5.png")} style={s.decoTopLeft} contentFit="contain" />
          <Image source={require("@/assets/abstracts/Group-9.png")} style={s.decoStarLeft} contentFit="contain" />

          {/* Fila: texto izquierda + ilustración derecha */}
          <View style={s.heroRow}>
            <View style={s.heroLeft}>
              <Text style={s.heroGreeting}>{"Retos ✦"}</Text>
              <Text style={s.heroTitle}>{"Encuentra\ntu reto"}</Text>
              <Text style={s.heroSub}>
                {totalDone === 4
                  ? "¡Todo completado!"
                  : `${4 - totalDone} de 4 pendientes`}
              </Text>
              <Pressable
                style={({ pressed }) => [s.heroBtn, pressed && { opacity: 0.85 }]}
                onPress={() => handleCardPress(nextId)}
              >
                <Text style={s.heroBtnTxt}>{ctaLabel}</Text>
              </Pressable>
            </View>

            <Image
              source={require("@/assets/abstracts/2.svg")}
              style={s.heroIllustration}
              contentFit="contain"
            />
          </View>
        </LinearGradient>

        <View style={[s.listSection, { backgroundColor: BG }]}>
          <Text style={s.listLabel}>{"Todos los retos"}</Text>
          <View style={s.list}>
            {WEEKLY_CHALLENGES.map((c) => {
              const done = progress[c.id] ?? 0;
              const total = c.questions.length;
              const cfg = ICON_MAP[c.id];

              const completed = done >= total;

              return (
                <Pressable
                  key={c.id}
                  style={({ pressed }) => [
                    s.row,
                    { backgroundColor: cfg.bg },
                    pressed && { opacity: 0.78 },
                  ]}
                  onPress={() => handleCardPress(c.id)}
                >
                  <View style={s.rowBody}>
                    <Text style={[s.rowTitle, { color: cfg.color }]}>
                      {c.title}
                    </Text>
                    <Text style={s.rowSub}>
                      {completed
                        ? "✓ Completado"
                        : done > 0
                          ? `${done} de ${total} correctas`
                          : `${total} preguntas`}
                    </Text>
                  </View>

                  <Image
                    source={cfg.cardImage}
                    style={s.rowIllustration}
                    contentFit="contain"
                  />
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

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { gap: SPACING * 2 },

  screenTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -0.8,
  },

  /* ── Hero card ── */
  heroCard: {
    paddingTop: SPACING * 2,
    paddingBottom: SPACING * 3,
    paddingLeft: SPACING * 2.5,
    overflow: "hidden",
  },

  heroRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  heroLeft: {
    flex: 1,
    gap: SPACING * 1.2,
    paddingBottom: SPACING,
  },
  heroGreeting: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT,
    opacity: 0.55,
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -1,
    lineHeight: 36,
  },
  heroSub: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "500",
  },
  heroBtn: {
    backgroundColor: BG,
    borderRadius: 20,
    paddingVertical: SPACING * 1.1,
    paddingHorizontal: SPACING * 1.8,
    alignSelf: "flex-start",
  },
  heroBtnTxt: { fontSize: 13, fontWeight: "800", color: TEXT },

  heroIllustration: {
    width: 160,
    height: 200,
    marginRight: -10,
  },

  decoTopRight: {
    position: "absolute",
    width: 110,
    height: 110,
    top: -24,
    right: -24,
    opacity: 0.45,
  },
  decoTopLeft: {
    position: "absolute",
    width: 90,
    height: 90,
    top: -16,
    left: -20,
    opacity: 0.35,
  },
  decoStarLeft: {
    position: "absolute",
    width: 40,
    height: 40,
    bottom: 28,
    left: 20,
    opacity: 0.25,
  },

  /* ── Lista ── */
  listSection: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -46,
    paddingTop: SPACING * 3,
    paddingBottom: SPACING * 2,
    gap: SPACING * 1.5,
  },
  listLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginHorizontal: SPACING * 2,
  },
  list: {
    marginHorizontal: SPACING * 2,
    gap: SPACING * 1.2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingTop: SPACING * 2,
    paddingBottom: SPACING * 2,
    paddingLeft: SPACING * 2.5,
    overflow: "hidden",
    minHeight: 95,
  },
  rowBody: {
    flex: 1,
    gap: 5,
    paddingRight: SPACING,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.4,
    lineHeight: 23,
  },
  rowSub: { fontSize: 12, color: MUTED, fontWeight: "500" },
  rowIllustration: {
    width: 95,
    height: 95,
    marginRight: -8,
  },
});
