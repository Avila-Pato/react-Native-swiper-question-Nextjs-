import * as ExpoClipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import { Animated, PanResponder } from "react-native";
import { FUSION_THRESHOLD, INIT_LEN, NODE_A, NODE_B_INIT, NODE_RADIUS, VinculoItem, W } from "./constants";

export function useVinculos(visible: boolean) {
  const [phase, setPhase]           = useState<"intro" | "select" | "thread" | "fused">("intro");
  const [selected, setSelected]     = useState<VinculoItem | null>(null);
  const [fusionBurst, setFusionBurst] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied]         = useState(false);
  const [accepted, setAccepted]     = useState(false);

  const isFusedRef       = useRef(false);
  const startPosRef      = useRef({ x: NODE_B_INIT.x, y: NODE_B_INIT.y });
  const nodeBRef         = useRef({ x: NODE_B_INIT.x, y: NODE_B_INIT.y });
  const fusionCenterRef  = useRef({ x: W / 2, y: NODE_B_INIT.y });

  const screenFade        = useRef(new Animated.Value(0)).current;
  const revealFade        = useRef(new Animated.Value(0)).current;
  const revealSlideY      = useRef(new Animated.Value(32)).current;
  const btnsFade          = useRef(new Animated.Value(0)).current;
  const nodeBPos          = useRef(new Animated.ValueXY({ x: NODE_B_INIT.x, y: NODE_B_INIT.y })).current;
  const nodeBScale        = useRef(new Animated.Value(1)).current;
  const nodeAScale        = useRef(new Animated.Value(1)).current;
  const nodeARingScale    = useRef(new Animated.Value(0)).current;
  const nodeARingOpacity  = useRef(new Animated.Value(0)).current;
  const threadLeft        = useRef(new Animated.Value(0)).current;
  const threadTop         = useRef(new Animated.Value(NODE_B_INIT.y)).current;
  const threadWidth       = useRef(new Animated.Value(INIT_LEN)).current;
  const threadAngle       = useRef(new Animated.Value(0)).current;
  const threadOpacity     = useRef(new Animated.Value(0.55)).current;
  const fusionGlowScale   = useRef(new Animated.Value(0)).current;
  const fusionGlowOpacity = useRef(new Animated.Value(0)).current;

  const nodeBLeft = Animated.subtract(nodeBPos.x, NODE_RADIUS);
  const nodeBTop  = Animated.subtract(nodeBPos.y, NODE_RADIUS);

  const computeThread = (bx: number, by: number) => {
    const ax = NODE_A.x, ay = NODE_A.y;
    const dx = bx - ax, dy = by - ay;
    const len   = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const midX  = (ax + bx) / 2;
    const midY  = (ay + by) / 2;

    threadLeft.setValue(midX - len / 2);
    threadTop.setValue(midY);
    threadWidth.setValue(len);
    threadAngle.setValue(angle);

    const proximity  = Math.max(0, 1 - len / INIT_LEN);
    threadOpacity.setValue(0.4 + proximity * 0.55);

    const ringProx = Math.max(0, 1 - len / (INIT_LEN * 0.6));
    nodeARingScale.setValue(1 + ringProx * 0.9);
    nodeARingOpacity.setValue(ringProx * 0.5);
    nodeAScale.setValue(1 + ringProx * 0.12);
  };

  const initThread = () => {
    computeThread(NODE_B_INIT.x, NODE_B_INIT.y);
    threadOpacity.setValue(0.55);
    nodeARingOpacity.setValue(0);
    nodeARingScale.setValue(1);
    nodeAScale.setValue(1);
  };

  // Sync hilo during snap-back animation
  useEffect(() => {
    const id = nodeBPos.addListener(({ x, y }) => computeThread(x, y));
    return () => nodeBPos.removeListener(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (visible) {
      isFusedRef.current = false;
      setPhase("intro");
      setSelected(null);
      setFusionBurst(false);
      setIsDragging(false);
      setCopied(false);
      setAccepted(false);
      nodeBPos.setValue(NODE_B_INIT);
      nodeBRef.current = { ...NODE_B_INIT };
      nodeBScale.setValue(1);
      fusionGlowScale.setValue(0);
      fusionGlowOpacity.setValue(0);
      revealFade.setValue(0);
      revealSlideY.setValue(32);
      btnsFade.setValue(0);
      initThread();
      Animated.timing(screenFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    } else {
      screenFade.setValue(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (phase !== "thread") return;
    isFusedRef.current = false;
    nodeBPos.setValue(NODE_B_INIT);
    nodeBRef.current = { ...NODE_B_INIT };
    nodeBScale.setValue(1);
    fusionGlowScale.setValue(0);
    fusionGlowOpacity.setValue(0);
    revealFade.setValue(0);
    revealSlideY.setValue(32);
    btnsFade.setValue(0);
    initThread();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== "fused") return;
    Animated.sequence([
      Animated.parallel([
        Animated.timing(revealFade, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.spring(revealSlideY, { toValue: 0, useNativeDriver: true, tension: 55, friction: 11 }),
      ]),
      Animated.timing(btnsFade, { toValue: 1, duration: 340, useNativeDriver: true }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const triggerFusion = () => {
    if (isFusedRef.current) return;
    isFusedRef.current = true;
    setFusionBurst(true);

    const fusX = (NODE_A.x + nodeBRef.current.x) / 2;
    const fusY = (NODE_A.y + nodeBRef.current.y) / 2;
    fusionCenterRef.current = { x: fusX, y: fusY };

    Animated.parallel([
      Animated.timing(threadOpacity, { toValue: 0, duration: 180, useNativeDriver: false }),
      Animated.spring(nodeBPos, { toValue: { x: fusX, y: fusY }, useNativeDriver: false, tension: 220, friction: 7 }),
      Animated.sequence([
        Animated.timing(nodeAScale, { toValue: 1.4, duration: 130, useNativeDriver: false }),
        Animated.timing(nodeAScale, { toValue: 0, duration: 220, useNativeDriver: false }),
      ]),
      Animated.sequence([
        Animated.timing(nodeBScale, { toValue: 1.35, duration: 120, useNativeDriver: true }),
        Animated.timing(nodeBScale, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.parallel([
          Animated.spring(fusionGlowScale, { toValue: 1, useNativeDriver: true, tension: 180, friction: 6 }),
          Animated.timing(fusionGlowOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        ]),
        Animated.timing(fusionGlowOpacity, { toValue: 0, duration: 480, useNativeDriver: true }),
      ]),
    ]).start(() => { setPhase("fused"); });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isFusedRef.current,
      onMoveShouldSetPanResponder: () => !isFusedRef.current,
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: () => {
        if (isFusedRef.current) return;
        startPosRef.current = { ...nodeBRef.current };
        setIsDragging(true);
        Animated.spring(nodeBScale, { toValue: 1.2, useNativeDriver: true, tension: 260, friction: 8 }).start();
      },

      onPanResponderMove: (_evt, gs) => {
        if (isFusedRef.current) return;
        const newX = startPosRef.current.x + gs.dx;
        const newY = startPosRef.current.y + gs.dy;
        nodeBRef.current = { x: newX, y: newY };
        nodeBPos.setValue({ x: newX, y: newY });
        computeThread(newX, newY);
        const dx = newX - NODE_A.x, dy = newY - NODE_A.y;
        if (Math.sqrt(dx * dx + dy * dy) < FUSION_THRESHOLD) triggerFusion();
      },

      onPanResponderRelease: () => {
        if (isFusedRef.current) return;
        setIsDragging(false);
        Animated.parallel([
          Animated.spring(nodeBPos, { toValue: NODE_B_INIT, useNativeDriver: false, tension: 40, friction: 5 }),
          Animated.spring(nodeBScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 8 }),
        ]).start(() => { nodeBRef.current = { ...NODE_B_INIT }; });
      },
    })
  ).current;

  const handleCopy = async () => {
    if (!selected) return;
    await ExpoClipboard.setStringAsync(
      `🔗 Mi reflejo del vínculo:\n\n${selected.reflection}\n\n✨ Mi acción de hoy:\n${selected.zenAction}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => setAccepted(false), 2200);
  };

  const goBack = () => {
    setPhase("select");
    isFusedRef.current = false;
  };

  const selectVinculo = (item: VinculoItem) => {
    setSelected(item);
    setPhase("thread");
  };

  const threadRotStr = threadAngle.interpolate({ inputRange: [-360, 360], outputRange: ["-360deg", "360deg"] });

  return {
    phase, selected, fusionBurst, isDragging, copied, accepted,
    screenFade, revealFade, revealSlideY, btnsFade,
    nodeBPos, nodeBScale, nodeAScale, nodeARingScale, nodeARingOpacity,
    threadLeft, threadTop, threadWidth, threadOpacity,
    fusionGlowScale, fusionGlowOpacity, fusionCenterRef,
    nodeBLeft, nodeBTop, threadRotStr,
    panResponder,
    handleCopy, handleAccept, goBack, selectVinculo, setPhase,
  };
}
