import { TAB_ITEM_SIZE } from "@/constants/constants";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const ACCENT = "#34D59A";
const ACTIVE_COLOR = "#111827";
const INACTIVE_COLOR = "#9CA3AF";

type Props = {
  tabBarIcon: React.ReactNode;
  label: string;
  onPress: () => void;
  isFocused: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TabbarItem = ({ tabBarIcon, label, onPress, isFocused }: Props) => {
  const scale = useSharedValue(1);
  const dotWidth = useSharedValue(isFocused ? 16 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.08 : 1, { stiffness: 300, damping: 25 });
    dotWidth.value = withTiming(isFocused ? 16 : 0, { duration: 200 });
  }, [isFocused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    width: dotWidth.value,
    opacity: dotWidth.value > 0 ? 1 : 0,
  }));

  return (
    <AnimatedPressable onPress={onPress} style={styles.container} hitSlop={6}>
      {/* Active indicator dot at top */}
      <Animated.View style={[styles.dot, dotStyle]} />

      <Animated.View style={[styles.iconWrap, iconStyle]}>
        {tabBarIcon}
      </Animated.View>

      <Text
        style={[
          styles.label,
          { color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR, fontWeight: isFocused ? "700" : "500" },
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
};

export default TabbarItem;

const styles = StyleSheet.create({
  container: {
    width: TAB_ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
  },
  dot: {
    height: 3,
    borderRadius: 2,
    backgroundColor: ACCENT,
    position: "absolute",
    top: 0,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
