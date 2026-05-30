import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Check, Copy, Eye, Sparkles, X } from "lucide-react-native";
import React from "react";
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FloatingParticle } from "./FloatingParticle";
import { FogCell } from "./FogCell";
import { BG_PARTICLES, GRADIENT_COLORS, MIRROR_DATA, REVEAL_PARTICLES } from "./constants";
import { s } from "./styles";
import { useSelfEsteemMirror } from "./useSelfEsteemMirror";

interface Props { visible: boolean; onClose: () => void; }

export default function SelfEsteemMirrorAssistant({ visible, onClose }: Props) {
  const {
    phase, selected, revealed, copied, accepted, revealBurst, cellsCleared,
    screenFade, cardFade, cardSlideY, revealOpacity, revealScale, btnsFade,
    mirrorContainerRef, cellOpacities, panResponder,
    progressBarWidth, progressPct,
    handleCopy, handleAccept, goBack, selectItem, setPhase,
  } = useSelfEsteemMirror(visible);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, { opacity: screenFade }]}>
        <LinearGradient colors={GRADIENT_COLORS} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />

        {BG_PARTICLES.map((p, i) => <FloatingParticle key={i} {...p} />)}
        {revealBurst && REVEAL_PARTICLES.map((p, i) => <FloatingParticle key={`r${i}`} {...p} />)}

        <View style={s.header}>
          {phase === "mirror" ? (
            <Pressable style={s.backBtn} onPress={goBack} hitSlop={12}>
              <ArrowLeft size={16} color="#7890A8" strokeWidth={2} />
              <Text style={s.backTxt}>{"Volver"}</Text>
            </Pressable>
          ) : (
            <Text style={s.headerTag}>{"LA LEY DEL ESPEJO · YOSHINORI NOGUCHI"}</Text>
          )}
          <Pressable style={s.closeBtn} onPress={onClose} hitSlop={12}>
            <X size={18} color="#7890A8" strokeWidth={2} />
          </Pressable>
        </View>

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={s.introBadge}>
              <Text style={s.introBadgeTxt}>{"AUTOESTIMA · LA LEY DEL ESPEJO"}</Text>
            </View>
            <Text style={s.heroTitle}>{"El Espejo Interior"}</Text>
            <Text style={s.introBody}>
              {"Yoshinori Noguchi, terapeuta japonés, trabajó durante décadas con miles de personas en conflicto con su entorno. Descubrió algo sorprendente: lo que nos molesta profundamente en otros siempre refleja algo que aún no hemos resuelto dentro de nosotros mismos."}
            </Text>
            <View style={s.introQuoteBox}>
              <Text style={s.introQuoteMark}>{"“"}</Text>
              <Text style={s.introQuoteTxt}>{"El mundo exterior es un espejo fiel de tu mundo interior. Lo que ves en los demás es lo que aún no has visto en ti."}</Text>
              <Text style={s.introQuoteAuthor}>{"— Yoshinori Noguchi, La Ley del Espejo"}</Text>
            </View>
            <View style={s.introMechanicBox}>
              <Text style={s.introMechanicLabel}>{"¿CÓMO FUNCIONA?"}</Text>
              <Text style={s.introMechanicTxt}>
                {"Elige la situación que más te incomoda. El espejo aparecerá cubierto de niebla. Desliza el dedo por toda su superficie para limpiarla y descubrir qué mensaje de tu interior refleja esa incomodidad — y cuál es tu paso concreto para hoy."}
              </Text>
            </View>
            <Pressable style={s.introCta} onPress={() => setPhase("select")}>
              <Eye size={16} color="#fff" strokeWidth={2.2} />
              <Text style={s.introCtaTxt}>{"Ver mi espejo"}</Text>
            </Pressable>
          </ScrollView>
        )}

        {/* ── SELECCIÓN ── */}
        {phase === "select" && (
          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={s.heroTitle}>{"El Espejo Interior"}</Text>
            <Text style={s.heroSub}>{"Lo que te molesta en otros es un mensaje de tu propio interior. Elige la situación que más te quita la paz."}</Text>
            {MIRROR_DATA.map((item) => (
              <Pressable key={item.id} style={s.situationCard} onPress={() => selectItem(item)}>
                <Eye size={15} color="#7890A8" strokeWidth={1.8} />
                <Text style={s.situationCardTxt}>{item.situation}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* ── ESPEJO ── */}
        {phase === "mirror" && selected && (
          <Animated.View style={[s.mirrorPhase, { opacity: cardFade, transform: [{ translateY: cardSlideY }] }]}>
            <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

              <View style={s.situationBadge}>
                <Text style={s.situationBadgeTxt}>{selected.situation}</Text>
              </View>

              <View ref={mirrorContainerRef} style={s.mirrorContainer}>
                <View style={s.truthLayer} pointerEvents="none">
                  <Text style={s.truthLabel}>{"EL ESPEJO TE MUESTRA"}</Text>
                  <Text style={s.truthText}>{selected.mirrorLaw}</Text>
                </View>

                {!revealed && (
                  <View style={StyleSheet.absoluteFill} pointerEvents="none">
                    <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
                    <View style={s.matrixGrid}>
                      {cellOpacities.map((opacity, idx) => <FogCell key={idx} opacity={opacity} />)}
                    </View>
                    {cellsCleared === 0 && (
                      <View style={[StyleSheet.absoluteFill, s.fogHintLayer]} pointerEvents="none">
                        <Sparkles size={22} color="rgba(100,130,160,0.55)" strokeWidth={1.5} />
                        <Text style={s.fogHintText}>{"Desliza el dedo por todo el espejo\npara descubrir tu reflejo"}</Text>
                      </View>
                    )}
                  </View>
                )}

                {!revealed && (
                  <View style={[StyleSheet.absoluteFill, s.wipeLayer]} {...panResponder.panHandlers} />
                )}
              </View>

              {!revealed && (
                <View style={s.progressRow}>
                  <View style={s.progressBg}>
                    <Animated.View style={[s.progressFill, { width: progressBarWidth }]} />
                  </View>
                  <Text style={s.progressLabel}>
                    {cellsCleared === 0
                      ? "Usa tu dedo para limpiar el espejo"
                      : progressPct >= 100
                        ? "¡Espejo completo!"
                        : `Limpio al ${progressPct}%`}
                  </Text>
                </View>
              )}

              {revealed && (
                <Animated.View style={[s.zenCard, { opacity: revealOpacity, transform: [{ scale: revealScale }] }]}>
                  <View style={s.zenAccent} />
                  <Text style={s.zenLabel}>{"✦   TU PASO DE HOY"}</Text>
                  <Text style={s.zenText}>{selected.zenAction}</Text>
                </Animated.View>
              )}

              {revealed && (
                <Animated.View style={[s.actionsRow, { opacity: btnsFade }]}>
                  <Pressable style={[s.actionBtn, accepted && s.actionBtnSuccess]} onPress={handleAccept}>
                    {accepted ? <Check size={15} color="#fff" strokeWidth={2.5} /> : <Eye size={15} color="#fff" strokeWidth={2} />}
                    <Text style={s.actionBtnTxt}>{accepted ? "¡Aceptado!" : "Aceptar mi reflejo"}</Text>
                  </Pressable>
                  <Pressable style={[s.actionBtn, s.actionBtnAlt, copied && s.actionBtnSuccess]} onPress={handleCopy}>
                    {copied ? <Check size={15} color="#fff" strokeWidth={2.5} /> : <Copy size={15} color="#fff" strokeWidth={2} />}
                    <Text style={s.actionBtnTxt}>{copied ? "¡Copiado!" : "Copiar Recordatorio"}</Text>
                  </Pressable>
                </Animated.View>
              )}

            </ScrollView>
          </Animated.View>
        )}

      </Animated.View>
    </Modal>
  );
}
