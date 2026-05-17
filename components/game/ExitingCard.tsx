import { SCREEN_WIDTH } from "@/constants/constants";
import { ExitingCardProps } from "@/types/gameTypes";
import { Image } from "expo-image";
import { useLayoutEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";
import { cardStyles as styles } from "./cardStyles";

export function ExitingCard({
  imageUri,
  initX,
  initY,
  velocityX,
  nodeText,
  opciones,
  chosenIndex,
  onDone,
}: ExitingCardProps) {
  const translateX = useSharedValue(initX);
  const translateY = useSharedValue(initY);

  useLayoutEffect(() => {
    const dir = Math.sign(velocityX || initX);
    translateX.value = withDecay(
      {
        velocity: dir * Math.max(Math.abs(velocityX), 1200),
        clamp: [-SCREEN_WIDTH * 2, SCREEN_WIDTH * 2],
      },
      () => runOnJS(onDone)(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        rotate: `${interpolate(
          translateX.value,
          [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          [-15, 0, 15],
        )}deg`,
      },
    ],
  }));

  const hasTwoOptions = opciones.length === 2;

  return (
    <Animated.View style={[styles.card, styles.exitCard, cardStyle]}>
      <Image
        source={{ uri: imageUri }}
        style={styles.cardImage}
        contentFit="cover"
        recyclingKey={imageUri}
        transition={0}
        priority="high"
        cachePolicy="memory-disk"
      />
      <View style={styles.cardOverlay} />

      <View
        style={[styles.questionArea, hasTwoOptions && styles.questionAreaSplit]}
      >
        <Text style={styles.questionText} numberOfLines={6}>
          {nodeText}
        </Text>
      </View>

      {hasTwoOptions && (
        <>
          <View style={styles.optionSeparator} />
          <View style={styles.optionsRow}>
            <View
              style={[
                styles.leftPanel,
                { opacity: chosenIndex === 0 ? 1 : 0.2 },
              ]}
            >
              <Text style={styles.arrowText}>←</Text>
              <Text style={styles.panelText} numberOfLines={4}>
                {opciones[0].texto}
              </Text>
            </View>
            <View style={styles.panelDivider} />
            <View
              style={[
                styles.rightPanel,
                { opacity: chosenIndex === 1 ? 1 : 0.2 },
              ]}
            >
              <Text style={styles.panelText} numberOfLines={4}>
                {opciones[1].texto}
              </Text>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </View>
        </>
      )}
    </Animated.View>
  );
}
