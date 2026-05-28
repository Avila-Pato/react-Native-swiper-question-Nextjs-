import { SPACING } from "@/constants/constants";
import { BG, MUTED, P_TEAL, TEXT } from "@/constants/theme";
import { CONCEPT_GROUPS } from "@/data/languageQuestions";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_H } = Dimensions.get("window");
const SHEET_H = SCREEN_H * 0.75;
const DISMISS_THRESHOLD = SHEET_H * 0.25;

type Props = {
  onConfirm: (concepts: string[]) => void;
  onClose: () => void;
};

export function ConceptPickerSheet({ onConfirm, onClose }: Props) {
  const translateY = useSharedValue(SHEET_H);
  const backdropOpacity = useSharedValue(0);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 160, mass: 0.85 });
    backdropOpacity.value = withTiming(1, { duration: 220 });
  }, []);

  const dismiss = useCallback(
    (callback: () => void) => {
      translateY.value = withTiming(
        SHEET_H,
        { duration: 380, easing: Easing.in(Easing.cubic) },
        () => runOnJS(callback)(),
      );
      backdropOpacity.value = withTiming(0, { duration: 360 });
    },
    [],
  );

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD || e.velocityY > 1200) {
        runOnJS(dismiss)(onClose);
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  function toggle(concept: string) {
    setSelected((prev) =>
      prev.includes(concept) ? prev.filter((c) => c !== concept) : [...prev, concept],
    );
  }

  function handleConfirm() {
    dismiss(() => onConfirm(selected));
  }

  return (
    <Modal transparent animationType="none" onRequestClose={() => dismiss(onClose)}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={{ flex: 1 }} onPress={() => dismiss(onClose)} />
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, sheetStyle]}>
            {/* Handle */}
            <View style={styles.handle} />

            <Text style={styles.title}>¿Qué áreas quieres explorar?</Text>
            <Text style={styles.subtitle}>
              Elige los temas que más te interesan y las preguntas serán sobre esos
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scroll}
            >
              {CONCEPT_GROUPS.map((group) => (
                <View key={group.label} style={styles.group}>
                  <Text style={styles.groupLabel}>{group.label}</Text>
                  <View style={styles.chips}>
                    {group.items.map((concept) => {
                      const active = selected.includes(concept);
                      return (
                        <Pressable
                          key={concept}
                          style={[styles.chip, active && styles.chipActive]}
                          onPress={() => toggle(concept)}
                        >
                          <Text
                            style={[styles.chipText, active && styles.chipTextActive]}
                          >
                            {concept}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.btn,
                  selected.length < 1 && styles.btnDisabled,
                ]}
                onPress={handleConfirm}
                disabled={selected.length < 1}
              >
                <Text style={styles.btnText}>
                  {selected.length < 1
                    ? "Elige al menos un área"
                    : `Explorar ${selected.length} área${selected.length > 1 ? "s" : ""} →`}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_H,
    backgroundColor: BG,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: SPACING * 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.5,
    marginBottom: SPACING * 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 19,
    marginBottom: SPACING * 2,
  },
  scroll: {
    paddingBottom: SPACING * 2,
    gap: SPACING * 2,
  },
  group: {
    gap: SPACING,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING * 0.8,
  },
  chip: {
    paddingHorizontal: SPACING * 1.4,
    paddingVertical: SPACING * 0.7,
    borderRadius: 100,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  chipActive: {
    backgroundColor: P_TEAL.bg,
    borderColor: P_TEAL.fg,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: MUTED,
  },
  chipTextActive: {
    color: P_TEAL.fg,
  },
  footer: {
    paddingVertical: SPACING * 1.5,
    paddingBottom: SPACING * 3,
  },
  btn: {
    backgroundColor: P_TEAL.fg,
    borderRadius: 16,
    paddingVertical: SPACING * 1.7,
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: "#E5E7EB",
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
