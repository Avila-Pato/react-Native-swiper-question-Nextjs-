import { FloatingParticle } from "@/components/home/reflection/FloatingParticle";
import { GRADIENT_COLORS, PARTICLES } from "@/components/home/reflection/constants";
import {
  BACKEND_URL,
  buildResultFromCategoria,
  buildResultFromText,
  classifyText,
  useAudioJournalStore,
} from "@/store/useAudioJournalStore";
import type { CategoriaDetectada } from "@/store/useAudioJournalStore";
import { MOODS } from "@/data/moods";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import { Square, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width: W } = Dimensions.get("window");

// ── Mood row ───────────────────────────────────────────────────────────────

// Mapeo de categoría detectada → índice en MOODS (Difícil→0 … Genial→4)
const CATEGORIA_MOOD: Record<CategoriaDetectada, number> = {
  ESTRES_ANSIEDAD:         0, // Difícil
  TRISTEZA_MELANCOLIA:     1, // Bajo
  CANSANCIO_APATIA:        2, // Neutro
  CONFUSION_INCERTIDUMBRE: 2, // Neutro
  ALEGRIA_MOTIVACION:      4, // Genial
};

// ── Waveform ───────────────────────────────────────────────────────────────

const BAR_HEIGHTS = [14, 32, 48, 28, 56, 38, 20, 46, 30, 52, 24, 40, 16];

function WaveBar({ target, delay, active }: { target: number; delay: number; active: boolean }) {
  const h = useSharedValue(5);

  useEffect(() => {
    if (active) {
      h.value = withRepeat(
        withSequence(
          withDelay(delay, withTiming(target, { duration: 300 })),
          withTiming(5, { duration: 300 }),
        ),
        -1,
        true,
      );
    } else {
      h.value = withTiming(5, { duration: 200 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const style = useAnimatedStyle(() => ({ height: h.value }));
  return <Animated.View style={[s.bar, style]} />;
}

// ── Web Speech API ─────────────────────────────────────────────────────────

type SpeechRec = {
  continuous: boolean; interimResults: boolean; lang: string;
  onresult: ((e: any) => void) | null; onend: (() => void) | null;
  start: () => void; stop: () => void;
};

function createSpeechRec(): SpeechRec | null {
  if (typeof window === "undefined") return null;
  const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR() as SpeechRec;
  r.continuous = true; r.interimResults = true; r.lang = "es-ES";
  return r;
}

// ── Backend ────────────────────────────────────────────────────────────────

async function sendAudio(uri: string): Promise<string> {
  const fd = new FormData();
  if (Platform.OS === "web") {
    const blob = await (await fetch(uri)).blob();
    fd.append("file", blob, "audio.webm");
  } else {
    fd.append("file", { uri, name: "audio.m4a", type: "audio/m4a" } as unknown as Blob);
  }
  const res = await fetch(`${BACKEND_URL}/audio/analyze`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`${res.status}`);
  return (await res.json()).categoria as string;
}

// ── Component ──────────────────────────────────────────────────────────────

interface Props { visible: boolean; onClose: () => void; }

export function RecorderModal({ visible, onClose }: Props) {
  const { setRecording, setAnalyzing, setResult, setError } = useAudioJournalStore();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recRef = useRef<SpeechRec | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detectedMood, setDetectedMood] = useState<CategoriaDetectada | null>(null);

  useEffect(() => {
    if (transcript.trim().length > 3) {
      setDetectedMood(classifyText(transcript));
    } else {
      setDetectedMood(null);
    }
  }, [transcript]);

  useEffect(() => {
    if (!visible) { setIsRecording(false); setTranscript(""); setDetectedMood(null); return; }
    startRecording();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const startRecording = async () => {
    try {
      if (Platform.OS !== "web") {
        const { granted } = await AudioModule.requestRecordingPermissionsAsync();
        if (!granted) { setError("Permiso denegado"); onClose(); return; }
        await recorder.prepareToRecordAsync();
        recorder.record();
      } else {
        const rec = createSpeechRec();
        if (rec) {
          rec.onresult = (e: any) => {
            let t = "";
            for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + " ";
            setTranscript(t.trim());
          };
          rec.onend = () => { try { rec.start(); } catch { /* ignorar */ } };
          rec.start();
          recRef.current = rec;
        }
      }
      setIsRecording(true);
      setRecording();
    } catch {
      setError("No se pudo iniciar la grabación");
      onClose();
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    recRef.current?.stop();
    recRef.current = null;
    onClose();
    setAnalyzing();

    try {
      if (Platform.OS === "web") {
        setResult(buildResultFromText(transcript));
        return;
      }
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) throw new Error("Sin URI");
      const cat = await sendAudio(uri);
      setResult(buildResultFromCategoria(cat as any));
    } catch {
      setResult(buildResultFromText(transcript));
    }
  };

  const handleClose = () => { recRef.current?.stop(); recRef.current = null; onClose(); };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={s.overlay}>
        <LinearGradient colors={GRADIENT_COLORS} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />
        <View style={s.blob3} pointerEvents="none" />
        {PARTICLES.map((p, i) => <FloatingParticle key={i} {...p} />)}

        <Pressable style={s.closeBtn} onPress={handleClose} hitSlop={12}>
          <X size={19} color="#8B7BAB" strokeWidth={2} />
        </Pressable>

        <View style={s.center}>
          <BlurView intensity={50} tint="light" style={s.card}>
            {/* Ornamento */}
            <View style={s.ornament}>
              <View style={s.oDot} />
              <View style={s.oLine} />
              <View style={s.oDot} />
            </View>

            <Text style={s.cardLabel}>{"REFLEXIÓN DEL MOMENTO"}</Text>

            {/* Frase del día */}
            <Text style={s.phrase}>
              {"Cuéntame cómo\nte sientes hoy."}
            </Text>

            <View style={s.separator} />

            {/* Waveform */}
            <Text style={s.inputLabel}>{"Tu voz en tiempo real"}</Text>
            <View style={s.waveRow}>
              {BAR_HEIGHTS.map((h, i) => (
                <WaveBar key={i} target={h} delay={i * 45} active={isRecording} />
              ))}
            </View>

            {/* Transcripción */}
            <Text style={s.transcript} numberOfLines={4}>
              {transcript || (isRecording ? "Escuchando tu voz..." : "Iniciando micrófono...")}
            </Text>

            {/* Tu humor de hoy */}
            <Text style={s.moodLabel}>{"Tu humor de hoy"}</Text>
            <View style={s.moodRow}>
              {MOODS.map((m, i) => {
                const active = detectedMood !== null && CATEGORIA_MOOD[detectedMood] === i;
                return (
                  <View key={i} style={[s.moodItem, active && { backgroundColor: m.color + "55" }]}>
                    <Image
                      source={m.image}
                      style={[s.moodImg, !active && s.moodImgDim]}
                      contentFit="contain"
                    />
                    <Text style={[s.moodItemLabel, active && s.moodItemLabelActive]}>
                      {m.label}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Botón detener */}
            <Pressable
              style={[s.stopBtn, !isRecording && s.stopBtnOff]}
              onPress={stopRecording}
              disabled={!isRecording}
            >
              <Square size={14} color="#fff" fill="#fff" strokeWidth={0} />
              <Text style={s.stopTxt}>{"Terminar reflexión"}</Text>
            </Pressable>
          </BlurView>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: { flex: 1, alignItems: "center", justifyContent: "center" },

  blob1: { position: "absolute", width: 300, height: 300, borderRadius: 150, backgroundColor: "rgba(210,195,240,0.38)", top: -80, left: -80 },
  blob2: { position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: "rgba(255,205,185,0.30)", bottom: 60, right: -70 },
  blob3: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(190,215,255,0.25)", bottom: 220, left: 10 },

  closeBtn: { position: "absolute", top: 56, right: 22, width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.65)", alignItems: "center", justifyContent: "center", zIndex: 10 },

  center: { width: "100%", paddingHorizontal: 24, alignItems: "center" },

  card: { width: W - 48, borderRadius: 28, padding: 26, backgroundColor: "rgba(255,255,255,0.52)", borderWidth: 1.2, borderColor: "rgba(255,255,255,0.88)", overflow: "hidden" },

  ornament: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 },
  oDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#C8B0DC" },
  oLine: { width: 44, height: 1, backgroundColor: "#D8C8EC" },

  cardLabel: { fontSize: 9, fontFamily: "Poppins-SemiBold", letterSpacing: 2.2, color: "#A895C8", textAlign: "center", marginBottom: 18 },

  phrase: { fontSize: 19, fontFamily: "Playfair-ExtraBold", color: "#2D1F60", lineHeight: 30, textAlign: "center", marginBottom: 22 },

  separator: { height: 1, backgroundColor: "rgba(180,155,215,0.28)", marginBottom: 18 },

  inputLabel: { fontSize: 11, fontFamily: "Poppins-Medium", color: "#A895C8", marginBottom: 12 },

  waveRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, height: 64, marginBottom: 16 },
  bar: { width: 4, borderRadius: 4, backgroundColor: "#C8B0DC" },

  transcript: { fontSize: 15, fontFamily: "Poppins-Regular", color: "#2D1F60", lineHeight: 24, minHeight: 60, marginBottom: 18, fontStyle: "italic" },

  stopBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#7B6BB5", borderRadius: 16, paddingVertical: 14 },
  stopBtnOff: { backgroundColor: "#C8BEE0" },
  stopTxt: { fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#fff" },

  moodLabel: { fontSize: 10, fontFamily: "Poppins-SemiBold", letterSpacing: 1.6, color: "#A895C8", textAlign: "center", marginBottom: 10 },
  moodRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  moodItem: { alignItems: "center", gap: 4, borderRadius: 12, paddingVertical: 6, paddingHorizontal: 8, flex: 1, marginHorizontal: 2 },
  moodImg: { width: 34, height: 34 },
  moodImgDim: { opacity: 0.35 },
  moodItemLabel: { fontSize: 9, fontFamily: "Poppins-Medium", color: "#B0A0CC" },
  moodItemLabelActive: { color: "#5A3FA0", fontFamily: "Poppins-SemiBold" },
});
