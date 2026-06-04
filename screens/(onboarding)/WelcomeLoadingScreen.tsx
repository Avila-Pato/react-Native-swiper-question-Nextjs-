import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// ── Animated loading dot ─────────────────────────────────────

function Dot({ delay }: { delay: number }) {
  const scale = useSharedValue(1);
  const op = useSharedValue(0.25);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.5, { duration: 380 }),
          withTiming(1, { duration: 380 }),
        ),
        -1,
        false,
      ),
    );
    op.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 380 }),
          withTiming(0.25, { duration: 380 }),
        ),
        -1,
        false,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: op.value,
  }));

  return <Animated.View style={[s.dot, style]} />;
}

// ── Screen ───────────────────────────────────────────────────

export default function WelcomeLoadingScreen() {
  const screenOp = useSharedValue(1);
  const logoOp = useSharedValue(0);
  const logoScale = useSharedValue(0.7);
  const glowOp = useSharedValue(0);
  const glowScale = useSharedValue(0.5);
  const nameOp = useSharedValue(0);
  const nameY = useSharedValue(14);
  const subOp = useSharedValue(0);
  const subY = useSharedValue(10);
  const dotsOp = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoOp.value = withTiming(1, { duration: 700 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 70 });

    // Glow behind logo
    glowOp.value = withDelay(200, withTiming(1, { duration: 800 }));
    glowScale.value = withDelay(
      200,
      withSpring(1, { damping: 10, stiffness: 60 }),
    );

    // "Lumina" name
    nameOp.value = withDelay(500, withTiming(1, { duration: 500 }));
    nameY.value = withDelay(
      500,
      withSpring(0, { damping: 16, stiffness: 100 }),
    );

    // Subtitle
    subOp.value = withDelay(850, withTiming(1, { duration: 500 }));
    subY.value = withDelay(850, withSpring(0, { damping: 16, stiffness: 100 }));

    // Dots
    dotsOp.value = withDelay(1100, withTiming(1, { duration: 400 }));

    // Fade out and navigate
    screenOp.value = withDelay(2800, withTiming(0, { duration: 500 }));
    const timer = setTimeout(() => {
      router.replace("/(tab)" as any);
    }, 3300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOp.value }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOp.value,
    transform: [{ scale: glowScale.value }],
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOp.value,
    transform: [{ scale: logoScale.value }],
  }));

  const subStyle = useAnimatedStyle(() => ({
    opacity: subOp.value,
    transform: [{ translateY: subY.value }],
  }));
  const dotsStyle = useAnimatedStyle(() => ({ opacity: dotsOp.value }));

  return (
    <Animated.View style={[s.root, screenStyle]}>
      {/* Glow rings */}
      <Animated.View style={[s.glow3, glowStyle]} />
      <Animated.View style={[s.glow2, glowStyle]} />
      <Animated.View style={[s.glow1, glowStyle]} />

      {/* Logo */}
      <Animated.Image
        source={require("@/assets/logo.png")}
        style={[s.logo, logoStyle]}
        resizeMode="contain"
      />

      {/* Name */}

      {/* Subtitle */}
      <Animated.View style={[s.subWrap, subStyle]}>
        <Text style={s.sub}>Cargando tu experiencia</Text>
      </Animated.View>

      {/* Dots */}
      <Animated.View style={[s.dots, dotsStyle]}>
        <Dot delay={0} />
        <Dot delay={160} />
        <Dot delay={320} />
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },

  // Concentric glow rings
  glow1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(137,128,184,0.10)",
  },
  glow2: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(137,128,184,0.06)",
  },
  glow3: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(137,128,184,0.03)",
  },

  logo: {
    width: 80,
    height: 80,
    shadowColor: "#8980B8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
  },
  name: {
    marginTop: 18,
    fontSize: 34,
    fontWeight: "800",
    color: "#1C1B29",
    letterSpacing: -1.2,
  },
  subWrap: {
    marginTop: 10,
    alignItems: "center",
  },
  sub: {
    fontSize: 13,
    color: "rgba(28,27,41,0.4)",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  dots: {
    marginTop: 32,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#8980B8",
  },
});
