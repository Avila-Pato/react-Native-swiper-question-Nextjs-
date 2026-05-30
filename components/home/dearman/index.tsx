import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Check, Copy, X } from "lucide-react-native";
import React from "react";
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FloatingParticle } from "./FloatingParticle";
import { CONTEXTS, GRADIENT_COLORS, INTROS, NEDRA_DATA, PARTICLES } from "./constants";
import { s } from "./styles";
import { useDearMan } from "./useDearMan";

interface Props { visible: boolean; onClose: () => void; }

export default function DearManAssistant({ visible, onClose }: Props) {
  const {
    context, phase, selectedTrigger, nedraMode, copied,
    screenFade, cardFade, cardSlideX, contentFade, switchTranslateX,
    transitionTo, selectTrigger, goBack, toggleNedra, changeContext, handleCopy,
    setPhase,
  } = useDearMan(visible);

  const triggers = NEDRA_DATA[context];

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, { opacity: screenFade }]}>

        <LinearGradient colors={GRADIENT_COLORS} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={s.blob1} pointerEvents="none" />
        <View style={s.blob2} pointerEvents="none" />
        <View style={s.blob3} pointerEvents="none" />
        {PARTICLES.map((p, i) => <FloatingParticle key={i} {...p} />)}

        {/* Header */}
        <View style={s.header}>
          {phase === "simulate" ? (
            <Pressable style={s.backBtn} onPress={goBack} hitSlop={12}>
              <ArrowLeft size={16} color="#8B7BAB" strokeWidth={2} />
              <Text style={s.backTxt}>{"Volver"}</Text>
            </Pressable>
          ) : phase === "intro" ? (
            <Text style={s.headerTag}>{"LÍMITES · PSICOLOGÍA CLÍNICA"}</Text>
          ) : (
            <Text style={s.headerTag}>{INTROS[context].headerTag}</Text>
          )}
          <Pressable style={s.closeBtn} onPress={onClose} hitSlop={12}>
            <X size={18} color="#8B7BAB" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Tabs de contexto — solo en diagnose */}
        {phase === "diagnose" && (
          <View style={s.contextRow}>
            {CONTEXTS.map((c) => {
              const active = c.key === context;
              return (
                <Pressable key={c.key} style={[s.contextTab, active && s.contextTabActive]} onPress={() => changeContext(c.key)}>
                  <Image source={c.icon} style={s.contextIcon} contentFit="contain" />
                  <Text style={[s.contextTabTxt, active && s.contextTabTxtActive]}>{c.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: cardFade, transform: [{ translateX: cardSlideX }] }}>

            {phase === "intro" ? (
              /* ── Intro ── */
              <BlurView intensity={45} tint="light" style={s.card}>
                <View style={s.introBadge}>
                  <Text style={s.introBadgeTxt}>{"PSICOLOGÍA CLÍNICA · EVIDENCIA"}</Text>
                </View>
                <Text style={s.introMainTitle}>{"El arte de poner límites"}</Text>
                <Text style={s.introMainSub}>{"Esta sección integra tres perspectivas complementarias sobre por qué necesitamos límites — y cómo construirlos sin culpa ni disculpas."}</Text>

                <View style={s.introAuthorCard}>
                  <Text style={s.introAuthorName}>{"Henry Cloud & John Townsend"}</Text>
                  <Text style={s.introAuthorBook}>{"Límites · 1992"}</Text>
                  <Text style={s.introAuthorDesc}>{"Psicólogos clínicos que demostraron que los límites no son rechazo — son la estructura que hace posible el amor real. Sin ellos, no hay relación, solo agotamiento."}</Text>
                </View>

                <View style={[s.introAuthorCard, s.introAuthorCardWarm]}>
                  <Text style={s.introAuthorName}>{"Brené Brown"}</Text>
                  <Text style={s.introAuthorBook}>{"Los dones de la imperfección · 2010"}</Text>
                  <Text style={s.introAuthorDesc}>{"Investigadora de la vulnerabilidad en la Universidad de Houston. Descubrió que las personas más compasivas son también las más claras con sus límites. No hay contradicción."}</Text>
                </View>

                <View style={s.introStudyBox}>
                  <Text style={s.introStudyLabel}>{"EVIDENCIA"}</Text>
                  <Text style={s.introStudyTxt}>{"Un análisis de 32 estudios (Journal of Counseling Psychology, 2018) encontró que el entrenamiento en límites reduce la ansiedad en un 42 % y mejora la satisfacción relacional en un 67 %."}</Text>
                </View>

                <Pressable style={s.ctaBtn} onPress={() => transitionTo(() => setPhase("diagnose"))}>
                  <Text style={s.ctaTxt}>{"Empezar mi diagnóstico"}</Text>
                </Pressable>
              </BlurView>

            ) : phase === "diagnose" ? (
              /* ── Diagnose ── */
              <BlurView intensity={45} tint="light" style={s.card}>
                <View style={s.introBox}>
                  <Text style={s.introQuote}>{INTROS[context].quote}</Text>
                  <Text style={s.introAuthor}>
                    {`— ${INTROS[context].author}, `}
                    <Text style={s.introBook}>{INTROS[context].book}</Text>
                  </Text>
                  <Text style={s.introBody}>{INTROS[context].body}</Text>
                </View>
                <Text style={s.diagTitle}>{"¿Qué te está pesando?"}</Text>
                <Text style={s.diagSub}>{"Toca el detonante que más resuena contigo ahora mismo."}</Text>
                <View style={s.tagGrid}>
                  {triggers.map((t) => (
                    <Pressable key={t.id} style={s.tag} onPress={() => selectTrigger(t)}>
                      <Text style={s.tagTxt}>{t.tag}</Text>
                    </Pressable>
                  ))}
                </View>
              </BlurView>

            ) : (
              /* ── Simulate ── */
              <>
                <Text style={s.triggerTitle}>{`"${selectedTrigger?.tag}"`}</Text>

                <Pressable style={s.switchRow} onPress={toggleNedra}>
                  <Text style={[s.switchLabel, !nedraMode && s.switchLabelActive]}>{"Modo Miedo"}</Text>
                  <View style={[s.switchTrack, nedraMode && s.switchTrackActive]}>
                    <Animated.View style={[s.switchThumb, { transform: [{ translateX: switchTranslateX }] }]} />
                  </View>
                  <Text style={[s.switchLabel, nedraMode && s.switchLabelActive]}>{INTROS[context].switchLabel}</Text>
                </Pressable>

                <Animated.View style={{ opacity: contentFade }}>
                  {!nedraMode ? (
                    <View style={s.fearCard}>
                      <Text style={s.fearLabel}>{"LO QUE SUELES DECIR"}</Text>
                      <View style={s.fearBubble}>
                        <Text style={s.fearText}>{selectedTrigger?.fearResponse}</Text>
                      </View>
                      <Text style={s.fearFooter}>{"Respuesta desde el miedo a decepcionar."}</Text>
                    </View>
                  ) : (
                    <BlurView intensity={50} tint="light" style={s.nedraCard}>
                      <Text style={s.nedraCardLabel}>{"MANUAL DE INSTRUCCIONES"}</Text>
                      <View style={s.nedraBlock}>
                        <Text style={s.nedraBlockLabel}>{"LO QUE VOY A DECIR"}</Text>
                        <Text style={s.nedraPhrase}>{selectedTrigger?.nedraPhrase}</Text>
                      </View>
                      <View style={s.nedraBlockAction}>
                        <Text style={s.nedraBlockLabel}>{"LO QUE VOY A HACER POR MÍ"}</Text>
                        <Text style={s.nedraAction}>{selectedTrigger?.nedraAction}</Text>
                      </View>
                      <Pressable style={[s.copyBtn, copied && s.copyBtnSuccess]} onPress={handleCopy}>
                        {copied ? <Check size={16} color="#fff" strokeWidth={2.5} /> : <Copy size={16} color="#fff" strokeWidth={2} />}
                        <Text style={s.copyTxt}>{copied ? "¡Copiado!" : "Copiar mi límite"}</Text>
                      </Pressable>
                    </BlurView>
                  )}
                </Animated.View>
              </>
            )}

          </Animated.View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
