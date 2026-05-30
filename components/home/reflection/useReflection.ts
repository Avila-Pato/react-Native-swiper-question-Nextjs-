import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { REFLECTIONS } from "./constants";

export function useReflection(visible: boolean, onSave: (text: string) => void, onClose: () => void) {
  const [typed, setTyped]         = useState("");
  const [inputText, setInputText] = useState("");

  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const cardScale   = useRef(new Animated.Value(0.92)).current;
  const breathScale = useRef(new Animated.Value(1)).current;

  const phrase = REFLECTIONS[new Date().getDay() % REFLECTIONS.length];

  useEffect(() => {
    if (!visible) {
      fadeAnim.setValue(0);
      cardScale.setValue(0.92);
      setTyped("");
      setInputText("");
      return;
    }
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, tension: 55, friction: 9, useNativeDriver: true }),
    ]).start();

    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(phrase.slice(0, i));
      if (i >= phrase.length) clearInterval(iv);
    }, 42);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const breath = Animated.loop(
      Animated.sequence([
        Animated.timing(breathScale, { toValue: 1.016, duration: 3800, useNativeDriver: true }),
        Animated.timing(breathScale, { toValue: 1,     duration: 3800, useNativeDriver: true }),
      ])
    );
    breath.start();
    return () => breath.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleSave = () => {
    if (!inputText.trim()) return;
    onSave(inputText.trim());
    onClose();
  };

  return {
    typed, inputText, setInputText, phrase,
    fadeAnim, cardScale, breathScale,
    handleSave,
  };
}
