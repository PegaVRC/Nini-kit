import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { staticFile } from "remotion";

/** Comprueba si un archivo de public/ existe sin fallar el render. */
export const existeArchivo = async (ruta: string | undefined) => {
  if (!ruta) {
    return false;
  }
  try {
    const res = await fetch(staticFile(ruta), { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
};

export type InfoVideo = { duracion: number; ancho: number; alto: number };

export const infoVideo = async (ruta: string): Promise<InfoVideo | null> => {
  if (!(await existeArchivo(ruta))) {
    return null;
  }
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(staticFile(ruta)),
  });
  try {
    const duracion = await input.computeDuration();
    const pista = await input.getPrimaryVideoTrack();
    if (!pista) {
      return null;
    }
    return {
      duracion,
      ancho: await pista.getDisplayWidth(),
      alto: await pista.getDisplayHeight(),
    };
  } catch (e) {
    console.warn(`No se pudo leer el clip ${ruta}:`, e);
    return null;
  } finally {
    input.dispose();
  }
};

export const duracionAudio = async (
  ruta: string | undefined,
): Promise<number | null> => {
  if (!ruta || !(await existeArchivo(ruta))) {
    return null;
  }
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(staticFile(ruta)),
  });
  try {
    return await input.computeDuration();
  } catch (e) {
    console.warn(`No se pudo leer el audio ${ruta}:`, e);
    return null;
  } finally {
    input.dispose();
  }
};
