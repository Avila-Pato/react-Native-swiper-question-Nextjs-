import { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export function usePulse() {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 750, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
  }, []);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

type BoxProps = {
  width?: number | string;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  pulse: ReturnType<typeof usePulse>;
};

export function SkeletonBox({ width = "100%", height, borderRadius = 8, style, pulse }: BoxProps) {
  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: "#E2D9CF" },
        pulse,
        style,
      ]}
    />
  );
}
