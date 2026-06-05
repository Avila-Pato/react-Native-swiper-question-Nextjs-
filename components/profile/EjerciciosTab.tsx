import { SPACING } from "@/constants/constants";
import { ACCENT, BORDER, MUTED, TEXT } from "@/constants/theme";
import { WEEKLY_CHALLENGES } from "@/data/weeklyData";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CircleProgress } from "./CircleProgress";

type Props = {
  progress: Record<string, number>;
};

export function EjerciciosTab({ progress }: Props) {
  return (
    <View style={s.tabContent}>
      {WEEKLY_CHALLENGES.map((c) => {
        const done = progress[c.id] ?? 0;
        const total = c.questions.length;
        const pct = Math.round((done / total) * 100);
        const isComplete = done >= total;

        return (
          <Pressable
            key={c.id}
            style={({ pressed }) => [s.exerciseRow, pressed && { opacity: 0.75 }]}
            onPress={() =>
              router.push({ pathname: "/challenge-detail", params: { id: c.id } })
            }
          >
            <View style={s.exerciseLeft}>
              <View style={s.exerciseInfo}>
                <Text style={s.exerciseTitle}>{c.title}</Text>
                <Text style={[s.exerciseDiff, { color: isComplete ? ACCENT : MUTED }]}>
                  {isComplete ? "Completado ✓" : "En progreso"}
                </Text>
              </View>
            </View>
            <View style={s.exerciseCircle}>
              <CircleProgress
                pct={pct}
                color={isComplete ? ACCENT : c.color}
                size={46}
                strokeWidth={5}
              />
              <View style={s.exerciseCircleInner}>
                <Text style={s.exerciseCirclePct}>{pct}%</Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  tabContent: { paddingTop: SPACING * 2 },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 1.2,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  exerciseLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING * 1.2,
    flex: 1,
  },
  exerciseInfo: { gap: 3 },
  exerciseTitle: { fontSize: 14, fontWeight: "700", color: TEXT },
  exerciseDiff: { fontSize: 12, fontWeight: "500" },
  exerciseCircle: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseCircleInner: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseCirclePct: { fontSize: 9, fontWeight: "800", color: TEXT },
});
