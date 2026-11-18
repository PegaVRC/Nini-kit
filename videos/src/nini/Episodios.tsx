import { Composition, Folder } from "remotion";
import { calcularEpisodio } from "./calcularEpisodio";
import { Episodio } from "./Episodio";
import { FORMATOS, FPS, type Formato } from "./tema";
import type { EpisodioJson } from "./tipos";

// Carga automáticamente todos los archivos episodios/*.json.
const contexto = require.context("../../episodios", false, /\.json$/);

const aSlug = (ruta: string) =>
  ruta
    .replace(/^.*\//, "")
    .replace(/\.json$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Registra dos composiciones por episodio: <nombre>-horizontal y <nombre>-vertical. */
export const Episodios: React.FC = () => (
  <Folder name="Nini-Kids-TV">
    {contexto.keys().map((ruta) => {
      const slug = aSlug(ruta);
      const episodio = contexto(ruta) as EpisodioJson;
      return (Object.keys(FORMATOS) as Formato[]).map((formato) => (
        <Composition
          key={`${slug}-${formato}`}
          id={`${slug}-${formato}`}
          component={Episodio}
          fps={FPS}
          width={FORMATOS[formato].width}
          height={FORMATOS[formato].height}
          durationInFrames={FPS}
          defaultProps={{ slug, formato, episodio }}
          calculateMetadata={calcularEpisodio}
        />
      ));
    })}
  </Folder>
);
