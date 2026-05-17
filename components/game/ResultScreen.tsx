import { GREEN, SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import { GameNode } from "@/types/types";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TAB_BAR_CLEARANCE = TAB_ITEM_SIZE + SPACING * 5;

type ResultScreenProps = {
  node: GameNode;
  onReset: () => void;
};

export function ResultScreen({ node, onReset }: ResultScreenProps) {
  const lines = node.texto.split("\n");
  const titulo = lines[0];
  const cuerpo = lines.slice(2).join("\n");

  return (
    <View style={styles.resultWrapper}>
      <ScrollView
        style={styles.resultScroll}
        contentContainerStyle={styles.resultContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultBadge}>
          <Text style={styles.resultBadgeText}>Perfil descubierto</Text>
        </View>
        <Text style={styles.resultTitle}>{titulo}</Text>
        <View style={styles.resultDivider} />
        <Text style={styles.resultBody}>{cuerpo}</Text>
      </ScrollView>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={onReset}
        activeOpacity={0.85}
      >
        <Text style={styles.resetButtonText}>↩ Reiniciar Test</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  resultWrapper: {
    flex: 1,
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 2,
  },
  resultScroll: {
    flex: 1,
  },
  resultContent: {
    paddingBottom: SPACING * 3,
  },
  resultBadge: {
    alignSelf: "flex-start",
    backgroundColor: GREEN,
    borderRadius: 20,
    paddingVertical: SPACING * 0.5,
    paddingHorizontal: SPACING * 1.5,
    marginBottom: SPACING * 1.5,
  },
  resultBadgeText: {
    color: "#1a1a2e",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a2e",
    lineHeight: 30,
    marginBottom: SPACING * 1.5,
  },
  resultDivider: {
    height: 2,
    backgroundColor: GREEN,
    marginBottom: SPACING * 2,
    borderRadius: 1,
    width: "30%",
  },
  resultBody: {
    fontSize: 15,
    lineHeight: 24,
    color: "#2c2c3e",
    fontWeight: "400",
  },
  resetButton: {
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    paddingVertical: SPACING * 1.8,
    alignItems: "center",
    marginTop: SPACING * 2,
    marginBottom: TAB_BAR_CLEARANCE,
  },
  resetButtonText: {
    color: GREEN,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
