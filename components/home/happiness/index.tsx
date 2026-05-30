import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Brain, Check, Copy, Gift, RefreshCw, Sparkles, X, Zap } from "lucide-react-native";
import React from "react";
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FloatingParticle } from "./FloatingParticle";
import { ReelWindow } from "./ReelWindow";
import { CHEMICALS, FACTS, GRADIENT_COLORS, JACKPOT_PARTICLES, PARTICLES, SUPERPOWERS } from "./constants";
import { s } from "./styles";
import { useHappiness } from "./useHappiness";

interface Props { visible: boolean; onClose: () => void; }

export default function HappinessGameAssistant({ visible, onClose }: Props) {
  const {
    phase, result, display, locked, alchemistMode, saved, copied, jackpot,
    screenFade, reel1Bounce, reel2Bounce, reel3Bounce, reel1Scale, reel2Scale, reel3Scale,
    jackpotGlow, cardFade, cardSlideY, contentFade, spinBtnScale,
    switchTranslateX, isIdle, isSpinning,
    spin, toggleAlchemist, handleSave, handleCopy, resetGame, setPhase,
  } = useHappiness(visible);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, { opacity: screenFade }]}>

        <LinearGradient colors={GRADIENT_COLORS} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />

        {PARTICLES.map((p, i) => <FloatingParticle key={i} {...p} />)}
        {jackpot && JACKPOT_PARTICLES.map((p, i) => <FloatingParticle key={`j${i}`} {...p} />)}

        <View style={s.header}>
          <Text style={s.headerTag}>
            {phase === "intro" ? "FELICIDAD · NEUROCIENCIA" : "CASINO EMOCIONAL · DOPAMINE ALCHEMY"}
          </Text>
          <Pressable style={s.closeBtn} onPress={onClose} hitSlop={12}>
            <X size={18} color="#9B8AB8" strokeWidth={2} />
          </Pressable>
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

          {phase === "intro" && (
            <BlurView intensity={45} tint="light" style={s.slotMachine}>
              <View style={s.introBadge}>
                <Text style={s.introBadgeTxt}>{"NEUROCIENCIA · POSITIVIDAD"}</Text>
              </View>
              <Text style={s.heroTitle}>{"Cosechar el Momento"}</Text>
              <Text style={s.introBody}>
                {"Tu cerebro tiene un sesgo de negatividad incorporado: está diseñado para registrar amenazas, no logros. Los pequeños momentos buenos —que son mayoría— pasan desapercibidos antes de que puedas procesarlos."}
              </Text>
              <View style={s.introFactBox}>
                <Text style={s.introFactLabel}>{"LA CIENCIA DETRÁS"}</Text>
                <Text style={s.introFactTxt}>
                  {"Rick Hanson, neurocientífico de Harvard, demostró que los momentos positivos necesitan 20 segundos de atención consciente para consolidarse en memoria a largo plazo. Sin ese anclaje, el cerebro los descarta."}
                </Text>
              </View>
              <View style={s.introMechanicBox}>
                <Text style={s.introMechanicLabel}>{"¿CÓMO FUNCIONA?"}</Text>
                <Text style={s.introMechanicTxt}>
                  {"Cada giro identifica un micro-momento real de bienestar, el superpoder que usaste para vivirlo y la molécula que liberaste. Luego puedes ver cómo el cerebro en automático lo minimiza — o amplificarlo como alquimista."}
                </Text>
              </View>
              <Pressable style={s.introCta} onPress={() => setPhase("idle")}>
                <Zap size={16} color="#fff" strokeWidth={2.5} />
                <Text style={s.introCtaTxt}>{"Empezar a cosechar"}</Text>
              </Pressable>
            </BlurView>
          )}

          {phase !== "intro" && (
            <>
              <Text style={s.heroTitle}>{"Cosechar el Momento"}</Text>
              <Text style={s.heroSub}>{"Convierte lo ordinario en combustible para tu bienestar."}</Text>

              <BlurView intensity={50} tint="light" style={s.slotMachine}>
                <Animated.View pointerEvents="none" style={[s.jackpotOverlay, { opacity: jackpotGlow }]} />
                <View style={s.reelsRow}>
                  <ReelWindow
                    label={"EL HECHO"} hint={"¿Qué pasó?"}
                    content={FACTS[display[0]].label}
                    bounce={reel1Bounce} reelScale={reel1Scale}
                    locked={locked[0]} idle={isIdle}
                    alchemistMode={alchemistMode} accentColor={"#F59E0B"}
                  />
                  <ReelWindow
                    label={"SUPERPODER"} hint={"¿Qué usaste?"}
                    content={SUPERPOWERS[display[1]].label}
                    bounce={reel2Bounce} reelScale={reel2Scale}
                    locked={locked[1]} idle={isIdle}
                    alchemistMode={alchemistMode} accentColor={"#7B6BB5"}
                  />
                  <ReelWindow
                    label={"QUÍMICA"} hint={"¿Qué ganaste?"}
                    content={CHEMICALS[display[2]].molecule}
                    bounce={reel3Bounce} reelScale={reel3Scale}
                    locked={locked[2]} idle={isIdle}
                    alchemistMode={alchemistMode} accentColor={result?.chemical.accent ?? "#10B981"}
                  />
                </View>
                <Animated.View style={{ transform: [{ scale: spinBtnScale }] }}>
                  <Pressable style={[s.spinBtn, isSpinning && s.spinBtnBusy]} onPress={spin} disabled={isSpinning}>
                    <Zap size={18} color="#fff" strokeWidth={2.5} />
                    <Text style={s.spinBtnTxt}>{isSpinning ? "Girando..." : "Cosechar Momento"}</Text>
                  </Pressable>
                </Animated.View>
              </BlurView>

              {result && (
                <Animated.View style={{ opacity: cardFade, transform: [{ translateY: cardSlideY }] }}>
                  <BlurView intensity={55} tint="light" style={s.rewardCard}>
                    <Pressable style={s.switchRow} onPress={toggleAlchemist}>
                      <Brain size={13} color={!alchemistMode ? "#7B6BB5" : "#C0B0D8"} strokeWidth={2} />
                      <Text style={[s.switchLabel, !alchemistMode && s.switchLabelActive]}>{"Automático"}</Text>
                      <View style={[s.switchTrack, alchemistMode && s.switchTrackGold]}>
                        <Animated.View style={[s.switchThumb, { transform: [{ translateX: switchTranslateX }] }]} />
                      </View>
                      <Text style={[s.switchLabel, alchemistMode && s.switchLabelGold]}>{"Alquimista"}</Text>
                      <Sparkles size={13} color={alchemistMode ? "#F59E0B" : "#C0B0D8"} strokeWidth={2} />
                    </Pressable>

                    <Animated.View style={{ opacity: contentFade }}>
                      {!alchemistMode ? (
                        <View style={s.autoCard}>
                          <Text style={s.autoLabel}>{"TU VOZ INTERIOR EN AUTOMÁTICO"}</Text>
                          <View style={s.autoBubble}>
                            <Text style={s.autoText}>{result.fact.sabotaje}</Text>
                          </View>
                          <Text style={s.autoFooter}>{"El sesgo de negatividad minimizando lo que ya lograste."}</Text>
                        </View>
                      ) : (
                        <View>
                          <View style={s.destelloBlock}>
                            <Text style={s.blockLabel}>{"✦  EL DESTELLO"}</Text>
                            <Text style={s.destelloText}>
                              {result.fact.destello}{" "}
                              <Text style={s.destelloSuffix}>{result.superpower.destelloSuffix}</Text>
                            </Text>
                            <View style={s.superpowerTag}>
                              <Sparkles size={11} color="#7B6BB5" strokeWidth={2} />
                              <Text style={s.superpowerTxt}>{result.superpower.label}</Text>
                            </View>
                          </View>
                          <View style={[s.chemBlock, { borderColor: result.chemical.accent + "44" }]}>
                            <Text style={s.blockLabel}>{"⬡  EL ANCLAJE QUÍMICO"}</Text>
                            <View style={s.chemRow}>
                              <View style={[s.chemBadge, { backgroundColor: result.chemical.accent + "18" }]}>
                                <Text style={[s.chemMolecule, { color: result.chemical.accent }]}>{result.chemical.molecule}</Text>
                                <Text style={[s.chemLabel, { color: result.chemical.accent }]}>{result.chemical.label}</Text>
                              </View>
                              <Text style={s.chemDesc}>{result.chemical.description}</Text>
                            </View>
                          </View>
                          <View style={s.actionsRow}>
                            <Pressable style={[s.actionBtn, saved && s.actionBtnSuccess]} onPress={handleSave}>
                              {saved ? <Check size={15} color="#fff" strokeWidth={2.5} /> : <Gift size={15} color="#fff" strokeWidth={2} />}
                              <Text style={s.actionBtnTxt}>{saved ? "¡Guardado!" : "Guardar"}</Text>
                            </Pressable>
                            <Pressable style={[s.actionBtn, s.actionBtnGold, copied && s.actionBtnSuccess]} onPress={handleCopy}>
                              {copied ? <Check size={15} color="#fff" strokeWidth={2.5} /> : <Copy size={15} color="#fff" strokeWidth={2} />}
                              <Text style={s.actionBtnTxt}>{copied ? "¡Copiado!" : "Multiplicar Eco"}</Text>
                            </Pressable>
                          </View>
                        </View>
                      )}
                    </Animated.View>
                  </BlurView>

                  <Pressable style={s.resetBtn} onPress={resetGame}>
                    <RefreshCw size={13} color="#B8A8D0" strokeWidth={2} />
                    <Text style={s.resetTxt}>{"Nuevo momento"}</Text>
                  </Pressable>
                </Animated.View>
              )}
            </>
          )}

        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
