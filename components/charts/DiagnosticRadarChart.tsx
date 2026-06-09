import {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Polygon,
  Stop,
  Svg,
  Text as SvgText,
} from "react-native-svg";

interface Props {
  labels: string[];
  colors: string[];
  values: number[]; // 0–1 normalizado por eje
  size?: number;
}

const GRID_LEVELS = [0.25, 0.5, 0.75, 1.0];

export function DiagnosticRadarChart({ labels, colors, values, size = 240 }: Props) {
  const PAD = 52;
  const total = size + PAD * 2;
  const cx = total / 2;
  const cy = total / 2;
  const N = labels.length;
  const R = size * 0.34;
  const labelR = size * 0.47;

  const toXY = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const axisAngles = Array.from({ length: N }, (_, i) => (i * 360) / N);
  const axisPoints = axisAngles.map((a) => toXY(a, R));

  const hasValues = values.some((v) => v > 0);
  const scorePoints = hasValues
    ? values.map((v, i) => toXY(axisAngles[i], Math.max(0.06, v) * R))
    : null;

  const gridPolygon = (level: number) =>
    axisPoints
      .map((p) => {
        const a = Math.atan2(p.y - cy, p.x - cx);
        return `${(cx + level * R * Math.cos(a)).toFixed(1)},${(cy + level * R * Math.sin(a)).toFixed(1)}`;
      })
      .join(" ");

  const scorePolygonStr = scorePoints
    ?.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <Svg width={total} height={total}>
      <Defs>
        <LinearGradient id="diagFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#8980B8" stopOpacity="0.38" />
          <Stop offset="100%" stopColor="#C45E7A" stopOpacity="0.22" />
        </LinearGradient>
      </Defs>

      {/* Grid rings */}
      {GRID_LEVELS.map((level, i) => (
        <Polygon
          key={i}
          points={gridPolygon(level)}
          fill="none"
          stroke="rgba(100,100,120,0.18)"
          strokeWidth={level === 1.0 ? 1 : 0.7}
          strokeDasharray={level < 1.0 ? "3,4" : undefined}
        />
      ))}

      {/* Axis lines */}
      {axisPoints.map((p, i) => (
        <Line
          key={i}
          x1={cx} y1={cy}
          x2={p.x} y2={p.y}
          stroke="rgba(100,100,120,0.15)"
          strokeWidth={0.8}
        />
      ))}

      {/* Score fill */}
      {scorePoints && (
        <Polygon
          points={scorePolygonStr}
          fill="url(#diagFill)"
          stroke="#8980B8"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      )}

      {/* Score dots */}
      {scorePoints?.map((p, i) => {
        const c = colors[i] ?? "#8980B8";
        return (
          <>
            <Circle key={`outer-${i}`} cx={p.x} cy={p.y} r={5} fill={c} opacity={0.25} />
            <Circle key={`dot-${i}`} cx={p.x} cy={p.y} r={3} fill="#fff" />
            <Circle key={`inner-${i}`} cx={p.x} cy={p.y} r={1.8} fill={c} />
          </>
        );
      })}

      {/* Labels */}
      {axisAngles.map((angle, i) => {
        const { x, y } = toXY(angle, labelR);
        const anchor = x < cx - 8 ? "end" : x > cx + 8 ? "start" : "middle";
        const c = colors[i] ?? "#8980B8";
        return (
          <SvgText
            key={i}
            x={x}
            y={y + 4}
            fontSize={10}
            fontWeight="700"
            fill={c}
            textAnchor={anchor}
          >
            {labels[i]}
          </SvgText>
        );
      })}
    </Svg>
  );
}
