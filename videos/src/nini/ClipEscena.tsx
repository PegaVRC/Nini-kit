import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { RETRASO_NARRACION_FRAMES } from "./calcularEpisodio";
import { Educativo } from "./Educativo";
import { COLORES, FUENTE } from "./tema";
import { TextoClip } from "./TextoClip";
import type { ClipResuelto } from "./tipos";

/** Aviso que reemplaza a un clip que no se encontró (no dibuja a Nini). */
const ClipFaltante: React.FC<{ archivo: string }> = ({ archivo }) => (
  <AbsoluteFill
    style={{
      background: `repeating-linear-gradient(45deg, ${COLORES.celeste}, ${COLORES.celeste} 60px, #5fd0ff 60px, #5fd0ff 120px)`,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        fontFamily: FUENTE,
        fontWeight: 600,
        fontSize: 54,
        color: "#333",
        background: "white",
        borderRadius: 40,
        padding: "30px 50px",
        textAlign: "center",
        maxWidth: "80%",
      }}
    >
      Falta el clip
      <div style={{ fontSize: 36, color: COLORES.morado, wordBreak: "break-all" }}>
        public/{archivo}
      </div>
    </div>
  </AbsoluteFill>
);

/**
 * Coloca el video cubriendo todo el cuadro. Si el clip es más ancho que el
 * formato (p. ej. clip 16:9 en formato 9:16), se recorta centrado en Nini
 * usando "encuadre" (0 = izquierda, 50 = centro, 100 = derecha).
 * "zoom" acerca la imagen desde el centro (solo en el formato horizontal).
 */
const VideoEncuadrado: React.FC<{ clip: ClipResuelto }> = ({ clip }) => {
  const { width: W, height: H } = useVideoConfig();
  const aspectoFuente = clip.anchoFuente / clip.altoFuente;
  const aspectoCuadro = W / H;
  const enfoque = Math.min(100, Math.max(0, clip.encuadre ?? 50)) / 100;
  const comun = {
    src: staticFile(clip.archivo),
    trimBefore: clip.inicioFrames,
    objectFit: "fill" as const,
  };

  if (aspectoFuente >= aspectoCuadro * 0.8) {
    // Cubrir el cuadro, recortando a los lados según el encuadre.
    // En vertical el recorte ya acerca la imagen, así que el zoom solo se usa en horizontal.
    const zoom = W >= H ? Math.max(1, clip.zoom ?? 1) : 1;
    const alto = Math.max(H, W / aspectoFuente) * zoom;
    const ancho = alto * aspectoFuente;
    const izquierda = Math.min(0, Math.max(W - ancho, W / 2 - enfoque * ancho));
    return (
      <Video
        {...comun}
        volume={clip.volumenClip ?? 0}
        style={{ position: "absolute", width: ancho, height: alto, left: izquierda, top: (H - alto) / 2 }}
      />
    );
  }

  // Clip mucho más angosto (vertical en formato horizontal): fondo difuminado + clip completo.
  const anchoClip = H * aspectoFuente;
  const anchoFondo = W;
  const altoFondo = W / aspectoFuente;
  return (
    <>
      <AbsoluteFill style={{ filter: "blur(40px) brightness(0.9)", scale: "1.15" }}>
        <Video
          {...comun}
          muted
          style={{ position: "absolute", width: anchoFondo, height: altoFondo, top: (H - altoFondo) / 2 }}
        />
      </AbsoluteFill>
      <Video
        {...comun}
        volume={clip.volumenClip ?? 0}
        style={{ position: "absolute", width: anchoClip, height: H, left: (W - anchoClip) / 2 }}
      />
    </>
  );
};

export const ClipEscena: React.FC<{
  clip: ClipResuelto;
  transicionFrames: number;
}> = ({ clip, transicionFrames }) => {
  // Los textos aparecen cuando el fundido ya va por la mitad.
  const retraso = Math.round(transicionFrames / 2) + 4;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {clip.existe ? <VideoEncuadrado clip={clip} /> : <ClipFaltante archivo={clip.archivo} />}
      {clip.texto ? <TextoClip texto={clip.texto} retraso={retraso} /> : null}
      {clip.educativo ? <Educativo datos={clip.educativo} retraso={retraso + 12} /> : null}
      {clip.narracion && clip.narracionExiste ? (
        <Sequence from={RETRASO_NARRACION_FRAMES} durationInFrames={clip.narracionFrames} name="Narración">
          <Audio src={staticFile(clip.narracion)} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
