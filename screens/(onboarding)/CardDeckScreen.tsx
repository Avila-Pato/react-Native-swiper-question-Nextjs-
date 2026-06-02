import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { AREA_COLORS, DeckCard, buildDeck } from "@/data/cardDeckData";
import { useUserStore } from "@/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_W = width * 0.84;
const CARD_H = 240;

function CardFace({ card }: { card: DeckCard }) {
  const colors = AREA_COLORS[card.area] ?? { accent: "#8980B8" };
  return (
    <View style={styles.cardContent}>
      <Text style={[styles.cardAreaLabel, { color: colors.accent }]}>
        {card.areaLabel}
      </Text>
      <Text style={styles.cardText}>{card.text}</Text>
    </View>
  );
}

export default function CardDeckScreen() {
  const params = useLocalSearchParams<{
    startNode?: string;
    formacion?: string;
    ramas?: string;
  }>();

  const { saveDiagnostic } = useUserStore();

  const areas = useMemo(
    () => params.ramas?.split(",").filter(Boolean) ?? ["emociones"],
    [params.ramas],
  );

  const cards = useMemo(() => buildDeck(areas), [areas]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);

  const cardX = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const card2Scale = useSharedValue(0.94);
  const card2Y = useSharedValue(20);
  const card3Scale = useSharedValue(0.88);
  const card3Y = useSharedValue(38);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardX.value }],
    opacity: cardOpacity.value,
  }));
  const card2Style = useAnimatedStyle(() => ({
    transform: [{ scale: card2Scale.value }, { translateY: card2Y.value }],
  }));
  const card3Style = useAnimatedStyle(() => ({
    transform: [{ scale: card3Scale.value }, { translateY: card3Y.value }],
  }));

  const advance = (nextIdx: number, finalScores: Record<string, number>) => {
    if (nextIdx >= cards.length) {
      const strengths = areas.filter((a) => (finalScores[a] ?? 0) <= 1);
      const challenges = areas.filter((a) => (finalScores[a] ?? 0) >= 2);
      saveDiagnostic({ scores: finalScores, strengths, challenges });
      router.push({
        pathname: "/personal",
        params: {
          startNode: params.startNode ?? "",
          formacion: params.formacion ?? "",
          ramas: params.ramas ?? "",
        },
      });
      return;
    }
    setCurrentIdx(nextIdx);
    cardX.value = 0;
    cardOpacity.value = 1;
    card2Scale.value = 0.94;
    card2Y.value = 20;
    card3Scale.value = 0.88;
    card3Y.value = 38;
    setBusy(false);
  };

  const handleChoice = (resonates: boolean) => {
    if (busy) return;
    setBusy(true);

    const card = cards[currentIdx];
    const newScores = { ...scores };
    if (resonates) {
      newScores[card.area] = (newScores[card.area] ?? 0) + 1;
      setScores(newScores);
    }

    cardX.value = withTiming(resonates ? width + 100 : -(width + 100), {
      duration: 320,
    });
    cardOpacity.value = withTiming(0, { duration: 260 });
    card2Scale.value = withSpring(1, { damping: 16, stiffness: 120 });
    card2Y.value = withSpring(0, { damping: 16, stiffness: 120 });
    card3Scale.value = withSpring(0.94, { damping: 16, stiffness: 120 });
    card3Y.value = withSpring(20, { damping: 16, stiffness: 120 });

    setTimeout(() => advance(currentIdx + 1, newScores), 310);
  };

  const card = cards[currentIdx];
  const next1 = cards[currentIdx + 1];
  const next2 = cards[currentIdx + 2];

  if (!card) return null;

  const bg = AREA_COLORS[card.area]?.bg ?? "#EDE9F5";
  const bg1 = next1 ? (AREA_COLORS[next1.area]?.bg ?? "#EDE9F5") : "#EDE9F5";
  const bg2 = next2 ? (AREA_COLORS[next2.area]?.bg ?? "#EDE9F5") : "#EDE9F5";

  const progress = (currentIdx + 1) / cards.length;

  return (
    <View style={styles.root}>
      <OnboardingProgress step={3} />
      <View style={styles.header}>
        <Text style={styles.title}>
          ¿Con cuál <Text style={{ color: "#8980B8" }}>resuenas?</Text>
        </Text>
        <Text style={styles.subtitle}>
          Toca la que mejor describe cómo te sientes ahora
        </Text>
      </View>

      {/* Progress dots */}
      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {currentIdx + 1}/{cards.length}
        </Text>
      </View>

      {/* Card stack */}
      <View style={styles.stackWrap}>
        {next2 && (
          <Animated.View
            style={[
              styles.card,
              card3Style,
              { backgroundColor: bg2, zIndex: 1 },
            ]}
          >
            <CardFace card={next2} />
          </Animated.View>
        )}
        {next1 && (
          <Animated.View
            style={[
              styles.card,
              card2Style,
              { backgroundColor: bg1, zIndex: 2 },
            ]}
          >
            <CardFace card={next1} />
          </Animated.View>
        )}
        <Animated.View
          style={[styles.card, cardStyle, { backgroundColor: bg, zIndex: 3 }]}
        >
          <CardFace card={card} />
        </Animated.View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnNo}
          onPress={() => handleChoice(false)}
          activeOpacity={0.75}
        >
          <Text style={styles.btnNoText}>No tanto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSi}
          onPress={() => handleChoice(true)}
          activeOpacity={0.82}
        >
          <Ionicons name="heart" size={16} color="#fff" />
          <Text style={styles.btnSiText}>Resuena</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: 28,
    gap: 6,
  },
  title: {
    color: "#1C1B29",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -1,
    lineHeight: 38,
  },
  subtitle: {
    color: "#8A8A9A",
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 20,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    marginTop: 20,
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(137,128,184,0.15)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8980B8",
    borderRadius: 2,
  },
  progressLabel: {
    color: "#8A8A9A",
    fontSize: 12,
    fontWeight: "600",
    minWidth: 32,
    textAlign: "right",
  },
  stackWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  card: {
    position: "absolute",
    width: CARD_W,
    height: CARD_H,
    borderRadius: 24,
    shadowColor: "#1C1B29",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  cardContent: {
    flex: 1,
    padding: 28,
    gap: 16,
    justifyContent: "center",
  },
  cardAreaLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cardEmoji: {
    fontSize: 52,
    textAlign: "center",
    marginVertical: 8,
  },
  cardText: {
    color: "#1C1B29",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 26,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 28,
    paddingBottom: 64,
    paddingTop: 20,
    gap: 12,
  },
  btnNo: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(137,128,184,0.25)",
  },
  btnNoText: {
    color: "#8A8A9A",
    fontSize: 15,
    fontWeight: "600",
  },
  btnSi: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#8980B8",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  btnSiText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
