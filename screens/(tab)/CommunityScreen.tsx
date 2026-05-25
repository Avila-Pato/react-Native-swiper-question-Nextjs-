import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import { ACCENT, BG, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const BAR_HEIGHT = TAB_ITEM_SIZE + SPACING * 1.5;

const FEATURES = [
  { icon: "💬", title: "Foros de discusión",  desc: "Habla con otros exploradores sobre tech" },
  { icon: "🤝", title: "Proyectos grupales",   desc: "Colabora en retos reales con tu comunidad" },
  { icon: "🏆", title: "Ranking global",        desc: "Compite y muestra tu progreso al mundo" },
  { icon: "📚", title: "Recursos compartidos", desc: "Guías y recursos curados por la comunidad" },
];

export default function CommunityScreen() {
  const { bottom } = useSafeAreaInsets();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={s.root}>
      <ScreenHeader title="Comunidad" />
      <View style={[s.container, { paddingBottom: BAR_HEIGHT + bottom + SPACING * 2 }]}>

        {/* ── Sub-header ── */}
        <View style={s.header}>
          <Text style={s.eyebrow}>Próximamente</Text>
          <Text style={s.sub}>
            Estamos construyendo un espacio donde los exploradores tech se conectan,
            aprenden juntos y se retan entre sí.
          </Text>
        </View>

        {/* ── Status badge ── */}
        <View style={s.statusBadge}>
          <View style={s.statusDot} />
          <Text style={s.statusText}>En desarrollo · Llega pronto</Text>
        </View>

        {/* ── Features coming ── */}
        <View style={s.featuresCard}>
          <Text style={s.featuresLabel}>Qué viene</Text>
          {FEATURES.map((f, i) => (
            <View key={f.title}>
              <View style={s.featureRow}>
                <View style={s.featureIconWrap}>
                  <Text style={s.featureIcon}>{f.icon}</Text>
                </View>
                <View style={s.featureText}>
                  <Text style={s.featureTitle}>{f.title}</Text>
                  <Text style={s.featureDesc}>{f.desc}</Text>
                </View>
              </View>
              {i < FEATURES.length - 1 && <View style={s.separator} />}
            </View>
          ))}
        </View>

        <Text style={s.footer}>Sigue explorando mientras tanto 🚀</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  container: {
    flex: 1,
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 3,
    alignItems: "center",
    gap: SPACING * 2,
  },

  /* Header */
  header: { alignItems: "center", gap: SPACING * 0.8, maxWidth: 300 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -1.5,
  },
  sub: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 20,
    textAlign: "center",
  },

  /* Status */
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: ACCENT + "18",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: ACCENT + "44",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: ACCENT,
  },
  statusText: { fontSize: 12, fontWeight: "700", color: ACCENT },

  /* Features */
  featuresCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: SPACING * 1.8,
    paddingTop: SPACING * 1.8,
    paddingBottom: SPACING,
  },
  featuresLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: SPACING,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING * 1.2,
    gap: SPACING * 1.4,
  },
  featureIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: CARD_BG,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureIcon: { fontSize: 20 },
  featureText: { flex: 1, gap: 3 },
  featureTitle: { fontSize: 14, fontWeight: "700", color: TEXT },
  featureDesc: { fontSize: 12, color: MUTED, lineHeight: 16 },
  separator: { height: 1, backgroundColor: "#F9FAFB", marginLeft: 42 + SPACING * 1.4 },

  footer: { fontSize: 13, color: MUTED, marginTop: SPACING },
});
