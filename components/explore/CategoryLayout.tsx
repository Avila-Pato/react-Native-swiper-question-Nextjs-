import { SPACING } from "@/constants/constants";
import { ACCENT, BORDER, CARD_BG, MUTED, TEXT } from "@/constants/theme";
import { CareerItem, CatData } from "@/types/explore";
import { Heart } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CareerSheet } from "./CareerSheet";

type Props = { data: CatData };

export function CategoryLayout({ data }: Props) {
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<CareerItem | null>(null);

  const toggleSave = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.hScroll}
      >
        {data.highlights.map((h) => (
          <Pressable key={h.id} style={s.hCard}>
            <Image source={{ uri: h.image }} style={StyleSheet.absoluteFillObject} />
            <View style={s.hOverlay} />
            <View style={s.hBottom}>
              <View style={[s.hDot, { backgroundColor: h.color }]} />
              <Text style={s.hTitle}>{h.title}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={s.sectionRow}>
        <Text style={s.sectionTitle}>{data.sectionTitle}</Text>
        <Text style={s.sortBtn}>↕ Ordenar</Text>
      </View>

      <View style={s.list}>
        {data.items.map((item) => (
          <Pressable
            key={item.id}
            style={s.listCard}
            onPress={() => setSelected(item)}
          >
            <Image source={{ uri: item.image }} style={s.listImg} />
            <View style={s.listBody}>
              <View style={[s.tag, { backgroundColor: item.tagColor + "22" }]}>
                <Text style={[s.tagText, { color: item.tagColor }]}>{item.tag}</Text>
              </View>
              <Text style={s.listTitle}>{item.title}</Text>
              <Text style={s.listDesc}>{item.desc}</Text>
              <Text style={s.listMeta}>{item.meta}</Text>
            </View>
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                toggleSave(item.id);
              }}
              hitSlop={10}
            >
              <Heart
                size={20}
                color={saved.has(item.id) ? "#EF4444" : "#D1D5DB"}
                fill={saved.has(item.id) ? "#EF4444" : "transparent"}
              />
            </Pressable>
          </Pressable>
        ))}
      </View>

      {selected && (
        <CareerSheet item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

const s = StyleSheet.create({
  hScroll: { paddingHorizontal: SPACING * 2, gap: 10, marginBottom: SPACING * 2.5 },
  hCard: {
    width: 115,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: CARD_BG,
  },
  hOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.40)" },
  hBottom: { flex: 1, justifyContent: "flex-end", padding: 10, gap: 5 },
  hDot: { width: 6, height: 6, borderRadius: 3 },
  hTitle: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    marginBottom: SPACING * 1.5,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: TEXT },
  sortBtn: { fontSize: 13, color: MUTED, fontWeight: "600" },
  list: { paddingHorizontal: SPACING * 2, gap: 12 },
  listCard: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    gap: 12,
    alignItems: "center",
  },
  listImg: { width: 88, height: 88, borderRadius: 12 },
  listBody: { flex: 1, gap: 4 },
  tag: { alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 10, fontWeight: "700" },
  listTitle: { color: TEXT, fontSize: 14, fontWeight: "700", lineHeight: 20 },
  listDesc: { color: MUTED, fontSize: 12, lineHeight: 17 },
  listMeta: { color: ACCENT, fontSize: 11, fontWeight: "600" },
});
