import { CategoryLayout } from "@/components/explore/CategoryLayout";
import { LayoutTodo } from "@/components/explore/LayoutTodo";
import { TopHero } from "@/components/explore/TopHero";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SPACING } from "@/constants/constants";
import { ACCENT, BG, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { CATEGORIES } from "@/data/exploreData";
import { Category } from "@/types/explore";
import { Bell, Search } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LAYOUTS: Record<Category, () => React.JSX.Element> = {
  Todo: LayoutTodo,
  Destacado: () => (
    <CategoryLayout
      newsCategory="general"
      sort="popularity"
      areaLabel="Destacado"
    />
  ),
  "Último hora": () => (
    <CategoryLayout
      newsCategory="technology"
      sort="published_desc"
      areaLabel="Último hora"
    />
  ),
  "Lo más leído": () => (
    <CategoryLayout
      newsCategory="business"
      sort="popularity"
      areaLabel="Lo más leído"
    />
  ),
};

export default function HomeScreen() {
  const [active, setActive] = useState<Category>("Todo");
  const ActiveLayout = LAYOUTS[active];

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
      <ScreenHeader
        title="Explorar"
        right={
          <View style={styles.headerIcons}>
            <Pressable style={styles.iconBtn}>
              <Bell size={20} color={MUTED} />
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <Search size={20} color={MUTED} />
            </Pressable>
          </View>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        key={active}
      >
        <TopHero />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setActive(cat)}
              style={[styles.chip, active === cat && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  active === cat && styles.chipTextActive,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ActiveLayout />
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { paddingTop: SPACING },
  headerIcons: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CARD_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  chips: { paddingHorizontal: SPACING * 2, gap: 8, marginBottom: SPACING * 2 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    borderWidth: 1.5,
    borderColor: "#C8BFB5",
  },
  chipActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  chipText: { color: TEXT, fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#FFF", fontWeight: "700" },
});
