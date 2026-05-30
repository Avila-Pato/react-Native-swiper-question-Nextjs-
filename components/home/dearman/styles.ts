import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  overlay: { flex: 1 },

  blob1: { position: "absolute", width: 300, height: 300, borderRadius: 150, backgroundColor: "rgba(210,195,240,0.35)", top: -80, left: -80 },
  blob2: { position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: "rgba(255,205,185,0.28)", bottom: 60, right: -70 },
  blob3: { position: "absolute", width: 180, height: 180, borderRadius: 90,  backgroundColor: "rgba(190,215,255,0.22)", bottom: 200, left: 10 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 58, paddingHorizontal: 22, paddingBottom: 14 },
  headerTag: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 1.8, color: "#A895C8" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backTxt: { fontSize: 13, fontFamily: "Poppins-Medium", color: "#8B7BAB" },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.65)", alignItems: "center", justifyContent: "center", shadowColor: "#C0B0D8", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },

  contextRow: { flexDirection: "row", gap: 8, paddingHorizontal: 22, marginBottom: 18 },
  contextTab: { flex: 1, paddingVertical: 10, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.45)", borderWidth: 1, borderColor: "rgba(255,255,255,0.7)", alignItems: "center", gap: 6 },
  contextTabActive: { backgroundColor: "#7B6BB5", borderColor: "#7B6BB5" },
  contextIcon: { width: 28, height: 28 },
  contextTabTxt: { fontSize: 10, fontFamily: "Poppins-SemiBold", color: "#A895C8" },
  contextTabTxtActive: { color: "#fff" },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  card: { borderRadius: 24, padding: 24, backgroundColor: "rgba(255,255,255,0.5)", borderWidth: 1.2, borderColor: "rgba(255,255,255,0.88)", overflow: "hidden", shadowColor: "#B8A8D8", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.22, shadowRadius: 22, elevation: 10 },

  // Intro screen
  introBadge: { alignSelf: "flex-start", backgroundColor: "rgba(123,107,181,0.12)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 14 },
  introBadgeTxt: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 1.6, color: "#7B6BB5" },
  introMainTitle: { fontSize: 24, fontFamily: "Playfair-ExtraBold", color: "#2D1F60", marginBottom: 8 },
  introMainSub: { fontSize: 13, fontFamily: "Poppins-Regular", color: "#7A7090", lineHeight: 20, marginBottom: 20 },
  introAuthorCard: { backgroundColor: "rgba(123,107,181,0.07)", borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "rgba(123,107,181,0.13)" },
  introAuthorCardWarm: { backgroundColor: "rgba(251,191,36,0.08)", borderColor: "rgba(217,119,6,0.15)" },
  introAuthorName: { fontSize: 13, fontFamily: "Poppins-SemiBold", color: "#2D1F60", marginBottom: 2 },
  introAuthorBook: { fontSize: 10, fontFamily: "Poppins-Regular", fontStyle: "italic", color: "#A895C8", marginBottom: 6 },
  introAuthorDesc: { fontSize: 12, fontFamily: "Poppins-Regular", color: "#7A7090", lineHeight: 18 },
  introStudyBox: { backgroundColor: "rgba(123,188,168,0.1)", borderRadius: 14, padding: 14, marginTop: 4, marginBottom: 20, borderWidth: 1, borderColor: "rgba(123,188,168,0.22)" },
  introStudyLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#4A9B8A", marginBottom: 6 },
  introStudyTxt: { fontSize: 12, fontFamily: "Poppins-Regular", color: "#4A7A6E", lineHeight: 18 },
  ctaBtn: { backgroundColor: "#7B6BB5", borderRadius: 16, paddingVertical: 14, alignItems: "center", shadowColor: "#7B6BB5", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  ctaTxt: { fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#fff" },

  // Diagnose
  introBox: { backgroundColor: "rgba(123,107,181,0.07)", borderRadius: 16, padding: 16, marginBottom: 22, borderWidth: 1, borderColor: "rgba(123,107,181,0.13)" },
  introQuote: { fontSize: 13, fontFamily: "Playfair-ExtraBold", color: "#2D1F60", lineHeight: 21, fontStyle: "italic", marginBottom: 6 },
  introAuthor: { fontSize: 10, fontFamily: "Poppins-SemiBold", color: "#A895C8", marginBottom: 12 },
  introBook: { fontFamily: "Poppins-Regular", fontStyle: "italic" },
  introBody: { fontSize: 12, fontFamily: "Poppins-Regular", color: "#7A7090", lineHeight: 19 },
  diagTitle: { fontSize: 22, fontFamily: "Playfair-ExtraBold", color: "#2D1F60", marginBottom: 6 },
  diagSub: { fontSize: 13, fontFamily: "Poppins-Regular", color: "#A895C8", lineHeight: 20, marginBottom: 22 },
  tagGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 50, backgroundColor: "rgba(123,107,181,0.1)", borderWidth: 1, borderColor: "rgba(123,107,181,0.2)" },
  tagTxt: { fontSize: 13, fontFamily: "Poppins-Medium", color: "#7B6BB5" },

  // Simulate
  triggerTitle: { fontSize: 16, fontFamily: "Playfair-ExtraBold", color: "#2D1F60", lineHeight: 26, marginBottom: 16, paddingHorizontal: 4 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 20, paddingVertical: 14, backgroundColor: "rgba(255,255,255,0.55)", borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.85)" },
  switchLabel: { fontSize: 11, fontFamily: "Poppins-SemiBold", color: "#C0B0D8" },
  switchLabelActive: { color: "#7B6BB5" },
  switchTrack: { width: 48, height: 28, borderRadius: 14, backgroundColor: "rgba(190,175,220,0.45)", justifyContent: "center" },
  switchTrackActive: { backgroundColor: "#7B6BB5" },
  switchThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#fff", shadowColor: "#7B6BB5", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },

  fearCard: { borderRadius: 20, padding: 20, backgroundColor: "rgba(230,225,240,0.5)", borderWidth: 1, borderColor: "rgba(210,200,230,0.6)" },
  fearLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#B8B0CC", marginBottom: 12 },
  fearBubble: { backgroundColor: "rgba(200,190,220,0.35)", borderRadius: 16, borderBottomLeftRadius: 4, padding: 14, marginBottom: 12 },
  fearText: { fontSize: 14, fontFamily: "Poppins-Regular", color: "#7A7090", lineHeight: 22, fontStyle: "italic" },
  fearFooter: { fontSize: 11, fontFamily: "Poppins-Regular", color: "#B0A8C0", textAlign: "center" },

  nedraCard: { borderRadius: 24, padding: 24, backgroundColor: "rgba(255,255,255,0.55)", borderWidth: 1.5, borderColor: "rgba(123,107,181,0.3)", overflow: "hidden", shadowColor: "#7B6BB5", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.22, shadowRadius: 24, elevation: 12 },
  nedraCardLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2.2, color: "#A895C8", textAlign: "center", marginBottom: 20 },
  nedraBlock: { backgroundColor: "rgba(123,107,181,0.08)", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "rgba(123,107,181,0.15)" },
  nedraBlockAction: { backgroundColor: "rgba(123,188,168,0.1)", borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: "rgba(123,188,168,0.22)" },
  nedraBlockLabel: { fontSize: 8, fontFamily: "Poppins-SemiBold", letterSpacing: 2, color: "#C0B0D8", marginBottom: 8 },
  nedraPhrase: { fontSize: 17, fontFamily: "Playfair-ExtraBold", color: "#2D1F60", lineHeight: 28 },
  nedraAction: { fontSize: 14, fontFamily: "Poppins-Medium", color: "#4A9B8A", lineHeight: 22 },

  copyBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#7B6BB5", borderRadius: 16, paddingVertical: 14, shadowColor: "#7B6BB5", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  copyBtnSuccess: { backgroundColor: "#7BBCA8" },
  copyTxt: { fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#fff" },
});
