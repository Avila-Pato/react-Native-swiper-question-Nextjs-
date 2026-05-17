import { CARD_WIDTH, SPACING, SWIPE_THRESHOLD, cardImages } from "@/constants/constants";
import gameData from "@/data/gameData";
import { ExitState, SwipeCardsProps } from "@/types/gameTypes";
import { CardItem } from "@/types/types";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ExitingCard } from "./ExitingCard";
import { SwipeableCard } from "./SwipeableCard";

const BUFFER_SIZE = 3;

export function SwipeCards({
  nodeText,
  nodeImage,
  opciones,
  onChoice,
}: SwipeCardsProps) {
  const poolIndex = useRef(BUFFER_SIZE);

  const [visibleCards, setVisibleCards] = useState<CardItem[]>(() =>
    cardImages.slice(0, BUFFER_SIZE),
  );
  const [exitState, setExitState] = useState<ExitState | null>(null);
  const behindProgress = useSharedValue(0);
  const dragX = useSharedValue(0);

  const leftModalStyle = useAnimatedStyle(() => {
    const p = interpolate(
      dragX.value,
      [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.25, 0],
      [1, 0, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity: p,
      transform: [
        { translateY: interpolate(p, [0, 1], [56, 0], Extrapolation.CLAMP) },
        { scale: interpolate(p, [0, 1], [0.82, 1], Extrapolation.CLAMP) },
        { rotate: `${interpolate(p, [0, 1], [-5, -1.5], Extrapolation.CLAMP)}deg` },
      ],
    };
  });

  const rightModalStyle = useAnimatedStyle(() => {
    const p = interpolate(
      dragX.value,
      [0, SWIPE_THRESHOLD * 0.25, SWIPE_THRESHOLD],
      [0, 0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: p,
      transform: [
        { translateY: interpolate(p, [0, 1], [56, 0], Extrapolation.CLAMP) },
        { scale: interpolate(p, [0, 1], [0.82, 1], Extrapolation.CLAMP) },
        { rotate: `${interpolate(p, [0, 1], [5, 1.5], Extrapolation.CLAMP)}deg` },
      ],
    };
  });

  useEffect(() => {
    opciones.forEach((op) => {
      const next = gameData[op.siguienteNodo];
      if (next?.image) Image.prefetch(next.image);
    });
  }, [opciones]);

  const onSwipeComplete = (
    card: CardItem,
    vx: number,
    tx: number,
    ty: number,
    choiceIndex: number,
  ) => {
    const nextCard = cardImages[poolIndex.current % cardImages.length];
    poolIndex.current += 1;

    setExitState({
      card,
      imageUri: nodeImage,
      vx,
      tx,
      ty,
      nodeText,
      opciones,
      chosenIndex: choiceIndex,
    });
    setVisibleCards((prev) => [...prev.slice(1), nextCard]);
    behindProgress.value = 0;

    onChoice(choiceIndex);
  };

  return (
    <View style={styles.cardsContainer}>
      {visibleCards
        .map((card, position) => (
          <SwipeableCard
            key={card.uri}
            card={card}
            imageUri={nodeImage}
            position={position}
            behindProgress={behindProgress}
            dragX={dragX}
            nodeText={nodeText}
            opciones={opciones}
            onSwipeComplete={onSwipeComplete}
          />
        ))
        .reverse()}

      {exitState && (
        <ExitingCard
          card={exitState.card}
          imageUri={exitState.imageUri}
          initX={exitState.tx}
          initY={exitState.ty}
          velocityX={exitState.vx}
          nodeText={exitState.nodeText}
          opciones={exitState.opciones}
          chosenIndex={exitState.chosenIndex}
          onDone={() => setExitState(null)}
        />
      )}

      {opciones.length === 2 && (
        <>
          <View style={styles.modalsOverlay} pointerEvents="none">
            <Animated.View style={[styles.choiceModal, styles.choiceLeft, leftModalStyle]}>
              <Text style={[styles.choiceBgArrow, styles.choiceBgArrowLeft]}>←</Text>
              <View style={styles.choiceHeader}>
                <Text style={styles.choiceArrow}>←</Text>
                <Text style={styles.choiceDirection}>IZQUIERDA</Text>
              </View>
              <View style={styles.choiceDivider} />
              <Text style={styles.choiceModalText} numberOfLines={4}>
                {opciones[0].texto}
              </Text>
            </Animated.View>
          </View>

          <View style={styles.modalsOverlay} pointerEvents="none">
            <Animated.View style={[styles.choiceModal, styles.choiceRight, rightModalStyle]}>
              <Text style={[styles.choiceBgArrow, styles.choiceBgArrowRight]}>→</Text>
              <View style={[styles.choiceHeader, styles.choiceHeaderRight]}>
                <Text style={styles.choiceDirection}>DERECHA</Text>
                <Text style={styles.choiceArrow}>→</Text>
              </View>
              <View style={styles.choiceDivider} />
              <Text style={styles.choiceModalText} numberOfLines={4}>
                {opciones[1].texto}
              </Text>
            </Animated.View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    flex: 1,
    alignItems: "center",
  },
  modalsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  choiceModal: {
    width: CARD_WIDTH - SPACING * 4,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 18,
  },
  choiceBgArrow: {
    position: "absolute",
    bottom: -8,
    fontSize: 96,
    color: "#fff",
    opacity: 0.07,
    fontWeight: "900",
    lineHeight: 96,
  },
  choiceBgArrowLeft: {
    left: -4,
  },
  choiceBgArrowRight: {
    right: -4,
  },
  choiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING,
    paddingHorizontal: SPACING * 1.8,
    paddingVertical: SPACING * 1.2,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  choiceHeaderRight: {
    justifyContent: "flex-end",
  },
  choiceArrow: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  choiceDirection: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2.5,
    opacity: 0.85,
  },
  choiceDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  choiceLeft: {
    backgroundColor: "#b82828",
    shadowColor: "#ff2222",
  },
  choiceRight: {
    backgroundColor: "#1a8f4a",
    shadowColor: "#22ff66",
  },
  choiceModalText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    paddingHorizontal: SPACING * 1.8,
    paddingVertical: SPACING * 1.5,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
