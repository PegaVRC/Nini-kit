import type { Formato } from "./tema";

/** Elemento educativo que aparece animado sobre el clip. */
export type Educativo =
  | { tipo: "numero"; valor: number }
  | { tipo: "color"; valor: string; hex?: string }
  | { tipo: "figura"; valor: string; color?: string }
  | { tipo: "palabra"; valor: string };

/** Un clip tal como se escribe en episodios/<nombre>.json */
export type ClipJson = {
  /** Ruta dentro de public/, p. ej. "nini/clips/saludo.mp4" */
  archivo: string;
  /** Texto en pantalla (máximo 3 palabras). */
  texto?: string;
  /** Narración opcional, ruta dentro de public/, p. ej. "audio/narracion/saludo.mp3" */
  narracion?: string;
  educativo?: Educativo;
  /** Segundo del clip desde el que empieza (por defecto 0). */
  inicioSegundos?: number;
  /** Cuántos segundos del clip usar (por defecto, hasta el final). */
  duracionSegundos?: number;
  /** Posición horizontal de Nini en el clip, de 0 (izquierda) a 100 (derecha). Por defecto 50. Se usa al recortar a vertical. */
  encuadre?: number;
  /** Acercamiento del clip (1 = normal, 1.2 = 20 % más cerca). Útil para sacar del cuadro letreros que traiga el clip. Solo se aplica en el formato horizontal. Por defecto 1. */
  zoom?: number;
  /** Volumen del audio propio del clip, de 0 a 1. Por defecto 0 (silenciado). */
  volumenClip?: number;
};

/** Contenido completo de episodios/<nombre>.json */
export type EpisodioJson = {
  titulo?: string;
  musica?: string;
  /** Volumen normal de la música (0 a 1). Por defecto 0.18. */
  musicaVolumen?: number;
  /** Volumen de la música mientras hay narración. Por defecto 0.05. */
  musicaVolumenNarracion?: number;
  /** Duración de los fundidos entre escenas. Por defecto 0.5 s. */
  transicionSegundos?: number;
  logo?: string;
  cierre?: {
    imagen?: string;
    texto?: string;
    invitacion?: string;
  };
  clips: ClipJson[];
};

/** Props que recibe la composición: el JSON del episodio + metadatos calculados. */
export type EpisodioProps = {
  slug: string;
  formato: Formato;
  episodio: EpisodioJson;
  resuelto?: EpisodioResuelto;
};

export type ClipResuelto = ClipJson & {
  existe: boolean;
  duracionFrames: number;
  inicioFrames: number;
  anchoFuente: number;
  altoFuente: number;
  narracionExiste: boolean;
  narracionFrames: number;
  /** Frame (global) en el que empieza la escena del clip. */
  comienzoGlobal: number;
  texto?: string;
};

export type EpisodioResuelto = {
  transicionFrames: number;
  introFrames: number;
  cierreFrames: number;
  clips: ClipResuelto[];
  musicaExiste: boolean;
  logoExiste: boolean;
  imagenCierreExiste: boolean;
  /** Tramos [inicio, fin) en frames globales donde suena narración. */
  tramosNarracion: [number, number][];
};
