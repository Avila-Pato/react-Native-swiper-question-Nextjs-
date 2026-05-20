import { SPACING } from "@/constants/constants";
import { ACCENT, BG, BORDER, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { NewsArticle } from "@/types/news";
import { useCallback, useEffect } from "react";
import { Dimensions, Image, Linking, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

const { height: SCREEN_H } = Dimensions.get("window");
const SHEET_H = SCREEN_H * 0.88;
const DISMISS_THRESHOLD = SHEET_H * 0.28;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Props = { article: NewsArticle; onClose: () => void };

export function NewsDetailSheet({ article, onClose }: Props) {
  const translateY = useSharedValue(SHEET_H);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 160, mass: 0.85 });
    backdropOpacity.value = withTiming(1, { duration: 220 });
  }, []);

  const dismiss = useCallback(() => {
    translateY.value = withTiming(
      SHEET_H,
      { duration: 460, easing: Easing.in(Easing.cubic) },
      () => runOnJS(onClose)()
    );
    backdropOpacity.value = withTiming(0, { duration: 440 });
  }, [onClose]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD || e.velocityY > 1200) {
        translateY.value = withTiming(
          SHEET_H,
          { duration: 460, easing: Easing.in(Easing.cubic) },
          () => runOnJS(onClose)()
        );
        backdropOpacity.value = withTiming(0, { duration: 440 });
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
            <GestureDetector gesture={panGesture}>
              <View style={s.handleArea}>
                <View style={s.handle} />
              </View>
            </GestureDetector>

            {article.urlToImage ? (
              <View style={s.heroWrap}>
                <Image source={{ uri: article.urlToImage }} style={s.heroImg} />
                <View style={s.heroOverlay} />
                <View style={s.sourceChip}>
                  <Text style={s.sourceText}>{article.source.name.toUpperCase()}</Text>
                </View>
              </View>
            ) : null}

            <Animated.ScrollView
              style={s.scroll}
              contentContainerStyle={s.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Text style={s.title}>{article.title}</Text>

              <View style={s.meta}>
                <View style={s.authorDot} />
                <Text style={s.metaText}>{article.author ?? article.source.name}</Text>
                <Text style={s.metaDivider}>·</Text>
                <Text style={s.metaText}>{formatDate(article.publishedAt)}</Text>
              </View>

              <View style={s.divider} />

              {article.description ? (
                <>
                  <Text style={s.sectionLabel}>Resumen</Text>
                  <Text style={s.body}>{article.description}</Text>
                  <View style={s.divider} />
                </>
              ) : null}

              <Pressable
                style={s.readBtn}
                onPress={() => Linking.openURL(article.url)}
              >
                <Text style={s.readBtnText}>Leer artículo completo →</Text>
              </Pressable>

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
  handleArea: { alignItems: "center", paddingVertical: 14 },
  handle: { width: 44, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB" },
  heroWrap: {
    height: 190,
    marginHorizontal: SPACING * 2,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 4,
  },
  heroImg: { ...StyleSheet.absoluteFillObject },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.22)" },
  sourceChip: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  sourceText: { color: "#FFF", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING * 2, paddingTop: SPACING * 1.5 },
  title: { fontSize: 20, fontWeight: "800", color: TEXT, lineHeight: 28, marginBottom: 12 },
  meta: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 },
  authorDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: ACCENT },
  metaText: { color: MUTED, fontSize: 12 },
  metaDivider: { color: MUTED, fontSize: 12 },
  divider: { height: 1, backgroundColor: BORDER, marginVertical: SPACING * 1.5 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  body: { fontSize: 14, color: TEXT, lineHeight: 22 },
  readBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  readBtnText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
});
