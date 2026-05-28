import { BlurView } from "expo-blur";
import * as ExpoClipboard from "expo-clipboard";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Check, Copy, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────

type ContextKey = "profesional" | "interpersonal" | "bienestar";

type Trigger = {
  id: string;
  tag: string;
  fearResponse: string;
  nedraPhrase: string;
  nedraAction: string;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const CONTEXTS: { key: ContextKey; label: string; icon: number }[] = [
  {
    key: "profesional",
    label: "Profesional",
    icon: require("@/assets/icons/ctx_profesional.svg"),
  },
  {
    key: "interpersonal",
    label: "Interpersonal",
    icon: require("@/assets/icons/ctx_interpersonal.svg"),
  },
  {
    key: "bienestar",
    label: "Bienestar",
    icon: require("@/assets/icons/ctx_bienestar.svg"),
  },
];

const INTROS: Record<ContextKey, {
  quote: string; author: string; book: string; body: string;
  headerTag: string; switchLabel: string;
}> = {
  profesional: {
    quote: "«Los límites saludables en el trabajo no son paredes que te aíslan — son las reglas del juego que hacen posible la colaboración real.»",
    author: "Henry Cloud",
    book: "Límites",
    body: "En el entorno profesional, un límite claro no es un acto de egoísmo. Es lo que separa el compromiso genuino del agotamiento crónico. Aquí aprenderás a decir no sin culpa y sí con intención.",
    headerTag: "LÍMITES · HENRY CLOUD",
    switchLabel: "Límite Cloud",
  },
  interpersonal: {
    quote: "«Cuando defines qué eres responsable de hacer — y qué no — liberas la relación del resentimiento acumulado.»",
    author: "John Townsend",
    book: "Límites",
    body: "Las relaciones más sanas no son las más cómodas — son las más honestas. Aquí identificarás qué dinámicas te están costando más de lo que te están dando.",
    headerTag: "LÍMITES · JOHN TOWNSEND",
    switchLabel: "Límite Townsend",
  },
  bienestar: {
    quote: "«Atreverse a poner límites es tener el coraje de amarnos a nosotros mismos, aunque arriesguemos decepcionar a otros.»",
    author: "Brené Brown",
    book: "Los dones de la imperfección",
    body: "Cuidarte no es un lujo ni una debilidad. Es el acto más responsable que puedes hacer — porque desde el agotamiento no puedes estar presente para nadie, ni para ti.",
    headerTag: "LÍMITES · BRENÉ BROWN",
    switchLabel: "Límite Brené",
  },
};

// Triggers alineados con la filosofía de cada autor
const NEDRA_DATA: Record<ContextKey, Trigger[]> = {

  // ── Henry Cloud · "Límites" ──────────────────────────────────────────────────
  // Concepto central: tú decides qué entra y qué sale de tu "cerca".
  // La responsabilidad de tus resultados es tuya; la de los demás, de ellos.
  profesional: [
    {
      id: "p1",
      tag: "Respondo a cualquier hora",
      fearResponse: "Ok, lo veo ahora mismo... (responde a las 11PM mientras acumula resentimiento)",
      nedraPhrase: "Lo que está fuera de mi horario laboral está fuera de mi cerca. No voy a entrar.",
      nedraAction: "Voy a silenciar notificaciones de trabajo después de las 7PM, sin excepciones.",
    },
    {
      id: "p2",
      tag: "Asumo lo que no me corresponde",
      fearResponse: "Sí, claro que puedo con eso también... (toma responsabilidad de resultados ajenos)",
      nedraPhrase: "Cada quien carga su propio peso. Este no es el mío y no lo voy a levantar.",
      nedraAction: "Voy a delimitarlo por escrito antes de que se convierta en una expectativa.",
    },
    {
      id: "p3",
      tag: "No puedo decirle no a mi jefe",
      fearResponse: "Claro, lo hago yo... (acepta sin clarificar y luego no cumple bien ninguna tarea)",
      nedraPhrase: "Puedo respetar la autoridad y aun así señalar cuándo algo no es viable.",
      nedraAction: "Voy a pedir una reunión para reorganizar prioridades con criterio real.",
    },
    {
      id: "p4",
      tag: "La urgencia ajena maneja mi día",
      fearResponse: "Termino esto y te atiendo... (pierde el hilo de su propio trabajo una y otra vez)",
      nedraPhrase: "Su urgencia no es automáticamente la mía. Yo decido qué entra en mi agenda.",
      nedraAction: "Voy a bloquear tiempo de trabajo profundo y no abrirlo a interrupciones.",
    },
  ],

  // ── John Townsend · "Límites" ────────────────────────────────────────────────
  // Concepto central: no eres responsable de los sentimientos ni las decisiones de otros.
  // El cambio real viene del dolor, no de ser rescatados.
  interpersonal: [
    {
      id: "i1",
      tag: "Me siento culpable al decir no",
      fearResponse: "Bueno... esta vez sí lo hago... (la culpa gana de nuevo sin que nadie la cuestionara)",
      nedraPhrase: "Sentir culpa no significa que hice algo malo. Es una señal vieja, no una verdad.",
      nedraAction: "Voy a sostener el no aunque la incomodidad llegue, sin dar explicaciones largas.",
    },
    {
      id: "i2",
      tag: "Cargo con sus emociones",
      fearResponse: "Cuéntame todo, aquí estoy... (rescata otra vez lo que ella/él debería gestionar)",
      nedraPhrase: "Sus sentimientos son suyos. No soy responsable de administrarlos ni de resolverlos.",
      nedraAction: "Voy a escuchar sin rescatar y a poner un límite de tiempo en estas conversaciones.",
    },
    {
      id: "i3",
      tag: "Cedo para evitar el conflicto",
      fearResponse: "Sí, tienes razón... (cede aunque no lo crea, y el resentimiento se acumula)",
      nedraPhrase: "Evitar el conflicto no es paz — es resentimiento diferido. Prefiero la honestidad.",
      nedraAction: "Voy a decir lo que pienso con calma, aunque incomode, sin pedir disculpas por ello.",
    },
    {
      id: "i4",
      tag: "Me quedo por miedo a su reacción",
      fearResponse: "No quiero que se enoje... (permanece en algo dañino para no afrontar la reacción)",
      nedraPhrase: "Su reacción a mi límite es información sobre ellos, no una sentencia sobre mí.",
      nedraAction: "Voy a tomar la decisión que necesito, independientemente de cómo lo reciban.",
    },
  ],

  // ── Brené Brown · "Los dones de la imperfección" ─────────────────────────────
  // Concepto central: la vergüenza crece en el silencio y el aislamiento.
  // Vivir con todo el corazón requiere soltar el perfeccionismo y atreverse a ser vistos.
  bienestar: [
    {
      id: "b1",
      tag: "Descansar me genera culpa",
      fearResponse: "Termino esto y descanso... (todo nunca termina y el cuerpo empieza a fallar)",
      nedraPhrase: "El descanso no es un premio al mérito — es parte de vivir con todo el corazón.",
      nedraAction: "Voy a tomar este tiempo ahora, sin justificarlo y sin pedir permiso.",
    },
    {
      id: "b2",
      tag: "Necesito que me aprueben",
      fearResponse: "¿Estuvo bien? ¿Estoy siendo suficiente?... (espera validación antes de avanzar)",
      nedraPhrase: "Soy suficiente ahora mismo — no cuando los demás lo confirmen.",
      nedraAction: "Voy a tomar una decisión hoy sin consultar si estuvo bien.",
    },
    {
      id: "b3",
      tag: "El perfeccionismo me paraliza",
      fearResponse: "Cuando esté listo de verdad, lo comparto... (lleva semanas detenida por miedo al juicio)",
      nedraPhrase: "El perfeccionismo no es excelencia — es miedo disfrazado de estándares altos.",
      nedraAction: "Voy a avanzar con lo que tengo hoy, imperfecto y real.",
    },
    {
      id: "b4",
      tag: "La vergüenza me hace callar",
      fearResponse: "No lo digo para que no piensen mal de mí... (el silencio alimenta la vergüenza)",
      nedraPhrase: "La vergüenza crece en el silencio. Hablar de esto le quita poder sobre mí.",
      nedraAction: "Voy a contárselo a alguien de confianza esta semana, sin editar la historia.",
    },
  ],
};

// ─── Particles ────────────────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 53 + 19) % (W - 10),
  size: (i % 4) + 2,
  duration: 10000 + ((i * 900) % 6000),
  delay: (i * 700) % 5000,
}));

function FloatingParticle({ x, size, duration, delay }: {
  x: number; size: number; duration: number; delay: number;
}) {
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
  const opacity    = anim.interpolate({ inputRange: [0, 0.08, 0.72, 1], outputRange: [0, 0.8, 0.45, 0] });
  const scale      = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.4, 1, 0.3] });
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute", left: x, bottom: (size * 22) % (H / 2),
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: "rgba(255,255,255,0.85)",
        shadowColor: "#fff", shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1, shadowRadius: size * 2.5,
        transform: [{ translateY }, { scale }], opacity,
      }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function DearManAssistant({ visible, onClose }: Props) {
  const [context, setContext]                 = useState<ContextKey>("profesional");
  const [phase, setPhase]                     = useState<"intro" | "diagnose" | "simulate">("intro");
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [nedraMode, setNedraMode]             = useState(false);
  const [copied, setCopied]                   = useState(false);

  const screenFade  = useRef(new Animated.Value(0)).current;
  const cardFade    = useRef(new Animated.Value(1)).current;
  const cardSlideX  = useRef(new Animated.Value(0)).current;
  const switchAnim  = useRef(new Animated.Value(0)).current;
  // Separate fade for fear/nedra card only — switch row stays visible during toggle
  const contentFade = useRef(new Animated.Value(1)).current;

  // ── Modal open/close ──
  useEffect(() => {
    if (visible) {
      setPhase("intro");
      setSelectedTrigger(null);
      setNedraMode(false);
      setCopied(false);
      switchAnim.setValue(0);
      cardFade.setValue(1);
      cardSlideX.setValue(0);
      contentFade.setValue(1);
      Animated.timing(screenFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    } else {
      screenFade.setValue(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // ── Phase transition: fade + slide, rAF defers the slide-in one frame
  //    so React can commit the new state before the animation starts ──
  const transitionTo = (fn: () => void, direction: 1 | -1 = 1) => {
    Animated.parallel([
      Animated.timing(cardFade,   { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(cardSlideX, { toValue: -50 * direction, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      fn();
      cardSlideX.setValue(60 * direction);
      // Wait one frame for React to finish rendering the new state
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(cardFade,   { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.timing(cardSlideX, { toValue: 0, duration: 280, useNativeDriver: true }),
        ]).start();
      });
    });
  };

  // ── Select trigger → simulate ──
  const selectTrigger = (trigger: Trigger) => {
    transitionTo(() => {
      setSelectedTrigger(trigger);
      setNedraMode(false);
      switchAnim.setValue(0);
      contentFade.setValue(1);
      setPhase("simulate");
    }, 1);
  };

  // ── Back to diagnose ──
  const goBack = () => {
    transitionTo(() => {
      setPhase("diagnose");
      setNedraMode(false);
    }, -1);
  };

  // ── Toggle fear ↔ nedra:
  //    switchAnim moves the thumb independently.
  //    contentFade fades ONLY the card below the switch — not the switch itself. ──
  const toggleNedra = () => {
    const toNedra = !nedraMode;
    Animated.spring(switchAnim, {
      toValue: toNedra ? 1 : 0,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();
    Animated.timing(contentFade, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
      setNedraMode(toNedra);
      requestAnimationFrame(() => {
        Animated.timing(contentFade, { toValue: 1, duration: 240, useNativeDriver: true }).start();
      });
    });
  };

  // ── Change context (diagnose only) ──
  const changeContext = (key: ContextKey) => {
    if (key === context) return;
    Animated.timing(cardFade, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setContext(key);
      requestAnimationFrame(() => {
        Animated.timing(cardFade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
      });
    });
  };

  const handleCopy = async () => {
    if (!selectedTrigger) return;
    await ExpoClipboard.setStringAsync(
      `${selectedTrigger.nedraPhrase} ${selectedTrigger.nedraAction}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const triggers = NEDRA_DATA[context];
  const switchTranslateX = switchAnim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s.overlay, { opacity: screenFade }]}>

        <LinearGradient
          colors={["#F4EBE0", "#FDF5EE", "#EDE8F5", "#F7EFF5"]}
          start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
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

        {/* Context tabs — diagnose only */}
        {phase === "diagnose" && (
          <View style={s.contextRow}>
            {CONTEXTS.map((c) => {
              const active = c.key === context;
              return (
                <Pressable
                  key={c.key}
                  style={[s.contextTab, active && s.contextTabActive]}
                  onPress={() => changeContext(c.key)}
                >
                  <Image source={c.icon} style={s.contextIcon} contentFit="contain" />
                  <Text style={[s.contextTabTxt, active && s.contextTabTxtActive]}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Main */}
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* cardFade + cardSlideX: wraps the whole phase content */}
          <Animated.View style={{ opacity: cardFade, transform: [{ translateX: cardSlideX }] }}>

            {phase === "intro" ? (

              /* ── Intro ─────────────────────────────────────────────── */
              <BlurView intensity={45} tint="light" style={s.card}>

                <View style={s.introBadge}>
                  <Text style={s.introBadgeTxt}>{"PSICOLOGÍA CLÍNICA · EVIDENCIA"}</Text>
                </View>

                <Text style={s.introMainTitle}>{"El arte de poner límites"}</Text>
                <Text style={s.introMainSub}>
                  {"Esta sección integra tres perspectivas complementarias sobre por qué necesitamos límites — y cómo construirlos sin culpa ni disculpas."}
                </Text>

                {/* Autor 1 */}
                <View style={s.introAuthorCard}>
                  <Text style={s.introAuthorName}>{"Henry Cloud & John Townsend"}</Text>
                  <Text style={s.introAuthorBook}>{"Límites · 1992"}</Text>
                  <Text style={s.introAuthorDesc}>
                    {"Psicólogos clínicos que demostraron que los límites no son rechazo — son la estructura que hace posible el amor real. Sin ellos, no hay relación, solo agotamiento."}
                  </Text>
                </View>

                {/* Autor 2 */}
                <View style={[s.introAuthorCard, s.introAuthorCardWarm]}>
                  <Text style={s.introAuthorName}>{"Brené Brown"}</Text>
                  <Text style={s.introAuthorBook}>{"Los dones de la imperfección · 2010"}</Text>
                  <Text style={s.introAuthorDesc}>
                    {"Investigadora de la vulnerabilidad en la Universidad de Houston. Descubrió que las personas más compasivas son también las más claras con sus límites. No hay contradicción."}
                  </Text>
                </View>

                {/* Evidencia */}
                <View style={s.introStudyBox}>
                  <Text style={s.introStudyLabel}>{"EVIDENCIA"}</Text>
                  <Text style={s.introStudyTxt}>
                    {"Un análisis de 32 estudios (Journal of Counseling Psychology, 2018) encontró que el entrenamiento en límites reduce la ansiedad en un 42 % y mejora la satisfacción relacional en un 67 %."}
                  </Text>
                </View>

                <Pressable
                  style={s.ctaBtn}
                  onPress={() => transitionTo(() => setPhase("diagnose"))}
                >
                  <Text style={s.ctaTxt}>{"Empezar mi diagnóstico"}</Text>
                </Pressable>

              </BlurView>

            ) : phase === "diagnose" ? (

              /* ── Diagnose ──────────────────────────────────────────── */
              <BlurView intensity={45} tint="light" style={s.card}>

                {/* Intro — cambia según el contexto activo */}
                <View style={s.introBox}>
                  <Text style={s.introQuote}>{INTROS[context].quote}</Text>
                  <Text style={s.introAuthor}>
                    {`— ${INTROS[context].author}, `}
                    <Text style={s.introBook}>{INTROS[context].book}</Text>
                  </Text>
                  <Text style={s.introBody}>{INTROS[context].body}</Text>
                </View>

                <Text style={s.diagTitle}>{"¿Qué te está pesando?"}</Text>
                <Text style={s.diagSub}>
                  {"Toca el detonante que más resuena contigo ahora mismo."}
                </Text>
                <View style={s.tagGrid}>
                  {triggers.map((t) => (
                    <Pressable key={t.id} style={s.tag} onPress={() => selectTrigger(t)}>
                      <Text style={s.tagTxt}>{t.tag}</Text>
                    </Pressable>
                  ))}
                </View>
              </BlurView>

            ) : (

              /* ── Simulate ──────────────────────────────────────────── */
              <>
                <Text style={s.triggerTitle}>{`"${selectedTrigger?.tag}"`}</Text>

                {/* Switch row — NOT inside contentFade, stays visible during toggle */}
                <Pressable style={s.switchRow} onPress={toggleNedra}>
                  <Text style={[s.switchLabel, !nedraMode && s.switchLabelActive]}>
                    {"Modo Miedo"}
                  </Text>
                  <View style={[s.switchTrack, nedraMode && s.switchTrackActive]}>
                    <Animated.View
                      style={[s.switchThumb, { transform: [{ translateX: switchTranslateX }] }]}
                    />
                  </View>
                  <Text style={[s.switchLabel, nedraMode && s.switchLabelActive]}>
                    {INTROS[context].switchLabel}
                  </Text>
                </Pressable>

                {/* contentFade: only the card below the switch fades during toggle */}
                <Animated.View style={{ opacity: contentFade }}>
                  {!nedraMode ? (

                    /* Fear card */
                    <View style={s.fearCard}>
                      <Text style={s.fearLabel}>{"LO QUE SUELES DECIR"}</Text>
                      <View style={s.fearBubble}>
                        <Text style={s.fearText}>{selectedTrigger?.fearResponse}</Text>
                      </View>
                      <Text style={s.fearFooter}>{"Respuesta desde el miedo a decepcionar."}</Text>
                    </View>

                  ) : (

                    /* Nedra card */
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

                      <Pressable
                        style={[s.copyBtn, copied && s.copyBtnSuccess]}
                        onPress={handleCopy}
                      >
                        {copied
                          ? <Check size={16} color="#fff" strokeWidth={2.5} />
                          : <Copy size={16} color="#fff" strokeWidth={2} />
                        }
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: { flex: 1 },

  blob1: {
    position: "absolute", width: 300, height: 300, borderRadius: 150,
    backgroundColor: "rgba(210,195,240,0.35)", top: -80, left: -80,
  },
  blob2: {
    position: "absolute", width: 240, height: 240, borderRadius: 120,
    backgroundColor: "rgba(255,205,185,0.28)", bottom: 60, right: -70,
  },
  blob3: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(190,215,255,0.22)", bottom: 200, left: 10,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 58,
    paddingHorizontal: 22,
    paddingBottom: 14,
  },
  headerTag: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 1.8,
    color: "#A895C8",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backTxt: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    color: "#8B7BAB",
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#C0B0D8", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 6, elevation: 3,
  },

  // ── Context tabs ──
  contextRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 22,
    marginBottom: 18,
  },
  contextTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    gap: 6,
  },
  contextTabActive: {
    backgroundColor: "#7B6BB5",
    borderColor: "#7B6BB5",
  },
  contextIcon: { width: 28, height: 28 },
  contextTabTxt: {
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    color: "#A895C8",
  },
  contextTabTxtActive: { color: "#fff" },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  // ── Intro screen ──
  introBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(123,107,181,0.12)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 14,
  },
  introBadgeTxt: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 1.6,
    color: "#7B6BB5",
  },
  introMainTitle: {
    fontSize: 24,
    fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60",
    marginBottom: 8,
  },
  introMainSub: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#7A7090",
    lineHeight: 20,
    marginBottom: 20,
  },
  introAuthorCard: {
    backgroundColor: "rgba(123,107,181,0.07)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(123,107,181,0.13)",
  },
  introAuthorCardWarm: {
    backgroundColor: "rgba(251,191,36,0.08)",
    borderColor: "rgba(217,119,6,0.15)",
  },
  introAuthorName: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: "#2D1F60",
    marginBottom: 2,
  },
  introAuthorBook: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    fontStyle: "italic",
    color: "#A895C8",
    marginBottom: 6,
  },
  introAuthorDesc: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#7A7090",
    lineHeight: 18,
  },
  introStudyBox: {
    backgroundColor: "rgba(123,188,168,0.1)",
    borderRadius: 14,
    padding: 14,
    marginTop: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(123,188,168,0.22)",
  },
  introStudyLabel: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2,
    color: "#4A9B8A",
    marginBottom: 6,
  },
  introStudyTxt: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#4A7A6E",
    lineHeight: 18,
  },
  ctaBtn: {
    backgroundColor: "#7B6BB5",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#7B6BB5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaTxt: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },

  // ── Intro quote block (inside diagnose card) ──
  introBox: {
    backgroundColor: "rgba(123,107,181,0.07)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(123,107,181,0.13)",
  },
  introQuote: {
    fontSize: 13,
    fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60",
    lineHeight: 21,
    fontStyle: "italic",
    marginBottom: 6,
  },
  introAuthor: {
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    color: "#A895C8",
    marginBottom: 12,
  },
  introBook: {
    fontFamily: "Poppins-Regular",
    fontStyle: "italic",
  },
  introBody: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#7A7090",
    lineHeight: 19,
  },

  // ── Diagnose card ──
  card: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.88)",
    overflow: "hidden",
    shadowColor: "#B8A8D8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 10,
  },
  diagTitle: {
    fontSize: 22,
    fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60",
    marginBottom: 6,
  },
  diagSub: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#A895C8",
    lineHeight: 20,
    marginBottom: 22,
  },
  tagGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: "rgba(123,107,181,0.1)",
    borderWidth: 1,
    borderColor: "rgba(123,107,181,0.2)",
  },
  tagTxt: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    color: "#7B6BB5",
  },

  // ── Trigger title ──
  triggerTitle: {
    fontSize: 16,
    fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60",
    lineHeight: 26,
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  // ── Toggle switch ──
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginBottom: 20,
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
  },
  switchLabel: {
    fontSize: 11,
    fontFamily: "Poppins-SemiBold",
    color: "#C0B0D8",
  },
  switchLabelActive: { color: "#7B6BB5" },
  switchTrack: {
    width: 48, height: 28, borderRadius: 14,
    backgroundColor: "rgba(190,175,220,0.45)",
    justifyContent: "center",
  },
  switchTrackActive: { backgroundColor: "#7B6BB5" },
  switchThumb: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#fff",
    shadowColor: "#7B6BB5", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
  },

  // ── Fear card ──
  fearCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: "rgba(230,225,240,0.5)",
    borderWidth: 1,
    borderColor: "rgba(210,200,230,0.6)",
  },
  fearLabel: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2,
    color: "#B8B0CC",
    marginBottom: 12,
  },
  fearBubble: {
    backgroundColor: "rgba(200,190,220,0.35)",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 14,
    marginBottom: 12,
  },
  fearText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#7A7090",
    lineHeight: 22,
    fontStyle: "italic",
  },
  fearFooter: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#B0A8C0",
    textAlign: "center",
  },

  // ── Nedra card ──
  nedraCard: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderWidth: 1.5,
    borderColor: "rgba(123,107,181,0.3)",
    overflow: "hidden",
    shadowColor: "#7B6BB5",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 12,
  },
  nedraCardLabel: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2.2,
    color: "#A895C8",
    textAlign: "center",
    marginBottom: 20,
  },
  nedraBlock: {
    backgroundColor: "rgba(123,107,181,0.08)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(123,107,181,0.15)",
  },
  nedraBlockAction: {
    backgroundColor: "rgba(123,188,168,0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(123,188,168,0.22)",
  },
  nedraBlockLabel: {
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 2,
    color: "#C0B0D8",
    marginBottom: 8,
  },
  nedraPhrase: {
    fontSize: 17,
    fontFamily: "Playfair-ExtraBold",
    color: "#2D1F60",
    lineHeight: 28,
  },
  nedraAction: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#4A9B8A",
    lineHeight: 22,
  },

  // ── Copy button ──
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7B6BB5",
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: "#7B6BB5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  copyBtnSuccess: { backgroundColor: "#7BBCA8" },
  copyTxt: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
});
