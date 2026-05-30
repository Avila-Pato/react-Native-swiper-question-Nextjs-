import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Check, Copy, Heart, X } from "lucide-react-native";
import React from "react";
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FloatingParticle } from "./FloatingParticle";
import { BG_PARTICLES, FUSION_PARTICLES, GRADIENT_COLORS, INTRO_AUTHORS, NODE_A, NODE_B_INIT, NODE_RADIUS, VINCULOS } from "./constants";
import { s } from "./styles";
import { useVinculos } from "./useVinculos";

interface Props { visible: boolean; onClose: () => void; }

export default function VinculosDelHilo({ visible, onClose }: Props) {
  const {
    phase, selected, fusionBurst, isDragging, copied, accepted,
    screenFade, revealFade, revealSlideY, btnsFade,
    nodeBScale, nodeAScale, nodeARingScale, nodeARingOpacity,
    threadLeft, threadTop, threadWidth, threadOpacity,
    fusionGlowScale, fusionGlowOpacity, fusionCenterRef,
    nodeBLeft, nodeBTop, threadRotStr,
    panResponder,
    handleCopy, handleAccept, goBack, selectVinculo, setPhase,
  } = useVinculos(visible);

  const fus = fusionCenterRef.current;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, { opacity: screenFade }]}>
        <LinearGradient colors={GRADIENT_COLORS} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />

        {BG_PARTICLES.map((p, i) => <FloatingParticle key={i} {...p} />)}
        {fusionBurst && FUSION_PARTICLES.map((p, i) => <FloatingParticle key={`f${i}`} {...p} />)}

        <View style={s.header}>
          {phase === "thread" || phase === "fused" ? (
            <Pressable style={s.backBtn} onPress={goBack} hitSlop={12}>
              <ArrowLeft size={16} color="#7890A8" strokeWidth={2} />
              <Text style={s.backTxt}>{"Volver"}</Text>
            </Pressable>
          ) : (
            <Text style={s.headerTag}>{"VÍNCULOS · LA LEY DEL HILO"}</Text>
          )}
          <Pressable style={s.closeBtn} onPress={onClose} hitSlop={12}>
            <X size={18} color="#7890A8" strokeWidth={2} />
          </Pressable>
        </View>

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={s.introBadge}>
              <Text style={s.introBadgeTxt}>{"VÍNCULOS · AUTOESTIMA"}</Text>
            </View>
            <Text style={s.heroTitle}>{'"El Hilo que nos une"'}</Text>
            <View style={s.introAuthorBadge}>
              <Text style={s.introAuthorName}>{'"John Bowlby"'}</Text>
              <Text style={s.introAuthorRole}>{'"Teoría del Apego · Psiquiatra y psicoanalista británico"'}</Text>
            </View>
            <Text style={s.introBody}>
              {"Bowlby demostró que los vínculos que formamos de adultos —con la pareja, los hijos, los amigos— son moldeados por los patrones de apego que aprendimos en la infancia. No elegimos conscientemente cómo nos relacionamos: lo repetimos.\n\nLo que te genera tensión en una relación no habla solo de la otra persona. Habla de un patrón más profundo que aún no ha sido visto."}
            </Text>
            <View style={s.introQuoteBox}>
              <Text style={s.introQuoteMark}>{"“"}</Text>
              <Text style={s.introQuoteTxt}>{"La necesidad de apego es tan fundamental en el ser humano como la necesidad de comida o abrigo. No es una debilidad —es nuestra naturaleza más esencial."}</Text>
              <Text style={s.introQuoteAuthor}>{"— John Bowlby, El vínculo afectivo"}</Text>
            </View>
            <View style={s.introAuthorsBox}>
              <Text style={s.introAuthorsLabel}>{"VOCES DE ESTE MÓDULO"}</Text>
              {INTRO_AUTHORS.map((a) => (
                <View key={a.name} style={s.introAuthorCard}>
                  <View style={s.introAuthorCardHeader}>
                    <Text style={s.introAuthorRowName}>{a.name}</Text>
                    <Text style={s.introAuthorCardRole}>{a.role}</Text>
                  </View>
                  <Text style={s.introAuthorCardBio}>{a.bio}</Text>
                </View>
              ))}
            </View>
            <View style={s.introMechanicBox}>
              <Text style={s.introMechanicLabel}>{"¿CÓMO FUNCIONA?"}</Text>
              <Text style={s.introMechanicTxt}>{"Elige la relación que más te ocupa la mente. Verás dos nodos unidos por un hilo: tú y el vínculo. Arrastra el nodo del vínculo hacia el tuyo para fusionarlos. En ese momento de unión, el espejo revelará —desde la perspectiva del autor asignado— el patrón real detrás de esa tensión."}</Text>
            </View>
            <Pressable style={s.introCta} onPress={() => setPhase("select")}>
              <Heart size={16} color="#fff" strokeWidth={2.2} />
              <Text style={s.introCtaTxt}>{"Explorar mis vínculos"}</Text>
            </Pressable>
          </ScrollView>
        )}

        {/* ── SELECCIÓN ── */}
        {phase === "select" && (
          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={s.heroTitle}>{"¿Con quién sientes tensión?"}</Text>
            <Text style={s.heroSub}>{"Elige el vínculo que más espacio ocupa en tu mente ahora mismo."}</Text>
            {VINCULOS.map((item) => (
              <Pressable key={item.id} style={s.vinculoCard} onPress={() => selectVinculo(item)}>
                <View style={s.vinculoCardIcon}>
                  <Heart size={14} color="#7890A8" strokeWidth={1.8} />
                </View>
                <View style={s.vinculoCardText}>
                  <Text style={s.vinculoCardLabel}>{item.label}</Text>
                  <Text style={s.vinculoCardTagline}>{item.tagline}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* ── CANVAS DEL HILO ── */}
        {phase === "thread" && selected && (
          <View style={s.canvas} pointerEvents="box-none">
            <Animated.View
              pointerEvents="none"
              style={[s.thread, { left: threadLeft, top: threadTop, width: threadWidth, opacity: threadOpacity, transform: [{ rotate: threadRotStr }] }]}
            />

            {/* Nodo A — Yo (fijo) */}
            <Animated.View
              pointerEvents="none"
              style={[s.nodeA, { left: NODE_A.x - NODE_RADIUS, top: NODE_A.y - NODE_RADIUS, transform: [{ scale: nodeAScale }] }]}
            >
              <LinearGradient colors={["#C8DFF2", "#A8C8E8"]} style={StyleSheet.absoluteFill} />
              <Text style={s.nodeALabel}>{"Yo"}</Text>
            </Animated.View>
            <Animated.View
              pointerEvents="none"
              style={[s.nodeARing, { left: NODE_A.x - NODE_RADIUS - 12, top: NODE_A.y - NODE_RADIUS - 12, opacity: nodeARingOpacity, transform: [{ scale: nodeARingScale }] }]}
            />
            <Text style={[s.nodeCaption, { left: NODE_A.x - 24, top: NODE_A.y + NODE_RADIUS + 10 }]}>{"Yo"}</Text>

            {/* Nodo B — Vínculo (arrastrable) */}
            <Animated.View style={{ position: "absolute", left: nodeBLeft, top: nodeBTop }}>
              <Animated.View style={[s.nodeB, { transform: [{ scale: nodeBScale }] }]} {...panResponder.panHandlers}>
                <LinearGradient colors={["#F0C8DC", "#DCA0BC"]} style={StyleSheet.absoluteFill} />
                <Heart size={16} color="#9E5C72" strokeWidth={2} fill={"#9E5C72"} />
              </Animated.View>
            </Animated.View>
            <Text style={[s.nodeCaption, { left: NODE_B_INIT.x - 40, top: NODE_B_INIT.y + NODE_RADIUS + 10, width: 80, textAlign: "center" }]}>
              {selected.label}
            </Text>

            {/* Destello de fusión */}
            <Animated.View
              pointerEvents="none"
              style={[s.fusionGlow, { left: fus.x - 60, top: fus.y - 60, opacity: fusionGlowOpacity, transform: [{ scale: fusionGlowScale }] }]}
            />

            <View style={s.instructionRow} pointerEvents="none">
              <Text style={s.instructionTxt}>
                {isDragging ? "Acércalo al nodo azul para fusionar" : `Arrastra "${selected.label}" hacia ti`}
              </Text>
            </View>
          </View>
        )}

        {/* ── REVELADO ── */}
        {phase === "fused" && selected && (
          <Animated.View style={[s.revealWrapper, { opacity: revealFade, transform: [{ translateY: revealSlideY }] }]}>
            <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={s.vinculoBadge}>
                <Heart size={11} color="#7890A8" strokeWidth={2} fill={"#7890A8"} />
                <Text style={s.vinculoBadgeTxt}>{selected.label.toUpperCase()}</Text>
              </View>

              <View style={s.reflectionCard}>
                <View style={s.reflectionAccent} />
                <View style={s.revealAuthorBadge}>
                  <Text style={s.revealAuthorName}>{selected.author}</Text>
                  <Text style={s.revealAuthorRole}>{selected.authorRole}</Text>
                </View>
                <Text style={s.revealAuthorQuote}>{`"${selected.authorQuote}"`}</Text>
                <View style={s.revealDivider} />
                <Text style={s.reflectionLabel}>{"✦   EL REFLEJO DEL VÍNCULO"}</Text>
                <Text style={s.reflectionTxt}>{selected.reflection}</Text>
              </View>

              <View style={s.zenCard}>
                <View style={[s.reflectionAccent, { backgroundColor: "#9E5C72" }]} />
                <Text style={[s.reflectionLabel, { color: "#9E5C72" }]}>{"✦   TU ACCIÓN DE HOY"}</Text>
                <Text style={s.zenTxt}>{selected.zenAction}</Text>
              </View>

              <Animated.View style={[s.actionsRow, { opacity: btnsFade }]}>
                <Pressable style={[s.actionBtn, accepted && s.actionBtnSuccess]} onPress={handleAccept}>
                  {accepted ? <Check size={15} color="#fff" strokeWidth={2.5} /> : <Heart size={15} color="#fff" strokeWidth={2} />}
                  <Text style={s.actionBtnTxt}>{accepted ? "¡Integrado!" : "Integrar reflexión"}</Text>
                </Pressable>
                <Pressable style={[s.actionBtn, s.actionBtnAlt, copied && s.actionBtnSuccess]} onPress={handleCopy}>
                  {copied ? <Check size={15} color="#fff" strokeWidth={2.5} /> : <Copy size={15} color="#fff" strokeWidth={2} />}
                  <Text style={s.actionBtnTxt}>{copied ? "¡Copiado!" : "Copiar"}</Text>
                </Pressable>
              </Animated.View>
            </ScrollView>
          </Animated.View>
        )}

      </Animated.View>
    </Modal>
  );
}
