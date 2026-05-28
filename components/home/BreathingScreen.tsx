import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

const PHASE_DURATION = 4000;

const PHASES = [
  { label: "Inhala profundamente", sub: "Llena tus pulmones con calma" },
  { label: "Sostén el aire",       sub: "Quédate en este instante" },
  { label: "Exhala despacio",      sub: "Suelta lo que no necesitas" },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 47 + 23) % (W - 10),
  size: (i % 4) + 2.5,
  duration: 9000 + ((i * 800) % 6000),
  delay: (i * 600) % 5000,
}));

function FloatingParticle({ x, size, duration, delay }: {
  x: number; size: number; duration: number; delay: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -(H + 60)] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.08, 0.72, 1], outputRange: [0, 0.85, 0.5, 0] });
  const scale      = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.4, 1, 0.3] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: x,
        bottom: (size * 20) % (H / 2),
        width: size, height: size,
        borderRadius: size / 2,
        backgroundColor: "rgba(255,255,255,0.9)",
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: size * 2.5,
        transform: [{ translateY }, { scale }],
        opacity,
      }}
    />
  );
}

const ORB   = 196;
const RING1 = ORB + 52;
const RING2 = ORB + 108;

interface Props {
  visible: boolean;
  onClose: () => void;
}

const STEPS = [
  { icon: "🌬️", phase: "Inhala", time: "4 seg", desc: "Llena los pulmones lentamente" },
  { icon: "🤍", phase: "Sostén", time: "4 seg", desc: "Quédate quieto en el aire" },
  { icon: "🍃", phase: "Exhala", time: "4 seg", desc: "Suelta todo lo que no necesitas" },
];

export default function BreathingScreen({ visible, onClose }: Props) {
  const [showIntro, setShowIntro] = useState(true);
  const [phase, setPhase]         = useState(0);
  const [countdown, setCountdown] = useState(4);

  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const introOpacity = useRef(new Animated.Value(1)).current;
  const exerciseOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim   = useRef(new Animated.Value(0.85)).current;
  const ring1Anim   = useRef(new Animated.Value(0.85)).current;
  const ring2Anim   = useRef(new Animated.Value(0.85)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const prevPhase   = useRef(0);

  const handleStart = () => {
    Animated.sequence([
      Animated.timing(introOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
      Animated.timing(exerciseOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
    ]).start(() => setShowIntro(false));
  };

  // Entry fade
  useEffect(() => {
    if (visible) {
      setShowIntro(true);
      introOpacity.setValue(1);
      exerciseOpacity.setValue(0);
      setPhase(0);
      setCountdown(4);
      prevPhase.current = 0;
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.85);
      ring1Anim.setValue(0.85);
      ring2Anim.setValue(0.85);
    }
  }, [visible]);

  // Breathing loop + phase tracker — solo arranca tras salir de la intro
  useEffect(() => {
    if (!visible || showIntro) return;

    const easeBreath = Easing.inOut(Easing.sin);

    const makeBreathLoop = (anim: Animated.Value, maxScale: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: maxScale, duration: PHASE_DURATION, easing: easeBreath, useNativeDriver: true }),
          Animated.delay(PHASE_DURATION),
          Animated.timing(anim, { toValue: 0.85, duration: PHASE_DURATION, easing: easeBreath, useNativeDriver: true }),
        ])
      );

    const orbLoop   = makeBreathLoop(scaleAnim, 1.15);
    const ring1Loop = makeBreathLoop(ring1Anim, 1.28);
    const ring2Loop = makeBreathLoop(ring2Anim, 1.42);

    orbLoop.start();
    ring1Loop.start();
    ring2Loop.start();

    // Phase + countdown tracker (fires every second)
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed++;
      const pos      = elapsed % 12;
      let newPhase   = 0;
      let newCount   = 4;

      if (pos < 4)       { newPhase = 0; newCount = 4 - pos; }
      else if (pos < 8)  { newPhase = 1; newCount = 8 - pos; }
      else               { newPhase = 2; newCount = 12 - pos; }

      setCountdown(newCount);

      if (newPhase !== prevPhase.current) {
        prevPhase.current = newPhase;
        setPhase(newPhase);
        Animated.sequence([
          Animated.timing(textOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
          Animated.timing(textOpacity, { toValue: 1, duration: 340, useNativeDriver: true }),
        ]).start();
      }
    }, 1000);

    return () => {
      orbLoop.stop();
      ring1Loop.stop();
      ring2Loop.stop();
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, showIntro]);

  const ring1Opacity = ring1Anim.interpolate({ inputRange: [0.85, 1.28], outputRange: [0.14, 0.32] });
  const ring2Opacity = ring2Anim.interpolate({ inputRange: [0.85, 1.42], outputRange: [0.06, 0.16] });

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, { opacity: fadeAnim }]}>

        <LinearGradient
          colors={["#F4EBE0", "#FDF5EE", "#EDE8F5", "#F7EFF5"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />
        <View style={s.blob3} pointerEvents="none" />

        {PARTICLES.map((p, i) => <FloatingParticle key={i} {...p} />)}

        <Pressable style={s.closeBtn} onPress={onClose} hitSlop={12}>
          <X size={19} color="#8B7BAB" strokeWidth={2} />
        </Pressable>

        {/* ── Intro ── */}
        <Animated.View style={[s.content, { opacity: introOpacity }]} pointerEvents={showIntro ? "auto" : "none"}>
          <View style={s.introHeader}>
            <Text style={s.introTag}>{"RESPIRACIÓN GUIADA"}</Text>
            <Text style={s.introTitle}>{"Calma tu\nmente ahora"}</Text>
            <Text style={s.introDesc}>
              {"Sigue el ritmo del orbe. Tres fases de 4 segundos cada una para recuperar tu centro."}
            </Text>
          </View>

          <View style={s.stepsRow}>
            {STEPS.map((step, i) => (
              <View key={i} style={s.stepCard}>
                <Text style={s.stepIcon}>{step.icon}</Text>
                <Text style={s.stepPhase}>{step.phase}</Text>
                <Text style={s.stepTime}>{step.time}</Text>
              </View>
            ))}
          </View>

          <Pressable style={s.startBtn} onPress={handleStart}>
            <Text style={s.startTxt}>{"Comenzar"}</Text>
          </Pressable>
        </Animated.View>

        {/* ── Ejercicio ── */}
        <Animated.View style={[s.content, StyleSheet.absoluteFill, s.center, { opacity: exerciseOpacity }]} pointerEvents={showIntro ? "none" : "auto"}>
          <Animated.View style={[s.textBlock, { opacity: textOpacity }]}>
            <Text style={s.phaseLabel}>{PHASES[phase].label}</Text>
            <Text style={s.phaseSub}>{PHASES[phase].sub}</Text>
          </Animated.View>

          <View style={s.orbArea}>
            <Animated.View style={[s.ring2, { transform: [{ scale: ring2Anim }], opacity: ring2Opacity }]} />
            <Animated.View style={[s.ring1, { transform: [{ scale: ring1Anim }], opacity: ring1Opacity }]} />
            <Animated.View style={[s.orbWrapper, { transform: [{ scale: scaleAnim }] }]}>
              <BlurView intensity={30} tint="light" style={s.orb}>
                <Text style={s.countdownNum}>{countdown}</Text>
                <Text style={s.countdownLabel}>{"seg"}</Text>
              </BlurView>
            </Animated.View>
          </View>

          <Text style={s.cycleLabel}>{"CICLO  4 · 4 · 4"}</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1 },

  blob1: {
    position: "absolute", width: 300, height: 300, borderRadius: 150,
    backgroundColor: "rgba(210,195,240,0.38)", top: -80, left: -80,
  },
  blob2: {
    position: "absolute", width: 240, height: 240, borderRadius: 120,
    backgroundColor: "rgba(255,205,185,0.30)", bottom: 60, right: -70,
  },
  blob3: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(190,215,255,0.25)", bottom: 220, left: 10,
  },

  closeBtn: {
    position: "absolute",
    top: 56, right: 22,
    width: 42, height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#C0B0D8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 52,
    paddingHorizontal: 32,
  },

  textBlock: {
    alignItems: "center",
    gap: 10,
  },
  phaseLabel: {
    fontSize: 26,
    fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  phaseSub: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#A895C8",
    textAlign: "center",
    lineHeight: 20,
  },

  orbArea: {
    width: RING2,
    height: RING2,
    alignItems: "center",
    justifyContent: "center",
  },
  ring2: {
    position: "absolute",
    width: RING2, height: RING2,
    borderRadius: RING2 / 2,
    borderWidth: 1,
    borderColor: "rgba(168,149,200,0.3)",
    backgroundColor: "rgba(168,149,200,0.05)",
  },
  ring1: {
    position: "absolute",
    width: RING1, height: RING1,
    borderRadius: RING1 / 2,
    borderWidth: 1.5,
    borderColor: "rgba(168,149,200,0.4)",
    backgroundColor: "rgba(168,149,200,0.09)",
  },
  orbWrapper: {
    width: ORB, height: ORB,
    borderRadius: ORB / 2,
    overflow: "hidden",
    shadowColor: "#B8A0D8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 10,
  },
  orb: {
    width: ORB, height: ORB,
    borderRadius: ORB / 2,
    backgroundColor: "rgba(255,255,255,0.42)",
    borderWidth: 1.5,
    borderColor: "rgba(168,149,200,0.4)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    gap: 2,
  },
  countdownNum: {
    fontSize: 56,
    fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60",
    lineHeight: 62,
  },
  countdownLabel: {
    fontSize: 11,
    fontFamily: "Poppins-SemiBold",
    color: "#A895C8",
    letterSpacing: 1.5,
  },

  cycleLabel: {
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    color: "#C0B0D8",
    letterSpacing: 3,
    textTransform: "uppercase",
  },

  // ── Intro styles ──
  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  introHeader: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 8,
  },
  introTag: {
    fontSize: 9,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2.5,
    color: "#A895C8",
    textTransform: "uppercase",
  },
  introTitle: {
    fontSize: 34,
    fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60",
    textAlign: "center",
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  introDesc: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#A895C8",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 4,
  },

  stepsRow: {
    flexDirection: "row",
    gap: 12,
  },
  stepCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 6,
  },
  stepIcon:  { fontSize: 26 },
  stepPhase: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#2D1F60",
  },
  stepTime: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#A895C8",
  },

  startBtn: {
    width: "100%",
    backgroundColor: "#7B6BB5",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#7B6BB5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 7,
  },
  startTxt: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
