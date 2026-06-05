import { SPACING } from "@/constants/constants";
import { ACCENT, MUTED, TEXT } from "@/constants/theme";
import { MOODS } from "@/data/moods";
import { MoodHistory, todayString } from "@/store/moodHistory";
import { Image } from "expo-image";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const SCREEN_W = Dimensions.get("window").width;
const CAL_CARD_PAD = 16;
const CIRCLE = Math.floor((SCREEN_W - SPACING * 4 - CAL_CARD_PAD * 2) / 7);

const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function MoodCalendar({ history }: { history: MoodHistory }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const today = todayString();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const goBack = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const goForward = () => {
    if (isCurrentMonth) return;
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const rawFirst = new Date(year, month, 1).getDay();
  const firstDay = (rawFirst + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayNum = now.getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Pressable onPress={goBack} hitSlop={14} style={s.arrow}>
          <ChevronLeft size={20} color={ACCENT} strokeWidth={2.5} />
        </Pressable>
        <Text style={s.monthLabel}>{MONTH_NAMES[month]}</Text>
        <Pressable onPress={goForward} hitSlop={14} style={s.arrow}>
          <ChevronRight
            size={20}
            color={isCurrentMonth ? "#D0CEDF" : ACCENT}
            strokeWidth={2.5}
          />
        </Pressable>
      </View>

      <View style={s.namesRow}>
        {DAY_NAMES.map((d) => (
          <View key={d} style={s.nameCell}>
            <Text style={s.nameText}>{d}</Text>
          </View>
        ))}
      </View>

      <View style={s.grid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`e${i}`} style={s.circleWrap} />;

          const mm = String(month + 1).padStart(2, "0");
          const dd = String(day).padStart(2, "0");
          const dateStr = `${year}-${mm}-${dd}`;
          const idx = history[dateStr];
          const mood = idx !== undefined ? MOODS[idx] : null;
          const isToday = dateStr === today;
          const isFuture = isCurrentMonth && day > todayNum;

          return (
            <View key={dateStr} style={s.circleWrap}>
              <View
                style={[
                  s.circle,
                  isToday && s.circleToday,
                  mood && !isToday && s.circleMood,
                  isFuture && s.circleFuture,
                ]}
              >
                {mood ? (
                  <Image
                    source={mood.image}
                    style={[s.moodImg, isToday && s.moodImgToday]}
                    contentFit="contain"
                  />
                ) : (
                  <Text
                    style={[
                      s.dayNum,
                      isToday && s.dayNumToday,
                      isFuture && s.dayNumFuture,
                    ]}
                  >
                    {day}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginHorizontal: SPACING * 2,
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: CAL_CARD_PAD,
    shadowColor: "#8980B8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: SPACING * 1.2,
  },
  arrow: { padding: 4 },
  monthLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: TEXT,
    letterSpacing: -0.3,
  },
  namesRow: { flexDirection: "row", marginBottom: 6 },
  nameCell: {
    width: CIRCLE,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  nameText: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    letterSpacing: 0.3,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  circleWrap: {
    width: CIRCLE,
    height: CIRCLE,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  circle: {
    width: CIRCLE - 6,
    height: CIRCLE - 6,
    borderRadius: (CIRCLE - 6) / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F0F8",
  },
  circleToday: { backgroundColor: ACCENT },
  circleMood: { backgroundColor: "#EDE9F8" },
  circleFuture: { backgroundColor: "transparent" },
  moodImg: { width: CIRCLE - 10, height: CIRCLE - 10 },
  moodImgToday: { tintColor: undefined },
  dayNum: { fontSize: 13, fontWeight: "600", color: TEXT },
  dayNumToday: { color: "#fff", fontWeight: "800" },
  dayNumFuture: { color: "#C8C4DC" },
});
