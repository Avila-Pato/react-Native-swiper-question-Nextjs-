import { SPACING } from "@/constants/constants";
import { ACCENT, BG, BORDER, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { CareerItem } from "@/types/explore";
import { useCallback, useEffect, useRef } from "react";
import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

const { height: SCREEN_H } = Dimensions.get("window");
const SHEET_H = SCREEN_H * 0.90;
const DISMISS_THRESHOLD = SHEET_H * 0.30;

const SKILLS = [
  "Trabajo en equipo",
  "Resolucion de problemas",
  "Comunicacion efectiva",
  "Aprendizaje continuo",
  "Adaptabilidad",
];
const STEPS = [
  "Aprende los fundamentos del area",
  "Construye proyectos practicos",
  "Obten tu primera certificacion",
  "Aplica a roles junior",
  "Crece hacia roles senior",
];

type Props = { item: CareerItem; onClose: () => void };

export function CareerSheet({ item, onClose }: Props) {
  const translateY = useSharedValue(SHEET_H);
  const backdropOpacity = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 160, mass: 0.85 });
    backdropOpacity.value = withTiming(1, { duration: 220 });
  }, []);

  const dismiss = useCallback(() => {
    translateY.value = withTiming(
      SHEET_H,
      { duration: 480, easing: Easing.in(Easing.cubic) },
      () => runOnJS(onClose)()
    );
    backdropOpacity.value = withTiming(0, { duration: 460 });
  }, [onClose]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD || e.velocityY > 1200) {
        translateY.value = withTiming(
          SHEET_H,
          { duration: 480, easing: Easing.in(Easing.cubic) },
          () => runOnJS(onClose)()
        );
        backdropOpacity.value = withTiming(0, { duration: 460 });
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 160, mass: 0.85 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Modal transparent visible animationType="none" onRequestClose={dismiss}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={s.root}>
          <Animated.View style={[s.backdrop, backdropStyle]}>
            <Pressable style={StyleSheet.absoluteFillObject} onPress={dismiss} />
          </Animated.View>

          <Animated.View style={[s.sheet, sheetStyle]}>
            <GestureDetector gesture={handleGesture}>
              <View style={s.handleArea}>
                <View style={s.handle} />
              </View>
            </GestureDetector>

            <View style={s.heroWrap}>
              <Image source={{ uri: item.image }} style={s.heroImg} />
              <View style={s.heroOverlay} />
            </View>

            <Animated.ScrollView
              ref={scrollRef}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              style={s.scroll}
              contentContainerStyle={s.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={[s.tag, { backgroundColor: item.tagColor + "22" }]}>
                <Text style={[s.tagText, { color: item.tagColor }]}>{item.tag}</Text>
              </View>
              <Text style={s.title}>{item.title}</Text>
              <Text style={s.meta}>{item.meta}</Text>

              <View style={s.divider} />

              <Text style={s.sectionLabel}>Sobre el rol</Text>
              <Text style={s.body}>{item.desc}</Text>
              <Text style={s.body}>
                Este rol es uno de los mas buscados en el mercado tech. Combina conocimientos solidos con adaptacion a entornos agiles y equipos multidisciplinarios.
              </Text>

              <View style={s.divider} />

              <Text style={s.sectionLabel}>Habilidades clave</Text>
              <View style={s.skillsWrap}>
                {SKILLS.map((sk) => (
                  <View key={sk} style={s.skill}>
                    <Text style={s.skillText}>{sk}</Text>
                  </View>
                ))}
              </View>

              <View style={s.divider} />

              <Text style={s.sectionLabel}>Ruta de aprendizaje</Text>
              {STEPS.map((step, i) => (
                <View key={i} style={s.stepRow}>
                  <View style={s.stepNum}>
                    <Text style={s.stepNumText}>{i + 1}</Text>
                  </View>
                  <Text style={s.stepText}>{step}</Text>
                </View>
              ))}

              <View style={{ height: 32 }} />
            </Animated.ScrollView>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.52)" },
  sheet: {
    height: SHEET_H,
    backgroundColor: BG,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  handleArea: { alignItems: "center", paddingVertical: 16 },
  handle: { width: 44, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB" },
  heroWrap: {
    height: 175,
    marginHorizontal: SPACING * 2,
    borderRadius: 18,
    overflow: "hidden",
  },
  heroImg: { ...StyleSheet.absoluteFillObject },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING * 2, paddingTop: SPACING * 1.5 },
  tag: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },
  tagText: { fontSize: 12, fontWeight: "700" },
  title: { fontSize: 22, fontWeight: "800", color: TEXT, lineHeight: 30, marginBottom: 4 },
  meta: { fontSize: 13, color: ACCENT, fontWeight: "600" },
  divider: { height: 1, backgroundColor: BORDER, marginVertical: SPACING * 1.5 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  body: { fontSize: 14, color: TEXT, lineHeight: 22, marginBottom: 8 },
  skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skill: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: BORDER,
  },
  skillText: { color: TEXT, fontSize: 12, fontWeight: "600" },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ACCENT + "22",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ACCENT,
    flexShrink: 0,
  },
  stepNumText: { color: ACCENT, fontSize: 12, fontWeight: "800" },
  stepText: { flex: 1, fontSize: 13, color: TEXT, lineHeight: 20, paddingTop: 3 },
});
