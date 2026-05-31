import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { PHASE_DURATION, TOTAL_CYCLES } from "./constants";

export function useBreathing(visible: boolean) {
  const [showIntro, setShowIntro]     = useState(true);
  const [phase, setPhase]             = useState(0);
  const [countdown, setCountdown]     = useState(4);
  const [cycleNum, setCycleNum]       = useState(1);
  const [done, setDone]               = useState(false);
  const [exerciseKey, setExerciseKey] = useState(0);

  const fadeAnim        = useRef(new Animated.Value(0)).current;
  const introOpacity    = useRef(new Animated.Value(1)).current;
  const exerciseOpacity = useRef(new Animated.Value(0)).current;
  const doneOpacity     = useRef(new Animated.Value(0)).current;
  const scaleAnim       = useRef(new Animated.Value(0.85)).current;
  const ring1Anim       = useRef(new Animated.Value(0.85)).current;
  const ring2Anim       = useRef(new Animated.Value(0.85)).current;
  const textOpacity     = useRef(new Animated.Value(1)).current;
  const prevPhase       = useRef(0);

  const handleStart = () => {
    Animated.sequence([
      Animated.timing(introOpacity,    { toValue: 0, duration: 350, useNativeDriver: true }),
      Animated.timing(exerciseOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
    ]).start(() => setShowIntro(false));
  };

  const handleRepeat = useCallback(() => {
    setDone(false);
    setPhase(0);
    setCountdown(4);
    setCycleNum(1);
    prevPhase.current = 0;
    doneOpacity.setValue(0);
    exerciseOpacity.setValue(1);
    scaleAnim.setValue(0.85);
    ring1Anim.setValue(0.85);
    ring2Anim.setValue(0.85);
    textOpacity.setValue(1);
    setExerciseKey(k => k + 1);
  }, []);

  // Reset al abrir el modal
  useEffect(() => {
    if (visible) {
      setShowIntro(true);
      setDone(false);
      setCycleNum(1);
      setExerciseKey(0);
      introOpacity.setValue(1);
      exerciseOpacity.setValue(0);
      doneOpacity.setValue(0);
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

  // Loop de respiración — solo tras salir de la intro
  useEffect(() => {
    if (!visible || showIntro) return;

    const ease = Easing.inOut(Easing.sin);
    const makeLoop = (anim: Animated.Value, max: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: max,  duration: PHASE_DURATION, easing: ease, useNativeDriver: true }),
          Animated.delay(PHASE_DURATION),
          Animated.timing(anim, { toValue: 0.85, duration: PHASE_DURATION, easing: ease, useNativeDriver: true }),
        ])
      );

    const orbLoop   = makeLoop(scaleAnim, 1.15);
    const ring1Loop = makeLoop(ring1Anim, 1.28);
    const ring2Loop = makeLoop(ring2Anim, 1.42);
    orbLoop.start(); ring1Loop.start(); ring2Loop.start();

    const totalSeconds = TOTAL_CYCLES * 12;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed++;

      // Todos los ciclos completados → transición a pantalla de fin
      if (elapsed >= totalSeconds) {
        clearInterval(interval);
        Animated.sequence([
          Animated.timing(exerciseOpacity, { toValue: 0, duration: 700, useNativeDriver: true }),
          Animated.timing(doneOpacity,     { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start(() => {
          orbLoop.stop(); ring1Loop.stop(); ring2Loop.stop();
          setDone(true);
        });
        return;
      }

      const pos      = elapsed % 12;
      const newCycle = Math.floor(elapsed / 12) + 1;

      let newPhase = 0, newCount = 4;
      if (pos < 4)      { newPhase = 0; newCount = 4 - pos; }
      else if (pos < 8) { newPhase = 1; newCount = 8 - pos; }
      else              { newPhase = 2; newCount = 12 - pos; }

      setCountdown(newCount);
      setCycleNum(newCycle);

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
      orbLoop.stop(); ring1Loop.stop(); ring2Loop.stop();
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, showIntro, exerciseKey]);

  const ring1Opacity = ring1Anim.interpolate({ inputRange: [0.85, 1.28], outputRange: [0.14, 0.32] });
  const ring2Opacity = ring2Anim.interpolate({ inputRange: [0.85, 1.42], outputRange: [0.06, 0.16] });

  return {
    showIntro, done, phase, countdown, cycleNum,
    fadeAnim, introOpacity, exerciseOpacity, doneOpacity,
    scaleAnim, ring1Anim, ring2Anim, textOpacity,
    ring1Opacity, ring2Opacity,
    handleStart, handleRepeat,
  };
}
