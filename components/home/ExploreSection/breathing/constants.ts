import { Dimensions } from "react-native";

export const { width: W, height: H } = Dimensions.get("window");

export const PHASE_DURATION = 4000;

export const ORB   = 196;
export const RING1 = ORB + 52;
export const RING2 = ORB + 108;

// Colores
export const C_TITLE  = "#2D1F60";
export const C_MUTED  = "#A895C8";
export const C_ACCENT = "#7B6BB5";
export const C_RING   = "rgba(168,149,200,0.4)";

export const GRADIENT_COLORS = ["#F4EBE0", "#FDF5EE", "#EDE8F5", "#F7EFF5"] as const;

export const PHASES = [
  { label: "Inhala profundamente", sub: "Llena tus pulmones con calma" },
  { label: "Sostén el aire",       sub: "Quédate en este instante" },
  { label: "Exhala despacio",      sub: "Suelta lo que no necesitas" },
];

export const STEPS = [
  { image: require("../../../../assets/icons/inhala.png"), phase: "Inhala", time: "4 seg" },
  { image: require("../../../../assets/icons/sosten.png"), phase: "Sostén", time: "4 seg" },
  { image: require("../../../../assets/icons/exhala.png"), phase: "Exhala", time: "4 seg" },
];

export const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 47 + 23) % (W - 10),
  size: (i % 4) + 2.5,
  duration: 9000 + ((i * 800) % 6000),
  delay: (i * 600) % 5000,
}));
