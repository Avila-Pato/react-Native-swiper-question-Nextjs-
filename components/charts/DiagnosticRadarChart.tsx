import {
  Circle,
  G,
  Line,
  Polygon,
  Svg,
  Text as SvgText,
} from "react-native-svg";

interface Props {
  labels: string[];
  colors: string[];
  values: number[]; // 0–1 normalizado
  size?: number;
}

const GRID_LEVELS = [0.25, 0.5, 0.75];

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

  const gridPolygon = (level: number) =>
    axisPoints
      .map((p) => {
        const a = Math.atan2(p.y - cy, p.x - cx);
        return `${(cx + level * R * Math.cos(a)).toFixed(1)},${(cy + level * R * Math.sin(a)).toFixed(1)}`;
      })
      .join(" ");

  const hasValues = values.some((v) => v > 0);
  const scorePoints = hasValues
    ? values.map((v, i) => toXY(axisAngles[i], Math.max(0.06, v) * R))
    : null;

  const scorePolygonStr = scorePoints
    ?.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  // Reference polygon at 75%
  const refPolygonStr = axisPoints
    .map((p) => {
      const a = Math.atan2(p.y - cy, p.x - cx);
      return `${(cx + 0.75 * R * Math.cos(a)).toFixed(1)},${(cy + 0.75 * R * Math.sin(a)).toFixed(1)}`;
    })
    .join(" ");

  return (
    <Svg width={total} height={total}>

      {/* Axis lines */}
      {axisPoints.map((p, i) => (
        <Line
          key={`ax-${i}`}
          x1={cx} y1={cy}
          x2={p.x} y2={p.y}
          stroke="rgba(120,120,140,0.20)"
          strokeWidth={0.8}
        />
      ))}

      {/* Dashed grid rings */}
      {GRID_LEVELS.map((level, i) => (
        <Polygon
          key={`g-${i}`}
          points={gridPolygon(level)}
          fill="none"
          stroke="rgba(120,120,140,0.18)"
          strokeWidth={0.7}
          strokeDasharray="3,4"
        />
      ))}

      {/* Outer ring */}
      <Polygon
        points={gridPolygon(1.0)}
        fill="none"
        stroke="rgba(120,120,140,0.25)"
        strokeWidth={0.9}
      />

      {/* Reference polygon — verde */}
      <Polygon
        points={refPolygonStr}
        fill="rgba(34,197,94,0.14)"
        stroke="#22C55E"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />

      {/* Score polygon — azul/índigo */}
      {scorePoints && (
        <Polygon
          points={scorePolygonStr}
          fill="rgba(99,102,241,0.22)"
          stroke="#6366F1"
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      )}

      {/* Dots */}
      {scorePoints?.map((p, i) => {
        const c = colors[i] ?? "#8980B8";
        return (
          <G key={`nd-${i}`}>
            <Circle cx={p.x} cy={p.y} r={5} fill="#fff" />
            <Circle cx={p.x} cy={p.y} r={3} fill={c} />
          </G>
        );
      })}

      {/* Labels */}
      {axisAngles.map((angleDeg, i) => {
        const { x, y } = toXY(angleDeg, labelR);
        const anchor = x < cx - 8 ? "end" : x > cx + 8 ? "start" : "middle";
        const c = colors[i] ?? "#8980B8";
        return (
          <SvgText
            key={`lb-${i}`}
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
