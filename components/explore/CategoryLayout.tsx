import { SPACING } from "@/constants/constants";
import { ACCENT, BORDER, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { SkeletonBox, usePulse } from "@/components/ui/Skeleton";
import { useNews } from "@/hooks/useNews";
import { NewsArticle, NewsCategory } from "@/types/news";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NewsDetailSheet } from "./NewsDetailSheet";
import { SectionHeader } from "./SectionHeader";

const SECTION_TITLES: Record<string, string> = {
  Destacado: "Lo más destacado ahora",
  "Último hora": "Noticias de último hora",
  "Lo más leído": "Lo que todos están leyendo",
  Desarrollo: "Lo más leído en Dev",
  Ciberseguridad: "Amenazas del mundo real",
  IA: "IA que está cambiando todo",
  Cloud: "El ecosistema Cloud hoy",
  Startups: "Startups tech que debes conocer",
};

function CategorySkeleton() {
  const pulse = usePulse();
  return (
    <>
      {/* Highlights skeleton: 5 cards portrait */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.hScroll}
        scrollEnabled={false}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonBox key={i} width={160} height={200} borderRadius={16} pulse={pulse} />
        ))}
      </ScrollView>

      {/* Section header skeleton */}
      <View style={{ paddingHorizontal: SPACING * 2, marginBottom: SPACING * 1.2 }}>
        <SkeletonBox width={180} height={17} borderRadius={6} pulse={pulse} />
      </View>

      {/* News rows skeleton: 4 filas */}
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={s.skeletonRow}>
          <SkeletonBox width={72} height={72} borderRadius={10} pulse={pulse} />
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonBox height={11} borderRadius={4} pulse={pulse} width="40%" />
            <SkeletonBox height={13} borderRadius={4} pulse={pulse} />
            <SkeletonBox height={13} borderRadius={4} pulse={pulse} width="80%" />
          </View>
        </View>
      ))}
    </>
  );
}

type Props = {
  newsCategory?: NewsCategory;
  keywords?: string;
  sort?: "published_desc" | "popularity";
  areaLabel?: string;
};

export function CategoryLayout({
  newsCategory = "technology",
  keywords,
  sort = "published_desc",
  areaLabel,
}: Props) {
  const { articles, loading } = useNews(newsCategory, keywords, sort);
  const [selected, setSelected] = useState<NewsArticle | null>(null);

  const sectionTitle = areaLabel
    ? (SECTION_TITLES[areaLabel] ?? `Noticias · ${areaLabel}`)
    : "Últimas noticias";

  if (loading) return <CategorySkeleton />;

  return (
    <>
      {articles.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.hScroll}
        >
          {articles.slice(0, 5).map((article) => (
            <Pressable
              key={article.url}
              style={s.hCard}
              onPress={() => setSelected(article)}
            >
              {article.urlToImage ? (
                <Image
                  source={{ uri: article.urlToImage }}
                  style={StyleSheet.absoluteFillObject}
                />
              ) : null}
              <View style={s.hOverlay} />
              <View style={s.hBottom}>
                <View style={s.sourceRow}>
                  <View style={s.sourceDot} />
                  <Text style={s.sourceText} numberOfLines={1}>
                    {article.source.name}
                  </Text>
                </View>
                <Text style={s.hTitle} numberOfLines={2}>
                  {article.title}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <SectionHeader title={sectionTitle} />

      {articles.length === 0 ? (
        <Text style={s.empty}>No hay noticias disponibles</Text>
      ) : (
        <>
          {articles.slice(0, 4).map((article) => (
            <Pressable
              key={article.url}
              style={s.newsRow}
              onPress={() => setSelected(article)}
            >
              {article.urlToImage ? (
                <Image source={{ uri: article.urlToImage }} style={s.newsImg} />
              ) : null}
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.newsSource}>{article.source.name}</Text>
                <Text style={s.newsTitle} numberOfLines={2}>
                  {article.title}
                </Text>
                {article.description ? (
                  <Text style={s.newsDesc} numberOfLines={1}>
                    {article.description}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          ))}
          <View style={{ height: 20 }} />
        </>
      )}

      {selected ? (
        <NewsDetailSheet article={selected} onClose={() => setSelected(null)} />
      ) : null}
    </>
  );
}

const s = StyleSheet.create({
  hScroll: {
    paddingHorizontal: SPACING * 2,
    gap: 10,
    marginBottom: SPACING * 2.5,
  },
  hCard: {
    width: 160,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: CARD_BG,
  },
  hOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.48)",
  },
  hBottom: { flex: 1, justifyContent: "flex-end", padding: 12, gap: 5 },
  sourceRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  sourceDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT },
  sourceText: { color: ACCENT, fontSize: 10, fontWeight: "700", flex: 1 },
  hTitle: { color: "#FFF", fontSize: 12, fontWeight: "700", lineHeight: 17 },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: SPACING * 2,
    marginBottom: SPACING * 1.5,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 12,
  },
  newsRow: {
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
  newsImg: { width: 72, height: 72, borderRadius: 10 },
  newsSource: { color: ACCENT, fontSize: 11, fontWeight: "600" },
  newsTitle: { color: TEXT, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  newsDesc: { color: MUTED, fontSize: 11, lineHeight: 16 },
  empty: {
    color: MUTED,
    textAlign: "center",
    marginVertical: 20,
    fontSize: 13,
  },
});
