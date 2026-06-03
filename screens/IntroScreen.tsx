import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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
    title: "Basada en los libros\nmás reconocidos",
    subtitle:
      "Cada reto y herramienta está inspirado en estudios de autores referentes en psicología y bienestar.",
    visual: "books" as const,
  },
  {
    key: "personalize",
    title: "Reflexiona sobre tus\nnecesidades",
    subtitle:
      "Para que podamos entenderte mejor y crear tu programa personal de bienestar.",
    visual: "areas" as const,
  },
  {
    key: "ready",
    title: "¡Bienvenido/a\na Lumina!",
    subtitle: "Un camino diseñado para ti, a tu ritmo, desde adentro.",
    visual: "glow" as const,
  },
];

const BOOKS = [
  { src: require("@/assets/portada/1_book.jpg"),  author: "Amir Levine"  },
  { src: require("@/assets/portada/2_book.jpg"),  author: "Brené Brown"  },
  { src: require("@/assets/portada/3_book.jpg"),  author: "Nedra Tawwab" },
  { src: require("@/assets/portada/5_book.jpeg"), author: "Walter Riso"  },
  { src: require("@/assets/portada/6_book.jpeg"), author: "James Allen"  },
  { src: require("@/assets/portada/7_book.jpeg"), author: "Esther Perel" },
];

const AREAS = [
  { icon: "heart" as const,            label: "Emociones",   tag: "Siente más",      color: "#C45E7A", bg: "#FFF0F5", img: require("@/assets/abstracts/Group-1.png")  },
  { icon: "people" as const,           label: "Relaciones",  tag: "Conecta mejor",   color: "#7B68BF", bg: "#F4EEFA", img: require("@/assets/abstracts/Group-3.png")  },
  { icon: "shield-checkmark" as const, label: "Límites",     tag: "Protégete",       color: "#4A80C4", bg: "#EAF4FF", img: require("@/assets/abstracts/Group-5.png")  },
  { icon: "star" as const,             label: "Autoestima",  tag: "Cree en ti",      color: "#C49030", bg: "#FFFAEC", img: require("@/assets/abstracts/Group-7.png")  },
  { icon: "flash" as const,            label: "Estrés",      tag: "Encuentra calma", color: "#C46030", bg: "#FFF4EE", img: require("@/assets/abstracts/Group-9.png")  },
  { icon: "moon" as const,             label: "Mindfulness", tag: "Vive el momento", color: "#3B9A5A", bg: "#EEF7F1", img: require("@/assets/abstracts/Group-11.png") },
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

  // Animaciones para slide "glow"
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const star1Anim  = useRef(new Animated.Value(1)).current;
  const star2Anim  = useRef(new Animated.Value(1)).current;
  const star3Anim  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrada suave al abrir la pantalla
    Animated.parallel([
      Animated.timing(slideOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(mountY, { toValue: 0, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
    runSlide(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Pulso del anillo exterior
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.14, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1,    duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();

    // Bounce del logo: sube y baja suavemente
    Animated.loop(Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 0.94, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 1,    duration: 500, easing: Easing.out(Easing.back(3)), useNativeDriver: true }),
      Animated.delay(900),
    ])).start();

    // Estrellas: destellan en momentos distintos
    const starLoop = (anim: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1.5, duration: 350, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1,   duration: 350, easing: Easing.in(Easing.quad),  useNativeDriver: true }),
        Animated.delay(2000),
      ])).start();

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
      // Sale hacia la izquierda + fade out
      Animated.parallel([
        Animated.timing(slideOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideX, { toValue: -W * 0.28, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start(() => {
        slideOpacity.setValue(0);
        slideX.setValue(W * 0.28); // nuevo contenido entra desde la derecha
        setCurrent(idx + 1);
        runSlide(idx + 1, 0);
        requestAnimationFrame(() => {
          // Entra desde la derecha + fade in
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

  const bubbleAnims = useMemo(
    () => BUBBLES.map(() => new Animated.Value(0)),
    [],
  );

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
      {/* Burbujas flotantes */}
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
              transform: [{
                translateY: bubbleAnims[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              }],
            },
          ]}
        />
      ))}

      {/* Progress bar */}
      <View style={s.progressRow}>
        {SLIDES.map((_, i) => (
          <View key={i} style={s.progressTrack}>
            {i < current && (
              <View style={[s.progressFill, { width: "100%" }]} />
            )}
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

      {/* Tap = avanza, Hold = pausa */}
      <Pressable style={s.touchArea} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={[s.content, { opacity: slideOpacity, transform: [{ translateX: slideX }, { translateY: mountY }] }]}>

          <Text style={s.title}>{slide.title}</Text>
          <Text style={s.subtitle}>{slide.subtitle}</Text>

          {/* Pills justo debajo del texto en slide glow */}
          {slide.visual === "glow" && (
            <View style={[s.pillsRow, { marginTop: 16 }]}>
              {["Bienestar", "Crecimiento", "Reflexión"].map((tag) => (
                <View key={tag} style={s.pill}>
                  <Text style={s.pillText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Anillos + logo abajo */}
          {slide.visual === "glow" && (
            <View style={s.ringContainer}>
              <Animated.View style={[s.glowOuter, { transform: [{ scale: pulseAnim }] }]} />
              <View style={s.glowMid} />
              <Animated.View style={[s.logoWrap, { transform: [{ scale: bounceAnim }] }]}>
                <Image source={require("@/assets/logo.png")} style={s.glowLogo} contentFit="contain" />
                <Animated.View style={[s.star, s.star1, { transform: [{ scale: star1Anim }] }]}>
                  <Ionicons name="star" size={18} color="#8980B8" />
                </Animated.View>
                <Animated.View style={[s.star, s.star2, { transform: [{ scale: star2Anim }] }]}>
                  <Ionicons name="star" size={12} color="#C9C3E8" />
                </Animated.View>
                <Animated.View style={[s.star, s.star3, { transform: [{ scale: star3Anim }] }]}>
                  <Ionicons name="star" size={22} color="#5B3FA6" />
                </Animated.View>
              </Animated.View>
            </View>
          )}

          {/* Visual: portadas de libros */}
          {slide.visual === "books" && (
            <View style={s.booksSection}>
              <View style={s.booksGrid}>
                {BOOKS.map((book, i) => (
                  <View key={i} style={s.bookItem}>
                    <Image source={book.src} style={s.bookCover} contentFit="cover" priority="high" />
                    <Text style={s.authorName} numberOfLines={2}>{book.author}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Visual: áreas de bienestar — dos columnas escalonadas */}
          {slide.visual === "areas" && (
            <View style={s.areasGrid}>
              <View style={s.areasCol}>
                {AREAS.slice(0, 3).map((area, i) => (
                  <View key={i} style={[s.areaCardV2, { backgroundColor: area.bg }]}>
                    <Image source={area.img} style={s.areaAbstract} contentFit="contain" />
                    <View style={[s.areaIconCircle, { backgroundColor: area.color + "25" }]}>
                      <Ionicons name={area.icon} size={22} color={area.color} />
                    </View>
                    <Text style={[s.areaNameV2, { color: area.color }]}>{area.label}</Text>
                    <Text style={s.areaTagV2}>{area.tag}</Text>
                  </View>
                ))}
              </View>
              <View style={[s.areasCol, { marginTop: 28 }]}>
                {AREAS.slice(3, 6).map((area, i) => (
                  <View key={i} style={[s.areaCardV2, { backgroundColor: area.bg }]}>
                    <Image source={area.img} style={s.areaAbstract} contentFit="contain" />
                    <View style={[s.areaIconCircle, { backgroundColor: area.color + "25" }]}>
                      <Ionicons name={area.icon} size={22} color={area.color} />
                    </View>
                    <Text style={[s.areaNameV2, { color: area.color }]}>{area.label}</Text>
                    <Text style={s.areaTagV2}>{area.tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Animated.View>
      </Pressable>

      {/* Acento decorativo abajo */}
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

  // Books
  booksSection: { marginTop: 32, width: "100%" },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
  },
  bookItem: { alignItems: "center", width: 72, gap: 6 },
  bookCover: {
    width: 72,
    height: 100,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  authorName: {
    fontSize: 9,
    color: "rgba(28,27,41,0.55)",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 13,
  },

  // Areas — dos columnas escalonadas
  areasGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
    paddingHorizontal: 4,
  },
  areasCol: {
    flex: 1,
    gap: 10,
  },
  areaCardV2: {
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 6,
    overflow: "hidden",
  },
  areaIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  areaNameV2: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 2,
  },
  areaTagV2: {
    fontSize: 10,
    color: "rgba(28,27,41,0.45)",
    fontWeight: "500",
  },
  areaAbstract: {
    position: "absolute",
    width: 70,
    height: 70,
    right: -8,
    top: -8,
    opacity: 0.35,
  },

  // Glow / Bienvenida
  glowSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  ringContainer: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  glowOuter: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(137,128,184,0.08)",
  },
  glowMid: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(137,128,184,0.12)",
  },
  logoWrap: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  glowLogo: {
    width: 130,
    height: 130,
  },
  star: {
    position: "absolute",
  },
  star1: { top: -8,  right: -4  },
  star2: { top: 20,  left: -16  },
  star3: { bottom: 0, right: -12 },
  glowLabel: {
    fontSize: 36,
    fontWeight: "800",
    color: "#8980B8",
    letterSpacing: -1,
    marginBottom: 20,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    backgroundColor: "rgba(137,128,184,0.12)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.2)",
  },
  pillText: {
    fontSize: 12,
    color: "#8980B8",
    fontWeight: "600",
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
