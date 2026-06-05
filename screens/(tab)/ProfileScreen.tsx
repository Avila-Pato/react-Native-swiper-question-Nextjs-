import { SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import { ARCHETYPE, AREA_META } from "@/constants/diagnosticData";
import { ACCENT, BG, BORDER, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { getAllProgress } from "@/store/challengeProgress";
import { getMoodHistory, MoodHistory } from "@/store/moodHistory";
import { useUserStore } from "@/store/useUserStore";
import { AjustesTab } from "@/components/profile/AjustesTab";
import { EjerciciosTab } from "@/components/profile/EjerciciosTab";
import { HumorTab } from "@/components/profile/HumorTab";
import { ProgresoTab } from "@/components/profile/ProgresoTab";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { SlidersHorizontal, UserPlus } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const BAR_HEIGHT = TAB_ITEM_SIZE + SPACING * 1.5;

type Tab = "progreso" | "ejercicios" | "humor" | "ajustes";

const TABS: { id: Tab; label: string }[] = [
  { id: "progreso", label: "PROGRESO" },
  { id: "ejercicios", label: "EJERCICIOS" },
  { id: "humor", label: "HUMOR" },
  { id: "ajustes", label: "AJUSTES" },
];

export default function ProfileScreen() {
  const { bottom } = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("progreso");
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [moodHistory, setMoodHistory] = useState<MoodHistory>({});

  const diagnostic = useUserStore((s) => s.diagnostic);
  const scores = diagnostic?.scores ?? {};
  const sortedAreas = Object.entries(scores)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a);
  const topArea = sortedAreas[0]?.[0] ?? "emociones";
  const archetype = ARCHETYPE[topArea] ?? ARCHETYPE.emociones;
  const areaMeta = AREA_META[topArea];

  const params = useLocalSearchParams<{ nombre: string; formacion?: string }>();
  const userNombre = params.nombre || "Invitado";

  useFocusEffect(
    useCallback(() => {
      setProgress(getAllProgress());
      getMoodHistory().then(setMoodHistory);
    }, []),
  );

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={s.root}>
      <View style={s.headerWrap}>
        <View style={s.header}>
          <Text style={s.headerTitle}>Perfil</Text>
          <View style={s.headerActions}>
            <Pressable style={s.iconBtn}>
              <UserPlus size={20} color={TEXT} strokeWidth={1.8} />
            </Pressable>
            <Pressable style={s.iconBtn}>
              <SlidersHorizontal size={20} color={TEXT} strokeWidth={1.8} />
            </Pressable>
          </View>
        </View>
        <View style={s.headerBorderRow}>
          <View style={s.headerAccentLine} />
          <View style={s.headerMutedLine} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: BAR_HEIGHT + bottom + SPACING * 2 }}
      >
        <View style={s.profileSection}>
          <View style={[s.avatarRing, { borderColor: archetype.color + "55" }]}>
            <View style={[s.avatar, { backgroundColor: archetype.color }]}>
              <Text style={s.avatarInitial}>{userNombre.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <Text style={s.name}>{userNombre}</Text>
          <Text style={[s.archetypeType, { color: archetype.color }]}>{archetype.tipo}</Text>
          <Text style={s.archetypeTagline}>{archetype.tagline}</Text>
          {areaMeta && (
            <View style={[s.areaTag, { backgroundColor: areaMeta.bg }]}>
              <Text style={[s.areaTagText, { color: areaMeta.color }]}>{areaMeta.label}</Text>
            </View>
          )}
        </View>

        <View style={s.tabBar}>
          {TABS.map((t) => (
            <Pressable key={t.id} style={s.tabItem} onPress={() => setTab(t.id)}>
              <Text style={[s.tabLabel, tab === t.id && s.tabLabelActive]}>{t.label}</Text>
              {tab === t.id && <View style={s.tabUnderline} />}
            </Pressable>
          ))}
        </View>

        {tab === "progreso" && <ProgresoTab progress={progress} topArea={topArea} />}
        {tab === "ejercicios" && <EjerciciosTab progress={progress} />}
        {tab === "humor" && <HumorTab moodHistory={moodHistory} />}
        {tab === "ajustes" && <AjustesTab />}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  headerWrap: { backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 1.2,
  },
  headerBorderRow: { flexDirection: "row", height: 3 },
  headerAccentLine: {
    flex: 1.4,
    backgroundColor: ACCENT,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  headerMutedLine: { flex: 1, backgroundColor: BORDER },
  headerTitle: { fontSize: 22, fontWeight: "800", color: TEXT, letterSpacing: -0.4 },
  headerActions: { flexDirection: "row", gap: SPACING * 0.8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CARD_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  profileSection: {
    alignItems: "center",
    paddingTop: SPACING * 1.5,
    paddingBottom: SPACING * 1.5,
    gap: SPACING * 0.6,
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: ACCENT + "55",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING * 0.4,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { fontSize: 32, fontWeight: "800", color: "#fff" },
  name: { fontSize: 22, fontWeight: "800", color: TEXT, letterSpacing: -0.5 },
  archetypeType: { fontSize: 14, fontWeight: "700", letterSpacing: 0.2, marginTop: 2 },
  archetypeTagline: {
    fontSize: 12,
    color: MUTED,
    fontStyle: "italic",
    fontWeight: "500",
    marginTop: 2,
    marginBottom: SPACING * 0.4,
  },
  areaTag: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginTop: SPACING * 0.2,
  },
  areaTagText: { fontSize: 12, fontWeight: "700" },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#fff",
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: SPACING * 1.2 },
  tabLabel: { fontSize: 11, fontWeight: "700", color: MUTED, letterSpacing: 0.5 },
  tabLabelActive: { color: ACCENT },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: ACCENT,
    borderRadius: 2,
  },
});
