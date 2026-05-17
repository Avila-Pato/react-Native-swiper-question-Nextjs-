import { ResultScreen } from "@/components/game/ResultScreen";
import { SwipeCards } from "@/components/game/SwipeCards";
import { BG_COLOR } from "@/constants/constants";
import gameData from "@/data/gameData";
import { GameNode, PerfilPoints } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabOneScreen() {
  const { startNode } = useLocalSearchParams<{ startNode?: string; nombre?: string; formacion?: string; ramas?: string }>();
  const initialNode = startNode && gameData[startNode] ? startNode : "inicio_perdido";
  const [currentNodeKey, setCurrentNodeKey] = useState(initialNode);
  const [, setPerfilPoints] = useState<PerfilPoints>({});

  const currentNode = gameData[currentNodeKey] as GameNode;
  const isGameOver = currentNode.opciones.length === 0;

  const handleChoice = (choiceIndex: number) => {
    const chosen = currentNode.opciones[choiceIndex];
    if (!chosen) return;

    setPerfilPoints((prev) => {
      const next = { ...prev };
      for (const [key, val] of Object.entries(chosen.puntos)) {
        next[key] = (next[key] ?? 0) + (val as number);
      }
      return next;
    });

    setCurrentNodeKey(chosen.siguienteNodo);
  };

  const handleReset = () => {
    setCurrentNodeKey(initialNode);
    setPerfilPoints({});
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {isGameOver ? (
        <ResultScreen node={currentNode} onReset={handleReset} />
      ) : (
        <SwipeCards
          nodeText={currentNode.texto}
          nodeImage={currentNode.image}
          opciones={currentNode.opciones}
          onChoice={handleChoice}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
});
