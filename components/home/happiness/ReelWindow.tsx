import React from "react";
import { Animated, Text, View } from "react-native";
import { s } from "./styles";

interface Props {
  label: string;
  hint: string;
  content: string;
  bounce: Animated.Value;
  reelScale: Animated.Value;
  locked: boolean;
  idle: boolean;
  alchemistMode: boolean;
  accentColor: string;
}

export function ReelWindow({ label, hint, content, bounce, reelScale, locked, idle, alchemistMode, accentColor }: Props) {
  const glowBorder = accentColor + "99";
  const glowBg     = accentColor + "14";
  const arrowColor = alchemistMode ? accentColor + "88" : "rgba(196,168,85,0.55)";

  return (
    <Animated.View style={{ flex: 1, alignItems: "center" }}>
      <Animated.View
        style={[
          s.reelWindow,
          locked && s.reelWindowLocked,
          alchemistMode && { borderColor: glowBorder, backgroundColor: glowBg, shadowColor: accentColor, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
          { transform: [{ translateY: bounce }, { scale: reelScale }], alignSelf: "stretch" },
        ]}
      >
        <Text style={[s.reelLabel, alchemistMode && { color: accentColor }]}>{label}</Text>
        <View style={s.reelContent}>
          {idle ? (
            <Text style={s.reelIdle}>{"✦"}</Text>
          ) : (
            <Text style={[s.reelText, alchemistMode && { color: accentColor }]} numberOfLines={3}>{content}</Text>
          )}
        </View>
        {locked && <View style={[s.reelLockDot, alchemistMode && { backgroundColor: accentColor }]} />}
      </Animated.View>
      <View style={s.reelHintRow}>
        <View style={[s.reelArrow, { borderTopColor: arrowColor }]} />
        <Text style={[s.reelHintTxt, alchemistMode && { color: accentColor }]}>{hint}</Text>
      </View>
    </Animated.View>
  );
}
