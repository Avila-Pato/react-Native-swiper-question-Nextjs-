import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, StyleSheet } from "react-native";
import { s } from "./styles";

export function FogCell({ opacity }: { opacity: Animated.Value }) {
  return (
    <Animated.View style={[s.matrixCell, { opacity }]}>
      <LinearGradient
        colors={["rgb(205,221,238)", "rgb(222,237,252)", "rgb(208,225,241)"]}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}
