import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const TABBAR_WIDTH = width;
export const SPACING = 20;
export const TAB_ITEM_SIZE = 60;

export const CARD_WIDTH = width - 4 * SPACING;
export const CARD_HEIGHT = CARD_WIDTH * 1.5;
export const SWIPE_THRESHOLD = width * 0.3;
export const SCREEN_WIDTH = width;


export const TEXT_COLOR = "#464343ff";
export const BG_COLOR = "#edf2f5";
export const GREEN = "#bdf14d";


export const BACKGROUND_TRANSLATE_Y = -2;
export const BADGE_HEIGHT = 44;
export const BADGE_WIDTH = 120;
export const INACTIVE_ROTATION = "8deg";



export const cardImages = [
  {
    uri: "https://plus.unsplash.com/premium_vector-1721145505642-e10ae9873721?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bid: "12,35",
  },
  {
    uri: "https://plus.unsplash.com/premium_vector-1718241095572-909428b1f472?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bid: "10,00",
  },
  {
    uri: "https://plus.unsplash.com/premium_vector-1718241094919-435c97eda545?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bid: "18,50",
  },
  {
    uri: "https://images.unsplash.com/vector-1757946405607-8de3159afba9?q=80&w=722&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bid: "62,75",
  },
  {
    uri: "https://plus.unsplash.com/premium_vector-1757929708249-5bbb6f4be798?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bid: "54,00",
  },
  {
    uri: "https://images.unsplash.com/photo-1751378679063-cbd774c0f973?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bid: "12,35",
  },
  {
    uri: "https://images.unsplash.com/vector-1752568455565-4eb1e541a4d4?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bid: "34,25",
  },
  {
    uri: "https://plus.unsplash.com/premium_vector-1753138845333-1fa4c49911af?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bid: "58,50",
  },
];