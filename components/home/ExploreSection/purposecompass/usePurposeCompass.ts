import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoClipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import { Animated, PanResponder } from "react-native";
import { Extrapolation, interpolate, SensorType, useAnimatedSensor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { CompassItem, COMPASS_X, COMPASS_Y, NODE_DEFS, ORBIT, SNAP_THRESHOLD, STAT_BAR_W, STORAGE_KEY } from "./constants";

export function usePurposeCompass(visible: boolean) {
  const [phase, setPhase]           = useState<"intro" | "select" | "compass" | "revealed">("intro");
  const [selected, setSelected]     = useState<CompassItem | null>(null);
  const [alignedCount, setAlignedCount] = useState(0);
  const [copied, setCopied]         = useState(false);
  const [anchored, setAnchored]     = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const alignedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!visible) return;
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setCompletedIds(new Set(JSON.parse(raw) as string[]));
    });
  }, [visible]);

  const nodePositions = useRef(ORBIT.map((o) => new Animated.ValueXY(o))).current;
  const nodeScales    = useRef(NODE_DEFS.map(() => new Animated.Value(1))).current;
  const nodeGlows     = useRef(NODE_DEFS.map(() => new Animated.Value(0))).current;

  const burstScale   = useRef(new Animated.Value(0)).current;
  const burstOpacity = useRef(new Animated.Value(0)).current;
  const ringScale    = useRef(new Animated.Value(1)).current;
  const ringOpacity  = useRef(new Animated.Value(0.3)).current;
  const textFade     = useRef(new Animated.Value(0)).current;
  const btnsFade     = useRef(new Animated.Value(0)).current;
  const statWidths   = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  const cardScale   = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const gyro        = useAnimatedSensor(SensorType.ROTATION);

  const cardTiltStyle = useAnimatedStyle(() => {
    const { pitch, roll } = gyro.sensor.value;
    const tiltX = interpolate(pitch + 1.5708, [-0.5, 0.5], [-24, 24], Extrapolation.CLAMP);
    const tiltY = interpolate(roll,            [-0.5, 0.5], [-24, 24], Extrapolation.CLAMP);
    return {
      opacity: cardOpacity.value,
      transform: [
        { perspective: 500 },
        { scale: cardScale.value },
        { rotateX: `${tiltX}deg` },
        { rotateY: `${tiltY}deg` },
      ],
    };
  });

  const sheenStyle = useAnimatedStyle(() => {
    const { pitch, roll } = gyro.sensor.value;
    const offsetX = interpolate(roll, [-0.5, 0.5], [-50, 50], Extrapolation.CLAMP);
    const offsetY = interpolate(pitch + 1.5708, [-0.5, 0.5], [-50, 50], Extrapolation.CLAMP);
    return {
      transform: [{ translateX: offsetX }, { translateY: offsetY }],
      opacity: interpolate(Math.abs(pitch + 1.5708) + Math.abs(roll), [0, 0.7], [0.12, 0.55], Extrapolation.CLAMP),
    };
  });

  useEffect(() => {
    if (phase !== "compass") { ringScale.setValue(1); ringOpacity.setValue(0.3); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale,   { toValue: 1.1, duration: 1500, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.7, duration: 750,  useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale,   { toValue: 1,   duration: 1500, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.3, duration: 750,  useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [phase]);

  useEffect(() => {
    if (phase !== "revealed" || !selected) return;
    cardScale.value = 0; cardOpacity.value = 0;
    textFade.setValue(0); btnsFade.setValue(0);
    statWidths.forEach((sw) => sw.setValue(0));
    cardOpacity.value = withTiming(1, { duration: 350 });
    cardScale.value   = withSpring(1, { damping: 9, stiffness: 75 });
    Animated.stagger(180, selected.stats.map((stat, i) =>
      Animated.timing(statWidths[i], { toValue: stat.value / 100, duration: 700, useNativeDriver: false })
    )).start();
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(textFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(btnsFade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const resetCompass = () => {
    nodePositions.forEach((pos, i) => { pos.stopAnimation(); pos.setValue(ORBIT[i]); });
    nodeScales.forEach((ns) => ns.setValue(1));
    nodeGlows.forEach((g) => g.setValue(0));
    burstScale.setValue(0); burstOpacity.setValue(0);
    alignedRef.current = new Set();
    setAlignedCount(0); setAnchored(false); setCopied(false);
  };

  const markAligned = (index: number) => {
    if (alignedRef.current.has(index)) return;
    alignedRef.current.add(index);
    const count = alignedRef.current.size;
    setAlignedCount(count);
    Animated.sequence([
      Animated.spring(nodeScales[index], { toValue: 1.4, tension: 200, friction: 4, useNativeDriver: false }),
      Animated.spring(nodeScales[index], { toValue: 1,   tension: 200, friction: 6, useNativeDriver: false }),
    ]).start();
    Animated.timing(nodeGlows[index], { toValue: 1, duration: 400, useNativeDriver: false }).start();
    if (count === 4) {
      Animated.parallel([
        Animated.spring(burstScale, { toValue: 3, tension: 60, friction: 5, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(burstOpacity, { toValue: 0.7, duration: 200, useNativeDriver: true }),
          Animated.delay(300),
          Animated.timing(burstOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]),
      ]).start();
      setTimeout(() => setPhase("revealed"), 900);
    }
  };

  const panResponders = useRef(
    ORBIT.map((orbitPos, i) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !alignedRef.current.has(i),
        onMoveShouldSetPanResponder:  () => !alignedRef.current.has(i),
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          nodePositions[i].setOffset({ x: (nodePositions[i].x as any)._value, y: (nodePositions[i].y as any)._value });
          nodePositions[i].setValue({ x: 0, y: 0 });
          Animated.spring(nodeScales[i], { toValue: 1.15, tension: 300, friction: 8, useNativeDriver: false }).start();
        },
        onPanResponderMove: Animated.event(
          [null, { dx: nodePositions[i].x, dy: nodePositions[i].y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: () => {
          nodePositions[i].flattenOffset();
          const cx   = (nodePositions[i].x as any)._value as number;
          const cy   = (nodePositions[i].y as any)._value as number;
          const dist = Math.sqrt(cx * cx + cy * cy);
          Animated.spring(nodeScales[i], { toValue: 1, tension: 300, friction: 8, useNativeDriver: false }).start();
          if (dist < SNAP_THRESHOLD) {
            Animated.spring(nodePositions[i], { toValue: { x: 0, y: 0 }, tension: 300, friction: 10, useNativeDriver: false }).start(() => markAligned(i));
          } else {
            Animated.spring(nodePositions[i], { toValue: orbitPos, tension: 30, friction: 7, useNativeDriver: false }).start();
          }
        },
      })
    )
  ).current;

  const handleSelectItem = (item: CompassItem) => { setSelected(item); resetCompass(); setPhase("compass"); };

  const handleCopy = async () => {
    if (!selected) return;
    await ExpoClipboard.setStringAsync(`${selected.quote}\n\n${selected.reflexion}\n\nAccion: ${selected.futureAction}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAnchor = () => {
    if (selected) {
      setCompletedIds((prev) => {
        const next = new Set(prev);
        next.add(selected.id);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
        return next;
      });
    }
    setAnchored(true);
    setTimeout(() => setAnchored(false), 2500);
  };

  const goBack = () => {
    if (phase === "revealed" || phase === "compass") { resetCompass(); setSelected(null); setPhase("select"); }
    else if (phase === "select") setPhase("intro");
  };

  const handleClose = (onClose: () => void) => { resetCompass(); setSelected(null); setPhase("intro"); onClose(); };

  const statInterpolations = statWidths.map((sw) =>
    sw.interpolate({ inputRange: [0, 1], outputRange: [0, STAT_BAR_W] })
  );

  return {
    phase, selected, alignedCount, copied, anchored, completedIds, alignedRef,
    nodePositions, nodeScales, nodeGlows,
    burstScale, burstOpacity, ringScale, ringOpacity, textFade, btnsFade,
    cardTiltStyle, sheenStyle, panResponders,
    statInterpolations,
    handleSelectItem, handleCopy, handleAnchor, goBack, handleClose, setPhase,
    COMPASS_X, COMPASS_Y,
  };
}
