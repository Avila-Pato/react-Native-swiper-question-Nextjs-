import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

const BOOKS = [
  { src: require("@/assets/portada/1_book.jpg"), author: "Amir Levine" },
  { src: require("@/assets/portada/2_book.jpg"), author: "Brené Brown" },
  { src: require("@/assets/portada/3_book.jpg"), author: "Nedra Tawwab" },
  { src: require("@/assets/portada/5_book.jpeg"), author: "Walter Riso" },
  { src: require("@/assets/portada/6_book.jpeg"), author: "James Allen" },
  { src: require("@/assets/portada/7_book.jpeg"), author: "Esther Perel" },
];

export function IntroVisualBooks() {
  return (
    <View style={s.booksSection}>
      <View style={s.booksGrid}>
        {BOOKS.map((book, i) => (
          <View key={i} style={s.bookItem}>
            <Image
              source={book.src}
              style={s.bookCover}
              contentFit="cover"
              priority="high"
            />
            <Text style={s.authorName} numberOfLines={2}>
              {book.author}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  booksSection: { marginTop: 32, width: "100%" },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
  },
  bookItem: { alignItems: "center", width: 72, gap: 6 },
  bookCover: {
    width: 72,
    height: 100,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  authorName: {
    fontSize: 9,
    color: "rgba(28,27,41,0.55)",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 13,
  },
});
