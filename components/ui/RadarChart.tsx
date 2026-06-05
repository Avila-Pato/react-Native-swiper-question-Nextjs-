import { Circle, Line, Polygon, Svg, Text as SvgText } from "react-native-svg";

type Props = {
  labels: string[];
  colors: string[];
  values: number[]; // 0-1 normalized per axis
  color?: string;
  size?: number;
};

export function RadarChart({ labels, colors, values, color = "#8980B8", size = 220 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const N = labels.length;
  const R = size * 0.33;
  const labelR = size * 0.44;
  const GRID_LEVELS = [0.25, 0.5, 0.75, 1.0];

  const toXY = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const axisAngles = Array.from({ length: N }, (_, i) => (i * 360) / N);
  const axisPoints = axisAngles.map((a) => toXY(a, R));
  const hasValues = values.some((v) => v > 0);
  const scorePoints = hasValues
    ? values.map((v, i) => toXY(axisAngles[i], Math.max(0.05, v) * R))
    : null;

  const gridPolygon = (level: number) =>
    axisPoints
      .map((p) => {
        const a = Math.atan2(p.y - cy, p.x - cx);
        return `${cx + level * R * Math.cos(a)},${cy + level * R * Math.sin(a)}`;
      })
      .join(" ");

  return (
    <Svg width={size} height={size}>
      {/* Grid rings */}
      {GRID_LEVELS.map((level, i) => (
        <Polygon
          key={i}
          points={gridPolygon(level)}
          fill="none"
          stroke="rgba(137,128,184,0.15)"
          strokeWidth={1}
        />
      ))}

      {/* Axis lines */}
      {axisPoints.map((p, i) => (
        <Line
          key={i}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke="rgba(137,128,184,0.12)"
          strokeWidth={1}
        />
      ))}

      {/* Score fill */}
      {scorePoints && (
        <Polygon
          points={scorePoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill={color + "28"}
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      )}

      {/* Score dots */}
      {scorePoints?.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={4} fill={colors[i] ?? color} />
      ))}

      {/* Labels */}
      {axisAngles.map((angle, i) => {
        const { x, y } = toXY(angle, labelR);
        const anchor = x < cx - 6 ? "end" : x > cx + 6 ? "start" : "middle";
        return (
          <SvgText
            key={i}
            x={x}
            y={y + 4}
            fontSize={9.5}
            fontWeight="700"
            fill={colors[i] ?? color}
            textAnchor={anchor}
          >
            {labels[i]}
          </SvgText>
        );
      })}
    </Svg>
  );
}
