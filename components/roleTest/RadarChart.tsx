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

type Props = { scores: RoleScores; size?: number };

const N = ROLES.length;
const LEVELS = 4;
const MAX = 4 * 5;

// Relleno extra alrededor del radar para que las etiquetas no se corten
const PAD = 76;

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

export function RadarChart({ scores, size = 280 }: Props) {
  // El canvas SVG es size × size, pero dibujamos en un viewBox con relleno
  const vbSize = size + PAD * 2;
  const cx = vbSize / 2 + 18; // desplazado a la derecha
  const cy = vbSize / 2;
  const R = (size / 2) * 0.62; // polígono más grande, las etiquetas siguen dentro del viewBox
  const labelR = R + 16; // etiquetas justo fuera del anillo exterior

  const gridRadii = Array.from(
    { length: LEVELS },
    (_, i) => ((i + 1) / LEVELS) * R,
  );
  const outerPts = Array.from({ length: N }, (_, i) => pt(cx, cy, R, i));

  // Polígono de puntuación (limitado a MAX para que no supere el anillo exterior)
  const scorePoints = ROLES.map((role, i) => {
    const pct = Math.min((scores[role.key] ?? 0) / MAX, 1);
    return pt(cx, cy, Math.max(pct * R, 2), i);
  });
  const scorePolygon = scorePoints
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  // Marcas justo fuera del pentágono exterior
  const TOTAL_TICKS = N * 5; // 25 marcas
  const ticks = Array.from({ length: TOTAL_TICKS }, (_, ti) => {
    const a = (Math.PI * 2 * ti) / TOTAL_TICKS - Math.PI / 2;
    const isMain = ti % 5 === 0;
    const r1 = R + 2;
    const r2 = R + (isMain ? 9 : 5);
    return {
      x1: (cx + r1 * Math.cos(a)).toFixed(1),
      y1: (cy + r1 * Math.sin(a)).toFixed(1),
      x2: (cx + r2 * Math.cos(a)).toFixed(1),
      y2: (cy + r2 * Math.sin(a)).toFixed(1),
      isMain,
    };
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${vbSize} ${vbSize}`}>
      <Defs>
        <LinearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#22D3EE" stopOpacity="0.38" />
          <Stop offset="100%" stopColor="#34D59A" stopOpacity="0.12" />
        </LinearGradient>
      </Defs>

      {/* Líneas de ejes */}
      {outerPts.map((p, i) => (
        <Line
          key={`ax-${i}`}
          x1={cx.toFixed(1)}
          y1={cy.toFixed(1)}
          x2={p.x.toFixed(1)}
          y2={p.y.toFixed(1)}
          stroke="#D1D5DB"
          strokeWidth={0.6}
        />
      ))}

      {/* Pentágonos de la cuadrícula */}
      {gridRadii.map((r, li) => (
        <Polygon
          key={`g-${li}`}
          points={polyStr(cx, cy, r)}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={0.8}
        />
      ))}

      {/* Pentágono exterior */}
      <Polygon
        points={polyStr(cx, cy, R)}
        fill="none"
        stroke="#D1D5DB"
        strokeWidth={1}
      />

      {/* Marcas de graduación */}
      {ticks.map((t, i) => (
        <Line
          key={`tk-${i}`}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.isMain ? "#9CA3AF" : "#D1D5DB"}
          strokeWidth={t.isMain ? 1 : 0.6}
        />
      ))}

      {/* Relleno de puntuación */}
      <Polygon points={scorePolygon} fill="url(#radarGrad)" />

      {/* Borde de puntuación */}
      <Polygon
        points={scorePolygon}
        fill="none"
        stroke="#34D59A"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Nodos con brillo */}
      {scorePoints.map((p, i) => (
        <G key={`nd-${i}`}>
          <Circle cx={p.x} cy={p.y} r={9} fill="#34D59A" opacity={0.1} />
          <Circle cx={p.x} cy={p.y} r={5} fill="#34D59A" opacity={0.2} />
          <Circle cx={p.x} cy={p.y} r={3} fill="#fff" />
          <Circle cx={p.x} cy={p.y} r={1.5} fill="#34D59A" />
        </G>
      ))}

      {/* Etiquetas — nombre + % */}
      {ROLES.map((role, i) => {
        const a = angle(i);
        const lp = pt(cx, cy, labelR, i);

        const anchor =
          Math.abs(Math.cos(a)) < 0.2
            ? "middle"
            : Math.cos(a) > 0
              ? "start"
              : "end";

        const pct = Math.min(
          Math.round(((scores[role.key] ?? 0) / MAX) * 100),
          100,
        );

        // Nombre arriba del % en el vértice superior; abajo en los inferiores
        const isTop = Math.sin(a) < -0.3;
        const nameY = isTop ? lp.y - 8 : lp.y + 5;
        const pctY = isTop ? lp.y + 8 : lp.y + 20;

        return (
          <G key={`lb-${i}`}>
            <SvgText
              x={lp.x.toFixed(1)}
              y={nameY.toFixed(1)}
              textAnchor={anchor}
              fontSize={14}
              fontWeight="700"
              fill="#374151"
            >
              {role.label}
            </SvgText>
            <SvgText
              x={lp.x.toFixed(1)}
              y={pctY.toFixed(1)}
              textAnchor={anchor}
              fontSize={12}
              fontWeight="600"
              fill="#9CA3AF"
            >
              {pct}%
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}
