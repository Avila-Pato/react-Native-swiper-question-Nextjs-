import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOTAL = 4;

function Segment({ index, step }: { index: number; step: number }) {
  const isBefore = step > index + 1;
  const isCurrent = step === index + 1;
  const fill = useSharedValue(isBefore ? 1 : 0);

  useEffect(() => {
    if (isBefore) {
      fill.value = 1;
    } else if (isCurrent) {
      fill.value = withTiming(1, { duration: 550 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fill.value * 100}%`,
  }));

  return (
    <View style={styles.seg}>
      <Animated.View style={[styles.segFill, fillStyle]} />
    </View>
  );
}

export function OnboardingProgress({ step }: { step: number }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 14 }]}>
      <View style={styles.bar}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <Segment key={i} index={i} step={step} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 6,
  },
  bar: {
    flexDirection: "row",
    gap: 6,
  },
  seg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(137,128,184,0.15)",
    overflow: "hidden",
  },
  segFill: {
    height: "100%",
    backgroundColor: "#8980B8",
    borderRadius: 2,
  },
});
