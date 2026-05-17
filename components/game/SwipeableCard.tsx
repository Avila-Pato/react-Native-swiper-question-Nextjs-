import { SCREEN_WIDTH, SWIPE_THRESHOLD } from "@/constants/constants";
import { SwipeableCardProps } from "@/types/gameTypes";
import { Image } from "expo-image";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Text } from "react-native";
import { cardStyles as styles } from "./cardStyles";

export function SwipeableCard({
  card,
  imageUri,
  position,
  behindProgress,
  dragX,
  nodeText,
  opciones,
  onSwipeComplete,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const leftPanelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [0.75, 1.15],
      Extrapolation.CLAMP,
    ),
  }));

  const rightPanelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [1.15, 0.75],
      Extrapolation.CLAMP,
    ),
  }));

  const gesture = Gesture.Pan()
    .enabled(position === 0)
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      dragX.value = e.translationX;
      behindProgress.value = Math.min(
        Math.abs(e.translationX) / SWIPE_THRESHOLD,
        1,
      );
    })
    .onEnd((e) => {
      const shouldSwipe =
        Math.abs(translateX.value) > SWIPE_THRESHOLD ||
        Math.abs(e.velocityX) > 800;

      if (shouldSwipe) {
        dragX.value = 0;
        const choiceIndex = translateX.value < 0 ? 0 : 1;
        runOnJS(onSwipeComplete)(
          card,
          e.velocityX,
          translateX.value,
          translateY.value,
          choiceIndex,
        );
      } else {
        translateX.value = withSpring(0, { damping: 20 });
        translateY.value = withSpring(0, { damping: 20 });
        dragX.value = withSpring(0, { damping: 20 });
        behindProgress.value = withSpring(0, { damping: 20 });
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    if (position === 0) {
      return {
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
      };
    }
    if (position === 1) {
      return {
        transform: [
          { scale: interpolate(behindProgress.value, [0, 1], [0.93, 1]) },
          { translateY: interpolate(behindProgress.value, [0, 1], [-12, 0]) },
        ],
      };
    }
    return {
      transform: [
        { scale: interpolate(behindProgress.value, [0, 1], [0.86, 0.93]) },
        { translateY: interpolate(behindProgress.value, [0, 1], [-24, -12]) },
      ],
    };
  });

  const isFront = position === 0;
  const hasTwoOptions = isFront && opciones.length === 2;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Image
          source={{ uri: imageUri }}
          style={styles.cardImage}
          contentFit="cover"
          recyclingKey={imageUri}
          transition={200}
          priority={position <= 1 ? "high" : "normal"}
          cachePolicy="memory-disk"
        />
        <View style={styles.cardOverlay} />

        {isFront && (
          <>
            <View
              style={[
                styles.questionArea,
                hasTwoOptions && styles.questionAreaSplit,
              ]}
            >
              <Text style={styles.questionText} numberOfLines={6}>
                {nodeText}
              </Text>
            </View>

            {hasTwoOptions && (
              <>
                <View style={styles.optionSeparator} />
                <View style={styles.optionsRow}>
                  <Animated.View style={[styles.leftPanel, leftPanelStyle]}>
                    <Text style={styles.arrowText}>←</Text>
                    <Text style={styles.panelText} numberOfLines={4}>
                      {opciones[0].texto}
                    </Text>
                  </Animated.View>

                  <View style={styles.panelDivider} />

                  <Animated.View style={[styles.rightPanel, rightPanelStyle]}>
                    <Text style={styles.panelText} numberOfLines={4}>
                      {opciones[1].texto}
                    </Text>
                    <Text style={styles.arrowText}>→</Text>
                  </Animated.View>
                </View>
              </>
            )}
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
