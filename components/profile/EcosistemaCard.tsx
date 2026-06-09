import { SPACING } from "@/constants/constants";
import { MUTED, TEXT } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { FRAMES } from "@/data/florFrames";

const PEAK = 69; // índice 69 = frame_070 = pico florecida (frame_071+ empieza a decaer)

function healthToIdx(health: number): number {
  // Curva raíz cuadrada: comprime la fase de marchita, expande la de florecida
  // 70% salud → frame ~62,  100% → frame 74
  const t = Math.min(1, Math.max(0, health / 100));
  return Math.round(Math.sqrt(t) * PEAK);
}

// ── Constantes ────────────────────────────────────────────────────────────────

const FLOR_KEY = "eco_flor_v8";
const WATER_KEY = "eco_flor_watered_v14";
const WATER_AMT = 8;

const STAGES = [
  {
    max: 15,
    label: "Semilla",
    desc: "Acabas de plantar tu intención",
    spark: "🌱",
  },
  { max: 30, label: "Brote", desc: "Pequeños pasos hacia la luz", spark: "🌿" },
  { max: 50, label: "Planta", desc: "Creciendo con constancia", spark: "🪴" },
  {
    max: 70,
    label: "En flor",
    desc: "Tu cuidado empieza a florecer",
    spark: "🌺",
  },
  {
    max: 90,
    label: "Floreciendo",
    desc: "Radiante de energía y propósito",
    spark: "🌸",
  },
  {
    max: 101,
    label: "Pleno ✨",
    desc: "Tu jardín interior está en su auge",
    spark: "✨",
  },
];

const DROPS = [
  { left: "52%", delay: 0 },
  { left: "61%", delay: 100 },
  { left: "69%", delay: 50 },
  { left: "77%", delay: 160 },
  { left: "56%", delay: 220 },
  { left: "73%", delay: 80 },
  { left: "65%", delay: 140 },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ── Gota de agua ──────────────────────────────────────────────────────────────

function WaterDrop({
  left,
  delay,
  trigger,
}: {
  left: string;
  delay: number;
  trigger: number;
}) {
  const y = useSharedValue(-10);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) return;
    y.value = -10;
    opacity.value = 0;
    y.value = withDelay(delay, withTiming(200, { duration: 700 }));
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 80 }),
        withDelay(420, withTiming(0, { duration: 200 })),
      ),
    );
  }, [trigger]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[dr.drop, { left: left as any }, style as any]}>
      <View style={dr.shape} />
    </Animated.View>
  );
}

const dr = StyleSheet.create({
  drop: { position: "absolute", top: 0, zIndex: 10, alignItems: "center" },
  shape: {
    width: 7,
    height: 12,
    borderRadius: 3.5,
    backgroundColor: "#5BA4CF",
    opacity: 0.75,
  },
});

// ── Card principal ─────────────────────────────────────────────────────────────

interface Props {
  diagnosticScores?: Record<string, number>;
}

export function EcosistemaCard({ diagnosticScores = {} }: Props) {
  const [health, setHealth] = useState(20);
  const [watered, setWatered] = useState("");
  const [ready, setReady] = useState(false);
  const [displayFrame, setDisplayFrame] = useState(0);
  const [waterTrigger, setWaterTrigger] = useState(0);

  const florScale = useSharedValue(1);
  const florRotate = useSharedValue(0);
  const _fillW = useSharedValue(20);
  const frameTimer = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  // Cargar desde AsyncStorage
  useEffect(() => {
    (async () => {
      const [hRaw, wRaw] = await Promise.all([
        AsyncStorage.getItem(FLOR_KEY),
        AsyncStorage.getItem(WATER_KEY),
      ]);

      let h = hRaw ? Number(hRaw) : 0;

      if (!hRaw) {
        h = 100;
        await AsyncStorage.setItem(FLOR_KEY, "100");
      }

      // Decaimiento diario: si no se regó hoy → vuelve a marchitada
      if (wRaw && wRaw !== todayISO()) {
        h = 0;
        await AsyncStorage.setItem(FLOR_KEY, "0");
      }

      _fillW.value = h;
      setHealth(h);
      setWatered(wRaw ?? "");
      // Marchitada al iniciar; florecida solo si ya regó hoy
      setDisplayFrame(wRaw === todayISO() ? healthToIdx(h) : 0);
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Respiración suave con Reanimated (escala del contenedor, no cambia frames)
  useEffect(() => {
    if (!ready) return;
    const amp = 0.012 + (health / 100) * 0.03;
    const dur = 2400 - (health / 100) * 700;
    florScale.value = withRepeat(
      withSequence(
        withTiming(1 + amp, { duration: dur }),
        withTiming(1, { duration: dur }),
      ),
      -1,
      true,
    );
  }, [health, ready]);

  const handleWater = async () => {
    const newH = Math.min(100, health + WATER_AMT);
    const today = todayISO();
    const toFrame = healthToIdx(newH);

    // Bounce del contenedor
    florScale.value = withSequence(
      withSpring(1.12, { damping: 4, stiffness: 300 }),
      withSpring(1, { damping: 9, stiffness: 160 }),
    );
    florRotate.value = withSequence(
      withTiming(-5, { duration: 70 }),
      withTiming(5, { duration: 70 }),
      withTiming(-3, { duration: 55 }),
      withTiming(0, { duration: 55 }),
    );
    _fillW.value = withSpring(newH, { damping: 14, stiffness: 80 });

    // Animación: siempre desde frame 0 hasta el nuevo nivel — muestra el crecimiento completo
    if (frameTimer.current) clearInterval(frameTimer.current);
    setDisplayFrame(0);
    let cur = 0;
    frameTimer.current = setInterval(() => {
      cur += 1;
      setDisplayFrame(cur);
      if (cur >= toFrame) {
        clearInterval(frameTimer.current!);
        frameTimer.current = undefined;
      }
    }, 32); // ~30fps

    setWaterTrigger((n) => n + 1);
    setHealth(newH);
    setWatered(today);

    await Promise.all([
      AsyncStorage.setItem(FLOR_KEY, String(newH)),
      AsyncStorage.setItem(WATER_KEY, today),
    ]);
  };

  const florStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: florScale.value },
      { rotate: `${florRotate.value}deg` },
    ],
  }));

  if (!ready) return null;

  const stage = STAGES.find((st) => health < st.max)!;
  const canWater = watered !== todayISO();

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Tu Ecosistema</Text>
        <Text style={s.subtitle}>Riégala cada día — crece contigo</Text>
      </View>

      <View style={s.card}>
        {/* Flor + gotas */}
        <View style={s.florWrap}>
          {DROPS.map((cfg, i) => (
            <WaterDrop key={i} {...cfg} trigger={waterTrigger} />
          ))}
          <Animated.View style={florStyle}>
            <Image
              source={FRAMES[displayFrame]}
              style={s.florImg}
              contentFit="contain"
            />
          </Animated.View>
        </View>

        <Text style={s.stageDesc}>{stage.desc}</Text>

        <Pressable
          style={[s.waterBtn, !canWater && s.waterBtnDone]}
          onPress={canWater ? handleWater : undefined}
        >
          <Text style={[s.waterTxt, !canWater && s.waterTxtDone]}>
            {canWater ? "Regar mi flor" : "Regada hoy"}
          </Text>
        </Pressable>

        {!canWater && (
          <Text style={s.nextWater}>
            Vuelve mañana para no dejar tu flor marchitada 🌸
          </Text>
        )}
      </View>
    </View>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────────────

const ACCENT = "#C45E7A";

const s = StyleSheet.create({
  container: { paddingBottom: SPACING * 2 },

  header: { marginHorizontal: SPACING * 2, marginBottom: SPACING * 1.5 },
  title: { fontSize: 16, fontWeight: "800", color: TEXT, letterSpacing: -0.4 },
  subtitle: { fontSize: 12, color: MUTED, marginTop: 3 },

  card: {
    marginHorizontal: SPACING * 2,
    backgroundColor: "#FFF9F6",
    borderRadius: 28,
    padding: SPACING * 2,
    alignItems: "center",
    gap: SPACING * 0.9,
    borderWidth: 1,
    borderColor: "rgba(196,94,122,0.14)",
    shadowColor: "#C45E7A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },

  florWrap: {
    width: 280,
    height: 520,
    marginLeft: -140,
    marginBottom: -140,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  florImg: { width: 280, height: 520 },

  stageDesc: {
    fontSize: 13,
    color: MUTED,
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: SPACING,
  },

  barBg: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F0E8ED",
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 4, backgroundColor: ACCENT },

  waterBtn: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: ACCENT,
    marginTop: SPACING * 0.5,
  },
  waterBtnDone: { backgroundColor: "#F0E8ED" },
  waterTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
  waterTxtDone: { color: ACCENT },

  nextWater: { fontSize: 11, color: MUTED, textAlign: "center" },
});
