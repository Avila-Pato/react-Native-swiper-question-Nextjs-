import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

const ACCENT = "#8980B8";
const BG = "#FAF8F5";
const TEXT_CLR = "#1C1B29";

const AREAS = [
  { icon: "heart-outline" as const, label: "Emociones" },
  { icon: "people-outline" as const, label: "Relaciones" },
  { icon: "leaf-outline" as const, label: "Límites" },
  { icon: "star-outline" as const, label: "Autoestima" },
];

export default function LandingScreen() {
  const [showSplash, setShowSplash] = useState(true);

  // Splash animado
  const logoScale = useSharedValue(0.5);
  const logoOp = useSharedValue(0);
  const nameOp = useSharedValue(0);
  const nameY = useSharedValue(16);
  const overlayOp = useSharedValue(1);

  // Landing (se inician con delay para que el splash ya esté saliendo)
  const imageScale = useSharedValue(1.06);
  const badgeX = useSharedValue(-60);
  const badgeOpacity = useSharedValue(0);
  const titleY = useSharedValue(40);
  const titleOpacity = useSharedValue(0);
  const descOpacity = useSharedValue(0);
  const areasOpacity = useSharedValue(0);
  const areasY = useSharedValue(20);

  useEffect(() => {
    // — Splash entra —
    logoOp.value = withTiming(1, { duration: 500 });
    logoScale.value = withSpring(1, { damping: 13, stiffness: 70 });
    nameOp.value = withDelay(550, withTiming(1, { duration: 450 }));
    nameY.value = withDelay(550, withSpring(0, { damping: 16, stiffness: 90 }));

    // — Splash sale y desaparece —
    overlayOp.value = withDelay(
      2000,
      withTiming(0, { duration: 600 }, () => {
        runOnJS(setShowSplash)(false);
      }),
    );
    imageScale.value = withTiming(1, {
      duration: 2200,
      easing: Easing.out(Easing.cubic),
    });
    badgeOpacity.value = withDelay(350, withTiming(1, { duration: 400 }));
    badgeX.value = withDelay(
      350,
      withSpring(0, { damping: 18, stiffness: 120 }),
    );
    titleOpacity.value = withDelay(550, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(
      550,
      withSpring(0, { damping: 16, stiffness: 90 }),
    );
    descOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    areasOpacity.value = withDelay(950, withTiming(1, { duration: 500 }));
    areasY.value = withDelay(
      950,
      withSpring(0, { damping: 18, stiffness: 110 }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ translateX: badgeX.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const descStyle = useAnimatedStyle(() => ({ opacity: descOpacity.value }));
  const areasStyle = useAnimatedStyle(() => ({
    opacity: areasOpacity.value,
    transform: [{ translateY: areasY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Fondo completo */}
      <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
        <Image
          source={require("@/assets/fondo.jpeg")}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          contentPosition="top"
          priority="high"
          cachePolicy="memory-disk"
        />
      </Animated.View>

      {/* Vignette superior */}
      <LinearGradient
        colors={["rgba(8,5,25,0.75)", "transparent"]}
        locations={[0, 1]}
        style={styles.topVignette}
      />

      {/* Overlay oscuro sobre el cabello para legibilidad */}
      <LinearGradient
        colors={["rgba(12,8,30,0.52)", "rgba(12,8,30,0.18)", "transparent"]}
        locations={[0, 0.55, 1]}
        style={styles.hairOverlay}
      />

      {/* Gradiente crema desde abajo (área de la persona) */}
      <LinearGradient
        colors={["transparent", BG + "DD", BG]}
        locations={[0, 0.55, 1]}
        style={styles.bottomGradient}
      />

      {/* Texto encima del cabello oscuro */}
      <View style={styles.topContent}>
        <Animated.View style={[styles.badge, badgeStyle]}>
          <Text style={styles.badgeText}>✦</Text>
        </Animated.View>

        <Animated.Text style={[styles.title, titleStyle]}>
          Tu camino al{"\n"}
          <Text style={{ color: "#C9C3E8" }}>bienestar</Text>
        </Animated.Text>

        <Animated.Text style={[styles.description, descStyle]}>
          Explora tus emociones, relaciones y límites.{"\n"}
          Retos semanales que transforman tu vida desde adentro.
        </Animated.Text>
      </View>

      {/* Chips y botón abajo */}
      <View style={styles.bottomContent}>
        <Animated.View style={[styles.areasRow, areasStyle]}>
          {AREAS.map(({ icon, label }) => (
            <View key={label} style={styles.areaChip}>
              <Ionicons name={icon} size={18} color={ACCENT} />
              <Text style={styles.areaLabel}>{label}</Text>
            </View>
          ))}
        </Animated.View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/intro")}
          activeOpacity={0.82}
        >
          <Text style={styles.buttonText}>Comenzar →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  topVignette: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.22,
  },
  hairOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.44,
  },

  topContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 68,
    paddingHorizontal: 18,
    alignItems: "center",
  },

  badge: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  title: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 50,
    letterSpacing: -1,
    marginBottom: 14,
    textAlign: "center",
  },

  description: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    textAlign: "center",
  },

  bottomContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingBottom: 52,
  },

  areasRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  areaChip: {
    flex: 1,
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 14,
    paddingVertical: 10,
    marginHorizontal: 3,
  },
  areaLabel: {
    color: TEXT_CLR,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },

  button: {
    backgroundColor: ACCENT,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
