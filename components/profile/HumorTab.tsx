import { SPACING } from "@/constants/constants";
import { MUTED, TEXT } from "@/constants/theme";
import { MOODS } from "@/data/moods";
import { MoodHistory } from "@/store/moodHistory";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { MoodCalendar } from "./MoodCalendar";

type Props = {
  moodHistory: MoodHistory;
};

export function HumorTab({ moodHistory }: Props) {
  return (
    <View style={s.tabContent}>
      <Text style={s.humorTitle}>Tu registro de humor</Text>
      <Text style={s.humorSub}>Cada día que registras tu estado se guarda aquí.</Text>
      <MoodCalendar history={moodHistory} />

      <View style={s.legendRow}>
        {MOODS.map((m, i) => (
          <View key={i} style={s.legendItem}>
            <Image source={m.image} style={s.legendImg} contentFit="contain" />
            <Text style={s.legendLabel}>{m.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  tabContent: { paddingTop: SPACING * 2 },
  humorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
    paddingHorizontal: SPACING * 2,
    marginBottom: 4,
  },
  humorSub: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "500",
    paddingHorizontal: SPACING * 2,
    marginBottom: SPACING * 1.5,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: SPACING,
    paddingVertical: SPACING * 1.5,
    marginTop: SPACING,
    backgroundColor: "#F7F5FC",
    borderRadius: 16,
    marginHorizontal: SPACING * 2,
  },
  legendItem: { alignItems: "center", gap: 4 },
  legendImg: { width: 32, height: 32 },
  legendLabel: { fontSize: 9, fontWeight: "600", color: MUTED },
});
