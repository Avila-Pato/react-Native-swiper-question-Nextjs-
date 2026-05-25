import { SPACING } from "@/constants/constants";
import { ROLES } from "@/data/roleTestData";
import { RoleKey, RoleScores } from "@/types/roleTest";
import { Cloud, Database, LucideIcon, Monitor, Server, Shield } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type IconCfg = { Icon: LucideIcon; bg: string };

const ICON_MAP: Record<RoleKey, IconCfg> = {
  frontend:  { Icon: Monitor,  bg: "#FEF3C7" },
  backend:   { Icon: Server,   bg: "#DBEAFE" },
  datos:     { Icon: Database, bg: "#EDE9FE" },
  devops:    { Icon: Cloud,    bg: "#DCFCE7" },
  seguridad: { Icon: Shield,   bg: "#FEE2E2" },
};

const MAX = 4 * 5;

type Props = { scores: RoleScores };

export function RoleBarChart({ scores }: Props) {
  const sorted = [...ROLES].sort((a, b) => (scores[b.key] ?? 0) - (scores[a.key] ?? 0));

  return (
    <View style={s.container}>
      {sorted.map((role, i) => {
        const raw = scores[role.key] ?? 0;
        const pct = Math.min(Math.round((raw / MAX) * 100), 100);
        const { Icon, bg } = ICON_MAP[role.key];
        const isTop = i === 0;

        return (
          <View key={role.key} style={s.row}>
            {/* Icon + label */}
            <View style={s.labelCol}>
              <View style={[s.iconBox, { backgroundColor: bg }]}>
                <Icon size={14} color={role.color} strokeWidth={1.8} />
              </View>
              <Text style={[s.label, isTop && { color: "#111827", fontWeight: "700" }]}>
                {role.label}
              </Text>
            </View>

            {/* Bar */}
            <View style={s.barTrack}>
              <View
                style={[
                  s.barFill,
                  {
                    width: `${pct}%`,
                    backgroundColor: isTop ? role.color : role.color + "88",
                    height: isTop ? 7 : 5,
                  },
                ]}
              />
            </View>

            {/* Percentage */}
            <Text style={[s.pct, isTop && { color: "#374151", fontWeight: "700" }]}>
              {pct}%
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: SPACING * 1.4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING,
  },
  labelCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    width: 130,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
    flexShrink: 1,
  },
  barTrack: {
    flex: 1,
    height: 7,
    backgroundColor: "#F3F4F6",
    borderRadius: 99,
    overflow: "hidden",
    justifyContent: "center",
  },
  barFill: {
    borderRadius: 99,
  },
  pct: {
    width: 36,
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
    textAlign: "right",
  },
});
