import { StyleSheet } from "react-native";
import { COLS, MIRROR_H, PROGRESS_W, ROWS } from "./constants";

export const s = StyleSheet.create({
  overlay: { flex: 1 },
  blob1: { position: "absolute", width: 300, height: 300, borderRadius: 150, backgroundColor: "rgba(155,190,225,0.18)", top: -80, right: -80 },
  blob2: { position: "absolute", width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(170,205,235,0.14)", bottom: 60, left: -70 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 58, paddingHorizontal: 22, paddingBottom: 14 },
  headerTag: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 1.8, color: "#8AABB8" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backTxt: { fontSize: 13, fontFamily: "Poppins-Medium", color: "#7890A8" },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.65)", alignItems: "center", justifyContent: "center", shadowColor: "#A0B8CC", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  mirrorPhase: { flex: 1 },

  heroTitle: { fontSize: 26, fontFamily: "Playfair-ExtraBold", color: "#1A2A38", marginBottom: 8 },
  heroSub: { fontSize: 13, fontFamily: "Poppins-Regular", color: "#7890A8", lineHeight: 20, marginBottom: 24 },

  situationCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(255,255,255,0.72)", borderRadius: 18, padding: 18, marginBottom: 12, borderWidth: 1.2, borderColor: "rgba(170,200,220,0.45)", shadowColor: "#A0B8CC", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 8, elevation: 3 },
  situationCardTxt: { flex: 1, fontSize: 14, fontFamily: "Poppins-Medium", color: "#2A3D50", lineHeight: 21 },

  situationBadge: { backgroundColor: "rgba(120,144,168,0.09)", borderRadius: 14, padding: 14, marginBottom: 18, borderWidth: 1, borderColor: "rgba(120,144,168,0.16)" },
  situationBadgeTxt: { fontSize: 13, fontFamily: "Poppins-Regular", color: "#4A6070", lineHeight: 20, fontStyle: "italic", textAlign: "center" },

  mirrorContainer: { height: MIRROR_H, borderRadius: 24, overflow: "hidden", borderWidth: 1.5, borderColor: "rgba(155,190,220,0.45)", backgroundColor: "rgba(238,245,252,0.6)", marginBottom: 16, shadowColor: "#98B8D0", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 10 },
  truthLayer: { ...StyleSheet.absoluteFillObject, padding: 24, justifyContent: "center" },
  truthLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#7890A8", marginBottom: 12 },
  truthText: { fontSize: 15, fontFamily: "Playfair-ExtraBold", color: "#1A2A38", lineHeight: 26 },

  matrixGrid: { ...StyleSheet.absoluteFillObject, flexDirection: "row", flexWrap: "wrap" },
  matrixCell: { width: `${100 / COLS}%` as unknown as number, height: `${100 / ROWS}%` as unknown as number, overflow: "hidden" },
  fogHintLayer: { alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 32 },
  fogHintText: { fontSize: 12, fontFamily: "Poppins-SemiBold", color: "rgba(80,110,140,0.7)", textAlign: "center", lineHeight: 20 },
  wipeLayer: { borderRadius: 24, backgroundColor: "transparent" },

  progressRow: { alignItems: "center", marginBottom: 22, gap: 8 },
  progressBg: { width: PROGRESS_W, height: 3, borderRadius: 2, backgroundColor: "rgba(155,190,220,0.28)", overflow: "hidden" },
  progressFill: { height: 3, borderRadius: 2, backgroundColor: "#7890A8" },
  progressLabel: { fontSize: 11, fontFamily: "Poppins-Regular", color: "#A0B8C8" },

  zenCard: { borderRadius: 20, paddingVertical: 22, paddingHorizontal: 22, paddingLeft: 28, marginBottom: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "rgba(160,190,215,0.35)", shadowColor: "#5A8AAA", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 8 },
  zenAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, backgroundColor: "#6899B4" },
  zenLabel: { fontSize: 9, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#6899B4", marginBottom: 10 },
  zenText: { fontSize: 16, fontFamily: "Poppins-Medium", color: "#1A2E42", lineHeight: 26 },

  actionsRow: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: "#3D5A72", borderRadius: 14, paddingVertical: 13, shadowColor: "#3D5A72", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.28, shadowRadius: 10, elevation: 5 },
  actionBtnAlt: { backgroundColor: "#7890A8" },
  actionBtnSuccess: { backgroundColor: "#4CAF82" },
  actionBtnTxt: { fontSize: 12, fontFamily: "Poppins-SemiBold", color: "#fff" },

  introBadge: { alignSelf: "flex-start", backgroundColor: "rgba(120,144,168,0.12)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 18, borderWidth: 1, borderColor: "rgba(120,144,168,0.22)" },
  introBadgeTxt: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#7890A8" },
  introBody: { fontSize: 14, fontFamily: "Poppins-Regular", color: "#3A5060", lineHeight: 23, marginBottom: 22 },
  introQuoteBox: { backgroundColor: "rgba(255,255,255,0.82)", borderRadius: 18, padding: 20, marginBottom: 18, borderLeftWidth: 4, borderLeftColor: "#7890A8", borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "rgba(155,190,220,0.35)", shadowColor: "#98B8D0", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 10, elevation: 4 },
  introQuoteMark: { fontSize: 42, fontFamily: "Playfair-ExtraBold", color: "#7890A8", lineHeight: 38, marginBottom: 4 },
  introQuoteTxt: { fontSize: 14, fontFamily: "Playfair-ExtraBold", color: "#1A2E42", lineHeight: 23, fontStyle: "italic", marginBottom: 12 },
  introQuoteAuthor: { fontSize: 11, fontFamily: "Poppins-Regular", color: "#7890A8", textAlign: "right" },
  introMechanicBox: { backgroundColor: "rgba(120,144,168,0.08)", borderRadius: 16, padding: 18, marginBottom: 28, borderWidth: 1, borderColor: "rgba(120,144,168,0.18)" },
  introMechanicLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#7890A8", marginBottom: 8 },
  introMechanicTxt: { fontSize: 13, fontFamily: "Poppins-Regular", color: "#3A5060", lineHeight: 21 },
  introCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#3D5A72", borderRadius: 16, paddingVertical: 16, shadowColor: "#3D5A72", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  introCtaTxt: { fontSize: 15, fontFamily: "Poppins-SemiBold", color: "#fff" },
});
