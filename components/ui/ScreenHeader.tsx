import { SPACING } from "@/constants/constants";
import { ACCENT, BORDER, TEXT } from "@/constants/theme";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
  right?: ReactNode;
  accentColor?: string;
}

export function ScreenHeader({ title, right, accentColor = ACCENT }: Props) {
  return (
    <View style={s.wrap}>
      <View style={s.row}>
        <Text style={s.title}>{title}</Text>
        {right && <View>{right}</View>}
      </View>
      <View style={s.borderRow}>
        <View style={[s.accentLine, { backgroundColor: accentColor }]} />
        <View style={s.mutedLine} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
    paddingTop: SPACING * 1.2,
    paddingBottom: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING * 2,
    paddingBottom: SPACING * 1.2,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.5,
  },
  borderRow: {
    flexDirection: "row",
    height: 3,
  },
  accentLine: {
    flex: 1.4,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  mutedLine: {
    flex: 1,
    backgroundColor: BORDER,
  },
});
