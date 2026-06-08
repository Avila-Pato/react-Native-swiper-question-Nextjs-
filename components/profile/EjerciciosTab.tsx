import { SPACING } from "@/constants/constants";
import { ACCENT, BORDER, MUTED, TEXT } from "@/constants/theme";
import { HABITS } from "@/data/habitsData";
import { WEEKLY_CHALLENGES } from "@/data/weeklyData";
import { useUserStore } from "@/store/useUserStore";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CircleProgress } from "./CircleProgress";

type Props = {
  progress: Record<string, number>;
};

export function EjerciciosTab({ progress }: Props) {
  const habitIds = useUserStore((s) => s.habits);
  const removeHabit = useUserStore((s) => s.removeHabit);
  const myHabits = HABITS.filter((h) => habitIds.includes(h.id));

  return (
    <View style={s.tabContent}>

      {/* ── Mis hábitos ── */}
      {myHabits.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionLabel}>{"Mis hábitos"}</Text>
          {myHabits.map((h) => (
            <View key={h.id} style={[s.habitRow, { borderLeftColor: h.accent }]}>
              <Image source={h.image} style={s.habitImg} contentFit="contain" />
              <View style={s.habitInfo}>
                <Text style={[s.habitTitle, { color: h.accent }]}>{h.title}</Text>
                <Text style={s.habitDuration}>{h.duration}</Text>
              </View>
              <Pressable
                style={s.removeBtn}
                onPress={() => removeHabit(h.id)}
                hitSlop={8}
              >
                <Text style={s.removeBtnTxt}>{"×"}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* ── Retos semanales ── */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>{"Retos semanales"}</Text>
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
    </View>
  );
}

const s = StyleSheet.create({
  tabContent: { paddingTop: SPACING * 2 },

  section: { marginBottom: SPACING * 2 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginHorizontal: SPACING * 2,
    marginBottom: SPACING,
  },

  /* Hábitos */
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING * 1.2,
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 1.2,
    borderBottomWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 3,
  },
  habitImg: { width: 36, height: 36, flexShrink: 0 },
  habitInfo: { flex: 1, gap: 2 },
  habitTitle: { fontSize: 14, fontWeight: "700" },
  habitDuration: { fontSize: 12, color: MUTED, fontWeight: "500" },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtnTxt: { fontSize: 18, color: MUTED, lineHeight: 22 },

  /* Retos */
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
