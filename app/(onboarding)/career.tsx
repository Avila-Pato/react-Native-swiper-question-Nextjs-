import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { GREEN, TEXT_FONT_SIZE } from "@/constants/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

const CAREERS = [
  {
    id: "sistemas",
    icon: "code-slash-outline" as const,
    label: "Sistemas / Informática",
    desc: "Tengo base técnica o estudio algo relacionado con tech",
    startNode: "intro_tecnico",
  },
  {
    id: "otra",
    icon: "compass-outline" as const,
    label: "Otra / Sin formación técnica",
    desc: "Me interesa la tecnología pero vengo de otro campo",
    startNode: "inicio_perdido",
  },
];

export default function CareerScreen() {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [startNode, setStartNode] = useState("inicio_perdido");
  const [formacion, setFormacion] = useState("");
  const [showForm, setShowForm] = useState(false);

  const formInputRef = useRef<TextInput>(null);

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);
  const card1Opacity = useSharedValue(0);
  const card1Y = useSharedValue(60);
  const card2Opacity = useSharedValue(0);
  const card2Y = useSharedValue(60);
  const formOpacity = useSharedValue(0);
  const formY = useSharedValue(30);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(24);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 400 });
    titleY.value = withSpring(0, { damping: 18, stiffness: 100 });
    card1Opacity.value = withDelay(200, withTiming(1, { duration: 350 }));
    card1Y.value = withDelay(
      200,
      withSpring(0, { damping: 16, stiffness: 100 }),
    );
    card2Opacity.value = withDelay(350, withTiming(1, { duration: 350 }));
    card2Y.value = withDelay(
      350,
      withSpring(0, { damping: 16, stiffness: 100 }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animateBtnIn = () => {
    btnOpacity.value = withTiming(1, { duration: 300 });
    btnY.value = withSpring(0, { damping: 16, stiffness: 130 });
  };

  const animateFormIn = () => {
    setShowForm(true);
    formOpacity.value = withTiming(1, { duration: 320 });
    formY.value = withSpring(0, { damping: 16, stiffness: 110 });
    setTimeout(() => formInputRef.current?.focus(), 380);
  };

  const animateFormOut = () => {
    formOpacity.value = withTiming(0, { duration: 220 });
    formY.value = withTiming(20, { duration: 220 });
    setTimeout(() => {
      setShowForm(false);
      setFormacion("");
    }, 230);
  };

  const handleCardPress = (id: string, node: string) => {
    if (selectedCareer === id) return;
    const wasOtra = selectedCareer === "otra";
    const isOtra = id === "otra";
    setSelectedCareer(id);
    setStartNode(node);
    if (!selectedCareer) animateBtnIn();
    if (isOtra && !wasOtra) animateFormIn();
    if (wasOtra && !isOtra) animateFormOut();
  };

  const handleNext = () => {
    if (!selectedCareer) return;
    if (selectedCareer === "otra" && !formacion.trim()) {
      formInputRef.current?.focus();
      return;
    }
    router.push({
      pathname: "/career-ramas",
      params: { startNode, formacion },
    });
  };

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const card1Style = useAnimatedStyle(() => ({
    opacity: card1Opacity.value,
    transform: [{ translateY: card1Y.value }],
  }));
  const card2Style = useAnimatedStyle(() => ({
    opacity: card2Opacity.value,
    transform: [{ translateY: card2Y.value }],
  }));
  const cardAnimStyles = [card1Style, card2Style];
  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formY.value }],
  }));
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
            Comencemos con unas preguntas de{"\n"}
            <Text style={{ color: GREEN }}>partida</Text>
          </Text>
          <Text style={styles.subtitle}>
            Personalizamos tu camino según tu perfil
          </Text>
        </Animated.View>

        <View style={styles.cards}>
          {CAREERS.map((career, i) => (
            <Animated.View key={career.id} style={cardAnimStyles[i]}>
              <TouchableOpacity
                style={[
                  styles.card,
                  selectedCareer === career.id && styles.cardSelected,
                ]}
                onPress={() => handleCardPress(career.id, career.startNode)}
                activeOpacity={0.78}
              >
                <View
                  style={[
                    styles.cardIcon,
                    selectedCareer === career.id && styles.cardIconSelected,
                  ]}
                >
                  <Ionicons name={career.icon} size={30} color={GREEN} />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardLabel}>{career.label}</Text>
                  <Text style={styles.cardDesc}>{career.desc}</Text>
                </View>
                <Ionicons
                  name={
                    selectedCareer === career.id
                      ? "checkmark-circle"
                      : "chevron-forward"
                  }
                  size={20}
                  color={
                    selectedCareer === career.id
                      ? GREEN
                      : "rgba(255,255,255,0.25)"
                  }
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Input formación anterior — anima entrada y salida */}
        {showForm && (
          <Animated.View style={[styles.panel, formStyle]}>
            <Text style={styles.panelLabel}>
              ¿Cuál es tu formación anterior?
            </Text>
            <TextInput
              ref={formInputRef}
              style={styles.input}
              placeholder="Ej: Administración, Diseño, Derecho..."
              placeholderTextColor="rgba(255,255,255,0.28)"
              value={formacion}
              onChangeText={setFormacion}
              returnKeyType="done"
              onSubmitEditing={handleNext}
            />
          </Animated.View>
        )}

        {/* Botón siguiente — aparece al elegir cualquier opción */}
        <Animated.View style={[styles.btnWrapper, btnStyle]}>
          <TouchableOpacity
            style={[
              styles.btn,
              selectedCareer === "otra" &&
                !formacion.trim() &&
                styles.btnDisabled,
            ]}
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
  flex: {
    flex: 1,
    backgroundColor: "#111120",
  },
  scroll: {
    paddingHorizontal: 28,
    paddingVertical: 64,
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    marginBottom: 36,
  },
  title: {
    color: "white",
    fontSize: TEXT_FONT_SIZE,
    fontWeight: "800",
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    textAlign: "center",
  },
  cards: {
    gap: 14,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 14,
  },
  cardSelected: {
    borderColor: GREEN,
    backgroundColor: "rgba(52,213,154,0.07)",
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(52,213,154,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconSelected: {
    backgroundColor: "rgba(52,213,154,0.22)",
  },
  cardText: {
    flex: 1,
  },
  cardLabel: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  cardDesc: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "400",
  },
  panel: {
    marginTop: 26,
  },
  panelLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "white",
    fontSize: 15,
    marginBottom: 14,
  },
  btnWrapper: {
    marginTop: 24,
  },
  btn: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.35,
  },
  btnText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
