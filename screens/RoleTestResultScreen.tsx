import { RadarChart } from "@/components/roleTest/RadarChart";
import { RoleBarChart } from "@/components/roleTest/RoleBarChart";
import { SPACING } from "@/constants/constants";
import { BG, MUTED, TEXT } from "@/constants/theme";
import { ROLES } from "@/data/roleTestData";
import { RoleKey, RoleScores } from "@/types/roleTest";
import { router, useLocalSearchParams } from "expo-router";
import {
  Cloud,
  Database,
  LucideIcon,
  Monitor,
  Server,
  Shield,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type IconConfig = { Icon: LucideIcon; bg: string; color: string; size: number };

const ROLE_ICON: Record<RoleKey, IconConfig> = {
  frontend: { Icon: Monitor, bg: "#FEF3C7", color: "#D97706", size: 28 },
  backend: { Icon: Server, bg: "#DBEAFE", color: "#2563EB", size: 28 },
  datos: { Icon: Database, bg: "#EDE9FE", color: "#7C3AED", size: 28 },
  devops: { Icon: Cloud, bg: "#DCFCE7", color: "#16A34A", size: 28 },
  seguridad: { Icon: Shield, bg: "#FEE2E2", color: "#DC2626", size: 28 },
};

export default function RoleTestResultScreen() {
  const { bottom } = useSafeAreaInsets();
  const { scores: raw } = useLocalSearchParams<{ scores: string }>();
  const scores: RoleScores = raw
    ? JSON.parse(raw)
    : { frontend: 0, backend: 0, datos: 0, devops: 0, seguridad: 0 };

  const ranked = [...ROLES].sort(
    (a, b) => (scores[b.key] ?? 0) - (scores[a.key] ?? 0),
  );
  const topRole = ranked[0];
  const maxPossible = 4 * 5;

  const pct = (key: RoleKey) =>
    Math.round(((scores[key] ?? 0) / maxPossible) * 100);

  const {
    Icon: TopIcon,
    bg: topBg,
    color: topColor,
    size: topSize,
  } = ROLE_ICON[topRole.key];

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: bottom + SPACING * 4 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSub}>Tu resultado</Text>
          <Text style={styles.headerTitle}>Tu perfil tech</Text>
        </View>

        {/* Top role highlight */}
        <View style={[styles.topCard, { borderLeftColor: topColor }]}>
          <View style={[styles.topIconBox, { backgroundColor: topBg }]}>
            <TopIcon size={topSize} color={topColor} strokeWidth={1.6} />
          </View>
          <View style={styles.topBody}>
            <Text style={styles.topLabel}>Tu rol dominante</Text>
            <Text style={styles.topName}>{topRole.label}</Text>
            <Text style={styles.topPct}>{pct(topRole.key)}% afinidad</Text>
          </View>
          <View style={[styles.topBadge, { backgroundColor: topColor + "22" }]}>
            <Text style={[styles.topBadgeText, { color: topColor }]}>#1</Text>
          </View>
        </View>

        {/* Radar chart — dark premium card */}
        <View style={styles.radarCard}>
          <Text style={styles.radarLabel}>Distribución de roles</Text>
          <View style={styles.radarWrap}>
            <RadarChart scores={scores} size={440} />
          </View>
        </View>

        {/* Horizontal bars */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Puntaje por rol</Text>
          <RoleBarChart scores={scores} />
        </View>

        {/* Top role description */}
        <View style={[styles.descCard, { borderColor: topColor + "44" }]}>
          <View style={styles.descHeader}>
            <View style={[styles.descIconBox, { backgroundColor: topBg }]}>
              <TopIcon size={20} color={topColor} strokeWidth={1.6} />
            </View>
            <Text style={styles.descTitle}>{topRole.label}</Text>
          </View>
          <Text style={styles.descText}>{topRole.description}</Text>
          <View style={styles.stackChip}>
            <Text style={styles.stackLabel}>Stack recomendado</Text>
            <Text style={styles.stackText}>{topRole.stack}</Text>
          </View>
        </View>

        {/* Retry button */}
        <Pressable
          style={({ pressed }) => [
            styles.retryBtn,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.replace("/role-test")}
        >
          <Text style={styles.retryText}>Repetir test</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.profileBtn,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.replace("/(tab)/three")}
        >
          <Text style={styles.profileBtnText}>Ir a Perfil</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: {
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 2,
    gap: SPACING * 1.8,
  },

  header: { gap: 3 },
  headerSub: {
    fontSize: 12,
    fontWeight: "600",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  headerTitle: { fontSize: 28, fontWeight: "900", color: TEXT },

  topCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderLeftWidth: 5,
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING * 1.8,
    gap: SPACING * 1.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  topIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  topBody: { flex: 1, gap: 3 },
  topLabel: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  topName: { fontSize: 18, fontWeight: "900", color: TEXT },
  topPct: { fontSize: 13, color: MUTED, fontWeight: "600" },
  topBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  topBadgeText: { fontSize: 16, fontWeight: "900" },

  radarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: SPACING * 2,
    paddingHorizontal: SPACING,
    alignItems: "center",
    gap: SPACING,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  radarLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
    alignSelf: "flex-start",
    paddingLeft: SPACING,
  },
  radarWrap: { alignItems: "center" },

  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: SPACING * 2,
    gap: SPACING * 1.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  descCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1.5,
    padding: SPACING * 2,
    gap: SPACING,
  },
  descHeader: { flexDirection: "row", alignItems: "center", gap: SPACING },
  descIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  descTitle: { fontSize: 17, fontWeight: "800", color: TEXT },
  descText: { fontSize: 13, color: MUTED, lineHeight: 20 },
  stackChip: {
    backgroundColor: BG,
    borderRadius: 12,
    padding: SPACING * 1.2,
    gap: 4,
  },
  stackLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  stackText: { fontSize: 12, fontWeight: "600", color: TEXT, lineHeight: 18 },

  retryBtn: {
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 50,
    paddingVertical: SPACING * 1.5,
    alignItems: "center",
  },
  retryText: { fontSize: 14, fontWeight: "700", color: MUTED },

  profileBtn: {
    backgroundColor: "#111827",
    borderRadius: 50,
    paddingVertical: SPACING * 1.5,
    alignItems: "center",
  },
  profileBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
