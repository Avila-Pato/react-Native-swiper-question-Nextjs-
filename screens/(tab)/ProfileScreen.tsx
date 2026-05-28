import { SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import {
  ACCENT,
  BG,
  BORDER,
  CARD_BG,
  MUTED,
  P_SLATE,
  P_TEAL,
  TEXT,
} from "@/constants/theme";
import { WEEKLY_CHALLENGES } from "@/data/weeklyData";
import { getAllProgress } from "@/store/challengeProgress";
import { router, useFocusEffect } from "expo-router";
import {
  ChevronRight,
  MapPin,
  SlidersHorizontal,
  UserPlus,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const BAR_HEIGHT = TAB_ITEM_SIZE + SPACING * 1.5;

type Tab = "progreso" | "ejercicios" | "ajustes";

const TABS: { id: Tab; label: string }[] = [
  { id: "progreso", label: "PROGRESO" },
  { id: "ejercicios", label: "EJERCICIOS" },
  { id: "ajustes", label: "AJUSTES" },
];

const SKILL_AREAS = [
  { id: "adivina_concepto", label: "Conceptos", emoji: "🧠", color: P_TEAL.fg },
  { id: "completa_reflexion", label: "Reflexiones", emoji: "✨", color: P_SLATE.fg },
];

const SETTINGS = [
  { id: "notif", label: "Notificaciones", icon: "🔔" },
  { id: "privacy", label: "Privacidad", icon: "🔒" },
  { id: "about", label: "Acerca de la app", icon: "ℹ️" },
];

function CircleProgress({
  pct,
  color,
  size = 140,
  strokeWidth = 9,
}: {
  pct: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const c = size / 2;
  return (
    <Svg width={size} height={size}>
      <Circle
        cx={c}
        cy={c}
        r={r}
        stroke="#EAECF0"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={c}
        cy={c}
        r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90, ${c}, ${c})`}
      />
    </Svg>
  );
}

export default function ProfileScreen() {
  const { bottom } = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("progreso");
  const [progress, setProgress] = useState<Record<string, number>>({});

  useFocusEffect(
    useCallback(() => {
      setProgress(getAllProgress());
    }, []),
  );

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={s.root}>
      {/* ── Header ── */}
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
        contentContainerStyle={{
          paddingBottom: BAR_HEIGHT + bottom + SPACING * 2,
        }}
      >
        {/* ── Avatar + nombre ── */}
        <View style={s.profileSection}>
          <View style={s.avatarRing}>
            <View style={s.avatar}>
              <Text style={s.avatarInitial}>I</Text>
            </View>
          </View>
          <Text style={s.name}>Invitado</Text>
          <View style={s.locationRow}>
            <MapPin size={13} color={MUTED} strokeWidth={1.8} />
            <Text style={s.locationText}>Tech Explorer</Text>
          </View>
        </View>

        {/* ── Amigos ── */}
        <View style={s.friendsSection}>
          <Text style={s.friendsCount}>Amigos (0)</Text>
          <Pressable style={s.friendBtn}>
            <Text style={s.friendBtnText}>Encontrar compañeros tech</Text>
          </Pressable>
        </View>

        {/* ── Tab bar ── */}
        <View style={s.tabBar}>
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              style={s.tabItem}
              onPress={() => setTab(t.id)}
            >
              <Text style={[s.tabLabel, tab === t.id && s.tabLabelActive]}>
                {t.label}
              </Text>
              {tab === t.id && <View style={s.tabUnderline} />}
            </Pressable>
          ))}
        </View>

        {/* ── PROGRESO ── */}
        {tab === "progreso" && (
          <View style={s.tabContent}>
            {SKILL_AREAS.map((area, idx) => {
              const challenge = WEEKLY_CHALLENGES.find((c) => c.id === area.id);
              const done = progress[area.id] ?? 0;
              const total = challenge?.questions.length ?? 1;
              const pct = Math.round((done / total) * 100);

              return (
                <View key={area.id} style={idx > 0 && s.domainSeparator}>
                  {/* Dominio row */}
                  <View style={s.domainRow}>
                    <Text style={s.domainLabel}>Dominio</Text>
                    <View style={s.domainRight}>
                      <Text style={s.domainEmoji}>{area.emoji}</Text>
                      <Text style={[s.domainName, { color: area.color }]}>
                        {area.label}
                      </Text>
                    </View>
                  </View>

                  {/* Círculo de progreso */}
                  <View style={s.circleWrap}>
                    <CircleProgress pct={pct} color={area.color} size={140} />
                    <View style={s.circleInner}>
                      <Text style={s.circlePct}>{pct} %</Text>
                    </View>
                  </View>
                  <Text style={s.circleSub}>
                    Dominio de {area.label.toLowerCase()}
                  </Text>

                  {/* Stats */}
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
        )}

        {/* ── EJERCICIOS ── */}
        {tab === "ejercicios" && (
          <View style={s.tabContent}>
            {WEEKLY_CHALLENGES.map((c) => {
              const done = progress[c.id] ?? 0;
              const total = c.questions.length;
              const pct = Math.round((done / total) * 100);
              const isComplete = done >= total;
              return (
                <Pressable
                  key={c.id}
                  style={({ pressed }) => [
                    s.exerciseRow,
                    pressed && { opacity: 0.75 },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/challenge-detail",
                      params: { id: c.id },
                    })
                  }
                >
                  <View style={s.exerciseLeft}>
                    {/* <Text style={s.exerciseEmoji}>{c.emoji}</Text> */}
                    <View style={s.exerciseInfo}>
                      <Text style={s.exerciseTitle}>{c.title}</Text>
                      <Text
                        style={[
                          s.exerciseDiff,
                          { color: isComplete ? ACCENT : MUTED },
                        ]}
                      >
                        {isComplete ? "Completado ✓" : "En progreso"}
                      </Text>
                    </View>
                  </View>
                  <View style={s.exerciseCircle}>
                    <CircleProgress
                      pct={pct}
                      color={isComplete ? ACCENT : c.color}
                      size={46}
                      strokeWidth={5}
                    />
                    <View style={s.exerciseCircleInner}>
                      <Text style={s.exerciseCirclePct}>{pct}%</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* ── AJUSTES ── */}
        {tab === "ajustes" && (
          <View style={[s.tabContent, s.settingsCard]}>
            {SETTINGS.map((item, i) => (
              <View key={item.id}>
                <Pressable
                  style={({ pressed }) => [
                    s.settingRow,
                    pressed && { opacity: 0.7 },
                  ]}
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  /* Header */
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.4,
  },
  headerActions: { flexDirection: "row", gap: SPACING * 0.8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CARD_BG,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Profile section */
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
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontSize: 13, color: MUTED, fontWeight: "500" },

  /* Friends */
  friendsSection: {
    alignItems: "center",
    gap: SPACING,
    paddingBottom: SPACING * 2,
  },
  friendsCount: { fontSize: 14, fontWeight: "600", color: TEXT },
  friendBtn: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingHorizontal: SPACING * 2.2,
    paddingVertical: SPACING * 0.9,
    borderWidth: 1,
    borderColor: BORDER,
  },
  friendBtnText: { fontSize: 13, color: MUTED, fontWeight: "600" },

  /* Tab bar */
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#fff",
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: SPACING * 1.2 },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    letterSpacing: 0.5,
  },
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

  /* Tab content */
  tabContent: { paddingTop: SPACING * 2 },

  /* Dominio / progress section */
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  circlePct: {
    fontSize: 26,
    fontWeight: "900",
    color: TEXT,
    letterSpacing: -1,
  },
  circleSub: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: TEXT,
    marginBottom: SPACING * 2,
  },

  /* Stats */
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
  statLabel: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "500",
    textAlign: "center",
  },
  statDivider: { width: 1, height: 44, backgroundColor: BORDER },

  /* Exercises tab */
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 1.2,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  exerciseLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING * 1.2,
    flex: 1,
  },
  exerciseEmoji: { fontSize: 24, width: 34, textAlign: "center" },
  exerciseInfo: { gap: 3 },
  exerciseTitle: { fontSize: 14, fontWeight: "700", color: TEXT },
  exerciseDiff: { fontSize: 12, fontWeight: "500" },
  exerciseCircle: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseCircleInner: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseCirclePct: { fontSize: 9, fontWeight: "800", color: TEXT },

  /* Settings */
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: SPACING * 2,
    paddingHorizontal: SPACING * 1.8,
    paddingTop: 0,
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
