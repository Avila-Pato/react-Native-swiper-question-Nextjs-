import { RadarChart as RadarChartFull } from "@/components/roleTest/RadarChart";
import { RoleBarChart } from "@/components/roleTest/RoleBarChart";
import { RadarChart as RadarChartSimple } from "@/components/ui/RadarChart";
import { SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import { ROLES } from "@/data/roleTestData";
import { BG, MUTED, TEXT } from "@/constants/theme";
import { useUserStore } from "@/store/useUserStore";
import { RoleKey, RoleScores } from "@/types/roleTest";
import { router } from "expo-router";
import {
  Compass,
  Eye,
  LucideIcon,
  Shield,
  Sun,
  Users,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const BAR_HEIGHT = TAB_ITEM_SIZE + SPACING * 1.5;
const ACCENT = "#8980B8";
const MAX_SCORE = 4 * 5;

type IconConfig = { Icon: LucideIcon; bg: string; color: string };

const ROLE_ICON: Record<RoleKey, IconConfig> = {
  limites:          { Icon: Shield,  bg: "#EDE9FE", color: "#7C3AED" },
  autoconocimiento: { Icon: Eye,     bg: "#E0F2FE", color: "#0284C7" },
  vinculos:         { Icon: Users,   bg: "#E8F0EE", color: "#4D8B7A" },
  felicidad:        { Icon: Sun,     bg: "#FEF3C7", color: "#D97706" },
  proposito:        { Icon: Compass, bg: "#EDE9F8", color: "#7B6BB5" },
};

const ROLE_KEYS: RoleKey[] = ["limites", "autoconocimiento", "vinculos", "felicidad", "proposito"];
const RADAR_COLORS  = ROLE_KEYS.map((k) => ROLE_ICON[k].color);
const RADAR_LABELS_SHORT: Record<RoleKey, string> = {
  limites: "Límites",
  autoconocimiento: "Autocon.",
  vinculos: "Vínculos",
  felicidad: "Felicidad",
  proposito: "Propósito",
};

export default function RoleTestScreen() {
  const { bottom } = useSafeAreaInsets();
  const assessment       = useUserStore((s) => s.assessment);
  const onboarding       = useUserStore((s) => s.onboarding);
  const resetAssessment  = useUserStore((s) => s.resetAssessment);

  const completed   = !!assessment?.completed;
  const scores      = assessment?.scores as RoleScores | undefined;

  // Ranked roles for results view
  const ranked      = [...ROLES].sort((a, b) => (scores?.[b.key] ?? 0) - (scores?.[a.key] ?? 0));
  const topRoleData = ranked[0];
  const topIconCfg  = ROLE_ICON[topRoleData?.key ?? "proposito"];
  const TopIcon     = topIconCfg.Icon;
  const pct         = (key: RoleKey) =>
    scores ? Math.round(((scores[key] ?? 0) / MAX_SCORE) * 100) : 0;

  // Pre-test simple radar values (empty)
  const simpleRadarValues = completed && scores
    ? (() => {
        const vals = ROLE_KEYS.map((k) => scores[k] ?? 0);
        const max  = Math.max(...vals, 1);
        return vals.map((v) => v / max);
      })()
    : ROLE_KEYS.map(() => 0);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: BAR_HEIGHT + bottom + SPACING * 2 }}
      >
        {/* ── Hero ── */}
        <View style={s.hero}>
          <Text style={s.eyebrow}>
            {completed ? "Tu resultado" : "Test de bienestar"}
          </Text>
          <Text style={s.heroTitle}>
            {completed
              ? "Tu mapa de bienestar."
              : (onboarding?.nombre ? `Hola, ${onboarding.nombre}.` : "Mi Mapa.")}
          </Text>
          <Text style={s.heroSub}>
            {completed
              ? "Aquí está tu análisis completo. Úsalo como brújula en tu camino."
              : "Descubre qué área de tu bienestar tiene más potencial de transformación ahora."}
          </Text>
        </View>

        {/* ── Body ── */}
        <View style={s.body}>

          {completed && scores ? (
            <>
              {/* Top role highlight */}
              <View style={[s.topCard, { borderLeftColor: topRoleData.color }]}>
                <View style={[s.topIconBox, { backgroundColor: topIconCfg.bg }]}>
                  <TopIcon size={28} color={topIconCfg.color} strokeWidth={1.6} />
                </View>
                <View style={s.topBody}>
                  <Text style={s.topLabel}>Tu área principal</Text>
                  <Text style={s.topName}>{topRoleData.label}</Text>
                  <Text style={s.topPct}>{pct(topRoleData.key)}% afinidad</Text>
                </View>
                <View style={[s.topBadge, { backgroundColor: topRoleData.color + "22" }]}>
                  <Text style={[s.topBadgeText, { color: topRoleData.color }]}>#1</Text>
                </View>
              </View>

              {/* Full radar — uses the rich roleTest version */}
              <View style={s.radarCard}>
                <Text style={s.cardLabel}>Distribución de áreas</Text>
                <View style={s.radarWrap}>
                  <RadarChartFull scores={scores} size={280} />
                </View>
              </View>

              {/* Bar chart */}
              <View style={s.chartCard}>
                <Text style={s.cardLabel}>Puntaje por área</Text>
                <RoleBarChart scores={scores} />
              </View>

              {/* Top role description */}
              <View style={[s.descCard, { borderColor: topRoleData.color + "44" }]}>
                <View style={s.descHeader}>
                  <View style={[s.descIconBox, { backgroundColor: topIconCfg.bg }]}>
                    <TopIcon size={20} color={topIconCfg.color} strokeWidth={1.6} />
                  </View>
                  <Text style={s.descTitle}>{topRoleData.label}</Text>
                </View>
                <Text style={s.descText}>{topRoleData.description}</Text>
                <View style={s.stackChip}>
                  <Text style={s.stackLabel}>Para explorar</Text>
                  <Text style={s.stackText}>{topRoleData.stack}</Text>
                </View>
              </View>

              {/* Reiniciar */}
              <Pressable
                style={({ pressed }) => [s.retakeBtn, pressed && { opacity: 0.6 }]}
                onPress={resetAssessment}
              >
                <Text style={s.retakeText}>Reiniciar test</Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* Simple radar template */}
              <View style={s.radarCard}>
                <Text style={s.cardLabel}>Las 5 dimensiones</Text>
                <View style={s.radarWrap}>
                  <RadarChartSimple
                    labels={ROLE_KEYS.map((k) => RADAR_LABELS_SHORT[k])}
                    colors={RADAR_COLORS}
                    values={simpleRadarValues}
                    color={ACCENT}
                    size={220}
                  />
                </View>
                <Text style={s.radarHint}>Completa el test para ver tu mapa</Text>
              </View>

              {/* Stats strip */}
              <View style={s.statsRow}>
                <View style={s.statItem}>
                  <Text style={s.statValue}>20</Text>
                  <Text style={s.statLabel}>preguntas</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.statItem}>
                  <Text style={s.statValue}>5</Text>
                  <Text style={s.statLabel}>dimensiones</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.statItem}>
                  <Text style={s.statValue}>5 min</Text>
                  <Text style={s.statLabel}>duración</Text>
                </View>
              </View>

              {/* Intro */}
              <View style={s.introCard}>
                <Text style={s.introTitle}>¿Qué es Mi Mapa?</Text>
                <Text style={s.introText}>
                  Tu Mapa de Bienestar es una radiografía de cómo estás en las 5 dimensiones que más
                  impactan tu vida: límites, autoconocimiento, vínculos, felicidad y propósito.
                </Text>
                <Text style={s.introText}>
                  El test te ayuda a identificar tu área de mayor potencial para que puedas enfocarte
                  donde realmente importa.
                </Text>
              </View>

              {/* CTA */}
              <Pressable
                style={({ pressed }) => [s.cta, pressed && { opacity: 0.85 }]}
                onPress={() => router.push("/role-test")}
              >
                <Text style={s.ctaText}>Comenzar test</Text>
                <Text style={s.ctaArrow}>→</Text>
              </Pressable>

              {/* Roles list */}
              <View style={s.listSection}>
                <Text style={s.listLabel}>Las 5 dimensiones</Text>
                {ROLES.map((role, i) => {
                  const cfg = ROLE_ICON[role.key];
                  const Icon = cfg.Icon;
                  return (
                    <View key={role.key}>
                      <View style={s.roleRow}>
                        <View style={[s.roleIcon, { backgroundColor: cfg.bg }]}>
                          <Icon size={17} color={cfg.color} strokeWidth={1.6} />
                        </View>
                        <View style={s.roleText}>
                          <Text style={s.roleName}>{role.label}</Text>
                          <Text style={s.roleDesc}>{role.description.slice(0, 72)}…</Text>
                        </View>
                        <View style={[s.roleDot, { backgroundColor: cfg.color }]} />
                      </View>
                      {i < ROLES.length - 1 && <View style={s.separator} />}
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  /* Hero */
  hero: {
    backgroundColor: ACCENT,
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 1.5,
    paddingBottom: SPACING * 6,
    gap: SPACING * 0.6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1.2,
    lineHeight: 40,
  },
  heroSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 20,
    maxWidth: 300,
  },

  /* Body */
  body: {
    backgroundColor: BG,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 2.5,
    gap: SPACING * 1.5,
  },

  /* Top role card */
  topCard: {
    backgroundColor: "#fff",
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
  topLabel: { fontSize: 11, color: MUTED, fontWeight: "600", textTransform: "uppercase" },
  topName:  { fontSize: 18, fontWeight: "900", color: TEXT },
  topPct:   { fontSize: 13, color: MUTED, fontWeight: "600" },
  topBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  topBadgeText: { fontSize: 16, fontWeight: "900" },

  /* Shared card */
  radarCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: SPACING * 2,
    paddingHorizontal: SPACING,
    alignItems: "center",
    gap: SPACING,
    shadowColor: "#8980B8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    alignSelf: "flex-start",
    paddingLeft: SPACING,
  },
  radarWrap: { alignItems: "center" },
  radarHint: {
    fontSize: 11,
    color: MUTED,
    fontStyle: "italic",
  },

  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: SPACING * 2,
    gap: SPACING * 1.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  descCard: {
    backgroundColor: "#fff",
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
  descText:  { fontSize: 13, color: MUTED, lineHeight: 20 },
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

  retakeBtn: { alignItems: "center", paddingVertical: SPACING },
  retakeText: { fontSize: 13, fontWeight: "600", color: MUTED },

  introCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: SPACING * 2,
    gap: SPACING * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  introTitle: { fontSize: 15, fontWeight: "800", color: TEXT, marginBottom: 2 },
  introText:  { fontSize: 13, color: MUTED, lineHeight: 20 },

  /* Pre-test only */
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: SPACING * 1.4,
    paddingHorizontal: SPACING * 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statItem:   { flex: 1, alignItems: "center", gap: 2 },
  statValue:  { fontSize: 20, fontWeight: "800", color: TEXT, letterSpacing: -0.5 },
  statLabel:  { fontSize: 11, color: MUTED, fontWeight: "500" },
  statDivider:{ width: 1, height: 32, backgroundColor: "#F3F4F6" },

  cta: {
    backgroundColor: TEXT,
    borderRadius: 16,
    paddingVertical: SPACING * 1.6,
    paddingHorizontal: SPACING * 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaText:  { fontSize: 15, fontWeight: "700", color: "#fff" },
  ctaArrow: { fontSize: 18, color: ACCENT, fontWeight: "800" },

  listSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: SPACING * 1.8,
    paddingTop: SPACING * 1.8,
    paddingBottom: SPACING,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
  roleDot:  { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  separator: {
    height: 1,
    backgroundColor: "#F9FAFB",
    marginLeft: 38 + SPACING * 1.2,
  },
});
