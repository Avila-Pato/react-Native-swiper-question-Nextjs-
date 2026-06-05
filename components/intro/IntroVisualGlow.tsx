import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Animated, StyleSheet, Text, View } from "react-native";

const PILLS = ["Bienestar", "Crecimiento", "Reflexión"];

type Props = {
  pulseAnim: Animated.Value;
  bounceAnim: Animated.Value;
  star1Anim: Animated.Value;
  star2Anim: Animated.Value;
  star3Anim: Animated.Value;
};

export function IntroVisualGlow({
  pulseAnim,
  bounceAnim,
  star1Anim,
  star2Anim,
  star3Anim,
}: Props) {
  return (
    <>
      <View style={[s.pillsRow, { marginTop: 16 }]}>
        {PILLS.map((tag) => (
          <View key={tag} style={s.pill}>
            <Text style={s.pillText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={s.ringContainer}>
        <Animated.View
          style={[s.glowOuter, { transform: [{ scale: pulseAnim }] }]}
        />
        <View style={s.glowMid} />
        <Animated.View
          style={[s.logoWrap, { transform: [{ scale: bounceAnim }] }]}
        >
          <Image
            source={require("@/assets/logo.png")}
            style={s.glowLogo}
            contentFit="contain"
          />
          <Animated.View style={[s.star, s.star1, { transform: [{ scale: star1Anim }] }]}>
            <Ionicons name="star" size={18} color="#8980B8" />
          </Animated.View>
          <Animated.View style={[s.star, s.star2, { transform: [{ scale: star2Anim }] }]}>
            <Ionicons name="star" size={12} color="#C9C3E8" />
          </Animated.View>
          <Animated.View style={[s.star, s.star3, { transform: [{ scale: star3Anim }] }]}>
            <Ionicons name="star" size={22} color="#5B3FA6" />
          </Animated.View>
        </Animated.View>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  pillsRow: { flexDirection: "row", gap: 8 },
  pill: {
    backgroundColor: "rgba(137,128,184,0.12)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.2)",
  },
  pillText: { fontSize: 12, color: "#8980B8", fontWeight: "600" },
  ringContainer: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  glowOuter: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(137,128,184,0.08)",
  },
  glowMid: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(137,128,184,0.12)",
  },
  logoWrap: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  glowLogo: { width: 130, height: 130 },
  star: { position: "absolute" },
  star1: { top: -8, right: -4 },
  star2: { top: 20, left: -16 },
  star3: { bottom: 0, right: -12 },
});
