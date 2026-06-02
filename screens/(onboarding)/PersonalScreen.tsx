import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { TEXT_FONT_SIZE } from "@/constants/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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

export default function PersonalScreen() {
  const params = useLocalSearchParams<{
    startNode?: string;
    formacion?: string;
    ramas?: string;
  }>();

  const [nombre, setNombre] = useState("");
  const inputRef = useRef<TextInput>(null);

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);
  const inputOpacity = useSharedValue(0);
  const inputY = useSharedValue(30);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(20);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 420 });
    titleY.value = withSpring(0, { damping: 18, stiffness: 100 });
    inputOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    inputY.value = withDelay(
      200,
      withSpring(0, { damping: 16, stiffness: 100 }),
    );
    btnOpacity.value = withDelay(380, withTiming(1, { duration: 350 }));
    btnY.value = withDelay(380, withSpring(0, { damping: 16, stiffness: 100 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const inputStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
    transform: [{ translateY: inputY.value }],
  }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnY.value }],
  }));

  const handleContinue = () => {
    if (!nombre.trim()) {
      inputRef.current?.focus();
      return;
    }
    router.push({
      pathname: "/signup",
      params: {
        startNode: params.startNode ?? "inicio_perdido",
        formacion: params.formacion ?? "",
        ramas: params.ramas ?? "",
        nombre: nombre.trim(),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <OnboardingProgress step={4} />
      <View style={styles.container}>
        <Animated.View style={[styles.header, titleStyle]}>
          <Text style={styles.title}>
            ¿Cómo te <Text style={{ color: "#8980B8" }}>llamamos?</Text>
          </Text>
          <Text style={styles.subtitle}>
            Tu nombre aparecerá en tu perfil y lo usaremos para personalizar tu
            camino de bienestar. Puedes usar tu nombre real o un alias.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.inputBlock, inputStyle]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Tu nombre..."
            placeholderTextColor="rgba(28,27,41,0.3)"
            value={nombre}
            onChangeText={setNombre}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            autoCapitalize="words"
            selectionColor={"#8980B8"}
          />
          <View style={styles.underline} />
        </Animated.View>

        <Animated.View style={[styles.btnWrapper, btnStyle]}>
          <TouchableOpacity
            style={[styles.btn, !nombre.trim() && styles.btnDisabled]}
            onPress={handleContinue}
            activeOpacity={0.82}
          >
            <Text style={styles.btnText}>Continuar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    gap: 32,
    paddingTop: 60,
  },
  header: {
    gap: 10,
  },
  subtitle: {
    color: "#8A8A9A",
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 20,
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
  },
  inputBlock: {},
  input: {
    color: "#1C1B29",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: -0.2,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  underline: {
    height: 1,
    backgroundColor: "rgba(137,128,184,0.2)",
    borderRadius: 1,
  },
  btnWrapper: {},
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
});



