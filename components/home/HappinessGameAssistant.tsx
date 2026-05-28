import { BlurView } from "expo-blur";
import * as ExpoClipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import {
  Brain,
  Check,
  Copy,
  Gift,
  RefreshCw,
  Sparkles,
  X,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────

type Fact = {
  id: string;
  label: string;
  sabotaje: string;
  destello: string;
};

type Superpower = {
  id: string;
  label: string;
  destelloSuffix: string;
};

type Chemical = {
  id: string;
  molecule: string;
  label: string;
  description: string;
  accent: string;
};

type SlotResult = {
  fact: Fact;
  superpower: Superpower;
  chemical: Chemical;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const FACTS: Fact[] = [
  {
    id: "f1",
    label: "Una llamada con alguien que quiero",
    sabotaje: "Estuvo bien... pero la conversación fue corta y no se sabe cuándo volverá a llamar.",
    destello: "Sentiste que importas y que alguien pensó en ti hoy",
  },
  {
    id: "f2",
    label: "Dormí bien toda la noche",
    sabotaje: "Una noche no cambia nada. Mañana seguro me desvelo de nuevo.",
    destello: "Tu cuerpo encontró la calma para descansar y repararse por completo",
  },
  {
    id: "f3",
    label: "Terminé una tarea de casa yo solo/a",
    sabotaje: "Tardé más que antes... ya no soy tan rápido/a como era.",
    destello: "Pusiste en marcha tu voluntad y completaste lo que te propusiste",
  },
  {
    id: "f4",
    label: "Disfruté de verdad una comida",
    sabotaje: "Qué pequeñez... otros tienen problemas reales y yo celebrando una comida.",
    destello: "Tu cuerpo recibió cuidado y tú estuviste presente para saborearlo",
  },
  {
    id: "f5",
    label: "Un rato de sol o de aire fresco",
    sabotaje: "Solo fue un rato. No sirve de mucho con todo lo que tengo pendiente.",
    destello: "Le diste a tu cuerpo y a tu mente el respiro que necesitaban",
  },
  {
    id: "f6",
    label: "Recordé algo con claridad",
    sabotaje: "Suerte. Cada vez me cuesta más recordar las cosas importantes.",
    destello: "Tu mente sigue activa y tus recuerdos siguen siendo tuyos",
  },
  {
    id: "f7",
    label: "Ayudé a alguien hoy",
    sabotaje: "No fue gran cosa. Cualquiera lo hubiera hecho en mi lugar.",
    destello: "Usaste tu experiencia y tu corazón para hacer la vida de alguien más fácil",
  },
  {
    id: "f8",
    label: "Me reí de verdad",
    sabotaje: "Un momento tonto... enseguida vuelve la rutina de siempre.",
    destello: "Tu cuerpo y tu mente se aliviaron juntos. Eso no pasa por casualidad",
  },
];

const SUPERPOWERS: Superpower[] = [
  {
    id: "s1",
    label: "Sabiduría de Años",
    destelloSuffix: "con una sabiduría que solo se gana viviendo lo que tú has vivido.",
  },
  {
    id: "s2",
    label: "Gratitud Auténtica",
    destelloSuffix: "reconociendo lo bueno cuando el mundo dice que no hay nada que celebrar.",
  },
  {
    id: "s3",
    label: "Paciencia Ganada",
    destelloSuffix: "con la calma que solo tiene quien ha aprendido a esperar sin rendirse.",
  },
  {
    id: "s4",
    label: "Generosidad del Corazón",
    destelloSuffix: "dando de ti sin calcular lo que recibirás a cambio.",
  },
  {
    id: "s5",
    label: "Resiliencia Probada",
    destelloSuffix: "apoyándote en todo lo que has superado para seguir adelante hoy.",
  },
  {
    id: "s6",
    label: "Presencia Plena",
    destelloSuffix: "estando completamente aquí, en este momento, sin huir hacia el pasado ni el futuro.",
  },
];

const CHEMICALS: Chemical[] = [
  {
    id: "c1",
    molecule: "Dopamina",
    label: "Motivación",
    description: "Tu cerebro acaba de marcar esto como valioso. Te empujará a repetirlo.",
    accent: "#F59E0B",
  },
  {
    id: "c2",
    molecule: "Serotonina",
    label: "Paz Interior",
    description: "Regulador maestro del humor. Tu sistema nervioso ahora descansa.",
    accent: "#10B981",
  },
  {
    id: "c3",
    molecule: "Endorfina",
    label: "Alivio",
    description: "El analgésico natural. Disuelve la tensión acumulada desde adentro.",
    accent: "#8B5CF6",
  },
  {
    id: "c4",
    molecule: "Oxitocina",
    label: "Conexión",
    description: "La molécula del vínculo. Tu cuerpo refuerza que no estás solo en esto.",
    accent: "#EC4899",
  },
  {
    id: "c5",
    molecule: "GABA",
    label: "Calma",
    description: "El freno del sistema nervioso. Señal de que puedes soltar el control.",
    accent: "#3B82F6",
  },
];

// ─── Particles ────────────────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: (i * 57 + 17) % (W - 10),
  size: (i % 4) + 2,
  duration: 11000 + ((i * 970) % 6000),
  delay: (i * 730) % 5500,
  color:
    i % 3 === 0
      ? "rgba(255,215,80,0.85)"
      : i % 3 === 1
      ? "rgba(255,185,165,0.8)"
      : "rgba(230,220,255,0.8)",
}));

const JACKPOT_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  x: (i * 43 + 31) % (W - 10),
  size: (i % 3) + 3,
  duration: 4500 + ((i * 400) % 2000),
  delay: (i * 180) % 800,
  color:
    i % 2 === 0 ? "rgba(255,220,50,0.95)" : "rgba(255,200,130,0.9)",
}));

function FloatingParticle({
  x, size, duration, delay, color,
}: {
  x: number; size: number; duration: number; delay: number; color: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 350, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -(H + 60)] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.08, 0.7, 1], outputRange: [0, 0.9, 0.5, 0] });
  const scale      = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.3, 1.1, 0.3] });
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute", left: x, bottom: (size * 20) % (H / 2),
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: color,
        shadowColor: color, shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1, shadowRadius: size * 3,
        transform: [{ translateY }, { scale }], opacity,
      }}
    />
  );
}

// ─── Reel Window ──────────────────────────────────────────────────────────────

function ReelWindow({
  label, hint, content, bounce, reelScale, locked, idle, alchemistMode, accentColor,
}: {
  label: string;
  hint: string;
  content: string;
  bounce: Animated.Value;
  reelScale: Animated.Value;
  locked: boolean;
  idle: boolean;
  alchemistMode: boolean;
  accentColor: string;
}) {
  const glowBorder  = accentColor + "99";
  const glowBg      = accentColor + "14";
  const arrowColor  = alchemistMode ? accentColor + "88" : "rgba(196,168,85,0.55)";

  return (
    <Animated.View style={{ flex: 1, alignItems: "center" }}>
      <Animated.View
        style={[
          s.reelWindow,
          locked && s.reelWindowLocked,
          alchemistMode && { borderColor: glowBorder, backgroundColor: glowBg,
            shadowColor: accentColor, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
          { transform: [{ translateY: bounce }, { scale: reelScale }], alignSelf: "stretch" },
        ]}
      >
        <Text style={[s.reelLabel, alchemistMode && { color: accentColor }]}>{label}</Text>
        <View style={s.reelContent}>
          {idle ? (
            <Text style={s.reelIdle}>{"✦"}</Text>
          ) : (
            <Text style={[s.reelText, alchemistMode && { color: accentColor }]} numberOfLines={3}>
              {content}
            </Text>
          )}
        </View>
        {locked && (
          <View style={[s.reelLockDot, alchemistMode && { backgroundColor: accentColor }]} />
        )}
      </Animated.View>
      {/* Arrow + hint */}
      <View style={s.reelHintRow}>
        <View style={[s.reelArrow, { borderTopColor: arrowColor }]} />
        <Text style={[s.reelHintTxt, alchemistMode && { color: accentColor }]}>{hint}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function HappinessGameAssistant({ visible, onClose }: Props) {
  const [phase, setPhase]               = useState<"intro" | "idle" | "spinning" | "jackpot">("intro");
  const [result, setResult]             = useState<SlotResult | null>(null);
  const [display, setDisplay]           = useState<[number, number, number]>([0, 0, 0]);
  const [locked, setLocked]             = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [alchemistMode, setAlchemistMode] = useState(false);
  const [saved, setSaved]               = useState(false);
  const [copied, setCopied]             = useState(false);
  const [jackpot, setJackpot]           = useState(false);

  const screenFade  = useRef(new Animated.Value(0)).current;
  const reel1Bounce = useRef(new Animated.Value(0)).current;
  const reel2Bounce = useRef(new Animated.Value(0)).current;
  const reel3Bounce = useRef(new Animated.Value(0)).current;
  const reel1Scale  = useRef(new Animated.Value(1)).current;
  const reel2Scale  = useRef(new Animated.Value(1)).current;
  const reel3Scale  = useRef(new Animated.Value(1)).current;
  const jackpotGlow = useRef(new Animated.Value(0)).current;
  const cardFade    = useRef(new Animated.Value(0)).current;
  const cardSlideY  = useRef(new Animated.Value(50)).current;
  const switchAnim  = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(1)).current;
  const spinBtnScale = useRef(new Animated.Value(1)).current;

  // ── Modal lifecycle ──
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

  // ── Spin ──
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

    // Vertical bounce while spinning
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

    // Rapid text cycling
    const i1 = setInterval(() =>
      setDisplay(d => [Math.floor(Math.random() * FACTS.length), d[1], d[2]]), 85);
    const i2 = setInterval(() =>
      setDisplay(d => [d[0], Math.floor(Math.random() * SUPERPOWERS.length), d[2]]), 85);
    const i3 = setInterval(() =>
      setDisplay(d => [d[0], d[1], Math.floor(Math.random() * CHEMICALS.length)]), 85);

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
      setDisplay(d => {
        const next: [number, number, number] = [...d] as [number, number, number];
        next[slot] = finalIdx;
        return next;
      });
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

      // Jackpot flash
      Animated.sequence([
        Animated.timing(jackpotGlow, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(jackpotGlow, { toValue: 0.5, duration: 200, useNativeDriver: true }),
        Animated.timing(jackpotGlow, { toValue: 0.85, duration: 180, useNativeDriver: true }),
        Animated.timing(jackpotGlow, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();

      // Card slides in
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(cardFade, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(cardSlideY, { toValue: 0, useNativeDriver: true, tension: 55, friction: 12 }),
        ]).start();
      }, 420);
    }, 2900);
  };

  // ── Toggle alchemist ──
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

  // ── Actions ──
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

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, { opacity: screenFade }]}>

        <LinearGradient
          colors={["#FDF0E8", "#F9F3FF", "#FFF0F8", "#F3EFF8"]}
          start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />

        {PARTICLES.map((p, i) => <FloatingParticle key={i} {...p} />)}
        {jackpot && JACKPOT_PARTICLES.map((p, i) => <FloatingParticle key={`j${i}`} {...p} />)}

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTag}>
            {phase === "intro" ? "FELICIDAD · NEUROCIENCIA" : "CASINO EMOCIONAL · DOPAMINE ALCHEMY"}
          </Text>
          <Pressable style={s.closeBtn} onPress={onClose} hitSlop={12}>
            <X size={18} color="#9B8AB8" strokeWidth={2} />
          </Pressable>
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

          {/* ── Intro phase ── */}
          {phase === "intro" && (
            <BlurView intensity={45} tint="light" style={s.slotMachine}>
              <View style={s.introBadge}>
                <Text style={s.introBadgeTxt}>{"NEUROCIENCIA · POSITIVIDAD"}</Text>
              </View>
              <Text style={s.heroTitle}>{"Cosechar el Momento"}</Text>
              <Text style={s.introBody}>
                {"Tu cerebro tiene un sesgo de negatividad incorporado: está diseñado para registrar amenazas, no logros. Los pequeños momentos buenos —que son mayoría— pasan desapercibidos antes de que puedas procesarlos."}
              </Text>
              <View style={s.introFactBox}>
                <Text style={s.introFactLabel}>{"LA CIENCIA DETRÁS"}</Text>
                <Text style={s.introFactTxt}>
                  {"Rick Hanson, neurocientífico de Harvard, demostró que los momentos positivos necesitan 20 segundos de atención consciente para consolidarse en memoria a largo plazo. Sin ese anclaje, el cerebro los descarta."}
                </Text>
              </View>
              <View style={s.introMechanicBox}>
                <Text style={s.introMechanicLabel}>{"¿CÓMO FUNCIONA?"}</Text>
                <Text style={s.introMechanicTxt}>
                  {"Cada giro identifica un micro-momento real de bienestar, el superpoder que usaste para vivirlo y la molécula que liberaste. Luego puedes ver cómo el cerebro en automático lo minimiza — o amplificarlo como alquimista."}
                </Text>
              </View>
              <Pressable style={s.introCta} onPress={() => setPhase("idle")}>
                <Zap size={16} color="#fff" strokeWidth={2.5} />
                <Text style={s.introCtaTxt}>{"Empezar a cosechar"}</Text>
              </Pressable>
            </BlurView>
          )}

          {/* ── Game phases ── */}
          {phase !== "intro" && (
            <>
              <Text style={s.heroTitle}>{"Cosechar el Momento"}</Text>
              <Text style={s.heroSub}>
                {"Convierte lo ordinario en combustible para tu bienestar."}
              </Text>

              {/* Slot Machine */}
              <BlurView intensity={50} tint="light" style={s.slotMachine}>
                <Animated.View
                  pointerEvents="none"
                  style={[s.jackpotOverlay, { opacity: jackpotGlow }]}
                />
                <View style={s.reelsRow}>
                  <ReelWindow
                    label={"EL HECHO"}
                    hint={"¿Qué pasó?"}
                    content={FACTS[display[0]].label}
                    bounce={reel1Bounce}
                    reelScale={reel1Scale}
                    locked={locked[0]}
                    idle={isIdle}
                    alchemistMode={alchemistMode}
                    accentColor={"#F59E0B"}
                  />
                  <ReelWindow
                    label={"SUPERPODER"}
                    hint={"¿Qué usaste?"}
                    content={SUPERPOWERS[display[1]].label}
                    bounce={reel2Bounce}
                    reelScale={reel2Scale}
                    locked={locked[1]}
                    idle={isIdle}
                    alchemistMode={alchemistMode}
                    accentColor={"#7B6BB5"}
                  />
                  <ReelWindow
                    label={"QUÍMICA"}
                    hint={"¿Qué ganaste?"}
                    content={CHEMICALS[display[2]].molecule}
                    bounce={reel3Bounce}
                    reelScale={reel3Scale}
                    locked={locked[2]}
                    idle={isIdle}
                    alchemistMode={alchemistMode}
                    accentColor={result?.chemical.accent ?? "#10B981"}
                  />
                </View>
                <Animated.View style={{ transform: [{ scale: spinBtnScale }] }}>
                  <Pressable
                    style={[s.spinBtn, isSpinning && s.spinBtnBusy]}
                    onPress={spin}
                    disabled={isSpinning}
                  >
                    <Zap size={18} color="#fff" strokeWidth={2.5} />
                    <Text style={s.spinBtnTxt}>
                      {isSpinning ? "Girando..." : "Cosechar Momento"}
                    </Text>
                  </Pressable>
                </Animated.View>
              </BlurView>

              {/* Reward Card */}
              {result && (
                <Animated.View style={{ opacity: cardFade, transform: [{ translateY: cardSlideY }] }}>
                  <BlurView intensity={55} tint="light" style={s.rewardCard}>
                    <Pressable style={s.switchRow} onPress={toggleAlchemist}>
                      <Brain size={13} color={!alchemistMode ? "#7B6BB5" : "#C0B0D8"} strokeWidth={2} />
                      <Text style={[s.switchLabel, !alchemistMode && s.switchLabelActive]}>
                        {"Automático"}
                      </Text>
                      <View style={[s.switchTrack, alchemistMode && s.switchTrackGold]}>
                        <Animated.View style={[s.switchThumb, { transform: [{ translateX: switchTranslateX }] }]} />
                      </View>
                      <Text style={[s.switchLabel, alchemistMode && s.switchLabelGold]}>
                        {"Alquimista"}
                      </Text>
                      <Sparkles size={13} color={alchemistMode ? "#F59E0B" : "#C0B0D8"} strokeWidth={2} />
                    </Pressable>

                    <Animated.View style={{ opacity: contentFade }}>
                      {!alchemistMode ? (
                        <View style={s.autoCard}>
                          <Text style={s.autoLabel}>{"TU VOZ INTERIOR EN AUTOMÁTICO"}</Text>
                          <View style={s.autoBubble}>
                            <Text style={s.autoText}>{result.fact.sabotaje}</Text>
                          </View>
                          <Text style={s.autoFooter}>
                            {"El sesgo de negatividad minimizando lo que ya lograste."}
                          </Text>
                        </View>
                      ) : (
                        <View>
                          <View style={s.destelloBlock}>
                            <Text style={s.blockLabel}>{"✦  EL DESTELLO"}</Text>
                            <Text style={s.destelloText}>
                              {result.fact.destello}
                              {" "}
                              <Text style={s.destelloSuffix}>{result.superpower.destelloSuffix}</Text>
                            </Text>
                            <View style={s.superpowerTag}>
                              <Sparkles size={11} color="#7B6BB5" strokeWidth={2} />
                              <Text style={s.superpowerTxt}>{result.superpower.label}</Text>
                            </View>
                          </View>
                          <View style={[s.chemBlock, { borderColor: result.chemical.accent + "44" }]}>
                            <Text style={s.blockLabel}>{"⬡  EL ANCLAJE QUÍMICO"}</Text>
                            <View style={s.chemRow}>
                              <View style={[s.chemBadge, { backgroundColor: result.chemical.accent + "18" }]}>
                                <Text style={[s.chemMolecule, { color: result.chemical.accent }]}>
                                  {result.chemical.molecule}
                                </Text>
                                <Text style={[s.chemLabel, { color: result.chemical.accent }]}>
                                  {result.chemical.label}
                                </Text>
                              </View>
                              <Text style={s.chemDesc}>{result.chemical.description}</Text>
                            </View>
                          </View>
                          <View style={s.actionsRow}>
                            <Pressable
                              style={[s.actionBtn, saved && s.actionBtnSuccess]}
                              onPress={handleSave}
                            >
                              {saved
                                ? <Check size={15} color="#fff" strokeWidth={2.5} />
                                : <Gift size={15} color="#fff" strokeWidth={2} />}
                              <Text style={s.actionBtnTxt}>
                                {saved ? "¡Guardado!" : "Guardar"}
                              </Text>
                            </Pressable>
                            <Pressable
                              style={[s.actionBtn, s.actionBtnGold, copied && s.actionBtnSuccess]}
                              onPress={handleCopy}
                            >
                              {copied
                                ? <Check size={15} color="#fff" strokeWidth={2.5} />
                                : <Copy size={15} color="#fff" strokeWidth={2} />}
                              <Text style={s.actionBtnTxt}>
                                {copied ? "¡Copiado!" : "Multiplicar Eco"}
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      )}
                    </Animated.View>
                  </BlurView>

                  <Pressable style={s.resetBtn} onPress={resetGame}>
                    <RefreshCw size={13} color="#B8A8D0" strokeWidth={2} />
                    <Text style={s.resetTxt}>{"Nuevo momento"}</Text>
                  </Pressable>
                </Animated.View>
              )}
            </>
          )}

        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: { flex: 1 },

  blob1: {
    position: "absolute", width: 320, height: 320, borderRadius: 160,
    backgroundColor: "rgba(255,200,100,0.18)", top: -110, right: -110,
  },
  blob2: {
    position: "absolute", width: 260, height: 260, borderRadius: 130,
    backgroundColor: "rgba(195,175,255,0.2)", bottom: 80, left: -80,
  },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 58, paddingHorizontal: 22, paddingBottom: 12,
  },
  headerTag: {
    fontSize: 8, fontFamily: "Poppins-SemiBold",
    letterSpacing: 1.8, color: "#C4A855",
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#C0B0D8", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 6, elevation: 3,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },

  heroTitle: {
    fontSize: 26, fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60", marginBottom: 6,
  },
  heroSub: {
    fontSize: 13, fontFamily: "Poppins-Regular",
    color: "#A895C8", lineHeight: 20, marginBottom: 22,
  },

  // ── Slot machine ──
  slotMachine: {
    borderRadius: 26, padding: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.88)",
    overflow: "hidden",
    shadowColor: "#C4A855", shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
    marginBottom: 16,
  },
  jackpotOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,215,60,0.28)",
  },
  reelsRow: { flexDirection: "row", gap: 8, marginBottom: 18 },

  reelWindow: {
    flex: 1, borderRadius: 16, minHeight: 110,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1.5, borderColor: "rgba(200,190,230,0.5)",
    padding: 10, alignItems: "center", overflow: "hidden",
  },
  reelWindowLocked: {
    borderColor: "rgba(200,160,40,0.65)",
    backgroundColor: "rgba(255,248,210,0.65)",
    shadowColor: "#F59E0B", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45, shadowRadius: 10, elevation: 5,
  },
  reelLabel: {
    fontSize: 7, fontFamily: "Poppins-SemiBold",
    letterSpacing: 1.5, color: "#C4A855", marginBottom: 8,
  },
  reelContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  reelIdle: { fontSize: 26, color: "rgba(180,165,220,0.45)" },
  reelText: {
    fontSize: 11, fontFamily: "Poppins-SemiBold",
    color: "#3D2D70", textAlign: "center", lineHeight: 16,
  },
  reelLockDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: "#F59E0B", marginTop: 6,
  },
  reelHintRow: {
    alignItems: "center", marginTop: 6, gap: 2,
  },
  reelArrow: {
    width: 0, height: 0,
    borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 0,
    borderTopWidth: 6,
    borderLeftColor: "transparent", borderRightColor: "transparent",
    borderTopColor: "rgba(196,168,85,0.55)",
  },
  reelHintTxt: {
    fontSize: 9, fontFamily: "Poppins-Regular",
    color: "#C4A855", textAlign: "center",
  },

  spinBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, backgroundColor: "#3D2D70",
    borderRadius: 18, paddingVertical: 16,
    shadowColor: "#3D2D70", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  spinBtnBusy: { backgroundColor: "#9B8AB8" },
  spinBtnTxt: { fontSize: 15, fontFamily: "Poppins-SemiBold", color: "#fff" },

  // ── Reward card ──
  rewardCard: {
    borderRadius: 26, padding: 22,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.88)",
    overflow: "hidden",
    shadowColor: "#C4A855", shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18, shadowRadius: 24, elevation: 12,
    marginBottom: 10,
  },

  switchRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, marginBottom: 20, paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.85)",
  },
  switchLabel: { fontSize: 11, fontFamily: "Poppins-SemiBold", color: "#C0B0D8" },
  switchLabelActive: { color: "#7B6BB5" },
  switchLabelGold: { color: "#D97706" },
  switchTrack: {
    width: 48, height: 28, borderRadius: 14,
    backgroundColor: "rgba(190,175,220,0.45)",
    justifyContent: "center",
  },
  switchTrackGold: { backgroundColor: "#F59E0B" },
  switchThumb: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: "#fff",
    shadowColor: "#7B6BB5", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
  },

  // ── Auto card ──
  autoCard: {
    borderRadius: 18, padding: 18,
    backgroundColor: "rgba(210,205,225,0.35)",
    borderWidth: 1, borderColor: "rgba(190,182,215,0.4)",
  },
  autoLabel: {
    fontSize: 8, fontFamily: "Poppins-SemiBold",
    letterSpacing: 2, color: "#B8B0CC", marginBottom: 12,
  },
  autoBubble: {
    backgroundColor: "rgba(190,182,215,0.28)",
    borderRadius: 14, borderBottomLeftRadius: 4,
    padding: 14, marginBottom: 12,
  },
  autoText: {
    fontSize: 14, fontFamily: "Poppins-Regular",
    color: "#7A7090", lineHeight: 22, fontStyle: "italic",
  },
  autoFooter: {
    fontSize: 11, fontFamily: "Poppins-Regular",
    color: "#B0A8C0", textAlign: "center",
  },

  // ── Destello block ──
  destelloBlock: {
    backgroundColor: "rgba(123,107,181,0.07)",
    borderRadius: 18, padding: 18, marginBottom: 12,
    borderWidth: 1, borderColor: "rgba(123,107,181,0.16)",
  },
  blockLabel: {
    fontSize: 8, fontFamily: "Poppins-SemiBold",
    letterSpacing: 2, color: "#C4A855", marginBottom: 10,
  },
  destelloText: {
    fontSize: 16, fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60", lineHeight: 26, marginBottom: 12,
  },
  destelloSuffix: { color: "#7B6BB5" },
  superpowerTag: {
    flexDirection: "row", alignItems: "center", gap: 5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(123,107,181,0.1)",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: "rgba(123,107,181,0.2)",
  },
  superpowerTxt: { fontSize: 11, fontFamily: "Poppins-SemiBold", color: "#7B6BB5" },

  // ── Chemical block ──
  chemBlock: {
    borderRadius: 18, padding: 18, marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderWidth: 1.5,
  },
  chemRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  chemBadge: {
    borderRadius: 14, padding: 12, alignItems: "center", minWidth: 82,
  },
  chemMolecule: { fontSize: 14, fontFamily: "Playfair-ExtraBold", marginBottom: 2 },
  chemLabel: { fontSize: 10, fontFamily: "Poppins-SemiBold" },
  chemDesc: {
    flex: 1, fontSize: 13, fontFamily: "Poppins-Regular",
    color: "#6B6080", lineHeight: 20,
  },

  // ── Actions ──
  actionsRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 7,
    backgroundColor: "#3D2D70",
    borderRadius: 14, paddingVertical: 13,
    shadowColor: "#3D2D70", shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  actionBtnGold: { backgroundColor: "#C4A855" },
  actionBtnSuccess: { backgroundColor: "#4CAF82" },
  actionBtnTxt: { fontSize: 12, fontFamily: "Poppins-SemiBold", color: "#fff" },

  resetBtn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8, paddingVertical: 14,
  },
  resetTxt: { fontSize: 13, fontFamily: "Poppins-Medium", color: "#B8A8D0" },

  // ── Intro ──
  introBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(245,158,11,0.14)",
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    marginBottom: 14,
  },
  introBadgeTxt: {
    fontSize: 8, fontFamily: "Poppins-SemiBold",
    letterSpacing: 1.6, color: "#C4A855",
  },
  introBody: {
    fontSize: 13, fontFamily: "Poppins-Regular",
    color: "#7A7090", lineHeight: 20, marginBottom: 18,
  },
  introFactBox: {
    backgroundColor: "rgba(123,107,181,0.07)",
    borderRadius: 16, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: "rgba(123,107,181,0.14)",
  },
  introFactLabel: {
    fontSize: 8, fontFamily: "Poppins-SemiBold",
    letterSpacing: 2, color: "#C4A855", marginBottom: 6,
  },
  introFactTxt: {
    fontSize: 12, fontFamily: "Poppins-Regular",
    color: "#7A7090", lineHeight: 18,
  },
  introMechanicBox: {
    backgroundColor: "rgba(245,158,11,0.07)",
    borderRadius: 16, padding: 14, marginBottom: 22,
    borderWidth: 1, borderColor: "rgba(245,158,11,0.15)",
  },
  introMechanicLabel: {
    fontSize: 8, fontFamily: "Poppins-SemiBold",
    letterSpacing: 2, color: "#D97706", marginBottom: 6,
  },
  introMechanicTxt: {
    fontSize: 12, fontFamily: "Poppins-Regular",
    color: "#7A7090", lineHeight: 18,
  },
  introCta: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, backgroundColor: "#3D2D70",
    borderRadius: 16, paddingVertical: 15,
    shadowColor: "#3D2D70", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  introCtaTxt: { fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#fff" },
});
