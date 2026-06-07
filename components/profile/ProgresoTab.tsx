import { Ionicons } from "@expo/vector-icons";
import { SPACING } from "@/constants/constants";
import { ARCHETYPE, AREA_META } from "@/constants/diagnosticData";
import { BORDER, MUTED, P_SLATE, P_TEAL, TEXT } from "@/constants/theme";
import { WEEKLY_CHALLENGES } from "@/data/weeklyData";
import { useUserStore } from "@/store/useUserStore";
import { AlertCircle, Lightbulb } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { CircleProgress } from "./CircleProgress";

const SKILL_AREAS = [
  { id: "adivina_concepto", label: "Conceptos", emoji: "🧠", color: P_TEAL.fg },
  { id: "completa_reflexion", label: "Reflexiones", emoji: "✨", color: P_SLATE.fg },
];

type Props = {
  progress: Record<string, number>;
  topArea: string;
};

export function ProgresoTab({ progress, topArea }: Props) {
  const archetype = ARCHETYPE[topArea] ?? ARCHETYPE.emociones;
  const areaMeta = AREA_META[topArea];

  const scores = useUserStore((s) => s.diagnostic?.scores) ?? {};
  const sortedAreas = Object.entries(scores)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxScore = sortedAreas[0]?.[1] ?? 1;

  return (
    <View style={s.tabContent}>

      {/* ── Hero arquetipo ── */}
      <View style={[s.heroCard, { backgroundColor: archetype.bg }]}>
        <View style={s.heroTop}>
          <View style={[s.heroIconWrap, { backgroundColor: archetype.color + "22" }]}>
            <Ionicons name={archetype.icon as any} size={26} color={archetype.color} />
          </View>
          <View style={s.heroTextBlock}>
            <Text style={s.heroEtiqueta}>Tu arquetipo</Text>
            <Text style={[s.heroTipo, { color: archetype.color }]}>{archetype.tipo}</Text>
          </View>
        </View>
        <Text style={[s.heroTagline, { color: archetype.color }]}>{archetype.tagline}</Text>
        <Text style={s.heroDesc}>{archetype.desc}</Text>
      </View>

      {/* ── Áreas de enfoque ── */}
      {sortedAreas.length > 0 && (
        <View style={s.areasCard}>
          <Text style={s.sectionTitle}>Áreas de enfoque</Text>
          {sortedAreas.map(([area, score]) => {
            const meta = AREA_META[area];
            if (!meta) return null;
            const pct = Math.round((score / maxScore) * 100);
            return (
              <View key={area} style={s.areaRow}>
                <Text style={[s.areaLabel, { color: meta.color }]}>{meta.short}</Text>
                <View style={s.areaBarBg}>
                  <View
                    style={[
                      s.areaBarFill,
                      { width: `${pct}%` as any, backgroundColor: meta.color },
                    ]}
                  />
                </View>
                <Text style={[s.areaScore, { color: meta.color }]}>{score}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* ── Tips — CORREGIDO ── */}
      <View style={s.tipCard}>
        <View style={s.tipHeaderRow}>
          <AlertCircle size={16} color="#D06A4C" strokeWidth={2} />
          <Text style={s.tipSectionTitle}>Área a fortalecer</Text>
        </View>
        <Text style={s.tipFocusText}>
          {archetype.mejorar ?? "Mantén la constancia en tu proceso de bienestar."}
        </Text>

        <View style={s.tipDivider} />

        <View style={s.tipHeaderRow}>
          <Lightbulb size={16} color="#EAA023" strokeWidth={2} />
          <Text style={s.tipSectionTitle}>Tip Recomendado</Text>
        </View>
        <Text style={s.tipDescText}>
          {areaMeta?.insight ?? "Dedica 5 minutos al día a observar cómo te sientes sin juzgarte."}
        </Text>
      </View>

      {/* ── Métricas de aprendizaje ── */}
      <Text style={s.sectionDividerTitle}>Métricas de Aprendizaje</Text>

      {SKILL_AREAS.map((area, idx) => {
        const challenge = WEEKLY_CHALLENGES.find((c) => c.id === area.id);
        const done = progress[area.id] ?? 0;
        const total = challenge?.questions.length ?? 1;
        const pct = Math.round((done / total) * 100);

        return (
          <View key={area.id} style={idx > 0 ? s.domainSeparator : undefined}>
            <View style={s.domainRow}>
              <Text style={s.domainLabel}>Dominio</Text>
              <View style={s.domainRight}>
                <Text style={s.domainEmoji}>{area.emoji}</Text>
                <Text style={[s.domainName, { color: area.color }]}>{area.label}</Text>
              </View>
            </View>

            <View style={s.circleWrap}>
              <CircleProgress pct={pct} color={area.color} size={140} />
              <View style={s.circleInner}>
                <Text style={s.circlePct}>{pct} %</Text>
              </View>
            </View>
            <Text style={s.circleSub}>Dominio de {area.label.toLowerCase()}</Text>

            <View style={s.statsRow}>
              <View style={s.statItem}>
                <Text style={s.statEmoji}>📈</Text>
                <Text style={s.statValue}>{done * 3}</Text>
                <Text style={s.statLabel}>Conceptos aprendidos</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statItem}>
                <Text style={s.statEmoji}>🏆</Text>
                <Text style={s.statValue}>{done >= total ? 1 : 0}</Text>
                <Text style={s.statLabel}>Certificados</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  tabContent: { paddingTop: SPACING * 2 },

  /* Results card */
  resultsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: SPACING * 2,
    padding: SPACING * 1.5,
    marginBottom: SPACING * 1.5,
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.15)",
    shadowColor: "#8980B8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  resultsLeft: { flex: 1, gap: 3 },
  resultsLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  resultsTitle: { fontSize: 15, fontWeight: "800", color: TEXT },
  resultsDate: { fontSize: 11, color: MUTED, fontWeight: "500" },

  /* Hero card */
  heroCard: {
    borderRadius: 20,
    marginHorizontal: SPACING * 2,
    padding: SPACING * 1.8,
    marginBottom: SPACING * 1.5,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING,
    marginBottom: SPACING,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTextBlock: { flex: 1 },
  heroEtiqueta: {
    fontSize: 10,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  heroTipo: { fontSize: 20, fontWeight: "900", letterSpacing: -0.4 },
  heroTagline: {
    fontSize: 13,
    fontWeight: "700",
    fontStyle: "italic",
    marginBottom: SPACING * 0.8,
    opacity: 0.9,
  },
  heroDesc: {
    fontSize: 13,
    color: "#444",
    lineHeight: 20,
    fontWeight: "400",
  },

  /* Áreas */
  areasCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: SPACING * 2,
    padding: SPACING * 1.5,
    marginBottom: SPACING * 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: SPACING * 1.2,
  },
  areaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING,
    marginBottom: SPACING * 0.8,
  },
  areaLabel: { fontSize: 12, fontWeight: "700", width: 56 },
  areaBarBg: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#F0EDF8",
    overflow: "hidden",
  },
  areaBarFill: { height: "100%", borderRadius: 4 },
  areaScore: { fontSize: 11, fontWeight: "700", width: 20, textAlign: "right" },

  /* Tip card */
  tipCard: {
    backgroundColor: "#FAF9FE",
    borderRadius: 16,
    marginHorizontal: SPACING * 2,
    padding: SPACING * 1.5,
    borderWidth: 1,
    borderColor: "rgba(137,128,184,0.12)",
    marginBottom: SPACING * 2.5,
  },
  tipHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  tipSectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tipFocusText: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT,
    lineHeight: 19,
    marginBottom: 12,
  },
  tipDivider: {
    height: 1,
    backgroundColor: "rgba(137,128,184,0.12)",
    marginVertical: 10,
  },
  tipDescText: {
    fontSize: 13,
    color: "#4A4A5A",
    lineHeight: 19,
    fontWeight: "400",
  },

  /* Learning metrics */
  sectionDividerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginHorizontal: SPACING * 2,
    marginBottom: SPACING,
  },
  domainSeparator: {
    marginTop: SPACING * 3,
    borderTopWidth: 1,
    borderColor: BORDER,
    paddingTop: SPACING * 2,
  },
  domainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    marginBottom: SPACING * 1.5,
  },
  domainLabel: { fontSize: 14, fontWeight: "700", color: TEXT },
  domainRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  domainEmoji: { fontSize: 16 },
  domainName: { fontSize: 14, fontWeight: "700" },
  circleWrap: {
    alignItems: "center",
    position: "relative",
    marginBottom: SPACING * 0.5,
  },
  circleInner: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  circlePct: { fontSize: 26, fontWeight: "900", color: TEXT, letterSpacing: -1 },
  circleSub: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: TEXT,
    marginBottom: SPACING * 2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: BORDER,
    marginHorizontal: SPACING * 2,
    paddingTop: SPACING * 1.5,
    paddingBottom: SPACING * 0.5,
  },
  statItem: { flex: 1, alignItems: "center", gap: 3 },
  statEmoji: { fontSize: 18 },
  statValue: { fontSize: 18, fontWeight: "800", color: TEXT },
  statLabel: { fontSize: 11, color: MUTED, fontWeight: "500", textAlign: "center" },
  statDivider: { width: 1, height: 44, backgroundColor: BORDER },
});
