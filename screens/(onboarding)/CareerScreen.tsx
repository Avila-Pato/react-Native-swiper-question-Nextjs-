import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { TEXT_FONT_SIZE } from "@/constants/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const GOALS = [
  {
    id: "crecimiento",
    icon: "leaf-outline" as const,
    label: "Conocerme mejor",
    desc: "Quiero entender mis emociones y crecer como persona",
    startNode: "crecimiento_personal",
  },
  {
    id: "relaciones",
    icon: "people-outline" as const,
    label: "Mejorar mis relaciones",
    desc: "Quiero trabajar mis vínculos, límites y comunicación",
    startNode: "relaciones_vinculos",
  },
  {
    id: "equilibrio",
    icon: "sunny-outline" as const,
    label: "Encontrar equilibrio",
    desc: "Quiero reducir el estrés y cuidar mi bienestar diario",
    startNode: "equilibrio_bienestar",
  },
];

export default function GoalScreen() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [startNode, setStartNode] = useState("crecimiento_personal");

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);
  const card1Opacity = useSharedValue(0);
  const card1Y = useSharedValue(60);
  const card2Opacity = useSharedValue(0);
  const card2Y = useSharedValue(60);
  const card3Opacity = useSharedValue(0);
  const card3Y = useSharedValue(60);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(24);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 400 });
    titleY.value = withSpring(0, { damping: 18, stiffness: 100 });
    card1Opacity.value = withDelay(200, withTiming(1, { duration: 350 }));
    card1Y.value = withDelay(200, withSpring(0, { damping: 16, stiffness: 100 }));
    card2Opacity.value = withDelay(320, withTiming(1, { duration: 350 }));
    card2Y.value = withDelay(320, withSpring(0, { damping: 16, stiffness: 100 }));
    card3Opacity.value = withDelay(440, withTiming(1, { duration: 350 }));
    card3Y.value = withDelay(440, withSpring(0, { damping: 16, stiffness: 100 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animateBtnIn = () => {
    btnOpacity.value = withTiming(1, { duration: 300 });
    btnY.value = withSpring(0, { damping: 16, stiffness: 130 });
  };

  const handleCardPress = (id: string, node: string) => {
    if (selectedGoal === id) return;
    setSelectedGoal(id);
    setStartNode(node);
    if (!selectedGoal) animateBtnIn();
  };

  const handleNext = () => {
    if (!selectedGoal) return;
    router.push({ pathname: "/career-ramas", params: { startNode, formacion: "" } });
  };

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const cardAnimStyles = [
    useAnimatedStyle(() => ({ opacity: card1Opacity.value, transform: [{ translateY: card1Y.value }] })),
    useAnimatedStyle(() => ({ opacity: card2Opacity.value, transform: [{ translateY: card2Y.value }] })),
    useAnimatedStyle(() => ({ opacity: card3Opacity.value, transform: [{ translateY: card3Y.value }] })),
  ];
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnY.value }],
  }));

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <OnboardingProgress step={1} />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, titleStyle]}>
          <Text style={styles.title}>
            ¿Qué te{"\n"}
            <Text style={{ color: "#8980B8" }}>trae aquí?</Text>
          </Text>
          <Text style={styles.subtitle}>
            Personalizamos tu camino según tus necesidades
          </Text>
        </Animated.View>

        <View style={styles.cards}>
          {GOALS.map((goal, i) => (
            <Animated.View key={goal.id} style={cardAnimStyles[i]}>
              <TouchableOpacity
                style={[
                  styles.card,
                  selectedGoal === goal.id && styles.cardSelected,
                ]}
                onPress={() => handleCardPress(goal.id, goal.startNode)}
                activeOpacity={0.78}
              >
                <View
                  style={[
                    styles.cardIcon,
                    selectedGoal === goal.id && styles.cardIconSelected,
                  ]}
                >
                  <Ionicons name={goal.icon} size={22} color="#8980B8" />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardLabel}>{goal.label}</Text>
                  <Text style={styles.cardDesc}>{goal.desc}</Text>
                </View>
                <Ionicons
                  name={selectedGoal === goal.id ? "checkmark-circle" : "chevron-forward"}
                  size={20}
                  color={selectedGoal === goal.id ? "#8980B8" : "rgba(137,128,184,0.3)"}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View style={[styles.btnWrapper, btnStyle]}>
          <TouchableOpacity
            style={styles.btn}
            onPress={handleNext}
            activeOpacity={0.82}
          >
            <Text style={styles.btnText}>Siguiente →</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#FAF8F5" },
  scroll: {
    paddingHorizontal: 28,
    paddingVertical: 40,
    flexGrow: 1,
    justifyContent: "center",
  },
  header: { marginBottom: 24 },
  title: {
    color: "#1C1B29",
    fontSize: TEXT_FONT_SIZE,
    fontWeight: "700",
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#8A8A9A",
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    textAlign: "center",
  },
  cards: { gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F2FB",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.2)",
    gap: 12,
  },
  cardSelected: {
    borderColor: "#8980B8",
    backgroundColor: "rgba(137,128,184,0.06)",
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(137,128,184,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconSelected: { backgroundColor: "rgba(137,128,184,0.18)" },
  cardText: { flex: 1 },
  cardLabel: {
    color: "#1C1B29",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  cardDesc: {
    color: "#8A8A9A",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
  },
  btnWrapper: { marginTop: 16 },
  btn: {
    backgroundColor: "#8980B8",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});



