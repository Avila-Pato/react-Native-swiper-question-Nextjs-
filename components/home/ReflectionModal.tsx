import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowUpRight, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

const REFLECTIONS = [
  "Hoy me permito sentir sin juzgar lo que siento.",
  "Cada respiración me acerca más a mí mismo.",
  "Lo que vivo hoy tiene valor, aunque no lo entienda aún.",
  "Soy suficiente como soy en este momento.",
  "El silencio también es una forma de escucharse.",
  "Hoy elijo pausar, respirar y volver a mí.",
  "Mis emociones son mensajes, no mi identidad.",
];

// Particle configs computed once at module load
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 47 + 23) % (W - 10),
  size: (i % 4) + 2.5,
  duration: 9000 + ((i * 800) % 6000),
  delay: (i * 600) % 5000,
}));

function FloatingParticle({
  x,
  size,
  duration,
  delay,
}: {
  x: number;
  size: number;
  duration: number;
  delay: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(H + 60)],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 0.08, 0.72, 1],
    outputRange: [0, 0.9, 0.5, 0],
  });
  const scale = anim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.4, 1, 0.3],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: x,
        bottom: (size * 20) % (H / 2),
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "rgba(255,255,255,0.9)",
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: size * 2.5,
        transform: [{ translateY }, { scale }],
        opacity,
      }}
    />
  );
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
}

export default function ReflectionModal({ visible, onClose, onSave }: Props) {
  const [typed, setTyped] = useState("");
  const [inputText, setInputText] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.92)).current;
  const breathScale = useRef(new Animated.Value(1)).current;

  const phrase = REFLECTIONS[new Date().getDay() % REFLECTIONS.length];

  // Entry animation + typewriter
  useEffect(() => {
    if (!visible) {
      fadeAnim.setValue(0);
      cardScale.setValue(0.92);
      setTyped("");
      setInputText("");
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 55,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();

    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(phrase.slice(0, i));
      if (i >= phrase.length) clearInterval(iv);
    }, 42);

    return () => clearInterval(iv);
  }, [visible]);

  // Breathing loop
  useEffect(() => {
    if (!visible) return;
    const breath = Animated.loop(
      Animated.sequence([
        Animated.timing(breathScale, {
          toValue: 1.016,
          duration: 3800,
          useNativeDriver: true,
        }),
        Animated.timing(breathScale, {
          toValue: 1,
          duration: 3800,
          useNativeDriver: true,
        }),
      ]),
    );
    breath.start();
    return () => breath.stop();
  }, [visible]);

  const handleSave = () => {
    if (!inputText.trim()) return;
    onSave(inputText.trim());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[s.overlay, { opacity: fadeAnim }]}>
        {/* Warm gradient background */}
        <LinearGradient
          colors={["#F4EBE0", "#FDF5EE", "#EDE8F5", "#F7EFF5"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Ambient glow blobs */}
        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />
        <View style={s.blob3} pointerEvents="none" />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}

        {/* Close button */}
        <Pressable style={s.closeBtn} onPress={onClose} hitSlop={12}>
          <X size={19} color="#8B7BAB" strokeWidth={2} />
        </Pressable>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={s.center}
        >
          <Animated.View style={{ transform: [{ scale: cardScale }] }}>
            <Animated.View style={{ transform: [{ scale: breathScale }] }}>
              <BlurView intensity={50} tint="light" style={s.card}>
                {/* Ornament */}
                <View style={s.ornament}>
                  <View style={s.oDot} />
                  <View style={s.oLine} />
                  <View style={s.oDot} />
                </View>

                <Text style={s.cardLabel}>{"REFLEXIÓN DEL MOMENTO"}</Text>

                {/* Typewriter phrase */}
                <Text style={s.phrase}>
                  {typed}
                  <Text style={s.cursor}>
                    {typed.length < phrase.length ? "|" : ""}
                  </Text>
                </Text>

                <View style={s.separator} />

                <Text style={s.inputLabel}>{"¿Qué quieres expresar hoy?"}</Text>
                <TextInput
                  style={s.input}
                  placeholder={"Escribe lo que sientes..."}
                  placeholderTextColor={"rgba(90,70,130,0.38)"}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  autoFocus
                  textAlignVertical="top"
                />

                <Pressable
                  style={[s.saveBtn, !inputText.trim() && s.saveBtnOff]}
                  onPress={handleSave}
                >
                  <Text style={s.saveTxt}>{"Guardar reflexión"}</Text>
                  <ArrowUpRight size={16} color="#fff" strokeWidth={2.5} />
                </Pressable>
              </BlurView>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  blob1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(210,195,240,0.38)",
    top: -80,
    left: -80,
  },
  blob2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,205,185,0.30)",
    bottom: 60,
    right: -70,
  },
  blob3: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(190,215,255,0.25)",
    bottom: 220,
    left: 10,
  },

  closeBtn: {
    position: "absolute",
    top: 56,
    right: 22,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#C0B0D8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  center: {
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "center",
  },

  card: {
    width: W - 48,
    borderRadius: 28,
    padding: 26,
    backgroundColor: "rgba(255,255,255,0.52)",
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.88)",
    overflow: "hidden",
    shadowColor: "#B8A8D8",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 14,
  },

  ornament: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
  oDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#C8B0DC" },
  oLine: { width: 44, height: 1, backgroundColor: "#D8C8EC" },

  cardLabel: {
    fontSize: 9,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2.2,
    color: "#A895C8",
    textAlign: "center",
    marginBottom: 18,
  },

  phrase: {
    fontSize: 19,
    fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60",
    lineHeight: 30,
    textAlign: "center",
    minHeight: 60,
    marginBottom: 22,
  },
  cursor: {
    color: "#A895C8",
    fontFamily: "Poppins-Regular",
  },

  separator: {
    height: 1,
    backgroundColor: "rgba(180,155,215,0.28)",
    marginBottom: 18,
  },

  inputLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Medium",
    color: "#A895C8",
    marginBottom: 10,
  },
  input: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#2D1F60",
    minHeight: 88,
    lineHeight: 24,
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
    backgroundColor: "#7B6BB5",
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: "#7B6BB5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 7,
  },
  saveBtnOff: {
    backgroundColor: "#C8BEE0",
    shadowOpacity: 0,
    elevation: 0,
  },
  saveTxt: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
});
