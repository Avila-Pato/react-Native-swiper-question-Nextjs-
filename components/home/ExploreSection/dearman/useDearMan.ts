import * as ExpoClipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { ContextKey, Trigger } from "./constants";

export function useDearMan(visible: boolean) {
  const [context, setContext]         = useState<ContextKey>("profesional");
  const [phase, setPhase]             = useState<"intro" | "diagnose" | "simulate">("intro");
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [nedraMode, setNedraMode]     = useState(false);
  const [copied, setCopied]           = useState(false);

  const screenFade  = useRef(new Animated.Value(0)).current;
  const cardFade    = useRef(new Animated.Value(1)).current;
  const cardSlideX  = useRef(new Animated.Value(0)).current;
  const switchAnim  = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(1)).current;

  // Reset al abrir/cerrar
  useEffect(() => {
    if (visible) {
      setPhase("intro");
      setSelectedTrigger(null);
      setNedraMode(false);
      setCopied(false);
      switchAnim.setValue(0);
      cardFade.setValue(1);
      cardSlideX.setValue(0);
      contentFade.setValue(1);
      Animated.timing(screenFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    } else {
      screenFade.setValue(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Transición entre fases con fade + slide
  const transitionTo = (fn: () => void, direction: 1 | -1 = 1) => {
    Animated.parallel([
      Animated.timing(cardFade,   { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(cardSlideX, { toValue: -50 * direction, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      fn();
      cardSlideX.setValue(60 * direction);
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(cardFade,   { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.timing(cardSlideX, { toValue: 0, duration: 280, useNativeDriver: true }),
        ]).start();
      });
    });
  };

  const selectTrigger = (trigger: Trigger) => {
    transitionTo(() => {
      setSelectedTrigger(trigger);
      setNedraMode(false);
      switchAnim.setValue(0);
      contentFade.setValue(1);
      setPhase("simulate");
    }, 1);
  };

  const goBack = () => {
    transitionTo(() => {
      setPhase("diagnose");
      setNedraMode(false);
    }, -1);
  };

  const toggleNedra = () => {
    const toNedra = !nedraMode;
    Animated.spring(switchAnim, { toValue: toNedra ? 1 : 0, useNativeDriver: true, tension: 65, friction: 8 }).start();
    Animated.timing(contentFade, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
      setNedraMode(toNedra);
      requestAnimationFrame(() => {
        Animated.timing(contentFade, { toValue: 1, duration: 240, useNativeDriver: true }).start();
      });
    });
  };

  const changeContext = (key: ContextKey) => {
    if (key === context) return;
    Animated.timing(cardFade, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setContext(key);
      requestAnimationFrame(() => {
        Animated.timing(cardFade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
      });
    });
  };

  const handleCopy = async () => {
    if (!selectedTrigger) return;
    await ExpoClipboard.setStringAsync(
      `${selectedTrigger.nedraPhrase} ${selectedTrigger.nedraAction}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const switchTranslateX = switchAnim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });

  return {
    context, phase, selectedTrigger, nedraMode, copied,
    screenFade, cardFade, cardSlideX, contentFade, switchTranslateX,
    transitionTo, selectTrigger, goBack, toggleNedra, changeContext, handleCopy,
    setPhase,
  };
}
