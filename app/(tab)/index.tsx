import { BG_COLOR, SPACING, TAB_ITEM_SIZE, cardImages } from "@/constants/constants";
import { Image } from "expo-image";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 4 * SPACING;
const CARD_HEIGHT = CARD_WIDTH * 1.4;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

function SwipeCards() {
  const [index, setIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const advanceCard = () => {
    setIndex((prev) => (prev + 1) % cardImages.length);
    translateX.value = 0;
    translateY.value = 0;
  };

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const dir = translateX.value > 0 ? 1 : -1;
        translateX.value = withSpring(dir * SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(advanceCard)();
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const topCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        rotate: `${interpolate(
          translateX.value,
          [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          [-15, 0, 15]
        )}deg`,
      },
    ],
  }));

  const middleCardStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1);
    return {
      transform: [
        { scale: interpolate(progress, [0, 1], [0.93, 1]) },
        { translateY: interpolate(progress, [0, 1], [-12, 0]) },
      ],
    };
  });

  const bottomCardStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1);
    return {
      transform: [
        { scale: interpolate(progress, [0, 1], [0.86, 0.93]) },
        { translateY: interpolate(progress, [0, 1], [-24, -12]) },
      ],
    };
  });

  const getCard = (offset: number) => cardImages[(index + offset) % cardImages.length];

  return (
    <View style={styles.cardsContainer}>
      <Animated.View style={[styles.card, bottomCardStyle]}>
        <Image source={{ uri: getCard(2).uri }} style={styles.cardImage} contentFit="cover" />
        <View style={styles.cardBid}>
          <Text style={styles.bidText}>Bid {getCard(2).bid} ETH</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.card, middleCardStyle]}>
        <Image source={{ uri: getCard(1).uri }} style={styles.cardImage} contentFit="cover" />
        <View style={styles.cardBid}>
          <Text style={styles.bidText}>Bid {getCard(1).bid} ETH</Text>
        </View>
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, topCardStyle]}>
          <Image source={{ uri: getCard(0).uri }} style={styles.cardImage} contentFit="cover" />
          <View style={styles.cardBid}>
            <Text style={styles.bidText}>Bid {getCard(0).bid} ETH</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default function TabOneScreen() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <SwipeCards />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  cardsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: TAB_ITEM_SIZE + SPACING * 3,
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardBid: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  bidText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
});
