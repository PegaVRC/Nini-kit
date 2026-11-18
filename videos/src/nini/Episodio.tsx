import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import { AbsoluteFill } from "remotion";
import { Cierre } from "./Cierre";
import { ClipEscena } from "./ClipEscena";
import { Intro } from "./Intro";
import { MusicaFondo } from "./MusicaFondo";
import { IMAGEN_CIERRE_POR_DEFECTO, LOGO_POR_DEFECTO } from "./tema";
import type { EpisodioProps } from "./tipos";

export const Episodio: React.FC<EpisodioProps> = ({ episodio, resuelto }) => {
  if (!resuelto) {
    return null;
  }
  const fundido = () => (
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: resuelto.transicionFrames })}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <TransitionSeries name="Episodio">
        <TransitionSeries.Sequence name="Intro" durationInFrames={resuelto.introFrames}>
          <Intro
            logo={episodio.logo ?? LOGO_POR_DEFECTO}
            logoExiste={resuelto.logoExiste}
            titulo={episodio.titulo}
          />
        </TransitionSeries.Sequence>
        {resuelto.clips.map((clip, i) => (
          <Fragment key={i}>
            {fundido()}
            <TransitionSeries.Sequence
              name={`Clip ${i + 1}${clip.texto ? `: ${clip.texto}` : ""}`}
              durationInFrames={clip.duracionFrames}
            >
              <ClipEscena clip={clip} transicionFrames={resuelto.transicionFrames} />
            </TransitionSeries.Sequence>
          </Fragment>
        ))}
        {fundido()}
        <TransitionSeries.Sequence name="Cierre" durationInFrames={resuelto.cierreFrames}>
          <Cierre
            imagen={episodio.cierre?.imagen ?? IMAGEN_CIERRE_POR_DEFECTO}
            imagenExiste={resuelto.imagenCierreExiste}
            texto={episodio.cierre?.texto ?? "¡Chao, amiguitos!"}
            invitacion={episodio.cierre?.invitacion ?? "¡Suscríbete!"}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {episodio.musica && resuelto.musicaExiste ? (
        <MusicaFondo
          src={episodio.musica}
          volumen={episodio.musicaVolumen ?? 0.18}
          volumenNarracion={episodio.musicaVolumenNarracion ?? 0.05}
          tramosNarracion={resuelto.tramosNarracion}
        />
      ) : null}
    </AbsoluteFill>
  );
};
