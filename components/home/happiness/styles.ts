import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  overlay: { flex: 1 },

  blob1: { position: "absolute", width: 320, height: 320, borderRadius: 160, backgroundColor: "rgba(255,200,100,0.18)", top: -110, right: -110 },
  blob2: { position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: "rgba(195,175,255,0.2)", bottom: 80, left: -80 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 58, paddingHorizontal: 22, paddingBottom: 12 },
  headerTag: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 1.8, color: "#C4A855" },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.65)", alignItems: "center", justifyContent: "center", shadowColor: "#C0B0D8", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },

  heroTitle: { fontSize: 26, fontFamily: "Playfair-ExtraBold", color: "#2D1F60", marginBottom: 6 },
  heroSub: { fontSize: 13, fontFamily: "Poppins-Regular", color: "#A895C8", lineHeight: 20, marginBottom: 22 },

  slotMachine: { borderRadius: 26, padding: 20, backgroundColor: "rgba(255,255,255,0.5)", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.88)", overflow: "hidden", shadowColor: "#C4A855", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10, marginBottom: 16 },
  jackpotOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,215,60,0.28)" },
  reelsRow: { flexDirection: "row", gap: 8, marginBottom: 18 },

  reelWindow: { flex: 1, borderRadius: 16, minHeight: 110, backgroundColor: "rgba(255,255,255,0.72)", borderWidth: 1.5, borderColor: "rgba(200,190,230,0.5)", padding: 10, alignItems: "center", overflow: "hidden" },
  reelWindowLocked: { borderColor: "rgba(200,160,40,0.65)", backgroundColor: "rgba(255,248,210,0.65)", shadowColor: "#F59E0B", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.45, shadowRadius: 10, elevation: 5 },
  reelLabel: { fontSize: 7, fontFamily: "Poppins-SemiBold", letterSpacing: 1.5, color: "#C4A855", marginBottom: 8 },
  reelContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  reelIdle: { fontSize: 26, color: "rgba(180,165,220,0.45)" },
  reelText: { fontSize: 11, fontFamily: "Poppins-SemiBold", color: "#3D2D70", textAlign: "center", lineHeight: 16 },
  reelLockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#F59E0B", marginTop: 6 },
  reelHintRow: { alignItems: "center", marginTop: 6, gap: 2 },
  reelArrow: { width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 0, borderTopWidth: 6, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "rgba(196,168,85,0.55)" },
  reelHintTxt: { fontSize: 9, fontFamily: "Poppins-Regular", color: "#C4A855", textAlign: "center" },

  spinBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#3D2D70", borderRadius: 18, paddingVertical: 16, shadowColor: "#3D2D70", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  spinBtnBusy: { backgroundColor: "#9B8AB8" },
  spinBtnTxt: { fontSize: 15, fontFamily: "Poppins-SemiBold", color: "#fff" },

  rewardCard: { borderRadius: 26, padding: 22, backgroundColor: "rgba(255,255,255,0.6)", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.88)", overflow: "hidden", shadowColor: "#C4A855", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 12, marginBottom: 10 },

  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20, paddingVertical: 12, backgroundColor: "rgba(255,255,255,0.55)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.85)" },
  switchLabel: { fontSize: 11, fontFamily: "Poppins-SemiBold", color: "#C0B0D8" },
  switchLabelActive: { color: "#7B6BB5" },
  switchLabelGold: { color: "#D97706" },
  switchTrack: { width: 48, height: 28, borderRadius: 14, backgroundColor: "rgba(190,175,220,0.45)", justifyContent: "center" },
  switchTrackGold: { backgroundColor: "#F59E0B" },
  switchThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#fff", shadowColor: "#7B6BB5", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },

  autoCard: { borderRadius: 18, padding: 18, backgroundColor: "rgba(210,205,225,0.35)", borderWidth: 1, borderColor: "rgba(190,182,215,0.4)" },
  autoLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#B8B0CC", marginBottom: 12 },
  autoBubble: { backgroundColor: "rgba(190,182,215,0.28)", borderRadius: 14, borderBottomLeftRadius: 4, padding: 14, marginBottom: 12 },
  autoText: { fontSize: 14, fontFamily: "Poppins-Regular", color: "#7A7090", lineHeight: 22, fontStyle: "italic" },
  autoFooter: { fontSize: 11, fontFamily: "Poppins-Regular", color: "#B0A8C0", textAlign: "center" },

  destelloBlock: { backgroundColor: "rgba(123,107,181,0.07)", borderRadius: 18, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: "rgba(123,107,181,0.16)" },
  blockLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#C4A855", marginBottom: 10 },
  destelloText: { fontSize: 16, fontFamily: "Playfair-ExtraBold", color: "#2D1F60", lineHeight: 26, marginBottom: 12 },
  destelloSuffix: { color: "#7B6BB5" },
  superpowerTag: { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start", backgroundColor: "rgba(123,107,181,0.1)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(123,107,181,0.2)" },
  superpowerTxt: { fontSize: 11, fontFamily: "Poppins-SemiBold", color: "#7B6BB5" },

  chemBlock: { borderRadius: 18, padding: 18, marginBottom: 20, backgroundColor: "rgba(255,255,255,0.4)", borderWidth: 1.5 },
  chemRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  chemBadge: { borderRadius: 14, padding: 12, alignItems: "center", minWidth: 82 },
  chemMolecule: { fontSize: 14, fontFamily: "Playfair-ExtraBold", marginBottom: 2 },
  chemLabel: { fontSize: 10, fontFamily: "Poppins-SemiBold" },
  chemDesc: { flex: 1, fontSize: 13, fontFamily: "Poppins-Regular", color: "#6B6080", lineHeight: 20 },

  actionsRow: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: "#3D2D70", borderRadius: 14, paddingVertical: 13, shadowColor: "#3D2D70", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  actionBtnGold: { backgroundColor: "#C4A855" },
  actionBtnSuccess: { backgroundColor: "#4CAF82" },
  actionBtnTxt: { fontSize: 12, fontFamily: "Poppins-SemiBold", color: "#fff" },

  resetBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14 },
  resetTxt: { fontSize: 13, fontFamily: "Poppins-Medium", color: "#B8A8D0" },

  introBadge: { alignSelf: "flex-start", backgroundColor: "rgba(245,158,11,0.14)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 14 },
  introBadgeTxt: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 1.6, color: "#C4A855" },
  introBody: { fontSize: 13, fontFamily: "Poppins-Regular", color: "#7A7090", lineHeight: 20, marginBottom: 18 },
  introFactBox: { backgroundColor: "rgba(123,107,181,0.07)", borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "rgba(123,107,181,0.14)" },
  introFactLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#C4A855", marginBottom: 6 },
  introFactTxt: { fontSize: 12, fontFamily: "Poppins-Regular", color: "#7A7090", lineHeight: 18 },
  introMechanicBox: { backgroundColor: "rgba(245,158,11,0.07)", borderRadius: 16, padding: 14, marginBottom: 22, borderWidth: 1, borderColor: "rgba(245,158,11,0.15)" },
  introMechanicLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#D97706", marginBottom: 6 },
  introMechanicTxt: { fontSize: 12, fontFamily: "Poppins-Regular", color: "#7A7090", lineHeight: 18 },
  introCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#3D2D70", borderRadius: 16, paddingVertical: 15, shadowColor: "#3D2D70", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  introCtaTxt: { fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#fff" },
});
