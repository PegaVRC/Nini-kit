import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Destellos } from "./Destellos";
import { COLORES, FUENTE, PALETA } from "./tema";

export const Intro: React.FC<{
  logo: string;
  logoExiste: boolean;
  titulo?: string;
}> = ({ logo, logoExiste, titulo }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const vertical = height > width;

  // Entrada con rebote + zoom suave continuo.
  const rebote = spring({ frame, fps, config: { damping: 7, mass: 0.8 } });
  const zoomSuave = interpolate(frame, [0, durationInFrames], [1, 1.1], {
    easing: Easing.inOut(Easing.quad),
  });
  const saltito =
    -Math.abs(Math.sin((frame - fps) / 9)) * 18 * (frame > fps ? 1 : 0);
  const tituloEntrada = spring({
    frame: frame - Math.round(1.6 * fps),
    fps,
    config: { damping: 12 },
  });
  const tamLogo = vertical ? width * 0.82 : height * 0.62;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, #ffffff 0%, #E9F8FF 35%, ${COLORES.celeste} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 30,
      }}
    >
      <Destellos cantidad={vertical ? 22 : 18} semilla="intro" />
      <div
        style={{
          scale: String(rebote * zoomSuave),
          translate: `0px ${saltito}px`,
        }}
      >
        {logoExiste ? (
          <Img
            src={staticFile(logo)}
            style={{
              width: tamLogo,
              height: tamLogo,
              objectFit: "contain",
              filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.25))",
            }}
          />
        ) : (
          <div
            style={{
              fontFamily: FUENTE,
              fontWeight: 700,
              fontSize: vertical ? 170 : 190,
              lineHeight: 1,
              textAlign: "center",
              WebkitTextStroke: "14px white",
              paintOrder: "stroke fill",
            }}
          >
            {"Nini Kids TV".split("").map((letra, i) => (
              <span key={i} style={{ color: PALETA[i % PALETA.length] }}>
                {letra}
              </span>
            ))}
          </div>
        )}
      </div>
      {titulo ? (
        <div
          style={{
            fontFamily: FUENTE,
            fontWeight: 700,
            fontSize: vertical ? 78 : 70,
            color: "white",
            background: COLORES.morado,
            padding: "14px 44px",
            borderRadius: 999,
            border: "6px solid white",
            opacity: tituloEntrada,
            scale: String(tituloEntrada),
            textAlign: "center",
            maxWidth: "88%",
          }}
        >
          {titulo}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
