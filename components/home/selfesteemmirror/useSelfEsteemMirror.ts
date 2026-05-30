import * as ExpoClipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import { Animated, PanResponder, View } from "react-native";
import { MirrorItem, PROGRESS_W, REQUIRED_CLEARED, TOTAL_CELLS } from "./constants";

export function useSelfEsteemMirror(visible: boolean) {
  const [phase, setPhase]           = useState<"intro" | "select" | "mirror">("intro");
  const [selected, setSelected]     = useState<MirrorItem | null>(null);
  const [revealed, setRevealed]     = useState(false);
  const [copied, setCopied]         = useState(false);
  const [accepted, setAccepted]     = useState(false);
  const [revealBurst, setRevealBurst] = useState(false);
  const [cellsCleared, setCellsCleared] = useState(0);

  const cellOpacities = useRef(Array.from({ length: TOTAL_CELLS }, () => new Animated.Value(1))).current;
  const mirrorContainerRef = useRef<View>(null);
  const mirrorLayoutRef    = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const isRevealedRef      = useRef(false);
  const clearedCellsRef    = useRef<Set<number>>(new Set());

  const screenFade    = useRef(new Animated.Value(0)).current;
  const cardFade      = useRef(new Animated.Value(0)).current;
  const cardSlideY    = useRef(new Animated.Value(40)).current;
  const progressAnim  = useRef(new Animated.Value(0)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const revealScale   = useRef(new Animated.Value(0.92)).current;
  const btnsFade      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase !== "mirror") return;
    const frameId = requestAnimationFrame(() => {
      mirrorContainerRef.current?.measureInWindow((x, y, w, h) => {
        mirrorLayoutRef.current = { x, y, width: w, height: h };
      });
    });
    return () => cancelAnimationFrame(frameId);
  }, [phase]);

  useEffect(() => {
    if (visible) {
      setPhase("intro");
      setSelected(null);
      setRevealed(false);
      setCopied(false);
      setAccepted(false);
      setRevealBurst(false);
      setCellsCleared(0);
      isRevealedRef.current = false;
      clearedCellsRef.current.clear();
      cellOpacities.forEach(op => op.setValue(1));
      progressAnim.setValue(0);
      revealOpacity.setValue(0);
      revealScale.setValue(0.92);
      btnsFade.setValue(0);
      cardFade.setValue(0);
      cardSlideY.setValue(40);
      Animated.timing(screenFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    } else {
      screenFade.setValue(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!revealed) return;
    Animated.sequence([
      Animated.parallel([
        Animated.timing(revealOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.spring(revealScale, { toValue: 1, useNativeDriver: true, tension: 52, friction: 9 }),
      ]),
      Animated.timing(btnsFade, { toValue: 1, duration: 320, useNativeDriver: true }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  const onWipeComplete = () => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;
    setRevealBurst(true);
    const fadeRemainders = cellOpacities.map(op =>
      Animated.timing(op, { toValue: 0, duration: 260, useNativeDriver: true })
    );
    Animated.parallel(fadeRemainders).start(() => { setRevealed(true); });
  };

  const selectItem = (item: MirrorItem) => {
    setSelected(item);
    setPhase("mirror");
    setCellsCleared(0);
    isRevealedRef.current = false;
    clearedCellsRef.current.clear();
    setRevealed(false);
    setRevealBurst(false);
    cellOpacities.forEach(op => op.setValue(1));
    progressAnim.setValue(0);
    revealOpacity.setValue(0);
    revealScale.setValue(0.92);
    btnsFade.setValue(0);
    Animated.parallel([
      Animated.timing(cardFade, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(cardSlideY, { toValue: 0, useNativeDriver: true, tension: 55, friction: 12 }),
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isRevealedRef.current,
      onMoveShouldSetPanResponder: () => !isRevealedRef.current,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        mirrorContainerRef.current?.measureInWindow((x, y, w, h) => {
          mirrorLayoutRef.current = { x, y, width: w, height: h };
        });
      },
      onPanResponderMove: (evt) => {
        if (isRevealedRef.current) return;
        const touch = evt.nativeEvent.touches[0];
        if (!touch) return;
        const layout = mirrorLayoutRef.current;
        if (!layout.width || !layout.height) return;

        const relX = touch.pageX - layout.x;
        const relY = touch.pageY - layout.y;
        if (relX < 0 || relX > layout.width || relY < 0 || relY > layout.height) return;

        const cellW  = layout.width / 3;
        const cellH  = layout.height / 3;
        const col    = Math.max(0, Math.min(2, Math.floor(relX / cellW)));
        const row    = Math.max(0, Math.min(2, Math.floor(relY / cellH)));
        const cellId = row * 3 + col;

        if (clearedCellsRef.current.has(cellId)) return;
        clearedCellsRef.current.add(cellId);

        Animated.timing(cellOpacities[cellId], { toValue: 0, duration: 320, useNativeDriver: true }).start();

        const cleared = clearedCellsRef.current.size;
        const ratio   = cleared / TOTAL_CELLS;
        setCellsCleared(cleared);
        progressAnim.setValue(ratio);

        if (cleared >= REQUIRED_CLEARED) {
          progressAnim.setValue(1);
          setCellsCleared(TOTAL_CELLS);
          onWipeComplete();
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const handleCopy = async () => {
    if (!selected) return;
    await ExpoClipboard.setStringAsync(
      `🪞 Mi reflejo interior:\n\n${selected.mirrorLaw}\n\n✨ Mi paso de hoy:\n${selected.zenAction}`
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
    cardFade.setValue(0);
    cardSlideY.setValue(40);
  };

  const progressBarWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, PROGRESS_W] });
  const progressPct      = Math.round((cellsCleared / TOTAL_CELLS) * 100);

  return {
    phase, selected, revealed, copied, accepted, revealBurst, cellsCleared,
    screenFade, cardFade, cardSlideY, revealOpacity, revealScale, btnsFade,
    mirrorContainerRef, cellOpacities, panResponder,
    progressBarWidth, progressPct,
    handleCopy, handleAccept, goBack, selectItem, setPhase,
  };
}
