import { SPACING } from "@/constants/constants";
import { ACCENT, TEXT } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.row}>
      <Text style={s.title}>{title}</Text>
      <Text style={s.link}>Ver todo</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    marginBottom: SPACING * 1.2,
  },
  title: { fontSize: 17, fontWeight: "700", color: TEXT },
  link: { fontSize: 13, fontWeight: "600", color: ACCENT },
});
