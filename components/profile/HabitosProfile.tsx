import { SPACING } from "@/constants/constants";
import { BORDER, MUTED, TEXT } from "@/constants/theme";
import { HABITS } from "@/data/habitsData";
import { useUserStore } from "@/store/useUserStore";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  progress: Record<string, number>;
};

export function HabitosProfile({ progress }: Props) {
  const habitIds = useUserStore((s) => s.habits);
  const removeHabit = useUserStore((s) => s.removeHabit);

  // Agrupar habitos por categoría
  const myHabits = HABITS.filter((h) => habitIds.includes(h.id));
  const byCategory = myHabits.reduce<Record<string, typeof myHabits>>(
    (acc, h) => {
      (acc[h.category] ??= []).push(h);
      return acc;
    },
    {},
  );
  const categories = Object.keys(byCategory).sort();

  return (
    <View style={s.tabContent}>
      {categories.length === 0 && (
        <Text style={s.empty}>{"Aún no has añadido hábitos."}</Text>
      )}
      {categories.map((cat) => (
        <View key={cat} style={s.section}>
          <Text style={s.sectionLabel}>{cat}</Text>
          {byCategory[cat].map((h) => (
            <View
              key={h.id}
              style={[s.habitRow, { borderLeftColor: h.accent }]}
            >
              <Image source={h.image} style={s.habitImg} contentFit="contain" />
              <View style={s.habitInfo}>
                <Text style={[s.habitTitle, { color: h.accent }]}>
                  {h.title}
                </Text>
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
      ))}
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
  empty: {
    fontSize: 13,
    color: MUTED,
    textAlign: "center",
    marginTop: SPACING * 3,
  },
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
