import * as ExpoClipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { CHEMICALS, FACTS, SlotResult, SUPERPOWERS } from "./constants";

export function useHappiness(visible: boolean) {
  const [phase, setPhase]               = useState<"intro" | "idle" | "spinning" | "jackpot">("intro");
  const [result, setResult]             = useState<SlotResult | null>(null);
  const [display, setDisplay]           = useState<[number, number, number]>([0, 0, 0]);
  const [locked, setLocked]             = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [alchemistMode, setAlchemistMode] = useState(false);
  const [saved, setSaved]               = useState(false);
  const [copied, setCopied]             = useState(false);
  const [jackpot, setJackpot]           = useState(false);

  const screenFade   = useRef(new Animated.Value(0)).current;
  const reel1Bounce  = useRef(new Animated.Value(0)).current;
  const reel2Bounce  = useRef(new Animated.Value(0)).current;
  const reel3Bounce  = useRef(new Animated.Value(0)).current;
  const reel1Scale   = useRef(new Animated.Value(1)).current;
  const reel2Scale   = useRef(new Animated.Value(1)).current;
  const reel3Scale   = useRef(new Animated.Value(1)).current;
  const jackpotGlow  = useRef(new Animated.Value(0)).current;
  const cardFade     = useRef(new Animated.Value(0)).current;
  const cardSlideY   = useRef(new Animated.Value(50)).current;
  const switchAnim   = useRef(new Animated.Value(0)).current;
  const contentFade  = useRef(new Animated.Value(1)).current;
  const spinBtnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      setPhase("intro");
      setResult(null);
      setDisplay([0, 0, 0]);
      setLocked([false, false, false]);
      setAlchemistMode(false);
      setSaved(false);
      setCopied(false);
      setJackpot(false);
      [reel1Bounce, reel2Bounce, reel3Bounce].forEach(a => a.setValue(0));
      [reel1Scale, reel2Scale, reel3Scale].forEach(a => a.setValue(1));
      switchAnim.setValue(0);
      contentFade.setValue(1);
      cardFade.setValue(0);
      cardSlideY.setValue(50);
      jackpotGlow.setValue(0);
      spinBtnScale.setValue(1);
      Animated.timing(screenFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    } else {
      screenFade.setValue(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const spin = () => {
    if (phase === "spinning") return;

    const fIdx = Math.floor(Math.random() * FACTS.length);
    const sIdx = Math.floor(Math.random() * SUPERPOWERS.length);
    const cIdx = Math.floor(Math.random() * CHEMICALS.length);

    setPhase("spinning");
    setLocked([false, false, false]);
    setAlchemistMode(false);
    switchAnim.setValue(0);
    contentFade.setValue(1);
    cardFade.setValue(0);
    cardSlideY.setValue(50);
    jackpotGlow.setValue(0);
    setJackpot(false);

    Animated.sequence([
      Animated.timing(spinBtnScale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(spinBtnScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    const startBounce = (anim: Animated.Value, ms: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -8, duration: ms, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 8, duration: ms, useNativeDriver: true }),
        ])
      );

    const b1 = startBounce(reel1Bounce, 55);
    const b2 = startBounce(reel2Bounce, 60);
    const b3 = startBounce(reel3Bounce, 65);
    b1.start(); b2.start(); b3.start();

    const i1 = setInterval(() => setDisplay(d => [Math.floor(Math.random() * FACTS.length), d[1], d[2]]), 85);
    const i2 = setInterval(() => setDisplay(d => [d[0], Math.floor(Math.random() * SUPERPOWERS.length), d[2]]), 85);
    const i3 = setInterval(() => setDisplay(d => [d[0], d[1], Math.floor(Math.random() * CHEMICALS.length)]), 85);

    const lockReel = (
      interval: ReturnType<typeof setInterval>,
      bounce: Animated.Value,
      loopAnim: Animated.CompositeAnimation,
      reelScaleAnim: Animated.Value,
      finalIdx: number,
      slot: 0 | 1 | 2,
      lockedState: [boolean, boolean, boolean]
    ) => {
      clearInterval(interval);
      loopAnim.stop();
      setDisplay(d => { const next: [number, number, number] = [...d] as [number, number, number]; next[slot] = finalIdx; return next; });
      setLocked(lockedState);
      Animated.spring(bounce, { toValue: 0, useNativeDriver: true, tension: 220, friction: 10 }).start();
      Animated.sequence([
        Animated.timing(reelScaleAnim, { toValue: 1.07, duration: 90, useNativeDriver: true }),
        Animated.spring(reelScaleAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 8 }),
      ]).start();
    };

    setTimeout(() => lockReel(i1, reel1Bounce, b1, reel1Scale, fIdx, 0, [true, false, false]), 1500);
    setTimeout(() => lockReel(i2, reel2Bounce, b2, reel2Scale, sIdx, 1, [true, true, false]), 2200);
    setTimeout(() => {
      lockReel(i3, reel3Bounce, b3, reel3Scale, cIdx, 2, [true, true, true]);
      setResult({ fact: FACTS[fIdx], superpower: SUPERPOWERS[sIdx], chemical: CHEMICALS[cIdx] });
      setPhase("jackpot");
      setJackpot(true);

      Animated.sequence([
        Animated.timing(jackpotGlow, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(jackpotGlow, { toValue: 0.5, duration: 200, useNativeDriver: true }),
        Animated.timing(jackpotGlow, { toValue: 0.85, duration: 180, useNativeDriver: true }),
        Animated.timing(jackpotGlow, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(cardFade, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(cardSlideY, { toValue: 0, useNativeDriver: true, tension: 55, friction: 12 }),
        ]).start();
      }, 420);
    }, 2900);
  };

  const toggleAlchemist = () => {
    const toAlch = !alchemistMode;
    Animated.spring(switchAnim, { toValue: toAlch ? 1 : 0, useNativeDriver: true, tension: 65, friction: 8 }).start();
    Animated.timing(contentFade, { toValue: 0, duration: 130, useNativeDriver: true }).start(() => {
      setAlchemistMode(toAlch);
      requestAnimationFrame(() => {
        Animated.timing(contentFade, { toValue: 1, duration: 230, useNativeDriver: true }).start();
      });
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleCopy = async () => {
    if (!result) return;
    await ExpoClipboard.setStringAsync(
      `✨ Mi momento de alquimia:\n\n"${result.fact.label}"\n\n🌟 ${result.fact.destello} ${result.superpower.destelloSuffix}\n\n🧪 ${result.chemical.molecule} (${result.chemical.label}): ${result.chemical.description}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const resetGame = () => {
    Animated.timing(cardFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setPhase("idle");
      setResult(null);
      setLocked([false, false, false]);
      setAlchemistMode(false);
      setSaved(false);
      setCopied(false);
      setJackpot(false);
    });
  };

  const switchTranslateX = switchAnim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });
  const isIdle     = phase === "idle";
  const isSpinning = phase === "spinning";

  return {
    phase, result, display, locked, alchemistMode, saved, copied, jackpot,
    screenFade, reel1Bounce, reel2Bounce, reel3Bounce, reel1Scale, reel2Scale, reel3Scale,
    jackpotGlow, cardFade, cardSlideY, contentFade, spinBtnScale,
    switchTranslateX, isIdle, isSpinning,
    spin, toggleAlchemist, handleSave, handleCopy, resetGame, setPhase,
  };
}
