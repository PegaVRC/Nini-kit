import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FUENTE, PALETA } from "./tema";

/** Texto en pantalla: hasta 3 palabras, cada una con un color del logo. */
export const TextoClip: React.FC<{ texto: string; retraso: number }> = ({
  texto,
  retraso,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  const palabras = texto.split(" ");
  const largo = texto.length;
  const base = vertical ? 150 : 140;
  const fontSize = largo > 14 ? base * (14 / largo) : base;

  return (
    <div
      style={{
        position: "absolute",
        top: vertical ? 230 : 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0 0.45em",
        fontFamily: FUENTE,
        fontWeight: 700,
        fontSize,
        lineHeight: 1.1,
        padding: "0 40px",
      }}
    >
      {palabras.map((palabra, i) => {
        const entrada = spring({
          frame: frame - retraso - i * 5,
          fps,
          config: { damping: 9 },
        });
        const flotar = Math.sin((frame + i * 12) / 14) * 6;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: PALETA[i % PALETA.length],
              WebkitTextStroke: `${Math.round(fontSize / 7)}px white`,
              paintOrder: "stroke fill",
              textShadow: "0 10px 20px rgba(0,0,0,0.3)",
              scale: String(entrada),
              translate: `0px ${flotar}px`,
            }}
          >
            {palabra}
          </span>
        );
      })}
    </div>
  );
};
