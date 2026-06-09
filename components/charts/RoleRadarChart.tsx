import { ROLES } from "@/data/roleTestData";
import { RoleScores } from "@/types/roleTest";
import {
  Circle,
  G,
  Line,
  Polygon,
  Svg,
  Text as SvgText,
} from "react-native-svg";

interface Props {
  scores: RoleScores;
  size?: number;
}

const N = ROLES.length;
const MAX = 4 * 5;
const PAD = 72;
const GRID_LEVELS = [0.25, 0.5, 0.75];

const ROLE_COLORS: Record<string, string> = {
  limites:          "#7C3AED",
  autoconocimiento: "#0284C7",
  vinculos:         "#4D8B7A",
  felicidad:        "#D97706",
  proposito:        "#8980B8",
};

function angle(i: number) {
  return (Math.PI * 2 * i) / N - Math.PI / 2;
}

function pt(cx: number, cy: number, r: number, i: number) {
  return { x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) };
}

function polyStr(cx: number, cy: number, r: number): string {
  return Array.from({ length: N }, (_, i) => {
    const p = pt(cx, cy, r, i);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
}

export function RoleRadarChart({ scores, size = 280 }: Props) {
  const vbSize = size + PAD * 2;
  const cx = vbSize / 2;
  const cy = vbSize / 2;
  const R = (size / 2) * 0.60;
  const labelR = R + 26;

  const outerPts = Array.from({ length: N }, (_, i) => pt(cx, cy, R, i));

  const scorePoints = ROLES.map((role, i) => {
    const pct = Math.min((scores[role.key] ?? 0) / MAX, 1);
    return pt(cx, cy, Math.max(pct * R, 4), i);
  });
  const scorePolygon = scorePoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  // Reference polygon at 80% — representa el potencial máximo
  const refPolygon = polyStr(cx, cy, R * 0.8);

  return (
    <Svg width={size + PAD} height={size + PAD} viewBox={`0 0 ${vbSize} ${vbSize}`}>

      {/* Axis lines */}
      {outerPts.map((p, i) => (
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
          points={polyStr(cx, cy, level * R)}
          fill="none"
          stroke="rgba(120,120,140,0.18)"
          strokeWidth={0.7}
          strokeDasharray="3,4"
        />
      ))}

      {/* Outer ring */}
      <Polygon
        points={polyStr(cx, cy, R)}
        fill="none"
        stroke="rgba(120,120,140,0.25)"
        strokeWidth={0.9}
      />

      {/* Reference polygon — verde */}
      <Polygon
        points={refPolygon}
        fill="rgba(34,197,94,0.14)"
        stroke="#22C55E"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />

      {/* Score polygon — azul/índigo */}
      <Polygon
        points={scorePolygon}
        fill="rgba(99,102,241,0.22)"
        stroke="#6366F1"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />

      {/* Dots */}
      {scorePoints.map((p, i) => {
        const c = ROLE_COLORS[ROLES[i].key] ?? "#8980B8";
        return (
          <G key={`nd-${i}`}>
            <Circle cx={p.x} cy={p.y} r={5} fill="#fff" />
            <Circle cx={p.x} cy={p.y} r={3} fill={c} />
          </G>
        );
      })}

      {/* Labels */}
      {ROLES.map((role, i) => {
        const a = angle(i);
        const lp = pt(cx, cy, labelR, i);
        const c = ROLE_COLORS[role.key] ?? "#8980B8";
        const anchor =
          Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
        const isTop = Math.sin(a) < -0.3;
        return (
          <SvgText
            key={`lb-${i}`}
            x={lp.x.toFixed(1)}
            y={(isTop ? lp.y - 4 : lp.y + 8).toFixed(1)}
            textAnchor={anchor}
            fontSize={12}
            fontWeight="700"
            fill={c}
          >
            {role.label}
          </SvgText>
        );
      })}
    </Svg>
  );
}
