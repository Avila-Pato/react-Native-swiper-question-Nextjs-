import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Modal, StyleSheet, Text, View } from "react-native";
import { GRADIENT_COLORS } from "@/components/home/reflection/constants";

const { width: W } = Dimensions.get("window");

const DOTS = [0, 1, 2];

function PulseDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.25, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[s.dot, { opacity }]} />;
}

interface Props { visible: boolean }

export function AnalyzingCard({ visible }: Props) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity   = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1, duration: 350,
          easing: Easing.out(Easing.quad), useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1, duration: 400,
          easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0, duration: 420,
          easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
      ]).start();
    } else {
      overlayOpacity.setValue(0);
      cardOpacity.setValue(0);
      cardTranslateY.setValue(28);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, { opacity: overlayOpacity }]}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

        <Animated.View style={[s.card, { opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] }]}>
          <LinearGradient
            colors={GRADIENT_COLORS}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={s.decorCircle} />

          <Text style={s.label}>{"PROCESANDO"}</Text>
          <Text style={s.title}>{"Leyendo\ntu estado..."}</Text>
          <Text style={s.sub}>{"Detectando el humor en tu voz"}</Text>

          <View style={s.dotsRow}>
            {DOTS.map((i) => <PulseDot key={i} delay={i * 220} />)}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: W - 64,
    borderRadius: 32,
    padding: 32,
    overflow: "hidden",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  decorCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(200,176,220,0.18)",
    top: -60,
    right: -40,
  },
  label: {
    fontSize: 9,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2.5,
    color: "#A895C8",
  },
  title: {
    fontSize: 28,
    fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60",
    textAlign: "center",
    lineHeight: 36,
  },
  sub: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "rgba(45,31,96,0.55)",
    textAlign: "center",
    fontStyle: "italic",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7B6BB5",
  },
});
