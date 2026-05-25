import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import { BG, MUTED, TEXT } from "@/constants/theme";
import { RoleKey } from "@/types/roleTest";
import { router } from "expo-router";
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

const BAR_HEIGHT = TAB_ITEM_SIZE + SPACING * 1.5;
const ACCENT = "#34D59A";

type RoleItem = {
  Icon: LucideIcon;
  label: string;
  desc: string;
  color: string;
  bg: string;
};

const ROLES: Record<RoleKey, RoleItem> = {
  frontend: {
    Icon: Monitor,
    label: "Frontend / UX",
    desc: "Interfaces y experiencia visual",
    color: "#D97706",
    bg: "#FEF3C7",
  },
  backend: {
    Icon: Server,
    label: "Backend",
    desc: "APIs, lógica y bases de datos",
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  datos: {
    Icon: Database,
    label: "Datos / IA",
    desc: "Modelos, análisis y predicciones",
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
  devops: {
    Icon: Cloud,
    label: "DevOps / Cloud",
    desc: "Infraestructura y automatización",
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  seguridad: {
    Icon: Shield,
    label: "Ciberseguridad",
    desc: "Seguridad y protección de datos",
    color: "#DC2626",
    bg: "#FEE2E2",
  },
};

const KEYS: RoleKey[] = ["frontend", "backend", "datos", "devops", "seguridad"];

export default function RoleTestScreen() {
  const { bottom } = useSafeAreaInsets();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
      <ScreenHeader title="Mi Rol" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: BAR_HEIGHT + bottom + SPACING * 2,
        }}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          {/* Icon strip */}

          {/* Title block */}
          <View style={styles.titleBlock}>
            <Text style={styles.eyebrow}>Test de personalidad tech</Text>
            <Text style={styles.heroTitle}>Descubre tu perfil.</Text>
            <Text style={styles.heroSub}>
              20 preguntas para identificar qué rol del ecosistema tech define
              mejor tu forma de pensar y trabajar.
            </Text>
            <View style={styles.iconStrip}>
              {KEYS.map((key) => {
                const { Icon, color, bg } = ROLES[key];
                return (
                  <View
                    key={key}
                    style={[
                      styles.iconChip,
                      {
                        backgroundColor: bg,
                      },
                    ]}
                  >
                    <Icon size={18} color={color} strokeWidth={1.6} />
                  </View>
                );
              })}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>20</Text>
              <Text style={styles.statLabel}>preguntas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>perfiles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>duración</Text>
            </View>
          </View>

          {/* CTA */}
          <Pressable
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
            onPress={() => router.push("/role-test")}
          >
            <Text style={styles.ctaText}>Comenzar test</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </Pressable>
        </View>

        {/* ── Roles list ── */}
        <View style={styles.listSection}>
          <Text style={styles.listLabel}>Los 5 perfiles</Text>

          {KEYS.map((key, i) => {
            const { Icon, label, desc, color, bg } = ROLES[key];
            return (
              <View key={key}>
                <View style={styles.roleRow}>
                  <View style={[styles.roleIcon, { backgroundColor: bg }]}>
                    <Icon size={17} color={color} strokeWidth={1.6} />
                  </View>
                  <View style={styles.roleText}>
                    <Text style={styles.roleName}>{label}</Text>
                    <Text style={styles.roleDesc}>{desc}</Text>
                  </View>
                  <View style={[styles.roleDot, { backgroundColor: color }]} />
                </View>
                {i < KEYS.length - 1 && <View style={styles.separator} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  /* ── Hero ── */
  hero: {
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 2,
    paddingBottom: SPACING * 3,
    gap: SPACING * 2,
  },

  iconStrip: {
    flexDirection: "row",
    gap: SPACING,
    justifyContent: "center",
  },
  iconChip: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  titleBlock: { gap: SPACING * 0.6 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "600",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -1.5,
    lineHeight: 44,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 20,
    marginTop: SPACING * 0.5,
    maxWidth: 300,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: SPACING * 1.4,
    paddingHorizontal: SPACING * 2,
    gap: 0,
  },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.5,
  },
  statLabel: { fontSize: 11, color: MUTED, fontWeight: "500" },
  statDivider: { width: 1, height: 32, backgroundColor: "#F3F4F6" },

  cta: {
    backgroundColor: TEXT,
    borderRadius: 16,
    paddingVertical: SPACING * 1.6,
    paddingHorizontal: SPACING * 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  ctaArrow: { fontSize: 18, color: ACCENT, fontWeight: "800" },

  /* ── Roles list ── */
  listSection: {
    marginHorizontal: SPACING * 2,
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING * 1.8,
    paddingTop: SPACING * 1.8,
    paddingBottom: SPACING,
    gap: 0,
  },
  listLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: SPACING * 0.6,
  },

  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING * 1.1,
    gap: SPACING * 1.2,
  },
  roleIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  roleText: { flex: 1, gap: 2 },
  roleName: { fontSize: 14, fontWeight: "700", color: TEXT },
  roleDesc: { fontSize: 11, color: MUTED, lineHeight: 15 },
  roleDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  separator: {
    height: 1,
    backgroundColor: "#F9FAFB",
    marginLeft: 38 + SPACING * 1.2,
  },
});
