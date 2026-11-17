import { Circle, Heart, Rect, Star, Triangle } from "@remotion/shapes";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, FUENTE, PALETA } from "./tema";
import type { Educativo as EducativoTipo } from "./tipos";

const NOMBRES_COLORES: Record<string, string> = {
  rojo: "#F44336",
  azul: "#2979FF",
  amarillo: COLORES.amarillo,
  verde: "#43C34A",
  naranja: "#FF9800",
  morado: COLORES.morado,
  rosado: COLORES.rosado,
  rosa: COLORES.rosado,
  celeste: COLORES.celeste,
  blanco: "#FFFFFF",
  negro: "#222222",
  cafe: "#8D5B3B",
  gris: "#9E9E9E",
};

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

const Etiqueta: React.FC<{ texto: string; color: string; size: number }> = ({
  texto,
  color,
  size,
}) => (
  <div
    style={{
      fontFamily: FUENTE,
      fontWeight: 700,
      fontSize: size,
      color,
      WebkitTextStroke: `${Math.round(size / 6)}px white`,
      paintOrder: "stroke fill",
      textShadow: "0 6px 14px rgba(0,0,0,0.3)",
      lineHeight: 1,
      textAlign: "center",
    }}
  >
    {texto}
  </div>
);

const Figura: React.FC<{ nombre: string; color: string; size: number }> = ({
  nombre,
  color,
  size,
}) => {
  const comun = {
    fill: color,
    stroke: "white",
    strokeWidth: size / 22,
    style: { overflow: "visible" as const },
  };
  switch (normalizar(nombre)) {
    case "cuadrado":
      return <Rect width={size} height={size} cornerRadius={size / 10} {...comun} />;
    case "triangulo":
      return <Triangle length={size * 1.1} direction="up" cornerRadius={size / 12} {...comun} />;
    case "estrella":
      return <Star points={5} innerRadius={size / 4} outerRadius={size / 1.9} cornerRadius={size / 25} {...comun} />;
    case "corazon":
      return <Heart height={size} {...comun} />;
    case "circulo":
    default:
      return <Circle radius={size / 2} {...comun} />;
  }
};

/** Número, color, figura o palabra que aparece animado sobre el clip. */
export const Educativo: React.FC<{ datos: EducativoTipo; retraso: number }> = ({
  datos,
  retraso,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  const f = frame - retraso;
  const entrada = spring({ frame: f, fps, config: { damping: 8 } });
  const latido = 1 + Math.sin(f / 8) * 0.04;
  const tam = vertical ? 300 : 260;

  let contenido: React.ReactNode = null;

  if (datos.tipo === "numero") {
    const n = Math.max(0, Math.round(Number(datos.valor)));
    const estrellas = Math.min(n, 10);
    contenido = (
      <>
        <div
          style={{
            width: tam,
            height: tam,
            borderRadius: "50%",
            background: COLORES.celeste,
            border: "12px solid white",
            boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Etiqueta texto={String(n)} color={COLORES.amarillo} size={tam * 0.7} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: tam * 2 }}>
          {new Array(estrellas).fill(0).map((_, i) => {
            const e = spring({ frame: f - 12 - i * 8, fps, config: { damping: 10 } });
            return (
              <div key={i} style={{ scale: String(e) }}>
                <svg width={60} height={60} viewBox="-30 -30 60 60" style={{ overflow: "visible" }}>
                  <Star points={5} innerRadius={12} outerRadius={28} fill={PALETA[i % 4]} stroke="white" strokeWidth={4} cornerRadius={3} />
                </svg>
              </div>
            );
          })}
        </div>
      </>
    );
  } else if (datos.tipo === "color") {
    const hex = datos.hex ?? NOMBRES_COLORES[normalizar(datos.valor)] ?? COLORES.rosado;
    contenido = (
      <>
        <div
          style={{
            width: tam,
            height: tam,
            borderRadius: "50%",
            background: hex,
            border: "14px solid white",
            boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
          }}
        />
        <div style={{ marginTop: 12 }}>
          <Etiqueta texto={datos.valor} color={hex === "#FFFFFF" ? COLORES.celeste : hex} size={tam * 0.32} />
        </div>
      </>
    );
  } else if (datos.tipo === "figura") {
    const color = datos.color
      ? NOMBRES_COLORES[normalizar(datos.color)] ?? datos.color
      : COLORES.amarillo;
    contenido = (
      <>
        <div style={{ filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.3))" }}>
          <Figura nombre={datos.valor} color={color} size={tam * 0.9} />
        </div>
        <div style={{ marginTop: 12 }}>
          <Etiqueta texto={datos.valor} color={COLORES.morado} size={tam * 0.3} />
        </div>
      </>
    );
  } else if (datos.tipo === "palabra") {
    const letras = datos.valor.toUpperCase().split("");
    const sizeLetra = Math.min(tam * 0.55, (vertical ? 900 : 760) / Math.max(letras.length, 1));
    contenido = (
      <div
        style={{
          display: "flex",
          background: "white",
          borderRadius: 50,
          padding: "20px 36px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
          border: `10px solid ${COLORES.rosado}`,
        }}
      >
        {letras.map((letra, i) => {
          const e = spring({ frame: f - 8 - i * 6, fps, config: { damping: 9 } });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: FUENTE,
                fontWeight: 700,
                fontSize: sizeLetra,
                lineHeight: 1.1,
                color: PALETA[i % PALETA.length],
                scale: String(e),
                whiteSpace: "pre",
              }}
            >
              {letra}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...(vertical
          ? { left: 0, right: 0, bottom: 360 }
          : { right: 80, bottom: 70 }),
        scale: String(entrada * latido),
        rotate: `${(1 - entrada) * -25}deg`,
      }}
    >
      {contenido}
    </div>
  );
};
