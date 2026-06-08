import {
  BACKEND_URL,
  buildResultFromCategoria,
  buildResultFromText,
  useAudioJournalStore,
} from "@/store/useAudioJournalStore";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { Platform } from "react-native";

async function buildFormData(uri: string): Promise<FormData> {
  const formData = new FormData();

  if (Platform.OS === "web") {
    // En web, uri es un blob URL — hay que convertirlo a Blob real
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append("file", blob, "audio.webm");
  } else {
    // En nativo, React Native fetch acepta { uri, name, type }
    formData.append("file", { uri, name: "audio.m4a", type: "audio/m4a" } as unknown as Blob);
  }

  return formData;
}

export function useJournalRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const { currentStep, setRecording, setAnalyzing, setResult, setError, reset } =
    useAudioJournalStore();

  const start = async () => {
    try {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted) {
        setError("Permiso de micrófono denegado");
        return;
      }
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecording();
    } catch {
      setError("No se pudo iniciar la grabación");
    }
  };

  const stop = async () => {
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) { setError("No se obtuvo el audio"); return; }

      setAnalyzing();

      const formData = await buildFormData(uri);
      const res = await fetch(`${BACKEND_URL}/audio/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);

      const data = await res.json();
      setResult(buildResultFromCategoria(data.categoria));
    } catch {
      setResult(buildResultFromText(""));
    }
  };

  const toggle = () => (currentStep === "recording" ? stop() : start());

  return { toggle, reset, currentStep };
}
