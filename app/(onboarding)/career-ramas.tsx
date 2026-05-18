import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { GREEN, TEXT_FONT_SIZE } from "@/constants/constants";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
  { id: "seguridad", icon: "shield-outline" as const, label: "Seguridad" },
  { id: "devops", icon: "cloud-outline" as const, label: "DevOps" },
  { id: "datos_ia", icon: "bar-chart-outline" as const, label: "Datos & IA" },
  {
    id: "desarrollo",
    icon: "code-slash-outline" as const,
    label: "Desarrollo",
  },
];

function RamaRow({
  icon,
  label,
  active,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 260 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const rowStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(52,213,154,${0.065 * progress.value})`,
  }));

  const borderStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(255,255,255,0.1)", GREEN],
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
          <Ionicons name={icon} size={20} color={GREEN} />
        </Animated.View>
        <Text style={[styles.rowLabel, active && styles.rowLabelActive]}>
          {label}
        </Text>
        <Animated.View style={checkStyle}>
          <Ionicons name="checkmark" size={20} color={GREEN} />
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

export default function CareerRamasScreen() {
  const { startNode, formacion } = useLocalSearchParams<{
    startNode?: string;
    formacion?: string;
  }>();

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
      pathname: "/personal",
      params: {
        startNode: startNode ?? "inicio_perdido",
        formacion: formacion ?? "",
        ramas: allRamas.join(","),
      },
    });
  };

  const subtitleText =
    totalSelected === 0
      ? "Puedes seleccionar mas de una rama"
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
              ¿Qué rama <Text style={{ color: "#34D59A" }}>te llama?</Text>
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
              active={selectedRamas.includes(rama.id)}
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
                    placeholder="Ej: UX/UI, Blockchain..."
                    placeholderTextColor="rgba(255,255,255,0.22)"
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
    backgroundColor: "#111120",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingVertical: 64,
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
  },
  title: {
    color: "white",
    fontSize: TEXT_FONT_SIZE,
    fontWeight: "800",
    lineHeight: 42,
    letterSpacing: -1.2,
  },
  counterBig: {
    color: GREEN,
    fontSize: 84,
    fontWeight: "900",
    lineHeight: 84,
    letterSpacing: -4,
  },
  subtitle: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
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
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    width: 24,
  },
  rowLabel: {
    flex: 1,
    color: "rgba(255,255,255,0.55)",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  rowLabelActive: {
    color: "white",
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
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  rowNumOtra: {
    color: "rgba(255,255,255,0.28)",
    fontSize: 18,
    fontWeight: "700",
    width: 24,
    textAlign: "center",
  },
  rowLabelOtra: {
    flex: 1,
    color: "rgba(255,255,255,0.32)",
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
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "white",
    fontSize: 15,
  },
  otraConfirm: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: GREEN,
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
    borderColor: GREEN,
    backgroundColor: "rgba(52,213,154,0.08)",
  },
  customTagText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "600",
  },
  btn: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 28,
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnBadge: {
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 7,
  },
  btnBadgeText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "800",
  },
  btnText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#1a1a2e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  modalInput: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "white",
    fontSize: 16,
  },
  modalBtn: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  modalBtnText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "800",
  },
});
