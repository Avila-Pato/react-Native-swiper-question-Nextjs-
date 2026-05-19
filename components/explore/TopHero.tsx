import { SPACING } from "@/constants/constants";
import { ACCENT, BG, MUTED, TEXT } from "@/constants/theme";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export function TopHero() {
  return (
    <Pressable style={s.wrap}>
      <View style={s.imageArea}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop" }}
          style={s.mainImage}
        />
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop" }}
          style={s.circleImage}
        />
        <View style={s.exclusiveBadge}>
          <View style={s.exclusiveDot} />
          <Text style={s.exclusiveText}>Exclusivo</Text>
        </View>
      </View>
      <View style={s.body}>
        <Text style={s.title}>
          El auge de la IA en la próxima generación de carreras tech
        </Text>
        <Text style={s.subtitle}>
          La IA ya no es solo una herramienta — es el motor detrás del futuro del trabajo digital.
        </Text>
        <View style={s.meta}>
          <View style={s.authorDot} />
          <Text style={s.metaText}>Por TechCareer</Text>
          <View style={s.verified} />
          <Text style={s.metaDivider}>·</Text>
          <Text style={s.metaText}>hace 2 días</Text>
          <Text style={s.metaDivider}>·</Text>
          <Text style={s.metaText}>5 min lectura</Text>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: { marginHorizontal: SPACING * 2, marginBottom: SPACING * 2.5 },
  imageArea: {
    borderRadius: 18,
    overflow: "hidden",
    height: 220,
    marginBottom: 16,
    backgroundColor: "#E5E7EB",
  },
  mainImage: { ...StyleSheet.absoluteFillObject },
  circleImage: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: BG,
  },
  exclusiveBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(15,23,42,0.75)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  exclusiveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#3B82F6" },
  exclusiveText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  body: { gap: 8 },
  title: { color: TEXT, fontSize: 22, fontWeight: "800", lineHeight: 30 },
  subtitle: { color: MUTED, fontSize: 14, lineHeight: 21 },
  meta: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  authorDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: ACCENT },
  verified: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#3B82F6" },
  metaText: { color: MUTED, fontSize: 12 },
  metaDivider: { color: MUTED, fontSize: 12 },
});
