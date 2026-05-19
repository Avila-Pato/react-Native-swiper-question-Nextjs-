import { SPACING } from "@/constants/constants";
import { ACCENT, BORDER, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SectionHeader } from "./SectionHeader";

const hCards = [
  {
    id: "1",
    title: "Ciberseguridad",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop",
    tag: "Cibersec",
    color: "#EF4444",
  },
  {
    id: "2",
    title: "Data Science",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop",
    tag: "Datos",
    color: "#3B82F6",
  },
  {
    id: "3",
    title: "DevOps",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&auto=format&fit=crop",
    tag: "DevOps",
    color: "#F59E0B",
  },
  {
    id: "4",
    title: "Desarrollo Web",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop",
    tag: "Dev",
    color: ACCENT,
  },
];

const trending = [
  {
    id: "t1",
    title: "Machine Learning en producción",
    author: "TechInsights",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=200&auto=format&fit=crop",
  },
  {
    id: "t2",
    title: "Cómo entrar a Big Tech desde Latam",
    author: "Carrera Tech",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&auto=format&fit=crop",
  },
  {
    id: "t3",
    title: "Kubernetes para principiantes",
    author: "DevOps Now",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=200&auto=format&fit=crop",
  },
];

export function LayoutTodo() {
  return (
    <>
      <View style={s.hero}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop" }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={s.overlay} />
        <View style={s.heroContent}>
          <View style={s.badge}>
            <Text style={s.badgeText}>Destacado</Text>
          </View>
          <Text style={s.heroTitle}>¿Listo para descubrir tu camino en tech?</Text>
          <Text style={s.heroCta}>Empieza ahora →</Text>
        </View>
      </View>

      <SectionHeader title="Carreras para ti" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.hScroll}
      >
        {hCards.map((c) => (
          <Pressable key={c.id} style={s.hCard}>
            <Image source={{ uri: c.image }} style={StyleSheet.absoluteFillObject} />
            <View style={s.overlay} />
            <View style={s.hCardContent}>
              <View style={[s.tag, { backgroundColor: c.color + "33" }]}>
                <Text style={[s.tagText, { color: c.color }]}>{c.tag}</Text>
              </View>
              <Text style={s.hCardTitle}>{c.title}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeader title="Tendencias" />
      {trending.map((t) => (
        <Pressable key={t.id} style={s.tRow}>
          <Image source={{ uri: t.image }} style={s.tImg} />
          <View style={{ flex: 1 }}>
            <Text style={s.tTitle}>{t.title}</Text>
            <Text style={s.tAuthor}>{t.author}</Text>
          </View>
        </Pressable>
      ))}
    </>
  );
}

const s = StyleSheet.create({
  hero: {
    marginHorizontal: SPACING * 2,
    borderRadius: 20,
    overflow: "hidden",
    height: 220,
    marginBottom: SPACING * 2.5,
  },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.52)" },
  heroContent: { flex: 1, padding: SPACING * 1.8, justifyContent: "flex-end" },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: ACCENT + "33",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: ACCENT + "66",
  },
  badgeText: { color: ACCENT, fontSize: 11, fontWeight: "700" },
  heroTitle: { color: "#FFF", fontSize: 20, fontWeight: "700", lineHeight: 26, marginBottom: 8 },
  heroCta: { color: ACCENT, fontSize: 13, fontWeight: "600" },
  hScroll: { paddingHorizontal: SPACING * 2, gap: 12, marginBottom: SPACING * 2.5 },
  hCard: { width: 160, height: 210, borderRadius: 16, overflow: "hidden" },
  hCardContent: { flex: 1, padding: 12, justifyContent: "flex-end" },
  tag: { alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  tagText: { fontSize: 10, fontWeight: "700" },
  hCardTitle: { color: "#FFF", fontSize: 14, fontWeight: "700" },
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
  tImg: { width: 64, height: 64, borderRadius: 10 },
  tTitle: { color: TEXT, fontSize: 14, fontWeight: "600", marginBottom: 4 },
  tAuthor: { color: MUTED, fontSize: 12, fontWeight: "600" },
});
