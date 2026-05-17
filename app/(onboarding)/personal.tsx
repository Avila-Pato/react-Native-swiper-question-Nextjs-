import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { GREEN, TEXT_FONT_SIZE } from "@/constants/constants";
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
    setTimeout(() => inputRef.current?.focus(), 500);
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
      <OnboardingProgress step={3} />
      <View style={styles.container}>
        <Animated.View style={[styles.header, titleStyle]}>
          <Text style={styles.title}>
            ¿Cómo te{"\n"}
            <Text style={{ color: GREEN }}>llamamos?</Text>
          </Text>
        </Animated.View>

        <Animated.View style={[styles.inputBlock, inputStyle]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Tu nombre..."
            placeholderTextColor="rgba(255,255,255,0.18)"
            value={nombre}
            onChangeText={setNombre}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            autoCapitalize="words"
            selectionColor={GREEN}
          />
          <View style={styles.underline} />
        </Animated.View>

        <Animated.View style={[styles.btnWrapper, btnStyle]}>
          <TouchableOpacity
            style={[styles.btn, !nombre.trim() && styles.btnDisabled]}
            onPress={handleContinue}
            activeOpacity={0.82}
          >
            <Text style={styles.btnText}>Comenzar quiz →</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#111120",
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    gap: 48,
  },
  header: {},
  label: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  title: {
    color: "white",
    fontSize: TEXT_FONT_SIZE,
    fontWeight: "800",
    lineHeight: 56,
  },
  inputBlock: {},
  input: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  underline: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 1,
  },
  btnWrapper: {},
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
});
