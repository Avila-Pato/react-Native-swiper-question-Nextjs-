import { NewsArticle } from "@/types/news";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  article: NewsArticle;
  onPress?: (article: NewsArticle) => void;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "Hace menos de 1h";
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

export function NewsCard({ article, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(article)}
      activeOpacity={0.8}
    >
      {article.urlToImage && (
        <Image
          source={{ uri: article.urlToImage }}
          style={styles.image}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      )}
      <View style={styles.body}>
        <Text style={styles.source} numberOfLines={1}>
          {article.source.name} · {timeAgo(article.publishedAt)}
        </Text>
        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>
        {article.description && (
          <Text style={styles.desc} numberOfLines={2}>
            {article.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 180,
  },
  body: {
    padding: 14,
    gap: 6,
  },
  source: {
    color: "#34D59A",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  desc: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    lineHeight: 19,
  },
});
