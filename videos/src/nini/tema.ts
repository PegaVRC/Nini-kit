import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Colores tomados del logo de Nini (letrero "Nini").
export const COLORES = {
  rosado: "#FC69BD",
  amarillo: "#FEC136",
  celeste: "#20B9F8",
  morado: "#B669F1",
} as const;

export const PALETA = [
  COLORES.rosado,
  COLORES.amarillo,
  COLORES.celeste,
  COLORES.morado,
];

// Letra grande y redondeada: Fredoka (licencia OFL), incluida en public/fonts
// para que el render funcione también sin conexión a Google Fonts.
export const FUENTE = "Fredoka";
loadFont({ family: FUENTE, url: staticFile("fonts/Fredoka-SemiBold.ttf"), weight: "600" });
loadFont({ family: FUENTE, url: staticFile("fonts/Fredoka-Bold.ttf"), weight: "700" });

export const FPS = 30;

export const DURACION_INTRO_SEG = 4;
export const DURACION_CIERRE_SEG = 5;

// Rutas por defecto, relativas a la carpeta public/.
export const LOGO_POR_DEFECTO = "nini/imagenes/logo.png";
export const IMAGEN_CIERRE_POR_DEFECTO = "nini/imagenes/nini.png";

export const FORMATOS = {
  horizontal: { width: 1920, height: 1080, sufijo: "16x9" },
  vertical: { width: 1080, height: 1920, sufijo: "9x16" },
} as const;

export type Formato = keyof typeof FORMATOS;
