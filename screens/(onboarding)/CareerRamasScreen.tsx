import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { TEXT_FONT_SIZE } from "@/constants/constants";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const RAMAS = [
  {
    id: "emociones",
    icon: "heart-outline" as const,
    label: "Emociones",
    desc: "Entender y gestionar lo que siento cada día",
  },
  {
    id: "limites",
    icon: "shield-outline" as const,
    label: "Límites",
    desc: "Aprender a decir no y cuidar mi energía",
  },
  {
    id: "relaciones",
    icon: "people-outline" as const,
    label: "Relaciones",
    desc: "Mejorar mis vínculos y comunicación con otros",
  },
  {
    id: "autoestima",
    icon: "star-outline" as const,
    label: "Autoestima",
    desc: "Fortalecer mi relación conmigo mismo",
  },
  {
    id: "estres",
    icon: "flash-outline" as const,
    label: "Estrés y ansiedad",
    desc: "Herramientas para calmarme y recuperar la paz",
  },
  {
    id: "mindfulness",
    icon: "moon-outline" as const,
    label: "Mindfulness",
    desc: "Vivir más en el presente y cultivar la calma interior",
  },
  {
    id: "proposito",
    icon: "compass-outline" as const,
    label: "Propósito",
    desc: "Encontrar dirección y sentido en mi vida cotidiana",
  },
  {
    id: "comunicacion",
    icon: "chatbubbles-outline" as const,
    label: "Comunicación",
    desc: "Expresarme mejor y conectar de forma auténtica",
  },
];

function RamaRow({
  icon,
  label,
  desc,
  active,
  suggested,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  desc: string;
  active: boolean;
  suggested: boolean;
  onPress: () => void;
}) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 260 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const rowStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(137,128,184,${0.065 * progress.value})`,
  }));

  const borderStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(137,128,184,0.15)", "#8980B8"],
    ),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: 0.28 + 0.72 * progress.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.6 + 0.4 * progress.value }],
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.65}>
      <Animated.View style={[styles.row, rowStyle]}>
        <Animated.View style={[styles.rowBorder, borderStyle]} />
        <Animated.View style={iconStyle}>
          <Ionicons name={icon} size={20} color="#8980B8" />
        </Animated.View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={[styles.rowLabel, active && styles.rowLabelActive]}>
              {label}
            </Text>
            {suggested && !active && (
              <View style={styles.suggestedBadge}>
                <Text style={styles.suggestedText}>Para ti</Text>
              </View>
            )}
          </View>
          <Text style={styles.rowDesc}>{desc}</Text>
        </View>
        <Animated.View style={checkStyle}>
          <Ionicons name="checkmark" size={20} color="#8980B8" />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

function CustomTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSpring(1, { damping: 12, stiffness: 220 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={styles.customTag}
        onPress={onRemove}
        activeOpacity={0.75}
      >
        <Text style={styles.customTagText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const GOAL_TO_AREAS: Record<string, string[]> = {
  crecimiento: ["emociones", "autoestima"],
  relaciones:  ["relaciones", "comunicacion", "limites"],
  equilibrio:  ["estres", "mindfulness"],
  autoestima:  ["autoestima", "emociones"],
  sanacion:    ["emociones", "mindfulness"],
};

export default function CareerRamasScreen() {
  const { startNode, formacion } = useLocalSearchParams<{
    startNode?: string;
    formacion?: string;
  }>();

  const suggested = useMemo(() => {
    const goals = formacion?.split(",").filter(Boolean) ?? [];
    const areas = goals.flatMap((g) => GOAL_TO_AREAS[g] ?? []);
    return new Set(areas);
  }, [formacion]);

  const [selectedRamas, setSelectedRamas] = useState<string[]>([]);
  const [customRamas, setCustomRamas] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [otraInput, setOtraInput] = useState("");

  const otraInputRef = useRef<TextInput>(null);

  const totalSelected = selectedRamas.length + customRamas.length;

  // Contador grande
  const counterScale = useSharedValue(1);
  const counterOpacity = useSharedValue(0.15);

  useEffect(() => {
    if (totalSelected === 0) {
      counterOpacity.value = withTiming(0.15, { duration: 200 });
      return;
    }
    counterOpacity.value = withTiming(1, { duration: 200 });
    counterScale.value = withSequence(
      withSpring(1.22, { damping: 6, stiffness: 320 }),
      withSpring(1, { damping: 14, stiffness: 200 }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSelected]);

  // Entrada general
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(24);
  const listOpacity = useSharedValue(0);
  const listY = useSharedValue(32);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 400 });
    titleY.value = withSpring(0, { damping: 18, stiffness: 100 });
    listOpacity.value = withTiming(1, { duration: 520 });
    listY.value = withSpring(0, { damping: 16, stiffness: 90 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const listStyle = useAnimatedStyle(() => ({
    opacity: listOpacity.value,
    transform: [{ translateY: listY.value }],
  }));

  const toggleRama = (id: string) => {
    setSelectedRamas((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const handleOtraPress = () => {
    setShowModal(true);
    setTimeout(() => otraInputRef.current?.focus(), 200);
  };

  const confirmOtraRama = () => {
    const trimmed = otraInput.trim();
    if (!trimmed) return;
    setCustomRamas((prev) => [...prev, trimmed]);
    setOtraInput("");
    setShowModal(false);
  };

  const removeCustomRama = (label: string) => {
    setCustomRamas((prev) => prev.filter((r) => r !== label));
  };

  const handleFinish = () => {
    const allRamas = [...selectedRamas, ...customRamas];
    router.push({
      pathname: "/card-deck",
      params: {
        startNode: startNode ?? "inicio_perdido",
        formacion: formacion ?? "",
        ramas: allRamas.join(","),
      },
    });
  };

  const subtitleText =
    totalSelected === 0
      ? "Puedes seleccionar mas de una área"
      : totalSelected === 1
        ? "1 seleccionada"
        : `${totalSelected} seleccionadas`;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <OnboardingProgress step={2} />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header con contador dramático */}
        <Animated.View style={[styles.header, titleStyle]}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>
              ¿Qué área de{"\n"}
              <Text style={{ color: "#8980B8" }}>bienestar</Text> te interesa?
            </Text>
            {/* <Animated.Text style={[styles.counterBig, counterStyle]}>
              {totalSelected}
            </Animated.Text> */}
          </View>
          <Text style={styles.subtitle}>{subtitleText}</Text>
        </Animated.View>

        {/* Lista editorial */}
        <Animated.View style={listStyle}>
          {RAMAS.map((rama) => (
            <RamaRow
              key={rama.id}
              icon={rama.icon}
              label={rama.label}
              desc={rama.desc}
              active={selectedRamas.includes(rama.id)}
              suggested={suggested.has(rama.id)}
              onPress={() => toggleRama(rama.id)}
            />
          ))}

          {/* Fila "Agregar otra" */}
          <TouchableOpacity onPress={handleOtraPress} activeOpacity={0.65}>
            <View style={styles.rowOtra}>
              <View style={styles.rowBorderOtra} />
              <Text style={styles.rowNumOtra}>+</Text>
              <Text style={styles.rowLabelOtra}>Agregar otra</Text>
            </View>
          </TouchableOpacity>

          {/* Modal para rama personalizada */}
          <Modal
            visible={showModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowModal(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowModal(false)}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <View style={styles.modalCard}>
                  <Text style={styles.modalTitle}>Agregar rama</Text>
                  <TextInput
                    ref={otraInputRef}
                    style={styles.modalInput}
                    placeholder="Ej: Mindfulness, Propósito..."
                    placeholderTextColor="rgba(28,27,41,0.3)"
                    value={otraInput}
                    onChangeText={setOtraInput}
                    returnKeyType="done"
                    onSubmitEditing={confirmOtraRama}
                    autoCapitalize="words"
                  />
                  <TouchableOpacity
                    style={[
                      styles.modalBtn,
                      !otraInput.trim() && styles.otraConfirmDisabled,
                    ]}
                    onPress={confirmOtraRama}
                    disabled={!otraInput.trim()}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalBtnText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </TouchableOpacity>
          </Modal>

          {/* Tags personalizados */}
          {customRamas.length > 0 && (
            <View style={styles.tagsRow}>
              {customRamas.map((label) => (
                <CustomTag
                  key={label}
                  label={label}
                  onRemove={() => removeCustomRama(label)}
                />
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.btn, totalSelected === 0 && styles.btnDisabled]}
            onPress={handleFinish}
            activeOpacity={0.82}
            disabled={totalSelected === 0}
          >
            <View style={styles.btnInner}>
              {totalSelected > 0 && (
                <View style={styles.btnBadge}>
                  <Text style={styles.btnBadgeText}>{totalSelected}</Text>
                </View>
              )}
              <Text style={styles.btnText}>Continuar</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 56,
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
  },
  title: {
    color: "#1C1B29",
    fontSize: TEXT_FONT_SIZE,
    fontWeight: "700",
    lineHeight: 40,
    letterSpacing: -1.0,
  },
  counterBig: {
    color: "#8980B8",
    fontSize: 84,
    fontWeight: "900",
    lineHeight: 84,
    letterSpacing: -4,
  },
  subtitle: {
    color: "#8A8A9A",
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0.2,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(137,128,184,0.12)",
  },
  rowBorder: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 2,
  },
  rowNum: {
    color: "#8980B8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    width: 24,
  },
  rowLabel: {
    color: "rgba(28,27,41,0.4)",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  rowLabelActive: {
    color: "#1C1B29",
  },
  rowDesc: {
    color: "#8A8A9A",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  rowOtra: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 18,
  },
  rowBorderOtra: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 2,
    backgroundColor: "rgba(137,128,184,0.2)",
  },
  rowNumOtra: {
    color: "#8A8A9A",
    fontSize: 18,
    fontWeight: "700",
    width: 24,
    textAlign: "center",
  },
  rowLabelOtra: {
    flex: 1,
    color: "rgba(28,27,41,0.35)",
    fontSize: 16,
    fontWeight: "600",
  },
  otraRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  otraInput: {
    flex: 1,
    backgroundColor: "rgba(137,128,184,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#1C1B29",
    fontSize: 15,
  },
  otraConfirm: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#8980B8",
    justifyContent: "center",
    alignItems: "center",
  },
  otraConfirmDisabled: {
    opacity: 0.3,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  customTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#8980B8",
    backgroundColor: "rgba(137,128,184,0.08)",
  },
  customTagText: {
    color: "#8980B8",
    fontSize: 13,
    fontWeight: "600",
  },
  btn: {
    backgroundColor: "#8980B8",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  btnDisabled: {
    opacity: 0.1,
  },
  btnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  btnBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FAF8F5",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    padding: 20,
    gap: 14,
  },
  modalTitle: {
    color: "#1C1B29",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  modalInput: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.18)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#1C1B29",
    fontSize: 14,
  },
  modalBtn: {
    backgroundColor: "#8980B8",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 6,
  },
  modalBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  suggestedBadge: {
    backgroundColor: "rgba(137,128,184,0.12)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.25)",
  },
  suggestedText: {
    color: "#8980B8",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
