import { StyleSheet } from "react-native";
import { NODE_RADIUS } from "./constants";

export const s = StyleSheet.create({
  overlay: { flex: 1 },
  blob1: { position: "absolute", width: 280, height: 280, borderRadius: 140, backgroundColor: "rgba(140,185,225,0.16)", top: -70, right: -70 },
  blob2: { position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: "rgba(160,200,235,0.12)", bottom: 50, left: -60 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 58, paddingHorizontal: 22, paddingBottom: 14 },
  headerTag: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 1.8, color: "#8AABB8" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backTxt: { fontSize: 13, fontFamily: "Poppins-Medium", color: "#7890A8" },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.65)", alignItems: "center", justifyContent: "center", shadowColor: "#A0B8CC", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },

  // Intro
  introBadge: { alignSelf: "flex-start", backgroundColor: "rgba(120,144,168,0.12)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 18, borderWidth: 1, borderColor: "rgba(120,144,168,0.22)" },
  introBadgeTxt: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#7890A8" },
  heroTitle: { fontSize: 26, fontFamily: "Playfair-ExtraBold", color: "#1A2A38", marginBottom: 10 },
  introBody: { fontSize: 14, fontFamily: "Poppins-Regular", color: "#3A5060", lineHeight: 23, marginBottom: 22 },
  introQuoteBox: { backgroundColor: "rgba(255,255,255,0.82)", borderRadius: 18, padding: 20, marginBottom: 18, borderLeftWidth: 4, borderLeftColor: "#7890A8", borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "rgba(155,190,220,0.35)", shadowColor: "#98B8D0", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 10, elevation: 4 },
  introQuoteMark: { fontSize: 42, fontFamily: "Playfair-ExtraBold", color: "#7890A8", lineHeight: 38, marginBottom: 4 },
  introQuoteTxt: { fontSize: 14, fontFamily: "Playfair-ExtraBold", color: "#1A2E42", lineHeight: 23, fontStyle: "italic", marginBottom: 12 },
  introQuoteAuthor: { fontSize: 11, fontFamily: "Poppins-Regular", color: "#7890A8", textAlign: "right" },
  introMechanicBox: { backgroundColor: "rgba(120,144,168,0.08)", borderRadius: 16, padding: 18, marginBottom: 28, borderWidth: 1, borderColor: "rgba(120,144,168,0.18)" },
  introMechanicLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#7890A8", marginBottom: 8 },
  introMechanicTxt: { fontSize: 13, fontFamily: "Poppins-Regular", color: "#3A5060", lineHeight: 21 },
  introCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#3D5A72", borderRadius: 16, paddingVertical: 16, shadowColor: "#3D5A72", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  introCtaTxt: { fontSize: 15, fontFamily: "Poppins-SemiBold", color: "#fff" },
  introAuthorBadge: { backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 14, padding: 14, marginBottom: 18, borderLeftWidth: 4, borderLeftColor: "#6899B4", borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "rgba(155,190,220,0.3)", shadowColor: "#98B8D0", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  introAuthorName: { fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#1A2E42", marginBottom: 2 },
  introAuthorRole: { fontSize: 11, fontFamily: "Poppins-Regular", color: "#6899B4" },
  introAuthorsBox: { backgroundColor: "rgba(120,144,168,0.07)", borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: "rgba(120,144,168,0.15)", gap: 10 },
  introAuthorsLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#7890A8", marginBottom: 4 },
  introAuthorRowName: { fontSize: 13, fontFamily: "Poppins-SemiBold", color: "#2A3D50", width: 120 },
  introAuthorCard: { backgroundColor: "rgba(255,255,255,0.6)", borderRadius: 12, padding: 12, gap: 6, borderWidth: 1, borderColor: "rgba(120,144,168,0.12)" },
  introAuthorCardHeader: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  introAuthorCardRole: { fontSize: 10, fontFamily: "Poppins-Regular", color: "#7890A8", flex: 1 },
  introAuthorCardBio: { fontSize: 11, fontFamily: "Poppins-Regular", color: "#4A6275", lineHeight: 17 },

  // Selección
  heroSub: { fontSize: 13, fontFamily: "Poppins-Regular", color: "#7890A8", lineHeight: 20, marginBottom: 24 },
  vinculoCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(255,255,255,0.72)", borderRadius: 18, padding: 18, marginBottom: 12, borderWidth: 1.2, borderColor: "rgba(170,200,220,0.4)", shadowColor: "#A0B8CC", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
  vinculoCardIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(120,144,168,0.1)", alignItems: "center", justifyContent: "center" },
  vinculoCardText: { flex: 1 },
  vinculoCardLabel: { fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#1A2E42", marginBottom: 2 },
  vinculoCardTagline: { fontSize: 12, fontFamily: "Poppins-Regular", color: "#7890A8" },

  // Canvas del hilo
  canvas: { flex: 1, position: "relative" },
  thread: { position: "absolute", height: 2, borderRadius: 1, backgroundColor: "#7890A8", marginTop: -1 },
  nodeA: { position: "absolute", width: NODE_RADIUS * 2, height: NODE_RADIUS * 2, borderRadius: NODE_RADIUS, overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(160,200,230,0.7)", shadowColor: "#6899B4", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  nodeALabel: { fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#2A4A62" },
  nodeARing: { position: "absolute", width: (NODE_RADIUS + 12) * 2, height: (NODE_RADIUS + 12) * 2, borderRadius: NODE_RADIUS + 12, borderWidth: 2, borderColor: "rgba(100,160,220,0.5)" },
  nodeB: { width: NODE_RADIUS * 2, height: NODE_RADIUS * 2, borderRadius: NODE_RADIUS, overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(220,160,190,0.7)", shadowColor: "#9E5C72", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 8 },
  nodeCaption: { position: "absolute", fontSize: 11, fontFamily: "Poppins-Regular", color: "#7890A8" },
  fusionGlow: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(180,220,255,0.6)", shadowColor: "rgba(120,180,255,1)", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 30, elevation: 20 },
  instructionRow: { position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" },
  instructionTxt: { fontSize: 13, fontFamily: "Poppins-Regular", color: "#7890A8", textAlign: "center" },

  // Revelado
  revealWrapper: { flex: 1 },
  vinculoBadge: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 6, backgroundColor: "rgba(120,144,168,0.1)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 20, borderWidth: 1, borderColor: "rgba(120,144,168,0.2)" },
  vinculoBadgeTxt: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 1.8, color: "#7890A8" },
  reflectionCard: { backgroundColor: "#FFFFFF", borderRadius: 20, paddingVertical: 22, paddingHorizontal: 22, paddingLeft: 26, marginBottom: 14, borderWidth: 1, borderColor: "rgba(160,190,215,0.35)", shadowColor: "#5A8AAA", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.14, shadowRadius: 16, elevation: 7 },
  reflectionAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, backgroundColor: "#6899B4" },
  reflectionLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#6899B4", marginBottom: 12 },
  reflectionTxt: { fontSize: 14, fontFamily: "Poppins-Medium", color: "#1A2E42", lineHeight: 23 },
  zenCard: { backgroundColor: "#FFFFFF", borderRadius: 20, paddingVertical: 22, paddingHorizontal: 22, paddingLeft: 26, marginBottom: 24, borderWidth: 1, borderColor: "rgba(200,160,185,0.35)", shadowColor: "#9E5C72", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 14, elevation: 6 },
  zenTxt: { fontSize: 14, fontFamily: "Poppins-Medium", color: "#1A2E42", lineHeight: 23 },
  revealAuthorBadge: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  revealAuthorName: { fontSize: 12, fontFamily: "Poppins-SemiBold", color: "#6899B4" },
  revealAuthorRole: { fontSize: 10, fontFamily: "Poppins-Regular", color: "#A0B8C8", flex: 1 },
  revealAuthorQuote: { fontSize: 13, fontFamily: "Playfair-ExtraBold", color: "#3A5060", lineHeight: 21, fontStyle: "italic", marginBottom: 14 },
  revealDivider: { height: 1, backgroundColor: "rgba(155,190,220,0.3)", marginBottom: 14 },

  actionsRow: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: "#3D5A72", borderRadius: 14, paddingVertical: 13, shadowColor: "#3D5A72", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.26, shadowRadius: 10, elevation: 5 },
  actionBtnAlt: { backgroundColor: "#7890A8" },
  actionBtnSuccess: { backgroundColor: "#4CAF82" },
  actionBtnTxt: { fontSize: 12, fontFamily: "Poppins-SemiBold", color: "#fff" },
});
