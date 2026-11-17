import { Audio } from "@remotion/media";
import { interpolate, staticFile, useVideoConfig } from "remotion";

const RAMPA = 8; // frames para bajar/subir la música

/**
 * Música de fondo en bucle con volumen bajo, que baja aún más
 * durante los tramos de narración y se desvanece al final.
 */
export const MusicaFondo: React.FC<{
  src: string;
  volumen: number;
  volumenNarracion: number;
  tramosNarracion: [number, number][];
}> = ({ src, volumen, volumenNarracion, tramosNarracion }) => {
  const { durationInFrames, fps } = useVideoConfig();

  const volumenEn = (f: number) => {
    let v = volumen;
    for (const [ini, fin] of tramosNarracion) {
      const factor = interpolate(
        f,
        [ini - RAMPA, ini, fin, fin + RAMPA],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      v = Math.min(v, volumen - (volumen - volumenNarracion) * factor);
    }
    const fades = interpolate(
      f,
      [0, fps * 0.5, durationInFrames - fps * 1.2, durationInFrames],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return v * fades;
  };

  return (
    <Audio
      name="Música de fondo"
      src={staticFile(src)}
      loop
      loopVolumeCurveBehavior="extend"
      volume={volumenEn}
    />
  );
};
