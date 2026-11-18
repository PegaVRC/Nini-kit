import type { CalculateMetadataFunction } from "remotion";
import { duracionAudio, existeArchivo, infoVideo } from "./medios";
import {
  DURACION_CIERRE_SEG,
  DURACION_INTRO_SEG,
  FORMATOS,
  FPS,
  IMAGEN_CIERRE_POR_DEFECTO,
  LOGO_POR_DEFECTO,
  SONIDO_INTRO_POR_DEFECTO,
} from "./tema";
import type { ClipResuelto, EpisodioProps } from "./tipos";

const DURACION_CLIP_FALTANTE_SEG = 5;
// La narración empieza un poquito después de que termina el fundido.
export const RETRASO_NARRACION_FRAMES = 6;

const limitarPalabras = (texto: string | undefined, slug: string, i: number) => {
  if (!texto) {
    return undefined;
  }
  const palabras = texto.trim().split(/\s+/);
  if (palabras.length > 3) {
    console.warn(
      `[${slug}] El texto del clip ${i + 1} tiene ${palabras.length} palabras; se muestran solo las 3 primeras.`,
    );
  }
  return palabras.slice(0, 3).join(" ");
};

export const calcularEpisodio: CalculateMetadataFunction<
  EpisodioProps
> = async ({ props }) => {
  const { episodio, slug, formato } = props;
  if (!episodio.clips || episodio.clips.length === 0) {
    throw new Error(
      `El episodio "${slug}" no tiene clips. Agrega al menos uno en episodios/${slug}.json`,
    );
  }

  const transicionFrames = Math.round(
    (episodio.transicionSegundos ?? 0.5) * FPS,
  );
  const introFrames = DURACION_INTRO_SEG * FPS;
  const cierreFrames = DURACION_CIERRE_SEG * FPS;

  const clips: ClipResuelto[] = [];
  const tramosNarracion: [number, number][] = [];
  // Inicio de la escena siguiente en el TransitionSeries.
  let comienzo = introFrames - transicionFrames;

  for (const [i, clip] of episodio.clips.entries()) {
    const info = await infoVideo(clip.archivo);
    if (!info) {
      console.warn(
        `[${slug}] Falta el clip public/${clip.archivo}: se muestra un aviso en su lugar.`,
      );
    }
    const inicioSeg = clip.inicioSegundos ?? 0;
    const disponibleSeg = info
      ? Math.max(0.5, info.duracion - inicioSeg)
      : Infinity;
    const usadoSeg = Math.min(
      clip.duracionSegundos ??
        (info ? disponibleSeg : DURACION_CLIP_FALTANTE_SEG),
      disponibleSeg,
    );
    const duracionFrames = Math.max(
      transicionFrames * 2 + 1,
      Math.floor(usadoSeg * FPS),
    );

    const narracionSeg = await duracionAudio(clip.narracion);
    if (clip.narracion && narracionSeg === null) {
      console.warn(
        `[${slug}] Falta la narración public/${clip.narracion}: el clip se renderiza sin ella.`,
      );
    }
    const narracionFrames = narracionSeg
      ? Math.min(
          Math.ceil(narracionSeg * FPS),
          duracionFrames - RETRASO_NARRACION_FRAMES,
        )
      : 0;
    if (narracionFrames > 0) {
      const ini = comienzo + RETRASO_NARRACION_FRAMES;
      tramosNarracion.push([ini, ini + narracionFrames]);
    }

    clips.push({
      ...clip,
      texto: limitarPalabras(clip.texto, slug, i),
      existe: Boolean(info),
      duracionFrames,
      inicioFrames: Math.round(inicioSeg * FPS),
      anchoFuente: info?.ancho ?? 1920,
      altoFuente: info?.alto ?? 1080,
      narracionExiste: narracionFrames > 0,
      narracionFrames,
      comienzoGlobal: comienzo,
    });
    comienzo += duracionFrames - transicionFrames;
  }

  const total = comienzo + cierreFrames;

  const [musicaExiste, logoExiste, imagenCierreExiste, sonidoIntroExiste] =
    await Promise.all([
      existeArchivo(episodio.musica),
      existeArchivo(episodio.logo ?? LOGO_POR_DEFECTO),
      existeArchivo(episodio.cierre?.imagen ?? IMAGEN_CIERRE_POR_DEFECTO),
      existeArchivo(episodio.sonidoIntro ?? SONIDO_INTRO_POR_DEFECTO),
    ]);
  if (sonidoIntroExiste) {
    // La música queda baja mientras suena la melodía de la intro.
    tramosNarracion.unshift([0, introFrames]);
  }
  if (episodio.musica && !musicaExiste) {
    console.warn(`[${slug}] Falta la música public/${episodio.musica}.`);
  }

  const { width, height, sufijo } = FORMATOS[formato];
  return {
    durationInFrames: total,
    fps: FPS,
    width,
    height,
    defaultOutName: `${slug}-${sufijo}`,
    props: {
      ...props,
      resuelto: {
        transicionFrames,
        introFrames,
        cierreFrames,
        clips,
        musicaExiste,
        logoExiste,
        sonidoIntroExiste,
        imagenCierreExiste,
        tramosNarracion,
      },
    },
  };
};
