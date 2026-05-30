import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowUpRight, X } from "lucide-react-native";
import React from "react";
import { Animated, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FloatingParticle } from "./FloatingParticle";
import { GRADIENT_COLORS, PARTICLES } from "./constants";
import { s } from "./styles";
import { useReflection } from "./useReflection";

interface Props { visible: boolean; onClose: () => void; onSave: (text: string) => void; }

export default function ReflectionModal({ visible, onClose, onSave }: Props) {
  const { typed, inputText, setInputText, phrase, fadeAnim, cardScale, breathScale, handleSave } = useReflection(visible, onSave, onClose);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, { opacity: fadeAnim }]}>
        <LinearGradient colors={GRADIENT_COLORS} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />
        <View style={s.blob3} pointerEvents="none" />
        {PARTICLES.map((p, i) => <FloatingParticle key={i} {...p} />)}

        <Pressable style={s.closeBtn} onPress={onClose} hitSlop={12}>
          <X size={19} color="#8B7BAB" strokeWidth={2} />
        </Pressable>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={s.center}>
          <Animated.View style={{ transform: [{ scale: cardScale }] }}>
            <Animated.View style={{ transform: [{ scale: breathScale }] }}>
              <BlurView intensity={50} tint="light" style={s.card}>
                <View style={s.ornament}>
                  <View style={s.oDot} />
                  <View style={s.oLine} />
                  <View style={s.oDot} />
                </View>
                <Text style={s.cardLabel}>{"REFLEXIÓN DEL MOMENTO"}</Text>
                <Text style={s.phrase}>
                  {typed}
                  <Text style={s.cursor}>{typed.length < phrase.length ? "|" : ""}</Text>
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
                <Pressable style={[s.saveBtn, !inputText.trim() && s.saveBtnOff]} onPress={handleSave}>
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
