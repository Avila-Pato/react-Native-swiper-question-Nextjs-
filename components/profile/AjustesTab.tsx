import { SPACING } from "@/constants/constants";
import { MUTED, TEXT } from "@/constants/theme";
import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

const SETTINGS = [
  { id: "notif", label: "Notificaciones", icon: "🔔" },
  { id: "privacy", label: "Privacidad", icon: "🔒" },
  { id: "about", label: "Acerca de la app", icon: "ℹ️" },
];

export function AjustesTab() {
  return (
    <View style={s.settingsCard}>
      {SETTINGS.map((item, i) => (
        <View key={item.id}>
          <Pressable
            style={({ pressed }) => [s.settingRow, pressed && { opacity: 0.7 }]}
          >
            <Text style={s.settingEmoji}>{item.icon}</Text>
            <Text style={s.settingLabel}>{item.label}</Text>
            <ChevronRight size={16} color={MUTED} />
          </Pressable>
          {i < SETTINGS.length - 1 && <View style={s.separator} />}
        </View>
      ))}
      <Text style={s.version}>Versión 1.0.0</Text>
    </View>
  );
}

const s = StyleSheet.create({
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: SPACING * 2,
    paddingHorizontal: SPACING * 1.8,
    paddingTop: 0,
    marginTop: SPACING * 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING * 1.4,
    gap: SPACING * 1.2,
  },
  settingEmoji: { fontSize: 18, width: 28, textAlign: "center" },
  settingLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: TEXT },
  separator: { height: 1, backgroundColor: "#F9FAFB", marginLeft: 40 },
  version: {
    fontSize: 11,
    color: MUTED,
    textAlign: "center",
    marginTop: SPACING * 1.5,
    paddingBottom: SPACING,
  },
});
