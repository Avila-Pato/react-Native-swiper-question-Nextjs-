import { CategoryLayout } from "@/components/explore/CategoryLayout";
import { LayoutTodo } from "@/components/explore/LayoutTodo";
import { TopHero } from "@/components/explore/TopHero";
import { SPACING } from "@/constants/constants";
import { ACCENT, BG, BORDER, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { CAT_DATA, CATEGORIES } from "@/data/exploreData";
import { Category } from "@/types/explore";
import { Bell, Search } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LAYOUTS: Record<Category, () => React.JSX.Element> = {
  Todo: LayoutTodo,
  Desarrollo: () => <CategoryLayout data={CAT_DATA.Desarrollo} />,
  Ciberseguridad: () => <CategoryLayout data={CAT_DATA.Ciberseguridad} />,
  DevOps: () => <CategoryLayout data={CAT_DATA.DevOps} />,
  Datos: () => <CategoryLayout data={CAT_DATA.Datos} />,
  Cloud: () => <CategoryLayout data={CAT_DATA.Cloud} />,
};

export default function HomeScreen() {
  const [active, setActive] = useState<Category>("Todo");
  const ActiveLayout = LAYOUTS[active];

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        key={active}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explorar</Text>
          <View style={styles.headerIcons}>
            <Pressable style={styles.iconBtn}>
              <Bell size={20} color={MUTED} />
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <Search size={20} color={MUTED} />
            </Pressable>
          </View>
        </View>

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
              <Text style={[styles.chipText, active === cat && styles.chipTextActive]}>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING * 2,
    marginBottom: SPACING * 1.5,
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: TEXT },
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
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipActive: { backgroundColor: ACCENT + "18", borderColor: ACCENT },
  chipText: { color: MUTED, fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: ACCENT },
});
