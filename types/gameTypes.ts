import { SharedValue } from "react-native-reanimated";
import { CardItem, Opcion } from "./types";

export type SwipeableCardProps = {
  card: CardItem;
  imageUri: string;
  position: number;
  behindProgress: SharedValue<number>;
  dragX: SharedValue<number>;
  nodeText: string;
  opciones: Opcion[];
  onSwipeComplete: (
    card: CardItem,
    vx: number,
    tx: number,
    ty: number,
    choiceIndex: number,
  ) => void;
};

export type ExitingCardProps = {
  card: CardItem;
  imageUri: string;
  initX: number;
  initY: number;
  velocityX: number;
  nodeText: string;
  opciones: Opcion[];
  chosenIndex: number;
  onDone: () => void;
};

export type ExitState = {
  card: CardItem;
  imageUri: string;
  vx: number;
  tx: number;
  ty: number;
  nodeText: string;
  opciones: Opcion[];
  chosenIndex: number;
};

export type SwipeCardsProps = {
  nodeText: string;
  nodeImage: string;
  opciones: Opcion[];
  onChoice: (index: number) => void;
};
