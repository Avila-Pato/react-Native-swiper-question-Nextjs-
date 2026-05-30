import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import React from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { FloatingParticle } from "./FloatingParticle";
import { GRADIENT_COLORS, PARTICLES, PHASES, STEPS } from "./constants";
import { s } from "./styles";
import { useBreathing } from "./useBreathing";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function BreathingScreen({ visible, onClose }: Props) {
  const {
    showIntro, phase, countdown,
    fadeAnim, introOpacity, exerciseOpacity,
    scaleAnim, ring1Anim, ring2Anim, textOpacity,
    ring1Opacity, ring2Opacity,
    handleStart,
  } = useBreathing(visible);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, { opacity: fadeAnim }]}>

        <LinearGradient
          colors={GRADIENT_COLORS}
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
        <Animated.View
          style={[s.content, { opacity: introOpacity }]}
          pointerEvents={showIntro ? "auto" : "none"}
        >
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
        <Animated.View
          style={[s.content, StyleSheet.absoluteFill, s.center, { opacity: exerciseOpacity }]}
          pointerEvents={showIntro ? "none" : "auto"}
        >
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
