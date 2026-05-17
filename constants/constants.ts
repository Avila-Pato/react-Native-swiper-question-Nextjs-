import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const TABBAR_WIDTH = width * 0.8; // espaciado de la barra de navegacion
export const SPACING = 10;
export const TAB_ITEM_SIZE = 50;

export const CARD_WIDTH = width - 4 * SPACING;
export const CARD_HEIGHT = CARD_WIDTH * 1.8;
export const SWIPE_THRESHOLD = width * 0.3;
export const SCREEN_WIDTH = width;


export const TEXT_FONT_SIZE = 32;
export const TEXT_COLOR = "#464343ff";
export const BG_COLOR = "#edf2f5";
export const GREEN = "#bdf14d";


export const BACKGROUND_TRANSLATE_Y = -2;
export const BADGE_HEIGHT = 44;
export const BADGE_WIDTH = 120;
export const INACTIVE_ROTATION = "8deg";



export const cardImages = [
  {
    uri: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
    title: "React",
  },
  {
    uri: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop",
    title: "JavaScript",
  },
  {
    uri: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop",
    title: "Python",
  },
  {
    uri: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop",
    title: "TypeScript",
  },
  {
    uri: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop",
    title: "Docker",
  },
  {
    uri: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop",
    title: "Kubernetes",
  },
  {
    uri: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
    title: "Node.js",
  },
  {
    uri: "https://images.unsplash.com/photo-1640552435388-a54879e72b28?w=800&auto=format&fit=crop",
    title: "Rust",
  },
];