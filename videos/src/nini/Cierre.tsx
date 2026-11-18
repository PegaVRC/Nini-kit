import {
  AbsoluteFill,
  Img,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Destellos } from "./Destellos";
import { COLORES, FUENTE, PALETA } from "./tema";

const Campana: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill="white"
      d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z"
    />
  </svg>
);

export const Cierre: React.FC<{
  imagen: string;
  imagenExiste: boolean;
  texto: string;
  invitacion: string;
}> = ({ imagen, imagenExiste, texto, invitacion }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;

  const entradaImagen = spring({ frame, fps, config: { damping: 9 } });
  const entradaTexto = spring({ frame: frame - 10, fps, config: { damping: 10 } });
  const entradaBoton = spring({ frame: frame - 28, fps, config: { damping: 8 } });
  const pulso = 1 + Math.max(0, Math.sin(frame / 6)) * 0.08 * (frame > 40 ? 1 : 0);
  const campana = Math.sin(frame / 2.5) * 18 * (frame > 40 ? 1 : 0);
  const saludo = Math.sin(frame / 10) * 4;

  const altoImagen = vertical ? height * 0.5 : height * 0.82;

  const imagenNini = imagenExiste ? (
    <div
      style={{
        height: altoImagen,
        aspectRatio: "941 / 1672",
        borderRadius: 60,
        overflow: "hidden",
        border: "14px solid white",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        translate: `0px ${(1 - entradaImagen) * 600}px`,
        rotate: `${saludo}deg`,
        flexShrink: 0,
      }}
    >
      <Img
        src={staticFile(imagen)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  ) : null;

  const textos = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: vertical ? 40 : 50,
      }}
    >
      <div
        style={{
          fontFamily: FUENTE,
          fontWeight: 700,
          fontSize: vertical ? 120 : 130,
          lineHeight: 1.05,
          textAlign: "center",
          WebkitTextStroke: "16px white",
          paintOrder: "stroke fill",
          textShadow: "0 10px 20px rgba(0,0,0,0.25)",
          scale: String(entradaTexto),
          maxWidth: vertical ? width * 0.9 : width * 0.5,
        }}
      >
        {texto.split(" ").map((palabra, i) => (
          <span key={i} style={{ color: PALETA[(i + 2) % PALETA.length] }}>
            {palabra}{" "}
          </span>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: "#FF2D2D",
          color: "white",
          fontFamily: FUENTE,
          fontWeight: 700,
          fontSize: vertical ? 70 : 66,
          padding: "22px 50px",
          borderRadius: 999,
          border: "8px solid white",
          boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
          scale: String(entradaBoton * pulso),
        }}
      >
        <div style={{ rotate: `${campana}deg`, display: "flex" }}>
          <Campana size={vertical ? 76 : 70} />
        </div>
        {invitacion}
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${COLORES.rosado} 0%, ${COLORES.morado} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Destellos cantidad={vertical ? 20 : 16} semilla="cierre" />
      <div
        style={{
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: vertical ? 50 : 80,
        }}
      >
        {imagenNini}
        {textos}
      </div>
    </AbsoluteFill>
  );
};
