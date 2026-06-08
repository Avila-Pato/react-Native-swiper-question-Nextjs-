import BreathingScreen from "@/components/home/ExploreSection/breathing";
import DearManAssistant from "@/components/home/ExploreSection/dearman";
import HappinessGameAssistant from "@/components/home/ExploreSection/happiness";
import PurposeCompassAssistant from "@/components/home/ExploreSection/purposecompass";
import SelfEsteemMirrorAssistant from "@/components/home/ExploreSection/selfesteemmirror";
import VinculosDelHilo from "@/components/home/ExploreSection/vinculos";
import { RecorderModal } from "@/components/home/RecorderModal";
import { RewardCard } from "@/components/home/RewardCard";
import { SPACING } from "@/constants/constants";
import { ACCENT, BG, BORDER, MUTED, TEXT } from "@/constants/theme";
import { MOODS } from "@/data/moods";
import { WEEKLY_CHALLENGES } from "@/data/weeklyData";
import { getMoodHistory, saveMood, todayString } from "@/store/moodHistory";
import { useJournalRecorder } from "@/hooks/useJournalRecorder";
import { getUserName, saveUserName } from "@/store/userProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  Bell,
  Check,
  ChevronRight,
  Mic,
  Square,
  Zap,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    image: require("@/assets/background/1.jpg"),
  },
  {
    text: "Los límites son la distancia a la que puedo amarte sin perderte a ti o a mí mismo.",
    author: "Nedra Tawwab",
    source: "Set Boundaries, Find Peace",
    image: require("@/assets/background/2.jpg"),
  },
  {
    text: "El bienestar no es una meta que se alcanza; es una práctica que se sostiene.",
    author: "Psicología positiva",
    source: "",
    image: require("@/assets/background/3.jpg"),
  },
  {
    text: "Pedir lo que necesitas es un acto de valentía, no de debilidad.",
    author: "Nedra Tawwab",
    source: "Set Boundaries, Find Peace",
    image: require("@/assets/background/4.jpg"),
  },
  {
    text: "Cada emoción es una señal, no una sentencia.",
    author: "Psicología emocional",
    source: "",
    image: require("@/assets/background/5.jpg"),
  },
  {
    text: "La gratitud transforma lo que tenemos en suficiente.",
    author: "Anónimo",
    source: "",
    image: require("@/assets/background/6.jpg"),
  },
  {
    text: "Conocerse a uno mismo es el comienzo de toda transformación.",
    author: "Carl Jung",
    source: "",
    image: require("@/assets/background/7.jpg"),
  },
];

const CHALLENGE_META: Record<
  string,
  { subtitle: string; image: ImageSourcePropType; photoBg: ImageSourcePropType }
> = {
  adivina_concepto: {
    subtitle: "Identifica el concepto desde la situación",
    image: require("@/assets/pincel/Group.svg"),
    photoBg: require("@/assets/background/7.jpg"),
  },
  identifica_patron: {
    subtitle: "Detecta el patrón de comportamiento",
    image: require("@/assets/pincel/Group-2.svg"),
    photoBg: require("@/assets/background/9.jpg"),
  },
  verdad_mito: {
    subtitle: "Límites, emociones, relaciones y más",
    image: require("@/assets/pincel/Group-4.svg"),
    photoBg: require("@/assets/background/11.jpg"),
  },
  completa_reflexion: {
    subtitle: "Completa la reflexión de los grandes autores",
    image: require("@/assets/pincel/Group-6.svg"),
    photoBg: require("@/assets/background/12.jpg"),
  },
};

export default function HomeScreen() {
  const { nombre } = useLocalSearchParams<{ nombre?: string }>();
  const [userName, setUserName] = useState("...");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  useEffect(() => {
    getMoodHistory().then((h) => {
      const idx = h[todayString()];
      if (idx !== undefined) setSelectedMood(idx);
    });
  }, []);
  const { reset: resetRecorder, currentStep } = useJournalRecorder();
  const [recorderVisible, setRecorderVisible] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentStep === "recording") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.18, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  // pulseAnim es un ref estable, no necesita ser dependencia
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const [breathingVisible, setBreathingVisible] = useState(false);
  const [dearManVisible, setDearManVisible] = useState(false);
  const [happinessVisible, setHappinessVisible] = useState(false);
  const [selfEsteemVisible, setSelfEsteemVisible] = useState(false);
  const [vinculosVisible, setVinculosVisible] = useState(false);
  const [propositoVisible, setPropositoVisible] = useState(false);
  const [visitedCats, setVisitedCats] = useState<Set<CategoryAction>>(
    new Set(),
  );

  const toastAnim = useRef(new Animated.Value(0)).current;
  const moodScales = useRef(MOODS.map(() => new Animated.Value(1))).current;

  const handleMoodPress = (i: number) => {
    setSelectedMood(i);
    saveMood(todayString(), i);

    moodScales[i].setValue(1);
    Animated.sequence([
      Animated.spring(moodScales[i], {
        toValue: 1.2,
        useNativeDriver: true,
        tension: 260,
        friction: 5,
      }),
      Animated.spring(moodScales[i], {
        toValue: 1,
        useNativeDriver: true,
        tension: 160,
        friction: 7,
      }),
    ]).start();

    toastAnim.stopAnimation();
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const VISITED_KEY = "home_visited_categories";

  useEffect(() => {
    AsyncStorage.getItem(VISITED_KEY).then((raw) => {
      if (raw) setVisitedCats(new Set(JSON.parse(raw) as CategoryAction[]));
    });
  }, []);

  const markVisited = (action: CategoryAction) => {
    setVisitedCats((prev) => {
      if (prev.has(action)) return prev;
      const next = new Set(prev);
      next.add(action);
      AsyncStorage.setItem(VISITED_KEY, JSON.stringify([...next]));
      return next;
    });
  };

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
    breathing: () => {
      markVisited("breathing");
      setBreathingVisible(true);
    },
    dear_man: () => {
      markVisited("dear_man");
      setDearManVisible(true);
    },
    felicidad: () => {
      markVisited("felicidad");
      setHappinessVisible(true);
    },
    autoestima: () => {
      markVisited("autoestima");
      setSelfEsteemVisible(true);
    },
    vinculos: () => {
      markVisited("vinculos");
      setVinculosVisible(true);
    },
    proposito: () => {
      markVisited("proposito");
      setPropositoVisible(true);
    },
  };

  const day = new Date().getDay();
  const quote = QUOTES[day % QUOTES.length];
  const featured = WEEKLY_CHALLENGES[day % WEEKLY_CHALLENGES.length];
  const meta = CHALLENGE_META[featured.id] ?? {
    subtitle: "",
    emoji: "⚡",
    photoBg: require("@/assets/background/7.jpg"),
  };

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

          {/* Micrófono */}
          <Pressable
            style={s.micCard}
            onPress={() => setRecorderVisible(true)}
            disabled={currentStep === "analyzing"}
          >
            <Text style={s.micLabel}>
              {currentStep === "idle" && "Habla sobre tu día"}
              {currentStep === "recording" && "Escuchando... toca para terminar"}
              {currentStep === "analyzing" && "Analizando tu voz..."}
            </Text>
            <Animated.View style={[s.micBtn, { transform: [{ scale: pulseAnim }] }]}>
              {currentStep === "recording"
                ? <Square size={16} color="#fff" fill="#fff" strokeWidth={0} />
                : <Mic size={18} color="#fff" strokeWidth={2.5} />}
            </Animated.View>
          </Pressable>

          {/* Registro de humor */}
          <View style={s.moodLogRow}>
            <Text style={s.moodLogLabel}>{"Registro de humor"}</Text>
            <Animated.View
              pointerEvents="none"
              style={[
                s.moodToast,
                {
                  opacity: toastAnim,
                  transform: [
                    {
                      translateX: toastAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {selectedMood !== null && (
                <>
                  <Image
                    source={MOODS[selectedMood].image}
                    style={s.moodToastEmoji}
                    contentFit="contain"
                  />
                  <Text style={s.moodToastText}>{"Guardado En tu Perfil"}</Text>
                  <Check
                    size={12}
                    color="rgba(45,31,96,0.65)"
                    strokeWidth={2.5}
                  />
                </>
              )}
            </Animated.View>
          </View>
          <View style={s.moodRow}>
            {MOODS.map((m, i) => {
              const active = selectedMood === i;
              return (
                <Animated.View
                  key={i}
                  style={{ transform: [{ scale: moodScales[i] }] }}
                >
                  <Pressable
                    onPress={() => handleMoodPress(i)}
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
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* ── Body ── */}
        <View style={s.body}>
          <Text style={s.sectionTitle}>{"Explora hoy"}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.catRow}
          >
            {CATEGORIES.map((cat) => {
              const visited = visitedCats.has(cat.action);
              return (
                <Pressable
                  key={cat.action}
                  style={[s.catCard, { backgroundColor: cat.color }]}
                  onPress={categoryHandlers[cat.action]}
                >
                  {/* Overlay gris al haber visitado */}
                  {visited && <View style={s.catVisitedOverlay} />}

                  {/* Badge check: siempre visible, lleno si visitado */}
                  <View
                    style={[s.catCheckBadge, visited && s.catCheckBadgeDone]}
                  >
                    <Check
                      size={9}
                      color={visited ? "#fff" : "rgba(80,80,100,0.45)"}
                      strokeWidth={3}
                    />
                  </View>

                  <Image
                    source={cat.image}
                    style={[
                      s.catIllustration,
                      visited && s.catIllustrationDone,
                    ]}
                    contentFit="contain"
                  />
                  <Text style={[s.catLabel, visited && s.catLabelDone]}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={s.quoteCard}>
            <Image
              source={quote.image}
              style={[
                StyleSheet.absoluteFill,
                { borderRadius: 20, opacity: 0.3 },
              ]}
              contentFit="cover"
            />

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
          {/* Desafio del dia */}
          <Pressable
            style={[
              s.challengeCard,
              {
                borderLeftColor: featured.color,
                backgroundColor: featured.color + "14",
              },
            ]}
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
              <Image
                source={meta.image}
                style={s.challengeIconImg}
                contentFit="contain"
              />
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
              <Image
                source={require("@/assets/background/3.jpg")}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "#EDE9F8A0" },
                ]}
              />
              <Image
                source={require("@/assets/pincel/Group-5.svg")}
                style={s.quickImg}
                contentFit="contain"
              />
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
              <Image
                source={require("@/assets/background/5.jpg")}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "#F5E8EFA0" },
                ]}
              />
              <Image
                source={require("@/assets/pincel/Group-3.svg")}
                style={s.quickImg}
                contentFit="contain"
              />
              <Text style={[s.quickTitle, { color: "#9E5C72" }]}>
                {"Retos"}
              </Text>
              <Text style={[s.quickSub, { color: "#B07088" }]}>
                {"4 desafíos de bienestar activos"}
              </Text>
            </Pressable>
          </View>

          <View style={{ height: 140 }} />
        </View>
      </ScrollView>

      <RecorderModal visible={recorderVisible} onClose={() => setRecorderVisible(false)} />
      <RewardCard visible={currentStep === "reward"} onClose={resetRecorder} />
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
      <PurposeCompassAssistant
        visible={propositoVisible}
        onClose={() => setPropositoVisible(false)}
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

  /* Micrófono */
  micCard: {
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
  micLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "rgba(45,31,96,0.55)",
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2D1F60",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  /* Mood log */
  moodLogRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING,
  },
  moodLogLabel: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: "rgba(30,15,70,0.55)",
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
  moodToast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
  },
  moodToastEmoji: { width: 20, height: 20 },
  moodToastText: {
    fontSize: 11,
    fontFamily: "Poppins-SemiBold",
    color: "rgba(45,31,96,0.75)",
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
  catVisitedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(137,128,184,0.1)",
    borderRadius: 20,
    zIndex: 1,
  },
  catCheckBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderWidth: 1.5,
    borderColor: "rgba(137,128,184,0.3)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  catCheckBadgeDone: {
    backgroundColor: "#8980B8",
    borderColor: "#8980B8",
  },
  catIllustrationDone: {
    opacity: 0.78,
  },
  catLabelDone: {
    color: MUTED,
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
    borderRadius: 18,
    padding: SPACING * 1.2,
    marginBottom: SPACING * 2,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 4,
  },
  challengeIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  challengeIconImg: { width: 64, height: 64 },
  challengeInfo: { flex: 1, gap: 3 },
  challengeBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  challengeBadgeText: { fontSize: 11, fontFamily: "Poppins-Bold" },
  challengeTitle: { fontSize: 15, fontFamily: "Poppins-Bold", color: TEXT },
  challengeSub: { fontSize: 12, fontFamily: "Poppins-Regular", color: MUTED },

  quickGrid: { flexDirection: "row", gap: SPACING },
  quickCard: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
    padding: SPACING * 1.2,
    gap: 5,
  },
  quickImg: { width: 64, height: 64, marginBottom: 2 },
  quickTitle: { fontSize: 14, fontFamily: "Poppins-ExtraBold" },
  quickSub: { fontSize: 11, fontFamily: "Poppins-Medium", lineHeight: 16 },
});
