import { SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import { BG, MUTED, TEXT } from "@/constants/theme";
import { Image } from "expo-image";
import { useState } from "react";
import {
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
const DARK = "#1A1244";
const CARD_H = 210;
const PEEK = 14;

const TIPS = [
  {
    title: "Practica la respiración consciente",
    desc: "Detente 5 minutos al día para respirar con intención. Reduce el estrés y mejora tu enfoque.",
    label: "Consejo destacado",
    image: require("@/assets/abstracts/Group-11.png"),
  },
];

const HABITS = [
  {
    id: "1",
    title: "Deja el celular al despertar",
    duration: "30 días",
    desc: "Los primeros 30 minutos sin pantalla. Tu mente empieza el día desde la calma, no desde el ruido.",
    color: "#FEF3C7",
    accent: "#D97706",
    image: require("@/assets/pincel/Group-5.svg"),
  },
  {
    id: "2",
    title: "Di lo que sientes, sin rodeos",
    duration: "21 días",
    desc: "Practicar la honestidad emocional fortalece tus vínculos y reduce la ansiedad acumulada.",
    color: "#EDE9FE",
    accent: "#7C3AED",
    image: require("@/assets/pincel/Group.svg"),
  },
  {
    id: "3",
    title: "Mueve tu cuerpo 20 minutos",
    duration: "60 días",
    desc: "Es un gran paso para tu bienestar. Tu cuerpo libera endorfinas y tu mente se despeja con cada sesión.",
    color: "#E8F4EE",
    accent: "#4D8B7A",
    image: require("@/assets/pincel/Group-3.svg"),
  },
  {
    id: "4",
    title: "Duerme 8 horas cada noche",
    duration: "14 días",
    desc: "El sueño repara tu cuerpo y consolida lo que aprendes. Sin él, todo lo demás cuesta el doble.",
    color: "#E0F2FE",
    accent: "#0284C7",
    image: require("@/assets/pincel/Group-4.svg"),
  },
  {
    id: "5",
    title: "Un límite claro al día",
    duration: "21 días",
    desc: "Di no a una cosa que no quieres hacer. Cada límite que pones es un mensaje de respeto hacia ti mismo.",
    color: "#FCE7F3",
    accent: "#9D174D",
    image: require("@/assets/pincel/Group-2.svg"),
  },
];

export default function ExploraScreen() {
  const { bottom } = useSafeAreaInsets();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const next = () => setCurrentIdx((i) => (i + 1) % HABITS.length);

  const stack = [0, 1, 2].map((offset) => HABITS[(currentIdx + offset) % HABITS.length]);
  const top = stack[0];

  const handleAdd = () => {
    setAddedIds((prev) => prev.includes(top.id) ? prev : [...prev, top.id]);
    next();
  };

  const handleSkip = () => next();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: BAR_HEIGHT + bottom + SPACING * 2 },
        ]}
      >
        {/* ── Page title ── */}
        <View style={s.pageHeader}>
          <Text style={s.pageTitle}>{"Explora\ntu bienestar"}</Text>
        </View>

        {/* ── Featured tip card ── */}
        <View style={s.tipCard}>
          <View style={s.tipLeft}>
            <Text style={s.tipLabel}>{TIPS[0].label}</Text>
            <Text style={s.tipTitle}>{TIPS[0].title}</Text>
            <Text style={s.tipDesc}>{TIPS[0].desc}</Text>
          </View>
          <Image
            source={TIPS[0].image}
            style={s.tipImage}
            contentFit="contain"
          />
        </View>

        {/* ── Dark CTA ── */}
        <Pressable
          style={({ pressed }) => [s.ctaBtn, pressed && { opacity: 0.82 }]}
        >
          <Text style={s.ctaBtnText}>{"Explorar tu bienestar"}</Text>
        </Pressable>

        {/* ── Habits section header ── */}
        <View style={s.habitsHeader}>
          <Text style={s.habitsTitle}>{"Nuevos hábitos para ti"}</Text>
          <Text style={s.habitsDesc}>
            {
              "Agrega estos hábitos a tu rutina diaria. Cada hábito completado suma a tu mapa de bienestar."
            }
          </Text>
        </View>

        {/* ── Deck de cartas ── */}
        {true ? (
          <View style={s.deckArea}>
            {/* Carta del fondo (3ª) */}
            {stack[2] && (
              <View
                style={[
                  s.deckBehind,
                  {
                    backgroundColor: stack[2].color,
                    top: PEEK * 2,
                    left: 20,
                    right: 20,
                  },
                ]}
              />
            )}
            {/* Carta del medio (2ª) */}
            {stack[1] && (
              <View
                style={[
                  s.deckBehind,
                  {
                    backgroundColor: stack[1].color,
                    top: PEEK,
                    left: 10,
                    right: 10,
                    zIndex: 2,
                  },
                ]}
              />
            )}
            {/* Carta superior — interactiva */}
            <View
              style={[s.deckTop, { backgroundColor: top.color, zIndex: 3 }]}
            >
              <Image
                source={top.image}
                style={s.habitImage}
                contentFit="contain"
              />
              <View style={s.habitContent}>
                <Text style={[s.habitTitle, { color: top.accent }]}>
                  {top.title}
                </Text>
                <Text style={[s.habitDuration, { color: top.accent + "AA" }]}>
                  {top.duration}
                </Text>
                <Text style={s.habitDesc}>{top.desc}</Text>
              </View>
              <View style={s.habitBtns}>
                <Pressable
                  style={[s.habitBtnFill, { backgroundColor: top.accent }]}
                  onPress={handleAdd}
                >
                  <Text style={s.habitBtnFillTxt}>{"+"}</Text>
                </Pressable>
                <Pressable
                  style={[
                    s.habitBtnOutline,
                    { borderColor: top.accent + "55" },
                  ]}
                  onPress={handleSkip}
                >
                  <Text
                    style={[s.habitBtnOutlineTxt, { color: top.accent }]}
                  >
                    {"›"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <View style={s.emptyDeck}>
            <Text style={s.emptyEmoji}>{"🎉"}</Text>
            <Text style={s.emptyTitle}>{"¡Añadiste todos los hábitos!"}</Text>
            <Text style={s.emptyDesc}>
              {"Revisa tu perfil para ver tu progreso."}
            </Text>
          </View>
        )}

        {/* Contador */}
        {(
          <Text style={s.deckCounter}>
            {`${addedIds.length} de ${HABITS.length} hábitos añadidos`}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { gap: SPACING * 2 },

  /* ── Page header ── */
  pageHeader: {
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 2,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -1.2,
    lineHeight: 42,
  },

  /* ── Featured tip ── */
  tipCard: {
    marginHorizontal: SPACING * 2,
    backgroundColor: "#fff",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING * 2,
    gap: SPACING,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  tipLeft: { flex: 1, gap: SPACING * 0.6 },
  tipLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  tipDesc: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 17,
  },
  tipImage: { width: 100, height: 100, flexShrink: 0 },

  /* ── CTA ── */
  ctaBtn: {
    marginHorizontal: SPACING * 2,
    backgroundColor: DARK,
    borderRadius: 18,
    paddingVertical: SPACING * 1.8,
    alignItems: "center",
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  /* ── Habits header ── */
  habitsHeader: {
    paddingHorizontal: SPACING * 2,
    gap: SPACING * 0.5,
  },
  habitsTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -0.5,
  },
  habitsDesc: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 19,
  },

  /* ── Deck ── */
  deckArea: {
    marginHorizontal: SPACING * 2,
    height: CARD_H + PEEK * 2,
    position: "relative",
    marginBottom: SPACING,
  },
  deckBehind: {
    position: "absolute",
    borderRadius: 24,
    height: CARD_H,
    zIndex: 1,
  },
  deckTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: CARD_H,
    borderRadius: 24,
    padding: SPACING * 2,
    gap: SPACING * 0.8,
    overflow: "hidden",
  },

  /* Card content */
  habitImage: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 100,
    height: 100,
    opacity: 0.3,
  },
  habitContent: { gap: SPACING * 0.25, flex: 1 },
  habitTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  habitDuration: { fontSize: 13, fontWeight: "600" },
  habitDesc: {
    fontSize: 12,
    color: "#444",
    lineHeight: 18,
    maxWidth: "75%",
  },
  habitBtns: {
    flexDirection: "row",
    gap: SPACING * 0.8,
  },
  habitBtnFill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  habitBtnFillTxt: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 28,
  },
  habitBtnOutline: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  habitBtnOutlineTxt: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
  },

  /* Counter */
  deckCounter: {
    textAlign: "center",
    fontSize: 12,
    color: MUTED,
    fontWeight: "500",
  },

  /* Empty state */
  emptyDeck: {
    marginHorizontal: SPACING * 2,
    alignItems: "center",
    gap: SPACING * 0.5,
    paddingVertical: SPACING * 3,
  },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: TEXT },
  emptyDesc: { fontSize: 13, color: MUTED },
});
