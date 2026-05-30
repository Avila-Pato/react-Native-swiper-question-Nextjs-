import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { H } from "./constants";

interface Props {
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export function FloatingParticle({ x, size, duration, delay }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -(H + 60)] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.08, 0.72, 1], outputRange: [0, 0.85, 0.5, 0] });
  const scale      = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.4, 1, 0.3] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: x,
        bottom: (size * 20) % (H / 2),
        width: size, height: size,
        borderRadius: size / 2,
        backgroundColor: "rgba(255,255,255,0.9)",
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: size * 2.5,
        transform: [{ translateY }, { scale }],
        opacity,
      }}
    />
  );
}
