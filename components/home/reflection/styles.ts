import { StyleSheet } from "react-native";
import { W } from "./constants";

export const s = StyleSheet.create({
  overlay: { flex: 1, alignItems: "center", justifyContent: "center" },

  blob1: { position: "absolute", width: 300, height: 300, borderRadius: 150, backgroundColor: "rgba(210,195,240,0.38)", top: -80, left: -80 },
  blob2: { position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: "rgba(255,205,185,0.30)", bottom: 60, right: -70 },
  blob3: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(190,215,255,0.25)", bottom: 220, left: 10 },

  closeBtn: { position: "absolute", top: 56, right: 22, width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.65)", alignItems: "center", justifyContent: "center", zIndex: 10, shadowColor: "#C0B0D8", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },

  center: { width: "100%", paddingHorizontal: 24, alignItems: "center" },

  card: { width: W - 48, borderRadius: 28, padding: 26, backgroundColor: "rgba(255,255,255,0.52)", borderWidth: 1.2, borderColor: "rgba(255,255,255,0.88)", overflow: "hidden", shadowColor: "#B8A8D8", shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.28, shadowRadius: 28, elevation: 14 },

  ornament: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 },
  oDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#C8B0DC" },
  oLine: { width: 44, height: 1, backgroundColor: "#D8C8EC" },

  cardLabel: { fontSize: 9, fontFamily: "Poppins-SemiBold", letterSpacing: 2.2, color: "#A895C8", textAlign: "center", marginBottom: 18 },

  phrase: { fontSize: 19, fontFamily: "Playfair-ExtraBold", color: "#2D1F60", lineHeight: 30, textAlign: "center", minHeight: 60, marginBottom: 22 },
  cursor: { color: "#A895C8", fontFamily: "Poppins-Regular" },

  separator: { height: 1, backgroundColor: "rgba(180,155,215,0.28)", marginBottom: 18 },

  inputLabel: { fontSize: 11, fontFamily: "Poppins-Medium", color: "#A895C8", marginBottom: 10 },
  input: { fontSize: 15, fontFamily: "Poppins-Regular", color: "#2D1F60", minHeight: 88, lineHeight: 24 },

  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18, backgroundColor: "#7B6BB5", borderRadius: 16, paddingVertical: 14, shadowColor: "#7B6BB5", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.38, shadowRadius: 14, elevation: 7 },
  saveBtnOff: { backgroundColor: "#C8BEE0", shadowOpacity: 0, elevation: 0 },
  saveTxt: { fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#fff" },
});
