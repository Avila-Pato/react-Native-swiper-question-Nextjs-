import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { H } from "./constants";

interface Props { x: number; size: number; duration: number; delay: number; color: string; }

export function FloatingParticle({ x, size, duration, delay, color }: Props) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -(H + 60)] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.1, 0.75, 1], outputRange: [0, 0.85, 0.45, 0] });
  const scale      = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.3, 1, 0.3] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute", left: x, bottom: (size * 18) % (H / 2),
        width: size * 3, height: size * 3, borderRadius: (size * 3) / 2,
        backgroundColor: color,
        shadowColor: color, shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1, shadowRadius: size * 4,
        transform: [{ translateY }, { scale }], opacity,
      }}
    />
  );
}
