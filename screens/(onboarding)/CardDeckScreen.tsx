import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { AREA_COLORS, DeckCard, buildDeck } from "@/data/cardDeckData";
import { useUserStore } from "@/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_W = width * 0.84;
const CARD_H = 240;

const SCALE = [1, 0.94, 0.88];
const Y_OFF = [0, 18, 34];
const DURATION = 320;

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

function AnimatedCard({
  card,
  position,
  isExiting,
  exitRight,
}: {
  card: DeckCard;
  position: number;
  isExiting: boolean;
  exitRight: boolean;
}) {
  const initScale = SCALE[position] ?? 0.82;
  const initY = Y_OFF[position] ?? 48;

  const scaleV = useSharedValue(initScale);
  const yV = useSharedValue(initY);
  const xV = useSharedValue(0);
  const opacityV = useSharedValue(position <= 2 ? 1 : 0);

  useEffect(() => {
    if (isExiting) {
      scaleV.value = withTiming(0.95, { duration: 180 });
      xV.value = withTiming(exitRight ? width + 80 : -(width + 80), {
        duration: 360,
      });
      opacityV.value = withTiming(0, { duration: 300 });
    } else {
      scaleV.value = withTiming(SCALE[position] ?? 0.82, { duration: DURATION });
      yV.value = withTiming(Y_OFF[position] ?? 48, { duration: DURATION });
      opacityV.value = withTiming(1, { duration: DURATION });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, isExiting]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: xV.value },
      { translateY: yV.value },
      { scale: scaleV.value },
    ],
    opacity: opacityV.value,
    zIndex: isExiting ? 10 : (3 - position),
  }));

  const bg = AREA_COLORS[card.area]?.bg ?? "#EDE9F5";

  return (
    <Animated.View style={[styles.card, style, { backgroundColor: bg }]}>
      <CardFace card={card} />
    </Animated.View>
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
  const [exitingInfo, setExitingInfo] = useState<{
    idx: number;
    right: boolean;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const handleChoice = (resonates: boolean) => {
    if (busy) return;
    setBusy(true);

    const thisIdx = currentIdx;
    const card = cards[thisIdx];
    const newScores = { ...scores };
    if (resonates) {
      newScores[card.area] = (newScores[card.area] ?? 0) + 1;
      setScores(newScores);
    }

    const nextIdx = thisIdx + 1;
    const isDone = nextIdx >= cards.length;

    setExitingInfo({ idx: thisIdx, right: resonates });
    if (!isDone) setCurrentIdx(nextIdx);

    setTimeout(() => {
      setExitingInfo(null);
      setBusy(false);

      if (isDone) {
        const strengths = areas.filter((a) => (newScores[a] ?? 0) <= 1);
        const challenges = areas.filter((a) => (newScores[a] ?? 0) >= 2);
        saveDiagnostic({ scores: newScores, strengths, challenges });
        router.replace({
          pathname: "/personal",
          params: {
            startNode: params.startNode ?? "",
            formacion: params.formacion ?? "",
            ramas: params.ramas ?? "",
          },
        });
      }
    }, 400);
  };

  const progress = (currentIdx + 1) / cards.length;

  // Build the list of cards to render
  const visibleSlots: { card: DeckCard; idx: number; position: number }[] = [];

  if (exitingInfo && cards[exitingInfo.idx]) {
    visibleSlots.push({
      card: cards[exitingInfo.idx],
      idx: exitingInfo.idx,
      position: 0,
    });
  }

  for (let i = 0; i < 3; i++) {
    const idx = currentIdx + i;
    if (idx < cards.length && idx !== exitingInfo?.idx) {
      visibleSlots.push({ card: cards[idx], idx, position: i });
    }
  }

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

      <View style={styles.stackWrap}>
        {visibleSlots.map(({ card, idx, position }) => (
          <AnimatedCard
            key={idx}
            card={card}
            position={position}
            isExiting={exitingInfo?.idx === idx}
            exitRight={exitingInfo?.right ?? true}
          />
        ))}
      </View>

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
