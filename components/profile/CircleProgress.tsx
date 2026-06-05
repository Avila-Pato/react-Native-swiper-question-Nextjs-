import Svg, { Circle } from "react-native-svg";

export function CircleProgress({
  pct,
  color,
  size = 140,
  strokeWidth = 9,
}: {
  pct: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const c = size / 2;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={c}
        cy={c}
        r={r}
        stroke="#EAECF0"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={c}
        cy={c}
        r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90, ${c}, ${c})`}
      />
    </Svg>
  );
}
