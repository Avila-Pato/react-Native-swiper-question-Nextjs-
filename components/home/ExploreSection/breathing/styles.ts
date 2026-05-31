import { StyleSheet } from "react-native";
import { C_ACCENT, C_MUTED, C_RING, C_TITLE, ORB, RING1, RING2 } from "./constants";

export const s = StyleSheet.create({
  overlay: { flex: 1 },

  blob1: {
    position: "absolute", width: 300, height: 300, borderRadius: 150,
    backgroundColor: "rgba(210,195,240,0.38)", top: -80, left: -80,
  },
  blob2: {
    position: "absolute", width: 240, height: 240, borderRadius: 120,
    backgroundColor: "rgba(255,205,185,0.30)", bottom: 60, right: -70,
  },
  blob3: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(190,215,255,0.25)", bottom: 220, left: 10,
  },

  closeBtn: {
    position: "absolute", top: 56, right: 22,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center", justifyContent: "center",
    zIndex: 10,
    shadowColor: "#C0B0D8", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },

  content: {
    flex: 1, alignItems: "center", justifyContent: "center",
    gap: 52, paddingHorizontal: 32,
  },
  center: { alignItems: "center", justifyContent: "center" },

  // ── Intro ──
  introHeader: { alignItems: "center", gap: 12, paddingHorizontal: 8 },
  introTag: {
    fontSize: 9, fontFamily: "Poppins-SemiBold",
    letterSpacing: 2.5, color: C_MUTED, textTransform: "uppercase",
  },
  introTitle: {
    fontSize: 34, fontFamily: "Playfair-ExtraBold",
    color: C_TITLE, textAlign: "center", lineHeight: 42, letterSpacing: -0.5,
  },
  introDesc: {
    fontSize: 13, fontFamily: "Poppins-Regular",
    color: C_MUTED, textAlign: "center", lineHeight: 21, marginTop: 4,
  },
  stepsRow: { flexDirection: "row", gap: 12 },
  stepCard: {
    flex: 1, backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.85)",
    paddingVertical: 18, paddingHorizontal: 8, alignItems: "center", gap: 6,
  },
  stepIcon:  { width: 48, height: 48 },
  stepPhase: { fontSize: 12, fontFamily: "Poppins-SemiBold", color: C_TITLE },
  stepTime:  { fontSize: 11, fontFamily: "Poppins-Regular", color: C_MUTED },
  startBtn: {
    width: "100%", backgroundColor: C_ACCENT, borderRadius: 18, paddingVertical: 16,
    alignItems: "center", shadowColor: C_ACCENT, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38, shadowRadius: 14, elevation: 7,
  },
  startTxt: { fontSize: 15, fontFamily: "Poppins-SemiBold", color: "#fff", letterSpacing: 0.3 },

  // ── Ejercicio ──
  textBlock: { alignItems: "center", gap: 10 },
  phaseLabel: {
    fontSize: 26, fontFamily: "Playfair-ExtraBold",
    color: C_TITLE, textAlign: "center", letterSpacing: -0.3,
  },
  phaseSub: {
    fontSize: 13, fontFamily: "Poppins-Regular",
    color: C_MUTED, textAlign: "center", lineHeight: 20,
  },
  orbArea: { width: RING2, height: RING2, alignItems: "center", justifyContent: "center" },
  ring2: {
    position: "absolute", width: RING2, height: RING2, borderRadius: RING2 / 2,
    borderWidth: 1, borderColor: "rgba(168,149,200,0.3)",
    backgroundColor: "rgba(168,149,200,0.05)",
  },
  ring1: {
    position: "absolute", width: RING1, height: RING1, borderRadius: RING1 / 2,
    borderWidth: 1.5, borderColor: C_RING, backgroundColor: "rgba(168,149,200,0.09)",
  },
  orbWrapper: {
    width: ORB, height: ORB, borderRadius: ORB / 2, overflow: "hidden",
    shadowColor: "#B8A0D8", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28, shadowRadius: 22, elevation: 10,
  },
  orb: {
    width: ORB, height: ORB, borderRadius: ORB / 2,
    backgroundColor: "rgba(255,255,255,0.42)", borderWidth: 1.5, borderColor: C_RING,
    alignItems: "center", justifyContent: "center", overflow: "hidden", gap: 2,
  },
  countdownNum: {
    fontSize: 56, fontFamily: "Playfair-ExtraBold", color: C_TITLE, lineHeight: 62,
  },
  countdownLabel: {
    fontSize: 11, fontFamily: "Poppins-SemiBold", color: C_MUTED, letterSpacing: 1.5,
  },
  exercisePhaseImg: { width: 64, height: 64, marginBottom: 2 },
  exerciseFooter:   { alignItems: "center", gap: 8 },
  phaseDots:        { flexDirection: "row", gap: 10, alignItems: "center" },
  dot:              { width: 7,  height: 7,  borderRadius: 4, backgroundColor: "rgba(168,149,200,0.25)" },
  dotActive:        { width: 10, height: 10, borderRadius: 5, backgroundColor: C_ACCENT },

  cycleLabel: {
    fontSize: 10, fontFamily: "Poppins-SemiBold", color: "#C0B0D8",
    letterSpacing: 3, textTransform: "uppercase",
  },

  doneEmoji:   { fontSize: 52 },
  doneTitle:   { fontSize: 26, fontFamily: "Playfair-ExtraBold", color: C_TITLE, textAlign: "center", lineHeight: 34 },
  doneSub:     { fontSize: 14, fontFamily: "Poppins-Regular", color: C_MUTED, textAlign: "center", lineHeight: 22, marginTop: 4 },
  doneActions: { gap: 12, width: "100%", marginTop: 16 },
  repeatBtn:   { width: "100%", borderRadius: 18, paddingVertical: 16, alignItems: "center", borderWidth: 1.5, borderColor: C_ACCENT, backgroundColor: "rgba(123,107,181,0.08)" },
  repeatTxt:   { fontSize: 15, fontFamily: "Poppins-SemiBold", color: C_ACCENT, letterSpacing: 0.3 },
});
