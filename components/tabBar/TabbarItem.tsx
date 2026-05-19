import { TAB_ITEM_SIZE } from "@/constants/constants";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  tabBarIcon: React.ReactNode;
  onPress: () => void;
  isFocused: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TabbarItem = ({ tabBarIcon, onPress, isFocused }: Props) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isFocused ? 1 : 0.5);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 1, { stiffness: 500, damping: 50 });
    opacity.value = withSpring(isFocused ? 1 : 0.5);
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable onPress={onPress} style={[styles.container, animatedStyle]}>
      <View style={styles.iconWrapper}>{tabBarIcon}</View>
      {isFocused ? (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={styles.dot}
        />
      ) : (
        <View style={styles.dotPlaceholder} />
      )}
    </AnimatedPressable>
  );
};

export default TabbarItem;

const styles = StyleSheet.create({
  container: {
    width: TAB_ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 6,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#34D59A",
  },
  dotPlaceholder: {
    width: 4,
    height: 4,
  },
});
