import {
  CARD_HEIGHT,
  CARD_WIDTH,
  SCREEN_WIDTH,
  SPACING,
} from "@/constants/constants";
import { StyleSheet } from "react-native";

export const OPTION_HEIGHT = CARD_HEIGHT * 0.32;

export const cardStyles = StyleSheet.create({
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    top: SPACING * 4,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#1a1a2e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  exitCard: {
    elevation: 10,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 5, 20, 0.72)",
  },
  questionArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING * 2.5,
  },
  questionAreaSplit: {
    bottom: OPTION_HEIGHT,
  },
  questionText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 26,
    textAlign: "center",
    letterSpacing: 0.2,
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  optionSeparator: {
    position: "absolute",
    bottom: OPTION_HEIGHT,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  optionsRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: OPTION_HEIGHT,
    flexDirection: "row",
  },
  leftPanel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 1.2,
    paddingVertical: SPACING,
    backgroundColor: "rgba(220, 70, 70, 0.18)",
    gap: SPACING * 0.8,
  },
  rightPanel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: SPACING * 1.2,
    paddingVertical: SPACING,
    backgroundColor: "rgba(100, 210, 100, 0.18)",
    gap: SPACING * 0.8,
  },
  panelDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  arrowText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  panelText: {
    flex: 1,
    color: "#fff",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export { SCREEN_WIDTH };
