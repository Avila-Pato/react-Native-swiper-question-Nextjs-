import { SPACING } from "@/constants/constants";
import { ACCENT, BG, MUTED, TEXT } from "@/constants/theme";
import { useNews } from "@/hooks/useNews";
import { SkeletonBox, usePulse } from "@/components/ui/Skeleton";
import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "hace unos minutos";
  if (h < 24) return `hace ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "ayer";
  if (d < 7) return `hace ${d} días`;
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function TopHeroSkeleton() {
  const pulse = usePulse();
  return (
    <View style={s.wrap}>
      <View style={[s.card, { overflow: "hidden" }]}>
        <SkeletonBox height={220} borderRadius={0} pulse={pulse} />
        <View style={{ padding: 16, gap: 10 }}>
          <SkeletonBox height={20} borderRadius={6} pulse={pulse} />
          <SkeletonBox height={14} width="75%" borderRadius={6} pulse={pulse} />
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <SkeletonBox width={20} height={20} borderRadius={10} pulse={pulse} />
            <SkeletonBox width={80} height={12} borderRadius={4} pulse={pulse} />
            <SkeletonBox width={60} height={12} borderRadius={4} pulse={pulse} />
          </View>
        </View>
      </View>
    </View>
  );
}

export function TopHero() {
  const { articles, loading } = useNews("technology");
  const featured = articles[0] ?? null;

  if (loading) return <TopHeroSkeleton />;

  if (!featured) return null;

  return (
    <Pressable style={s.wrap} onPress={() => Linking.openURL(featured.url)}>
      <View style={s.card}>
        <View style={s.imageWrap}>
          <Image source={{ uri: featured.urlToImage! }} style={s.image} />
          <View style={s.gradient} />

          <View style={s.topRow}>
            <View style={s.exclusiveBadge}>
              <View style={s.exclusivePulse} />
              <Text style={s.exclusiveText}>EXCLUSIVO</Text>
            </View>
            <View style={s.sourceChip}>
              <Text style={s.sourceText}>{featured.source.name.toUpperCase()}</Text>
            </View>
          </View>

          <View style={s.bottomOverlay}>
            <Text style={s.overlayTitle} numberOfLines={2}>{featured.title}</Text>
          </View>
        </View>

        <View style={s.body}>
          {featured.description ? (
            <Text style={s.desc} numberOfLines={2}>{featured.description}</Text>
          ) : null}
          <View style={s.meta}>
            <View style={s.authorDot} />
            <Text style={s.metaText}>{featured.author ?? featured.source.name}</Text>
            <Text style={s.metaDivider}>·</Text>
            <Text style={s.metaText}>{timeAgo(featured.publishedAt)}</Text>
            <Text style={s.metaDivider}>·</Text>
            <Text style={s.readLink}>Leer artículo →</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: { marginHorizontal: SPACING * 2, marginBottom: SPACING * 2.5 },
  skeleton: {
    height: 260,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: BG,
    borderWidth: 1.5,
    borderColor: "#DDD6CD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrap: { height: 220, position: "relative" },
  image: { ...StyleSheet.absoluteFillObject },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  topRow: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exclusiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0F172A",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: ACCENT + "88",
  },
  exclusivePulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: ACCENT,
  },
  exclusiveText: { color: ACCENT, fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  sourceChip: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  sourceText: { color: "#FFF", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 40,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  overlayTitle: { color: "#FFF", fontSize: 18, fontWeight: "800", lineHeight: 24 },
  body: { padding: 16, gap: 10 },
  desc: { color: MUTED, fontSize: 13, lineHeight: 20 },
  meta: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  authorDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: ACCENT },
  metaText: { color: MUTED, fontSize: 12 },
  metaDivider: { color: MUTED, fontSize: 12 },
  readLink: { color: ACCENT, fontSize: 12, fontWeight: "700" },
});
