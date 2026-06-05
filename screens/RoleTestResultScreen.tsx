import { useUserStore } from "@/store/useUserStore";
import { RoleScores } from "@/types/roleTest";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function RoleTestResultScreen() {
  const { scores: raw } = useLocalSearchParams<{ scores: string }>();
  const saveAssessment = useUserStore((s) => s.saveAssessment);

  useEffect(() => {
    if (raw) {
      const scores: RoleScores = JSON.parse(raw);
      saveAssessment(scores);
    }
    router.replace("/(tab)/four" as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View />;
}
