import { IntroVisualAreas } from "@/components/intro/IntroVisualAreas";
import { IntroVisualBooks } from "@/components/intro/IntroVisualBooks";
import { IntroVisualGlow } from "@/components/intro/IntroVisualGlow";
import { IntroVisualMoment } from "@/components/intro/IntroVisualMoment";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

const BUBBLES = [
  { size: 120, x: -30, y: 60, opacity: 0.18, duration: 6000 },
  { size: 80, x: W - 60, y: 100, opacity: 0.14, duration: 7500 },
  { size: 50, x: 40, y: H * 0.4, opacity: 0.12, duration: 5500 },
  { size: 90, x: W - 80, y: H * 0.5, opacity: 0.1, duration: 8000 },
  { size: 40, x: W / 2, y: H * 0.7, opacity: 0.15, duration: 6500 },
  { size: 60, x: 20, y: H * 0.8, opacity: 0.1, duration: 7000 },
];

const SLIDES = [
  {
    key: "books",
    title: "Respaldada en algunos de los libros\nmás populares del mundo",
    subtitle: "Cada reto y herramienta está inspirado en estudios de autores referentes en psicología y bienestar.",
    visual: "books" as const,
  },
  {
    key: "personalize",
    title: "Reflexiona sobre tus\nnecesidades",
    subtitle: "Para que podamos entenderte mejor y crear tu programa personal de bienestar.",
    visual: "areas" as const,
  },
  {
    key: "moment",
    title: "Actúa y piensa\nen el momento",
    subtitle: "Lumina te guía con herramientas prácticas para cada situación de tu día a día.",
    visual: "moment" as const,
  },
  {
    key: "ready",
    title: "¡Bienvenido/a\na Lumina!",
    subtitle: "Un camino diseñado para ti, a tu ritmo, desde adentro.",
    visual: "glow" as const,
  },
];

const SLIDE_DURATION = 5000;

export default function IntroScreen() {
  const [current, setCurrent] = useState(0);
  const progressAnims = useRef(SLIDES.map(() => new Animated.Value(0))).current;
  const slideOpacity = useRef(new Animated.Value(0)).current;
  const mountY = useRef(new Animated.Value(24)).current;
  const currentIdx = useRef(0);
  const savedProgress = useRef(0);
  const pressStartTime = useRef(0);
  const slideX = useRef(new Animated.Value(0)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const star1Anim = useRef(new Animated.Value(1)).current;
  const star2Anim = useRef(new Animated.Value(1)).current;
  const star3Anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(mountY, {
        toValue: 0,
        duration: 550,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
    runSlide(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.14, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 0.94, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.back(3)), useNativeDriver: true }),
        Animated.delay(900),
      ]),
    ).start();

    const starLoop = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1.5, duration: 350, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1, duration: 350, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.delay(2000),
        ]),
      ).start();

    starLoop(star1Anim, 0);
    starLoop(star2Anim, 600);
    starLoop(star3Anim, 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runSlide(idx: number, fromValue: number) {
    currentIdx.current = idx;
    progressAnims[idx].setValue(fromValue);
    const remaining = SLIDE_DURATION * (1 - fromValue);
    Animated.timing(progressAnims[idx], {
      toValue: 1,
      duration: remaining,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return;
      advanceSlide(idx);
    });
  }

  function advanceSlide(idx: number) {
    if (idx < SLIDES.length - 1) {
      Animated.parallel([
        Animated.timing(slideOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideX, { toValue: -W * 0.28, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start(() => {
        slideOpacity.setValue(0);
        slideX.setValue(W * 0.28);
        setCurrent(idx + 1);
        runSlide(idx + 1, 0);
        requestAnimationFrame(() => {
          Animated.parallel([
            Animated.timing(slideOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(slideX, { toValue: 0, duration: 340, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          ]).start();
        });
      });
    } else {
      router.replace("/(onboarding)/career" as any);
    }
  }

  function handlePressIn() {
    pressStartTime.current = Date.now();
    progressAnims[currentIdx.current].stopAnimation((value) => {
      savedProgress.current = value;
    });
  }

  function handlePressOut() {
    const held = Date.now() - pressStartTime.current;
    if (held < 200) {
      advanceSlide(currentIdx.current);
    } else {
      runSlide(currentIdx.current, savedProgress.current);
    }
  }

  const slide = SLIDES[current];

  const bubbleAnims = useMemo(() => BUBBLES.map(() => new Animated.Value(0)), []);

  useEffect(() => {
    bubbleAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: BUBBLES[i].duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: BUBBLES[i].duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ).start();
    });
  }, [bubbleAnims]);

  return (
    <LinearGradient
      colors={["#FAF8F5", "#F0EDF8", "#FAF8F5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.root}
    >
      {BUBBLES.map((b, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={[
            s.bubble,
            {
              width: b.size,
              height: b.size,
              borderRadius: b.size / 2,
              left: b.x,
              top: b.y,
              opacity: b.opacity,
              transform: [
                {
                  translateY: bubbleAnims[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      <View style={s.progressRow}>
        {SLIDES.map((_, i) => (
          <View key={i} style={s.progressTrack}>
            {i < current && <View style={[s.progressFill, { width: "100%" }]} />}
            {i === current && (
              <Animated.View
                style={[
                  s.progressFill,
                  {
                    width: progressAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>

      <Pressable
        style={s.touchArea}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            s.content,
            {
              opacity: slideOpacity,
              transform: [{ translateX: slideX }, { translateY: mountY }],
            },
          ]}
        >
          <Text style={s.title}>{slide.title}</Text>
          <Text style={s.subtitle}>{slide.subtitle}</Text>

          {slide.visual === "glow" && (
            <IntroVisualGlow
              pulseAnim={pulseAnim}
              bounceAnim={bounceAnim}
              star1Anim={star1Anim}
              star2Anim={star2Anim}
              star3Anim={star3Anim}
            />
          )}
          {slide.visual === "books" && <IntroVisualBooks />}
          {slide.visual === "areas" && <IntroVisualAreas />}
          {slide.visual === "moment" && <IntroVisualMoment />}
        </Animated.View>
      </Pressable>

      <View style={s.waveContainer} pointerEvents="none">
        <View style={s.wave} />
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  progressRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 56,
    gap: 6,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(137,128,184,0.2)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8980B8",
    borderRadius: 2,
  },
  bubble: {
    position: "absolute",
    backgroundColor: "rgba(137,128,184,0.12)",
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.18)",
  },
  touchArea: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 48,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1B29",
    textAlign: "center",
    letterSpacing: -0.8,
    lineHeight: 36,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(28,27,41,0.6)",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400",
    maxWidth: 300,
  },
  waveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    overflow: "hidden",
  },
  wave: {
    position: "absolute",
    bottom: -60,
    left: -40,
    right: -40,
    height: 160,
    backgroundColor: "rgba(137,128,184,0.08)",
    borderRadius: 999,
  },
});
