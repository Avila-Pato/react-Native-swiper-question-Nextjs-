import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Check, Compass, Copy } from "lucide-react-native";
import React from "react";
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ReAnimated from "react-native-reanimated";
import { FloatingParticle } from "./FloatingParticle";
import { BG_PARTICLES, COMPASS_X, COMPASS_Y, GRADIENT_COLORS, ITEMS, NODE_DEFS, NODE_RADIUS } from "./constants";
import { s } from "./styles";
import { usePurposeCompass } from "./usePurposeCompass";

interface Props { visible: boolean; onClose: () => void; }

export default function PurposeCompassAssistant({ visible, onClose }: Props) {
  const {
    phase, selected, alignedCount, copied, anchored, completedIds, alignedRef,
    nodePositions, nodeScales, nodeGlows,
    burstScale, burstOpacity, ringScale, ringOpacity, textFade, btnsFade,
    cardTiltStyle, sheenStyle, panResponders,
    statInterpolations,
    handleSelectItem, handleCopy, handleAnchor, goBack, handleClose, setPhase,
  } = usePurposeCompass(visible);

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={() => handleClose(onClose)}>
      <View style={s.overlay}>
        <LinearGradient colors={GRADIENT_COLORS} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />
        {BG_PARTICLES.map((p, i) => <FloatingParticle key={i} {...p} />)}

        <Animated.View pointerEvents="none" style={[s.burst, { left: COMPASS_X - 80, top: COMPASS_Y - 80, opacity: burstOpacity, transform: [{ scale: burstScale }] }]} />

        <View style={s.header}>
          {phase !== "intro" ? (
            <Pressable style={s.backBtn} onPress={goBack} hitSlop={12}>
              <ArrowLeft size={16} color="#8888A8" strokeWidth={2} />
              <Text style={s.backTxt}>{"Volver"}</Text>
            </Pressable>
          ) : <View style={s.backBtn} />}
          <Pressable onPress={() => handleClose(onClose)} hitSlop={12} style={s.closeBtn}>
            <Text style={s.closeTxt}>{"x"}</Text>
          </Pressable>
        </View>

        {/* INTRO */}
        {phase === "intro" && (
          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={s.introBadge}><Text style={s.introBadgeTxt}>{"PROPÓSITO · SENTIDO DE VIDA"}</Text></View>
            <Text style={s.heroTitle}>{"La Brújula del Sentido"}</Text>
            <View style={s.introAuthorCard}>
              <View style={s.introAuthorAccent} />
              <Text style={s.introAuthorName}>{"Viktor Frankl"}</Text>
              <Text style={s.introAuthorRole}>{"Psiquiatra austriaco - Fundador de la Logoterapia - Superviviente del Holocausto"}</Text>
            </View>
            <Text style={s.introBody}>{"Frankl sobrevivió cuatro campos de concentración nazis, incluido Auschwitz, y en ese infierno descubrió lo que ningún verdugo podía quitarle: la libertad de elegir su actitud.\n\nSu conclusión fue radical: la búsqueda de sentido es la motivación primaria del ser humano. No el placer, no el poder. El significado. Cuando lo pierdes, aparece el vacío existencial. Cuando lo encuentras, puedes soportar casi cualquier cosa."}</Text>
            <View style={s.introQuoteBox}>
              <Text style={s.introQuoteMark}>{"\u201C"}</Text>
              <Text style={s.introQuoteTxt}>{"El hombre no debería preguntar cuál es el sentido de su vida, sino reconocer que es él quien recibe esa pregunta."}</Text>
              <Text style={s.introQuoteAuthor}>{"— Viktor Frankl"}</Text>
            </View>
            <View style={s.introIkigaiBox}>
              <Text style={s.introSectionLabel}>{"+ IKIGAI"}</Text>
              <Text style={s.introBodyAlt}>{"En Okinawa, la región con más centenarios del mundo, no existe una palabra para retiro. El Ikigai (razón de ser) es la intersección de cuatro preguntas: lo que amas, lo que el mundo necesita, aquello en lo que eres bueno y por lo que te pagarían. Donde convergen las cuatro, vive tu propósito."}</Text>
            </View>
            <View style={s.introMechanicBox}>
              <Text style={s.introSectionLabel}>{"¿CÓMO FUNCIONA?"}</Text>
              <Text style={s.introBodyAlt}>{"Elige un enfoque de propósito. Veras cuatro nodos flotando alrededor de un centro morado, los cuatro pilares de tu ser. Arrastra cada nodo hacia el centro para alinearlos. Cuando los cuatro converjan, se revelará tu arquetipo de proposito."}</Text>
            </View>
            <Pressable style={s.introCta} onPress={() => setPhase("select")}>
              <Compass size={16} color="#fff" strokeWidth={2.2} />
              <Text style={s.introCtaTxt}>{"Explorar mi propósito"}</Text>
            </Pressable>
          </ScrollView>
        )}

        {/* SELECT */}
        {phase === "select" && (
          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={s.heroTitle}>{"¿Desde dónde quieres mirar?"}</Text>
            <Text style={s.heroSub}>{"Elige el enfoque que más resuena contigo ahora mismo."}</Text>
            {ITEMS.map((item) => {
              const done = completedIds.has(item.id);
              return (
                <Pressable key={item.id} style={[s.selectCard, done && s.selectCardDone]} onPress={() => handleSelectItem(item)}>
                  <View style={[s.selectCardAccent, done && s.selectCardAccentDone]} />
                  <Text style={s.selectCardTitle}>{item.title}</Text>
                  <Text style={s.selectCardSub}>{item.subtitle}</Text>
                  {done && (
                    <View style={s.selectCardCheckBadge}>
                      <Check size={10} color="#fff" strokeWidth={3} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* COMPASS */}
        {phase === "compass" && selected && (
          <View style={s.compassContainer} pointerEvents="box-none">
            <View style={s.compassHeader}>
              <Text style={s.compassTitle}>{selected.title}</Text>
              <Text style={s.compassSub}>{alignedCount === 0 ? "Arrastra cada pilar hacia el centro" : alignedCount < 4 ? `${alignedCount} de 4 pilares alineados` : "Convergencia total..."}</Text>
            </View>
            <Animated.View pointerEvents="none" style={[s.targetRing, { left: COMPASS_X - 56, top: COMPASS_Y - 56, transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
            <View style={[s.targetDot, { left: COMPASS_X - 5, top: COMPASS_Y - 5 }]} pointerEvents="none" />
            <View style={[s.progressRow, { top: COMPASS_Y + 90 }]} pointerEvents="none">
              {NODE_DEFS.map((_, i) => (
                <View key={i} style={[s.progressDot, alignedRef.current.has(i) && s.progressDotActive]} />
              ))}
            </View>
            {NODE_DEFS.map((node, i) => {
              const glowColor   = nodeGlows[i].interpolate({ inputRange: [0, 1], outputRange: ["rgba(107,90,158,0)", "rgba(107,90,158,0.3)"] });
              const borderColor = nodeGlows[i].interpolate({ inputRange: [0, 1], outputRange: ["rgba(155,138,208,0.5)", "rgba(107,90,158,0.95)"] });
              return (
                <Animated.View key={node.id} style={{ position: "absolute", left: COMPASS_X - NODE_RADIUS, top: COMPASS_Y - NODE_RADIUS, alignItems: "center", transform: [{ translateX: nodePositions[i].x }, { translateY: nodePositions[i].y }, { scale: nodeScales[i] }] }} {...(alignedRef.current.has(i) ? {} : panResponders[i].panHandlers)}>
                  <Animated.View pointerEvents="none" style={[s.nodeGlow, { backgroundColor: glowColor }]} />
                  <Animated.View style={[s.nodeBorder, { borderColor }]}>
                    <LinearGradient colors={node.colors} style={s.node} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                      <node.Icon size={15} color="#fff" strokeWidth={2} />
                    </LinearGradient>
                  </Animated.View>
                  <Text style={s.nodeLabel}>{node.label}</Text>
                </Animated.View>
              );
            })}
          </View>
        )}

        {/* REVEALED */}
        {phase === "revealed" && selected && (
          <ScrollView style={s.scroll} contentContainerStyle={s.revealScrollContent} showsVerticalScrollIndicator={false}>
            <ReAnimated.View style={[s.collectCard, cardTiltStyle]}>
              <LinearGradient colors={["#152232", "#0E1C2E", "#1A3050"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 22 }]} />
              <ReAnimated.View style={[s.cardSheen, sheenStyle]} pointerEvents="none">
                <LinearGradient colors={["rgba(255,255,255,0)", "rgba(104,153,180,0.75)", "rgba(200,235,255,0.65)", "rgba(255,255,255,0)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              </ReAnimated.View>
              <View style={s.cardTopRow}>
                <View style={s.cardBadge}><Text style={s.cardBadgeTxt}>{"ARQUETIPO REVELADO"}</Text></View>
                <Compass size={13} color="rgba(168,210,235,0.85)" strokeWidth={1.5} />
              </View>
              <View style={s.cardIconArea}>
                <View style={s.cardIconRing}>
                  <LinearGradient colors={["rgba(104,153,180,0.45)", "rgba(61,90,114,0.2)"]} style={StyleSheet.absoluteFill} />
                </View>
                <Compass size={24} color="#A8D0E8" strokeWidth={1.5} />
              </View>
              <Text style={s.cardTitle}>{selected.title}</Text>
              <Text style={s.cardSubtitle}>{selected.subtitle}</Text>
              <View style={s.cardDivider} />
              {selected.stats.map((stat, i) => (
                <View key={stat.label} style={s.statRow}>
                  <Text style={s.statLabel}>{stat.label}</Text>
                  <View style={s.statTrack}>
                    <Animated.View style={[s.statFill, { width: statInterpolations[i] }]} />
                  </View>
                  <Text style={s.statPct}>{stat.value}%</Text>
                </View>
              ))}
            </ReAnimated.View>

            <Animated.View style={{ opacity: textFade }}>
              <View style={s.reflectionCard}>
                <View style={s.reflectionAccent} />
                <Text style={s.revealQuote}>{selected.quote}</Text>
                <View style={s.revealDivider} />
                <Text style={s.reflectionLabel}>{"✦   EL ESPEJO DEL PROPÓSITO"}</Text>
                <Text style={s.reflectionTxt}>{selected.reflexion}</Text>
              </View>
              <View style={s.zenCard}>
                <View style={s.zenAccent} />
                <Text style={s.zenLabel}>{"✦   TU ACCIÓN DE HOY"}</Text>
                <Text style={s.zenTxt}>{selected.futureAction}</Text>
              </View>
            </Animated.View>

            <Animated.View style={[s.actionsRow, { opacity: btnsFade }]}>
              <Pressable style={[s.actionBtn, anchored && s.actionBtnSuccess]} onPress={handleAnchor}>
                {anchored ? <Check size={15} color="#fff" strokeWidth={2.5} /> : <Compass size={15} color="#fff" strokeWidth={2} />}
                <Text style={s.actionBtnTxt}>{anchored ? "¡Anclado!" : "Anclar propósito"}</Text>
              </Pressable>
              <Pressable style={[s.actionBtn, s.actionBtnAlt, copied && s.actionBtnSuccess]} onPress={handleCopy}>
                {copied ? <Check size={15} color="#fff" strokeWidth={2.5} /> : <Copy size={15} color="#fff" strokeWidth={2} />}
                <Text style={s.actionBtnTxt}>{copied ? "¡Copiado!" : "Copiar"}</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}
