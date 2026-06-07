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
  character: ImageSourcePropType;
  photoBg: ImageSourcePropType;
};

const TAG_LABELS: Record<string, string> = {
  adivina_concepto: "#Conceptos",
  identifica_patron: "#Patrones",
  verdad_mito: "#Verdad o Mito",
  completa_reflexion: "#Reflexión",
};

const ICON_MAP: Record<string, IconConfig> = {
  adivina_concepto: {
    image: require("@/assets/icons/Dialog.svg"),
    bg: P_TEAL.bg,
    color: P_TEAL.fg,
    cardImage: require("@/assets/abstracts/Group-11.png"),
    character: require("@/assets/character/3.png"),
    photoBg: require("@/assets/background/7.jpg"),
  },
  identifica_patron: {
    image: require("@/assets/icons/Surveillance.svg"),
    bg: P_AMBER.bg,
    color: P_AMBER.fg,
    cardImage: require("@/assets/abstracts/Group-6.png"),
    character: require("@/assets/character/7.png"),
    photoBg: require("@/assets/background/9.jpg"),
  },
  verdad_mito: {
    image: require("@/assets/icons/Approval.svg"),
    bg: P_GOLD.bg,
    color: P_GOLD.fg,
    cardImage: require("@/assets/abstracts/Group-8.png"),
    character: require("@/assets/character/14.png"),
    photoBg: require("@/assets/background/11.jpg"),
  },
  completa_reflexion: {
    image: require("@/assets/icons/Documentation.svg"),
    bg: P_SLATE.bg,
    color: P_SLATE.fg,
    cardImage: require("@/assets/abstracts/Group-1.png"),
    character: require("@/assets/character/2.png"),
    photoBg: require("@/assets/background/12.jpg"),
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
        <View style={s.heroCard}>
          {/* Fondo */}
          <Image
            source={require("@/assets/images/fondo2.jpeg")}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition="top"
          />
          {/* Fila: texto izquierda + ilustración derecha */}
          <View style={s.heroRow}>
            <View style={s.heroLeft}>
              <Text style={s.heroGreeting}>{"Retos semanales ✦"}</Text>
              <Text style={s.heroTitle}>
                {"Entrena tu\n"}
                <Text style={s.heroTitleAccent}>{"bienestar"}</Text>
              </Text>
              <Text style={s.heroDesc}>
                {
                  "Practica con ejercicios cortos diseñados\npara fortalecer tu mente cada semana."
                }
              </Text>
              <Text style={s.heroSub}>
                {totalDone === 4
                  ? "✓ Semana completa — ¡buen trabajo!"
                  : `${4 - totalDone} de 4 retos pendientes`}
              </Text>
            </View>
          </View>
        </View>

        <View style={[s.listSection, { backgroundColor: BG }]}>
          <Text style={s.listLabel}>{"Todos los retos"}</Text>
          <View style={s.list}>
            {/* Línea vertical del timeline */}
            <View style={s.timelineLine} />

            {WEEKLY_CHALLENGES.map((c) => {
              const done = progress[c.id] ?? 0;
              const total = c.questions.length;
              const cfg = ICON_MAP[c.id];
              const completed = done >= total;

              return (
                <View key={c.id} style={s.timelineItem}>
                  {/* Izquierda: solo el dot */}
                  <View style={s.timelineLeft}>
                    <View
                      style={[
                        s.timelineDot,
                        { backgroundColor: cfg.bg, borderColor: cfg.color },
                      ]}
                    >
                      <Image
                        source={cfg.cardImage}
                        style={s.timelineDotIcon}
                        contentFit="contain"
                      />
                    </View>
                  </View>

                  {/* Derecha: etiqueta encima de la card + personaje + card */}
                  <View style={s.cardWrapper}>
                    <Text style={[s.timelineLabel, { color: cfg.color }]}>
                      {TAG_LABELS[c.id].replace("#", "")}
                    </Text>
                    <Image
                      source={cfg.character}
                      style={s.rowCharacter}
                      contentFit="contain"
                      contentPosition="bottom"
                    />
                    <Pressable
                      style={({ pressed }) => [
                        s.row,
                        { backgroundColor: cfg.bg },
                        pressed && { opacity: 0.82 },
                      ]}
                      onPress={() => handleCardPress(c.id)}
                    >
                      <Image
                        source={cfg.photoBg}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                      />
                      <View style={[StyleSheet.absoluteFill, { backgroundColor: cfg.bg + "A0" }]} />
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
                    </Pressable>
                  </View>
                </View>
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
    color: "#8980B8",
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -1,
    lineHeight: 36,
  },
  heroTitleAccent: {
    color: "#8980B8",
    fontWeight: "900",
  },
  heroDesc: {
    fontSize: 13,
    color: MUTED,
    fontWeight: "400",
    lineHeight: 19,
  },
  heroSub: {
    fontSize: 12,
    color: "#8980B8",
    fontWeight: "700",
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
    marginHorizontal: SPACING,
    gap: SPACING * 2,
    position: "relative",
  },

  /* ── Timeline ── */
  timelineLine: {
    position: "absolute",
    left: 19,
    top: 50,
    bottom: 50,
    width: 1.5,
    borderLeftWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(137,128,184,0.3)",
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING,
  },
  timelineLeft: {
    alignItems: "center",
    paddingTop: 60 + 22,
    width: 42,
  },
  timelineDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  timelineDotIcon: {
    width: 38,
    height: 38,
  },
  timelineLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: 6,
  },

  /* ── Card wrapper (derecha del timeline) ── */
  cardWrapper: {
    flex: 1,
    position: "relative",
    paddingTop: 60,
  },
  rowWrapper: {
    position: "relative",
    paddingTop: 60,
  },
  row: {
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 120,
    paddingTop: SPACING * 2,
    paddingBottom: SPACING * 2,
    paddingLeft: SPACING * 2,
    paddingRight: 160,
    gap: 6,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: SPACING,
  },
  rowLeft: {
    flex: 1,
    gap: 6,
  },
  rowCharacter: {
    position: "absolute",
    right: 4,
    bottom: 0,
    height: 300,
    width: 200,
    zIndex: 1,
  },
  rowTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  rowTagChip: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  rowSub: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "500",
  },
  rowBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  rowBadgeNum: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.5,
    color: "#fff",
  },
  rowBadgeLabel: {
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
  },
  rowBtn: {
    borderRadius: 14,
    paddingVertical: SPACING * 1.1,
    paddingHorizontal: SPACING * 1.8,
    alignSelf: "flex-start",
  },
  rowBtnTxt: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
  },
  rowIllustration: {
    width: 95,
    height: 95,
  },
});
