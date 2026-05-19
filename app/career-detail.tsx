import { SPACING } from "@/constants/constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Bookmark, ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#34D59A";
const BG = "#FAF7F2";
const CARD_BG = "#F0EBE3";
const MUTED = "#6B7280";
const TEXT = "#111827";

const SKILLS = [
  "Trabajo en equipo",
  "Resolución de problemas",
  "Comunicación efectiva",
  "Aprendizaje continuo",
  "Pensamiento crítico",
  "Adaptabilidad",
];

const STEPS = [
  "Aprende los fundamentos del área",
  "Construye proyectos prácticos",
  "Obtén tu primera certificación",
  "Aplica a roles junior o pasantías",
  "Crece hacia roles senior",
];

export default function CareerDetail() {
  const router = useRouter();
  const { title, desc, meta, image, tag, tagColor } = useLocalSearchParams<{
    title: string;
    desc: string;
    meta: string;
    image: string;
    tag: string;
    tagColor: string;
  }>();

  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.root}>
      {/* Hero image */}
      <View style={styles.heroWrap}>
        <Image source={{ uri: image }} style={styles.heroImg} />
        <View style={styles.heroOverlay} />

        {/* Nav buttons sobre la imagen */}
        <SafeAreaView edges={["top"]} style={styles.navRow}>
          <Pressable style={styles.navBtn} onPress={() => router.back()}>
            <ChevronLeft size={20} color={TEXT} />
          </Pressable>
          <Pressable style={styles.navBtn} onPress={() => setSaved(v => !v)}>
            <Bookmark
              size={20}
              color={saved ? ACCENT : TEXT}
              fill={saved ? ACCENT : "transparent"}
            />
          </Pressable>
        </SafeAreaView>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tag + título */}
        <View style={[styles.tag, { backgroundColor: (tagColor ?? ACCENT) + "22" }]}>
          <Text style={[styles.tagText, { color: tagColor ?? ACCENT }]}>{tag}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{meta}</Text>

        <View style={styles.divider} />

        {/* Descripción */}
        <Text style={styles.sectionLabel}>Sobre el rol</Text>
        <Text style={styles.body}>{desc}</Text>
        <Text style={styles.body}>
          Este rol es uno de los más buscados en el mercado tech. Combina conocimientos técnicos sólidos con capacidad de adaptación a entornos ágiles y multidisciplinarios. Ideal para quienes disfrutan resolver problemas complejos con impacto real en el producto.
        </Text>

        <View style={styles.divider} />

        {/* Habilidades */}
        <Text style={styles.sectionLabel}>Habilidades clave</Text>
        <View style={styles.skillsWrap}>
          {SKILLS.map(s => (
            <View key={s} style={styles.skill}>
              <Text style={styles.skillText}>{s}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Ruta de aprendizaje */}
        <Text style={styles.sectionLabel}>Ruta de aprendizaje</Text>
        {STEPS.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Botones fijos abajo */}
      <SafeAreaView edges={["bottom"]} style={styles.actions}>
        <Pressable style={styles.btnSecondary} onPress={() => router.back()}>
          <Text style={styles.btnSecondaryText}>Ver requisitos</Text>
        </Pressable>
        <Pressable style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Explorar carrera</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  heroWrap: { height: 280 },
  heroImg: { ...StyleSheet.absoluteFillObject },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.90)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING * 2, paddingTop: SPACING * 2.5 },
  tag: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
  },
  tagText: { fontSize: 12, fontWeight: "700" },
  title: { fontSize: 26, fontWeight: "800", color: TEXT, lineHeight: 34, marginBottom: 6 },
  meta: { fontSize: 14, color: ACCENT, fontWeight: "600", marginBottom: 4 },
  divider: { height: 1, backgroundColor: "#E2D9CF", marginVertical: SPACING * 2 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: MUTED, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 },
  body: { fontSize: 15, color: TEXT, lineHeight: 24, marginBottom: 10 },
  skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skill: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2D9CF",
  },
  skillText: { color: TEXT, fontSize: 13, fontWeight: "600" },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 14 },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ACCENT + "22",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ACCENT,
    flexShrink: 0,
  },
  stepNumText: { color: ACCENT, fontSize: 13, fontWeight: "800" },
  stepText: { flex: 1, fontSize: 14, color: TEXT, lineHeight: 22, paddingTop: 3 },
  actions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 1.5,
    paddingBottom: SPACING * 2,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: "#E2D9CF",
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: ACCENT,
    alignItems: "center",
  },
  btnSecondaryText: { color: ACCENT, fontSize: 15, fontWeight: "700" },
  btnPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: ACCENT,
    alignItems: "center",
  },
  btnPrimaryText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});
