import { GREEN } from "@/constants/constants";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

const PERFILES = [
  { icon: "shield-outline" as const, label: "Seguridad" },
  { icon: "cloud-outline" as const, label: "DevOps" },
  { icon: "bar-chart-outline" as const, label: "Datos & IA" },
  { icon: "code-slash-outline" as const, label: "Desarrollo" },
];

export default function IntroScreen() {
  const imageScale = useSharedValue(1.08);

  const badgeX = useSharedValue(-60);
  const badgeOpacity = useSharedValue(0);

  const titleY = useSharedValue(48);
  const titleOpacity = useSharedValue(0);

  const descOpacity = useSharedValue(0);

  const perfilesOpacity = useSharedValue(0);
  const perfilesY = useSharedValue(20);

  const buttonScale = useSharedValue(0.78);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    imageScale.value = withTiming(1, {
      duration: 2000,
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

    perfilesOpacity.value = withDelay(950, withTiming(1, { duration: 500 }));
    perfilesY.value = withDelay(
      950,
      withSpring(0, { damping: 18, stiffness: 110 }),
    );

    buttonOpacity.value = withDelay(1050, withTiming(1, { duration: 300 }));
    buttonScale.value = withDelay(
      1050,
      withSpring(1, { damping: 11, stiffness: 160 }),
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

  const descStyle = useAnimatedStyle(() => ({
    opacity: descOpacity.value,
  }));

  const perfilesStyle = useAnimatedStyle(() => ({
    opacity: perfilesOpacity.value,
    transform: [{ translateY: perfilesY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Hero image con zoom sutil */}
      <Animated.View style={[styles.imageContainer, imageStyle]}>
        <Image
          source={require("@/assets/Mask group.png")}
          style={styles.heroImage}
          contentFit="contain"
          contentPosition="top"
          priority="high"
          cachePolicy="memory-disk"
        />
      </Animated.View>

      {/* Vignette superior suave */}
      <LinearGradient
        colors={["rgba(5,5,20,0.55)", "transparent"]}
        style={styles.topVignette}
      />

      {/* Gradiente principal: corta la imagen y transiciona al fondo */}
      <LinearGradient
        colors={["transparent", "rgba(26,26,46,0.75)", "#111120", "#111120"]}
        locations={[0, 0.3, 0.58, 1]}
        style={styles.gradient}
      />

      {/* Contenido animado */}
      <View style={styles.content}>
        {/* <Animated.View style={[styles.badge, badgeStyle]}>
          <Text style={styles.badgeText}>⚡ RPG QUIZ</Text>
        </Animated.View> */}

        <Animated.Text style={[styles.title, titleStyle]}>
          Descubre tu perfil{" "}
          <Text style={{ color: "#34D59A" }}>tecnológico</Text>
        </Animated.Text>

        <Animated.Text style={[styles.description, descStyle]}>
          Desliza para elegir. Descubre en qué área de la tecnología está tu
          verdadero camino.
        </Animated.Text>

        <Animated.View style={[styles.perfilesRow, perfilesStyle]}>
          {PERFILES.map(({ icon, label }) => (
            <View key={label} style={styles.perfilChip}>
              <Ionicons name={icon} size={22} color={GREEN} />
              <Text style={styles.perfilLabel}>{label}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.buttonWrapper, buttonStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/(tab)")}
            activeOpacity={0.82}
          >
            <Text style={styles.buttonText}>Comenzar →</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111120",
  },
  imageContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    height: height,
  },
  heroImage: {
    width: "110%",
    height: "100%",
  },
  topVignette: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.22,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.75,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingBottom: 52,
  },
  // badge: {
  //   alignSelf: "flex-start",
  //   backgroundColor: GREEN,
  //   borderRadius: 20,
  //   paddingVertical: 5,
  //   paddingHorizontal: 14,
  //   marginBottom: 20,
  // },
  // badgeText: {
  //   color: "#1a1a2e",
  //   fontSize: 11,
  //   fontWeight: "800",
  //   letterSpacing: 1.5,
  //   textTransform: "uppercase",
  // },
  title: {
    color: "white",
    fontSize: 42,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 50,
    letterSpacing: -0.5,
    marginBottom: 16,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  description: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "400",
    marginBottom: 24,
  },
  perfilesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  perfilChip: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  perfilLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  buttonWrapper: {
    borderRadius: 18,
    overflow: "hidden",
  },
  button: {
    backgroundColor: GREEN,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#1a1a2e",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
