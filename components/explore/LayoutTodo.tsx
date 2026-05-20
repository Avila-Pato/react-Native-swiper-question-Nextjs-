import { SPACING } from "@/constants/constants";
import { ACCENT, BORDER, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { useNews } from "@/hooks/useNews";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SectionHeader } from "./SectionHeader";

type SkillCard = {
  id: string;
  title: string;
  label: string;
  image: string;
  color: string;
};

const SKILL_CARDS: SkillCard[] = [
  {
    id: "s1",
    title: "Python",
    label: "Lenguaje más demandado en 2025",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&auto=format&fit=crop",
    color: "#3B82F6",
  },
  {
    id: "s2",
    title: "React / RN",
    label: "Framework líder en apps web y móvil",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop",
    color: ACCENT,
  },
  {
    id: "s3",
    title: "Kubernetes",
    label: "Orquestación de contenedores a escala",
    image:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&auto=format&fit=crop",
    color: "#6366F1",
  },
  {
    id: "s4",
    title: "LangChain / IA",
    label: "Construcción de agentes con IA generativa",
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&auto=format&fit=crop",
    color: "#8B5CF6",
  },
  {
    id: "s5",
    title: "Terraform",
    label: "Infraestructura como código en la nube",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop",
    color: "#F59E0B",
  },
];

export function LayoutTodo() {
  const { articles, loading } = useNews("technology");

  return (
    <>
      {/* ── Sección 1: Skills en demanda ─────────────────────── */}
      <View style={s.sectionMeta}>
        <Text style={s.sectionTitle}>Explora el Mundo Tech</Text>
        <Text style={s.sectionSub}>
          Tecnologías que el mercado está buscando ahora
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.hScroll}
      >
        {SKILL_CARDS.map((sk) => (
          <Pressable key={sk.id} style={s.skillCard}>
            <Image
              source={{ uri: sk.image }}
              style={StyleSheet.absoluteFillObject}
            />
            <View
              style={[s.cardOverlay, { backgroundColor: "rgba(0,0,0,0.58)" }]}
            />
            <View style={s.skillCardContent}>
              <Text style={s.skillTitle}>{sk.title}</Text>
              <Text style={s.skillLabel}>{sk.label}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── Sección 3: Noticias reales de la API ─────────────── */}
      <SectionHeader title="Tendencias tech" />

      {loading ? (
        <ActivityIndicator color={ACCENT} style={{ marginVertical: 16 }} />
      ) : articles.length === 0 ? (
        <Text style={s.empty}>No hay noticias disponibles</Text>
      ) : (
        <>
          {articles.slice(0, 4).map((article) => (
            <Pressable
              key={article.url}
              style={s.tRow}
              onPress={() => Linking.openURL(article.url)}
            >
              {article.urlToImage ? (
                <Image source={{ uri: article.urlToImage }} style={s.tImg} />
              ) : null}
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.tSource}>{article.source.name}</Text>
                <Text style={s.tTitle} numberOfLines={2}>
                  {article.title}
                </Text>
                {article.description ? (
                  <Text style={s.tDesc} numberOfLines={1}>
                    {article.description}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          ))}
          <View style={{ height: 20 }} />
        </>
      )}
    </>
  );
}

const s = StyleSheet.create({
  sectionMeta: {
    paddingHorizontal: SPACING * 2,
    marginBottom: SPACING * 1.5,
    gap: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: TEXT },
  sectionSub: { fontSize: 13, color: MUTED, lineHeight: 18 },

  hScroll: {
    paddingHorizontal: SPACING * 2,
    gap: 12,
    marginBottom: SPACING * 2.5,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.50)",
  },
  tag: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 2,
  },
  tagText: { fontSize: 10, fontWeight: "700" },

  // Skill cards (landscape 200×130)
  skillCard: { width: 200, height: 130, borderRadius: 16, overflow: "hidden" },
  skillCardContent: {
    flex: 1,
    padding: 14,
    justifyContent: "flex-end",
    gap: 3,
  },
  skillTitle: { color: "#FFF", fontSize: 14, fontWeight: "800" },
  skillLabel: { color: "rgba(255,255,255,0.68)", fontSize: 11, lineHeight: 15 },

  // News rows
  tRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: SPACING * 2,
    marginBottom: SPACING * 1.5,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },

  tImg: { width: 68, height: 68, borderRadius: 10 },
  tSource: { color: ACCENT, fontSize: 11, fontWeight: "600" },
  tTitle: { color: TEXT, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  tDesc: { color: MUTED, fontSize: 11, lineHeight: 16 },
  empty: {
    color: MUTED,
    textAlign: "center",
    marginVertical: 20,
    fontSize: 13,
  },
});
