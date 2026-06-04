import { GoogleSignInButton } from "@/components/onboarding/GoogleSignInButton";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { TEXT_FONT_SIZE } from "@/constants/constants";
import { useUserStore } from "@/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { UserCircle } from "lucide-react-native";
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

  const { setUser, saveOnboarding } = useUserStore();

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

  const persistContext = (userName?: string) => {
    saveOnboarding({
      goals: params.formacion ? params.formacion.split(",").filter(Boolean) : [],
      areas: params.ramas ? params.ramas.split(",").filter(Boolean) : [],
      nombre: userName ?? params.nombre ?? "",
    });
  };

  const handleCreate = () => {
    if (!isValid) return;
    setUser({ id: email.trim(), name: params.nombre ?? "", email: email.trim() });
    persistContext();
    router.replace("/(onboarding)/welcome-loading" as any);
  };

  const handleSkip = () => {
    persistContext();
    router.replace("/(onboarding)/welcome-loading" as any);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <OnboardingProgress step={6} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <Animated.View style={[styles.header, titleStyle]}>
          <Text style={styles.title}>
            Crea tu <Text style={{ color: "#8980B8" }}>cuenta.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Crea tu cuenta y guarda tu progreso en tu camino de bienestar
            personal.
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
                placeholderTextColor="rgba(28,27,41,0.3)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                selectionColor="#8980B8"
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
                placeholderTextColor="rgba(28,27,41,0.3)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleCreate}
                selectionColor="#8980B8"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((p) => !p)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#8A8A9A"
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
            <Text style={styles.btnText}>Crear cuenta</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleSignInButton
            onSuccess={(user) => {
              setUser({ id: user.id, name: user.name ?? "", email: user.email ?? "", picture: user.picture });
              persistContext(user.name);
              router.replace("/(onboarding)/welcome-loading" as any);
            }}
          />

          <TouchableOpacity
            style={styles.guestBtn}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <UserCircle size={18} color="#8A8A9A" />
            <Text style={styles.guestText}>Entrar como invitado</Text>
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
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    justifyContent: "flex-start",
    gap: 32,
    paddingVertical: 28,
  },
  header: {
    gap: 10,
  },
  label: {
    color: "#8A8A9A",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    color: "#1C1B29",
    fontSize: TEXT_FONT_SIZE,
    fontWeight: "700",
    lineHeight: 46,
    letterSpacing: -1.2,
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    color: "#8A8A9A",
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 20,
    textAlign: "center",
  },
  fields: {
    gap: 24,
  },
  fieldBlock: {},
  fieldLabel: {
    color: "#8A8A9A",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
  },
  input: {
    color: "#1C1B29",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: -0.2,
    flex: 1,
  },
  underline: {
    height: 1,
    backgroundColor: "rgba(137,128,184,0.18)",
    borderRadius: 1,
  },
  hint: {
    color: "rgba(255,100,100,0.6)",
    fontSize: 11,
    marginTop: 5,
    fontWeight: "500",
  },
  actions: {
    gap: 10,
  },
  btn: {
    backgroundColor: "#8980B8",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  guestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    paddingVertical: 13,
  },
  guestText: {
    color: "#8A8A9A",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  dividerText: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 12,
    fontWeight: "400",
  },
});




