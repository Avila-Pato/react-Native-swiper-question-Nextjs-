import { AREA_META } from "@/constants/diagnosticData";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const BAR_MAX_H = 110;
const GRID_FRACS = [0, 0.33, 0.66, 1];

interface BarColumnProps {
  area: string;
  score: number;
  maxScore: number;
  delay: number;
  isTop: boolean;
}

function BarColumn({ area, score, maxScore, delay, isTop }: BarColumnProps) {
  const meta = AREA_META[area];
  const targetH = maxScore > 0 ? (score / maxScore) * BAR_MAX_H : 0;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const scoreOp = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: targetH,
          duration: 700,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(scoreOp, {
          toValue: 1,
          duration: 350,
          delay: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
    ]).start(() => {
      if (isTop) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, { toValue: 1, duration: 900, useNativeDriver: false }),
            Animated.timing(glowAnim, { toValue: 0, duration: 900, useNativeDriver: false }),
          ]),
        ).start();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!meta) return null;

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.45] });

  return (
    <View style={bc.col}>
      <Animated.Text style={[bc.scoreVal, { color: meta.color, opacity: scoreOp }]}>
        {score}
      </Animated.Text>

      <View style={bc.track}>
        {/* Glow layer for top bar */}
        {isTop && (
          <Animated.View
            style={[
              bc.glow,
              { backgroundColor: meta.color, opacity: glowOpacity },
            ]}
          />
        )}
        <Animated.View
          style={[
            bc.fill,
            {
              height: heightAnim,
              backgroundColor: meta.color,
              shadowColor: meta.color,
              shadowOpacity: isTop ? 0.45 : 0.12,
              shadowOffset: { width: 0, height: -3 },
              shadowRadius: isTop ? 10 : 4,
              elevation: isTop ? 6 : 2,
            },
          ]}
        />
      </View>

      <Text
        style={[
          bc.label,
          {
            color: isTop ? meta.color : "rgba(28,27,41,0.35)",
            fontWeight: isTop ? "700" : "500",
          },
        ]}
        numberOfLines={1}
      >
        {meta.short}
      </Text>
    </View>
  );
}

// ── AreaBarChart ─────────────────────────────────────────────────────────────

interface Props {
  areas: [string, number][];
}

export function AreaBarChart({ areas }: Props) {
  const maxScore = areas[0]?.[1] ?? 1;

  return (
    <View style={s.root}>
      <View style={s.chartArea}>
        {/* Grid lines */}
        <View style={s.gridLines} pointerEvents="none">
          {GRID_FRACS.map((frac) => (
            <View key={frac} style={[s.gridLine, { bottom: frac * BAR_MAX_H }]} />
          ))}
        </View>
        {/* Bars */}
        <View style={s.barsRow}>
          {areas.map(([area, score], i) => (
            <BarColumn
              key={area}
              area={area}
              score={score}
              maxScore={maxScore}
              delay={i * 90}
              isTop={i === 0}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const bc = StyleSheet.create({
  col: { flex: 1, alignItems: "center", gap: 5 },
  scoreVal: { fontSize: 12, fontWeight: "800", letterSpacing: -0.3 },
  track: {
    width: "62%",
    height: BAR_MAX_H,
    borderRadius: 10,
    backgroundColor: "rgba(137,128,184,0.08)",
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "relative",
  },
  glow: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 10,
  },
  fill: {
    borderRadius: 10,
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  label: { fontSize: 9.5, textAlign: "center" },
});

const s = StyleSheet.create({
  root: { width: "100%" },
  chartArea: {
    height: BAR_MAX_H + 30,
    position: "relative",
    justifyContent: "flex-end",
  },
  gridLines: {
    position: "absolute",
    left: 0, right: 0, bottom: 24,
    height: BAR_MAX_H,
  },
  gridLine: {
    position: "absolute",
    left: 0, right: 0,
    height: 1,
    backgroundColor: "rgba(137,128,184,0.08)",
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: BAR_MAX_H + 30,
  },
});
