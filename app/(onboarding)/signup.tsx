import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { GREEN, TEXT_FONT_SIZE } from "@/constants/constants";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

export default function SignupScreen() {
  const params = useLocalSearchParams<{
    startNode?: string;
    formacion?: string;
    ramas?: string;
    nombre?: string;
  }>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Animaciones de entrada
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);
  const field1Opacity = useSharedValue(0);
  const field1Y = useSharedValue(24);
  const field2Opacity = useSharedValue(0);
  const field2Y = useSharedValue(24);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(20);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 420 });
    titleY.value = withSpring(0, { damping: 18, stiffness: 100 });
    field1Opacity.value = withDelay(200, withTiming(1, { duration: 380 }));
    field1Y.value = withDelay(
      200,
      withSpring(0, { damping: 16, stiffness: 100 }),
    );
    field2Opacity.value = withDelay(320, withTiming(1, { duration: 380 }));
    field2Y.value = withDelay(
      320,
      withSpring(0, { damping: 16, stiffness: 100 }),
    );
    btnOpacity.value = withDelay(460, withTiming(1, { duration: 350 }));
    btnY.value = withDelay(460, withSpring(0, { damping: 16, stiffness: 100 }));
    setTimeout(() => emailRef.current?.focus(), 550);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const field1Style = useAnimatedStyle(() => ({
    opacity: field1Opacity.value,
    transform: [{ translateY: field1Y.value }],
  }));
  const field2Style = useAnimatedStyle(() => ({
    opacity: field2Opacity.value,
    transform: [{ translateY: field2Y.value }],
  }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnY.value }],
  }));

  const isValid = email.trim().includes("@") && password.length >= 6;

  const handleCreate = () => {
    if (!isValid) return;
    // TODO: llamar a tu servicio de auth aquí
    router.replace({
      pathname: "/(tab)",
      params: {
        startNode: params.startNode ?? "inicio_perdido",
        formacion: params.formacion ?? "",
        ramas: params.ramas ?? "",
        nombre: params.nombre ?? "",
      },
    });
  };

  const handleSkip = () => {
    router.replace({
      pathname: "/(tab)",
      params: {
        startNode: params.startNode ?? "inicio_perdido",
        formacion: params.formacion ?? "",
        ramas: params.ramas ?? "",
        nombre: params.nombre ?? "",
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <OnboardingProgress step={4} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <Animated.View style={[styles.header, titleStyle]}>
          <Text style={styles.title}>
            Crea tu <Text style={{ color: GREEN }}>cuenta.</Text>
          </Text>
        </Animated.View>

        {/* Campos */}
        <View style={styles.fields}>
          {/* Email */}
          <Animated.View style={[styles.fieldBlock, field1Style]}>
            <Text style={styles.fieldLabel}>Correo electrónico</Text>
            <View style={styles.inputRow}>
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="hola@ejemplo.com"
                placeholderTextColor="rgba(255,255,255,0.18)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                selectionColor={GREEN}
              />
            </View>
            <View style={styles.underline} />
          </Animated.View>

          {/* Contraseña */}
          <Animated.View style={[styles.fieldBlock, field2Style]}>
            <Text style={styles.fieldLabel}>Contraseña</Text>
            <View style={styles.inputRow}>
              <TextInput
                ref={passwordRef}
                style={[styles.input, { flex: 1 }]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="rgba(255,255,255,0.18)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleCreate}
                selectionColor={GREEN}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((p) => !p)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="rgba(255,255,255,0.35)"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.underline} />
            {password.length > 0 && password.length < 6 && (
              <Text style={styles.hint}>Mínimo 6 caracteres</Text>
            )}
          </Animated.View>
        </View>

        {/* Acciones */}
        <Animated.View style={[styles.actions, btnStyle]}>
          <TouchableOpacity
            style={[styles.btn, !isValid && styles.btnDisabled]}
            onPress={handleCreate}
            activeOpacity={0.82}
          >
            <Text style={styles.btnText}>Crear cuenta →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Ahora no, ir al quiz</Text>
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
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    gap: 44,
    paddingVertical: 32,
  },
  header: {},
  label: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: {
    color: "white",
    fontSize: TEXT_FONT_SIZE,
    fontWeight: "800",
    lineHeight: 56,
    letterSpacing: -1.5,
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 14,
    fontWeight: "400",
  },
  fields: {
    gap: 36,
  },
  fieldBlock: {},
  fieldLabel: {
    color: "rgba(255,255,255,0.38)",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  input: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.3,
    flex: 1,
  },
  underline: {
    height: 1.5,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 1,
  },
  hint: {
    color: "rgba(255,100,100,0.7)",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  actions: {
    gap: 14,
  },
  btn: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.35,
  },
  btnText: {
    color: "#1a1a2e",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  skipText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 14,
    fontWeight: "500",
  },
});
