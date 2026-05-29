import BreathingScreen from "@/components/home/BreathingScreen";
import DearManAssistant from "@/components/home/DearManAssistant";
import HappinessGameAssistant from "@/components/home/HappinessGameAssistant";
import SelfEsteemMirrorAssistant from "@/components/home/SelfEsteemMirrorAssistant";
import VinculosDelHilo from "@/components/home/VinculosDelHilo";
import ReflectionModal from "@/components/home/ReflectionModal";
import { SPACING } from "@/constants/constants";
import { ACCENT, BG, BORDER, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { WEEKLY_CHALLENGES } from "@/data/weeklyData";
import { getUserName, saveUserName } from "@/store/userProfile";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowUpRight, Bell, ChevronRight, Zap } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOODS = [
  {
    image: require("@/assets/images/moods/mood_dificil.svg"),
    label: "Difícil",
  },
  { image: require("@/assets/images/moods/mood_bajo.svg"), label: "Bajo" },
  { image: require("@/assets/images/moods/mood_neutro.svg"), label: "Neutro" },
  { image: require("@/assets/images/moods/mood_bien.svg"), label: "Bien" },
  { image: require("@/assets/images/moods/mood_genial.svg"), label: "Genial" },
] as const;

const MOOD_FEEDBACK = [
  "Está bien no estar bien. Hoy es un buen día para cuidarte con amabilidad.",
  "Los días bajos también forman parte del camino. Sé gentil contigo.",
  "Un día neutro también es válido. Pequeños pasos cuentan.",
  "¡Qué bueno! Aprovecha esta energía para explorar algo nuevo.",
  "Excelente. Hoy tienes todo para ir un poco más lejos.",
];

type CategoryAction =
  | "breathing"
  | "dear_man"
  | "felicidad"
  | "autoestima"
  | "vinculos"
  | "proposito";

type Category = {
  image: number;
  label: string;
  color: string;
  action: CategoryAction;
};

const CATEGORIES: Category[] = [
  {
    image: require("@/assets/images/categories/respiracion.svg"),
    label: "Respiración",
    color: "#E8F0EE",
    action: "breathing",
  },
  {
    image: require("@/assets/images/categories/limites.svg"),
    label: "Límites",
    color: "#EDE9FE",
    action: "dear_man",
  },
  {
    image: require("@/assets/images/categories/felicidad.svg"),
    label: "Felicidad",
    color: "#FEF9E7",
    action: "felicidad",
  },
  {
    image: require("@/assets/images/categories/autoestima.svg"),
    label: "Autoestima",
    color: "#F5E8EF",
    action: "autoestima",
  },
  {
    image: require("@/assets/images/categories/vinculos.svg"),
    label: "Vínculos",
    color: "#E8F4EE",
    action: "vinculos",
  },
  {
    image: require("@/assets/images/categories/proposito.svg"),
    label: "Propósito",
    color: "#EDE9F8",
    action: "proposito",
  },
];

const QUOTES = [
  {
    text: "El hombre es lo que piensa en lo más profundo de su corazón.",
    author: "James Allen",
    source: "Como el Hombre Piensa",
  },
  {
    text: "Los límites son la distancia a la que puedo amarte sin perderte a ti o a mí mismo.",
    author: "Nedra Tawwab",
    source: "Set Boundaries, Find Peace",
  },
  {
    text: "El bienestar no es una meta que se alcanza; es una práctica que se sostiene.",
    author: "Psicología positiva",
    source: "",
  },
  {
    text: "Pedir lo que necesitas es un acto de valentía, no de debilidad.",
    author: "Nedra Tawwab",
    source: "Set Boundaries, Find Peace",
  },
  {
    text: "Cada emoción es una señal, no una sentencia.",
    author: "Psicología emocional",
    source: "",
  },
  {
    text: "La gratitud transforma lo que tenemos en suficiente.",
    author: "Anónimo",
    source: "",
  },
  {
    text: "Conocerse a uno mismo es el comienzo de toda transformación.",
    author: "Carl Jung",
    source: "",
  },
];

const CHALLENGE_META: Record<string, { subtitle: string; emoji: string }> = {
  adivina_concepto: {
    subtitle: "Identifica el concepto desde la situación",
    emoji: "🧠",
  },
  identifica_patron: {
    subtitle: "Detecta el patrón de comportamiento",
    emoji: "🔍",
  },
  verdad_mito: {
    subtitle: "¿Sabes distinguir los mitos del bienestar?",
    emoji: "⚡",
  },
  completa_reflexion: {
    subtitle: "Completa la reflexión de los grandes autores",
    emoji: "✨",
  },
};

export default function HomeScreen() {
  const { nombre } = useLocalSearchParams<{ nombre?: string }>();
  const [userName, setUserName] = useState("...");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [breathingVisible, setBreathingVisible] = useState(false);
  const [dearManVisible, setDearManVisible] = useState(false);
  const [happinessVisible, setHappinessVisible] = useState(false);
  const [selfEsteemVisible, setSelfEsteemVisible] = useState(false);
  const [vinculosVisible, setVinculosVisible] = useState(false);

  useEffect(() => {
    if (nombre) {
      saveUserName(nombre);
      setUserName(nombre);
    } else {
      getUserName().then((n) => {
        if (n) setUserName(n);
      });
    }
  }, [nombre]);

  const categoryHandlers: Record<CategoryAction, () => void> = {
    breathing: () => setBreathingVisible(true),
    dear_man: () => setDearManVisible(true),
    felicidad: () => setHappinessVisible(true),
    autoestima: () => setSelfEsteemVisible(true),
    vinculos: () => setVinculosVisible(true),
    proposito: () => {},
  };

  const day = new Date().getDay();
  const quote = QUOTES[day % QUOTES.length];
  const featured = WEEKLY_CHALLENGES[day % WEEKLY_CHALLENGES.length];
  const meta = CHALLENGE_META[featured.id] ?? { subtitle: "", emoji: "⚡" };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
        {/* ── Hero ── */}
        <View style={s.hero}>
          <Image
            source={require("@/assets/images/Bg.svg")}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <Image
            source={require("@/assets/images/bg2.svg")}
            style={s.auxiliar_bg}
            contentFit="contain"
          />

          {/* Top bar */}
          <View style={s.heroTop}>
            <Text style={s.heroLabel}>{"Reflexión diaria"}</Text>
            <Pressable style={s.bellBtn}>
              <Bell size={20} color="#2D1F60" strokeWidth={1.8} />
            </Pressable>
          </View>

          {/* Saludo */}
          <Text style={s.heroGreeting}>{`Hola, ${userName} 👋`}</Text>

          {/* Pregunta con texto mixto */}
          <Text style={s.heroQuestion}>
            {"¿Cómo te sientes con tus "}
            <Text style={s.heroQuestionBold}>{"emociones"}</Text>
            {" hoy?"}
          </Text>

          {/* Input de reflexión → abre modal */}
          <Pressable
            style={s.reflectionCard}
            onPress={() => setModalVisible(true)}
          >
            <Text
              style={[
                s.reflectionInput,
                !reflection && s.reflectionPlaceholder,
              ]}
              numberOfLines={1}
            >
              {reflection || "Tu reflexión de hoy..."}
            </Text>
            <View style={s.reflectionBtn}>
              <ArrowUpRight size={18} color={"#fff"} strokeWidth={2.5} />
            </View>
          </Pressable>

          {/* Registro de humor */}
          <Text style={s.moodLogLabel}>{"Registro de humor"}</Text>
          <View style={s.moodRow}>
            {MOODS.map((m, i) => {
              const active = selectedMood === i;
              return (
                <Pressable
                  key={i}
                  onPress={() => setSelectedMood(i)}
                  style={[s.moodBtn, active && s.moodBtnActive]}
                >
                  <Image
                    source={m.image}
                    style={s.moodEmoji}
                    contentFit="contain"
                  />
                  <Text style={[s.moodLabel, active && s.moodLabelActive]}>
                    {m.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {selectedMood !== null && (
            <View style={s.feedbackBox}>
              <Text style={s.feedbackText}>{MOOD_FEEDBACK[selectedMood]}</Text>
            </View>
          )}
        </View>

        {/* ── Body ── */}
        <View style={s.body}>
          <Text style={s.sectionTitle}>{"Explora hoy"}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.catRow}
          >
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.action}
                style={[s.catCard, { backgroundColor: cat.color }]}
                onPress={categoryHandlers[cat.action]}
              >
                <Image
                  source={cat.image}
                  style={s.catIllustration}
                  contentFit="contain"
                />
                <Text style={s.catLabel}>{cat.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={s.quoteCard}>
            <Text style={s.cardLabel}>{"FRASE DEL DÍA"}</Text>
            <Text style={s.quoteMark}>{"“"}</Text>
            <Text style={s.quoteText}>{quote.text}</Text>
            <View style={s.quoteFooter}>
              <Text style={s.quoteAuthor}>{`— ${quote.author}`}</Text>
              {quote.source ? (
                <Text style={s.quoteSource}>{quote.source}</Text>
              ) : null}
            </View>
          </View>

          <Text style={s.sectionTitle}>{"Desafío del día"}</Text>
          <Pressable
            style={[s.challengeCard, { borderLeftColor: featured.color }]}
            onPress={() =>
              router.push({
                pathname: "/challenge-detail",
                params: { id: featured.id },
              })
            }
          >
            <View
              style={[
                s.challengeIcon,
                { backgroundColor: featured.color + "18" },
              ]}
            >
              <Text style={s.challengeIconText}>{meta.emoji}</Text>
            </View>
            <View style={s.challengeInfo}>
              <View style={s.challengeBadge}>
                <Zap size={11} color={featured.color} />
                <Text style={[s.challengeBadgeText, { color: featured.color }]}>
                  {"5 min"}
                </Text>
              </View>
              <Text style={s.challengeTitle} numberOfLines={1}>
                {featured.title}
              </Text>
              <Text style={s.challengeSub} numberOfLines={1}>
                {meta.subtitle}
              </Text>
            </View>
            <ChevronRight size={20} color={featured.color} strokeWidth={2} />
          </Pressable>

          <Text style={s.sectionTitle}>{"Tu espacio"}</Text>
          <View style={s.quickGrid}>
            <Pressable
              style={[s.quickCard, { backgroundColor: "#EDE9F8" }]}
              onPress={() => router.push("/four")}
            >
              <Text style={s.quickEmoji}>{"🧭"}</Text>
              <Text style={[s.quickTitle, { color: "#7B6BB5" }]}>
                {"Mi Camino"}
              </Text>
              <Text style={[s.quickSub, { color: "#9080C0" }]}>
                {"Descubre tu perfil de bienestar"}
              </Text>
            </Pressable>
            <Pressable
              style={[s.quickCard, { backgroundColor: "#F5E8EF" }]}
              onPress={() => router.push("/two")}
            >
              <Text style={s.quickEmoji}>{"🏆"}</Text>
              <Text style={[s.quickTitle, { color: "#9E5C72" }]}>
                {"Retos"}
              </Text>
              <Text style={[s.quickSub, { color: "#B07088" }]}>
                {"4 desafíos de bienestar activos"}
              </Text>
            </Pressable>
          </View>

          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      <ReflectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(text) => {
          setReflection(text);
          setModalVisible(false);
        }}
      />
      <BreathingScreen
        visible={breathingVisible}
        onClose={() => setBreathingVisible(false)}
      />
      <DearManAssistant
        visible={dearManVisible}
        onClose={() => setDearManVisible(false)}
      />
      <HappinessGameAssistant
        visible={happinessVisible}
        onClose={() => setHappinessVisible(false)}
      />
      <SelfEsteemMirrorAssistant
        visible={selfEsteemVisible}
        onClose={() => setSelfEsteemVisible(false)}
      />
      <VinculosDelHilo
        visible={vinculosVisible}
        onClose={() => setVinculosVisible(false)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: ACCENT },
  scroll: { flex: 1 },

  /* ── Hero ── */
  hero: {
    position: "relative",
    backgroundColor: ACCENT,
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING,
    paddingBottom: SPACING * 5.5,
  },
  auxiliar_bg: {
    position: "absolute",
    right: 0,
    bottom: 40,
    width: 220,
    height: 300,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING * 2,
  },
  heroLabel: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    color: "rgba(30,15,70,0.5)",
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroGreeting: {
    fontSize: 28,
    fontFamily: "Playfair-ExtraBold",
    color: "#1A1244",
    marginBottom: 6,
  },
  heroQuestion: {
    fontSize: 22,
    fontFamily: "Poppins-Regular",
    color: "#2D1F60",
    lineHeight: 32,
    marginBottom: SPACING * 2,
  },
  heroQuestionBold: {
    fontFamily: "Poppins-ExtraBold",
    color: "#1A1244",
  },

  /* Reflection input */
  reflectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: SPACING * 2.5,
    gap: 8,
  },
  reflectionInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#2D1F60",
  },
  reflectionPlaceholder: {
    color: "rgba(45,31,96,0.38)",
    maxHeight: 72,
  },
  reflectionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2D1F60",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  /* Mood log */
  moodLogLabel: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: "rgba(30,15,70,0.55)",
    marginBottom: SPACING,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodBtn: {
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  moodBtnActive: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderColor: "rgba(255,255,255,0.7)",
  },
  moodEmoji: { width: 48, height: 48 },
  moodLabel: {
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    color: "rgba(30,15,70,0.5)",
  },
  moodLabelActive: {
    color: "#1A1244",
    fontFamily: "Poppins-ExtraBold",
  },
  feedbackBox: {
    marginTop: SPACING * 1.5,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  feedbackText: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    color: "#2D1F60",
    lineHeight: 19,
  },

  /* ── Body ── */
  body: {
    backgroundColor: BG,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    marginTop: -48,
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 2.5,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: TEXT,
    marginBottom: SPACING,
  },
  catRow: {
    gap: SPACING * 1.2,
    paddingBottom: SPACING * 2,
    paddingRight: SPACING,
  },
  catCard: {
    width: 110,
    borderRadius: 20,
    paddingBottom: SPACING,
    overflow: "hidden",
    alignItems: "center",
  },
  catIllustration: {
    width: 110,
    height: 100,
  },
  catLabel: {
    fontSize: 11,
    fontFamily: "Poppins-SemiBold",
    color: TEXT,
    textAlign: "center",
    marginTop: 4,
  },

  quoteCard: {
    backgroundColor: "#F5F3FF",
    borderRadius: 20,
    padding: SPACING * 1.5,
    marginBottom: SPACING * 2,
    borderWidth: 1,
    borderColor: "#E4DFFF",
    shadowColor: "#222227",
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 10,
    fontFamily: "Poppins-Bold",
    letterSpacing: 1.2,
    color: MUTED,
    marginBottom: 4,
  },
  quoteMark: {
    fontSize: 52,
    color: ACCENT,
    fontFamily: "Playfair-ExtraBold",
    lineHeight: 48,
    marginBottom: 2,
  },
  quoteText: {
    fontSize: 15,
    color: TEXT,
    fontFamily: "Poppins-Medium",
    lineHeight: 22,
    fontStyle: "italic",
    marginBottom: 12,
  },
  quoteFooter: { gap: 2 },
  quoteAuthor: { fontSize: 12, fontFamily: "Poppins-Bold", color: ACCENT },
  quoteSource: { fontSize: 11, fontFamily: "Poppins-Regular", color: MUTED },

  challengeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: SPACING * 1.2,
    marginBottom: SPACING * 2,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 4,
  },
  challengeIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  challengeIconText: { fontSize: 26 },
  challengeInfo: { flex: 1, gap: 3 },
  challengeBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  challengeBadgeText: { fontSize: 11, fontFamily: "Poppins-Bold" },
  challengeTitle: { fontSize: 15, fontFamily: "Poppins-Bold", color: TEXT },
  challengeSub: { fontSize: 12, fontFamily: "Poppins-Regular", color: MUTED },

  quickGrid: { flexDirection: "row", gap: SPACING },
  quickCard: {
    flex: 1,
    borderRadius: 18,
    padding: SPACING * 1.2,
    gap: 5,
  },
  quickEmoji: { fontSize: 28, marginBottom: 2 },
  quickTitle: { fontSize: 14, fontFamily: "Poppins-ExtraBold" },
  quickSub: { fontSize: 11, fontFamily: "Poppins-Medium", lineHeight: 16 },
});
