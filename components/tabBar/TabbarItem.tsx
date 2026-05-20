import { TAB_ITEM_SIZE } from "@/constants/constants";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  tabBarIcon: React.ReactNode;
  label: string;
  onPress: () => void;
  isFocused: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TabbarItem = ({ tabBarIcon, label, onPress, isFocused }: Props) => {
  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.1 : 1, { stiffness: 400, damping: 40 });
    bgOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  return (
    <AnimatedPressable onPress={onPress} style={styles.container}>
      <Animated.View style={[styles.pill, bgStyle]} />
      <Animated.View style={[styles.iconWrap, iconStyle]}>
        {tabBarIcon}
      </Animated.View>
      <Text style={[styles.label, isFocused && styles.labelActive]}>
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
  pill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    marginHorizontal: -8,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 0.3,
  },
  labelActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
