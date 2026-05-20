import { NewsArticle, NewsCategory } from "@/types/news";
import { useNews } from "@/hooks/useNews";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { NewsCard } from "./NewsCard";

type Props = {
  category?: NewsCategory;
  onPressArticle?: (article: NewsArticle) => void;
};

export function NewsFeed({ category = "technology", onPressArticle }: Props) {
  const { articles, loading, error } = useNews(category);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#34D59A" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => (
        <NewsCard article={item} onPress={onPressArticle} />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  errorText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    textAlign: "center",
  },
});
