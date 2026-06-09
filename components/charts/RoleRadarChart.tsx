import { ROLES } from "@/data/roleTestData";
import { RoleScores } from "@/types/roleTest";
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Polygon,
  Stop,
  Svg,
  Text as SvgText,
} from "react-native-svg";

interface Props {
  scores: RoleScores;
  size?: number;
}

const N = ROLES.length;
const LEVELS = 4;
const MAX = 4 * 5;
const PAD = 80;

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
  return {
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  };
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
  const R = (size / 2) * 0.64;
  const labelR = R + 22;

  const gridRadii = Array.from(
    { length: LEVELS },
    (_, i) => ((i + 1) / LEVELS) * R,
  );
  const outerPts = Array.from({ length: N }, (_, i) => pt(cx, cy, R, i));

  const scorePoints = ROLES.map((role, i) => {
    const pct = Math.min((scores[role.key] ?? 0) / MAX, 1);
    return pt(cx, cy, Math.max(pct * R, 4), i);
  });
  const scorePolygon = scorePoints
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <Svg width={size + PAD} height={size + PAD} viewBox={`0 0 ${vbSize} ${vbSize}`}>
      <Defs>
        <LinearGradient id="roleFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#8980B8" stopOpacity="0.38" />
          <Stop offset="100%" stopColor="#C45E7A" stopOpacity="0.20" />
        </LinearGradient>
      </Defs>

      {/* Axis lines */}
      {outerPts.map((p, i) => (
        <Line
          key={`ax-${i}`}
          x1={cx.toFixed(1)} y1={cy.toFixed(1)}
          x2={p.x.toFixed(1)} y2={p.y.toFixed(1)}
          stroke="rgba(100,100,120,0.18)"
          strokeWidth={0.8}
        />
      ))}

      {/* Inner grid rings */}
      {gridRadii.slice(0, -1).map((r, li) => (
        <Polygon
          key={`g-${li}`}
          points={polyStr(cx, cy, r)}
          fill="none"
          stroke="rgba(100,100,120,0.15)"
          strokeWidth={0.7}
          strokeDasharray="3,4"
        />
      ))}

      {/* Outer ring */}
      <Polygon
        points={polyStr(cx, cy, R)}
        fill="none"
        stroke="rgba(100,100,120,0.22)"
        strokeWidth={1}
      />

      {/* Score fill */}
      <Polygon points={scorePolygon} fill="url(#roleFill)" />

      {/* Score border */}
      <Polygon
        points={scorePolygon}
        fill="none"
        stroke="#8980B8"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Nodes */}
      {scorePoints.map((p, i) => {
        const role = ROLES[i];
        const c = ROLE_COLORS[role.key] ?? "#8980B8";
        return (
          <G key={`nd-${i}`}>
            <Circle cx={p.x} cy={p.y} r={6} fill={c} opacity={0.22} />
            <Circle cx={p.x} cy={p.y} r={3.5} fill="#fff" />
            <Circle cx={p.x} cy={p.y} r={2} fill={c} />
          </G>
        );
      })}

      {/* Labels */}
      {ROLES.map((role, i) => {
        const a = angle(i);
        const lp = pt(cx, cy, labelR, i);
        const c = ROLE_COLORS[role.key] ?? "#8980B8";

        const anchor =
          Math.abs(Math.cos(a)) < 0.2
            ? "middle"
            : Math.cos(a) > 0
              ? "start"
              : "end";

        const isTop = Math.sin(a) < -0.3;
        const nameY = isTop ? lp.y - 6 : lp.y + 6;

        return (
          <SvgText
            key={`lb-${i}`}
            x={lp.x.toFixed(1)}
            y={nameY.toFixed(1)}
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
