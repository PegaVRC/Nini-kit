# Nini Kids TV — sistema de edición

Videos para niños y niñas de 1 a 5 años con Nini, la perrita golden con moño de colores.
Cada episodio se arma **editando solo un archivo JSON**. El sistema se encarga de la intro, las transiciones, los textos, la música y el cierre, y exporta en dos formatos:

| Formato | Tamaño | Archivo de salida |
| --- | --- | --- |
| Horizontal 16:9 (YouTube) | 1920x1080 | `out/<nombre>-16x9.mp4` |
| Vertical 9:16 (Shorts, Reels, TikTok) | 1080x1920 | `out/<nombre>-9x16.mp4` |

> Nini **nunca** se dibuja con código: siempre se usan los clips e imágenes generados con IA que están en `public/nini/`.

## Estructura de cada video

1. **Intro (4 s):** `public/nini/imagenes/logo.png` con zoom suave, destellos y rebote.
2. **Episodio:** los clips en el orden del JSON, unidos con fundidos suaves.
   Cada clip puede llevar un texto en pantalla, una narración y un elemento educativo.
3. **Cierre (5 s):** imagen de Nini, "¡Chao, amiguitos!" y un botón de "¡Suscríbete!".
4. **Audio:** música de fondo baja, que baja todavía más mientras hay narración.

## Dónde van los archivos

Todo va dentro de `videos/public/`:

```
public/
├── nini/
│   ├── clips/          ← clips de video de Nini (.mp4)
│   └── imagenes/
│       ├── logo.png    ← logo para la intro
│       └── nini.png    ← imagen de Nini para el cierre
├── audio/
│   ├── musica/         ← música de fondo (.mp3)
│   └── narracion/      ← narraciones (.mp3), una por clip
└── fonts/              ← letra Fredoka (no tocar)
```

En el JSON, las rutas se escriben **sin** `public/` al principio, por ejemplo `"nini/clips/saludo.mp4"`.

## Cómo armar un episodio nuevo

1. Copia tus clips a `public/nini/clips/` y tus audios a `public/audio/`.
2. Copia `episodios/ejemplo.json` con un nombre nuevo, por ejemplo `episodios/colores.json`.
3. Edita ese JSON (los campos se explican abajo).
4. Renderiza los dos formatos:

   ```bash
   cd videos
   npm run episodio -- colores
   ```

   Los videos quedan en `out/colores-16x9.mp4` y `out/colores-9x16.mp4`.

Para ver el episodio antes de renderizarlo, ejecuta `npm run dev` y abre la carpeta **Nini-Kids-TV**: cada JSON aparece solo como `colores-horizontal` y `colores-vertical`.

### Ejemplo completo

```json
{
  "titulo": "Los colores",
  "musica": "audio/musica/fondo.mp3",
  "clips": [
    {
      "archivo": "nini/clips/saludo.mp4",
      "texto": "¡Hola, amiguitos!",
      "narracion": "audio/narracion/saludo.mp3"
    },
    {
      "archivo": "nini/clips/pelota-roja.mp4",
      "texto": "Pelota roja",
      "narracion": "audio/narracion/rojo.mp3",
      "educativo": { "tipo": "color", "valor": "rojo" },
      "encuadre": 35
    },
    {
      "archivo": "nini/clips/cuenta.mp4",
      "texto": "¡Cuenta conmigo!",
      "educativo": { "tipo": "numero", "valor": 3 },
      "inicioSegundos": 1,
      "duracionSegundos": 6
    },
    {
      "archivo": "nini/clips/estrella.mp4",
      "educativo": { "tipo": "figura", "valor": "estrella", "color": "amarillo" }
    },
    {
      "archivo": "nini/clips/sol.mp4",
      "educativo": { "tipo": "palabra", "valor": "sol" }
    }
  ]
}
```

### Campos del episodio

| Campo | Obligatorio | Qué hace |
| --- | --- | --- |
| `clips` | Sí | Lista de clips, en el orden en que aparecen. |
| `titulo` | No | Se muestra bajo el logo en la intro. |
| `musica` | No | Música de fondo; se repite en bucle si es corta. |
| `musicaVolumen` | No | Volumen normal de la música, de 0 a 1. Por defecto `0.18`. |
| `musicaVolumenNarracion` | No | Volumen de la música mientras hay narración. Por defecto `0.05`. |
| `transicionSegundos` | No | Duración de cada fundido. Por defecto `0.5`. |
| `logo` | No | Otra imagen para la intro. Por defecto `nini/imagenes/logo.png`. |
| `cierre.imagen` | No | Imagen del cierre. Por defecto `nini/imagenes/nini.png`. |
| `cierre.texto` | No | Por defecto "¡Chao, amiguitos!". |
| `cierre.invitacion` | No | Texto del botón. Por defecto "¡Suscríbete!". |

### Campos de cada clip

| Campo | Obligatorio | Qué hace |
| --- | --- | --- |
| `archivo` | Sí | Ruta del clip, por ejemplo `nini/clips/saludo.mp4`. |
| `texto` | No | Texto grande en pantalla, **máximo 3 palabras**. Si hay más, se usan solo las 3 primeras. |
| `narracion` | No | Audio de narración; empieza junto con el clip. |
| `educativo` | No | Número, color, figura o palabra animada (ver abajo). |
| `inicioSegundos` | No | Desde qué segundo del clip empezar. Por defecto `0`. |
| `duracionSegundos` | No | Cuántos segundos del clip usar. Por defecto, hasta el final del clip. |
| `encuadre` | No | Dónde está Nini en el clip, de `0` (izquierda) a `100` (derecha). Por defecto `50`. En el formato vertical, el recorte se centra en ese punto. |
| `volumenClip` | No | Volumen del sonido propio del clip, de 0 a 1. Por defecto `0` (silenciado). |

### Elementos educativos

| Tipo | Ejemplo | Qué muestra |
| --- | --- | --- |
| `numero` | `{ "tipo": "numero", "valor": 3 }` | El número grande y la misma cantidad de estrellitas (hasta 10). |
| `color` | `{ "tipo": "color", "valor": "rojo" }` | Un círculo de ese color con su nombre. |
| `figura` | `{ "tipo": "figura", "valor": "estrella", "color": "amarillo" }` | La figura con su nombre. |
| `palabra` | `{ "tipo": "palabra", "valor": "sol" }` | La palabra, letra por letra. |

- **Colores reconocidos:** rojo, azul, amarillo, verde, naranja, morado, rosado, celeste, blanco, negro, café y gris. Para otro color, agrega `"hex": "#00AA88"`.
- **Figuras:** círculo, cuadrado, triángulo, estrella y corazón.

## Si falta un archivo

El video se renderiza igual, y la consola avisa qué falta:

- **Falta la música o una narración:** se omite.
- **Falta el logo:** la intro muestra "Nini Kids TV" escrito con los colores del logo.
- **Falta la imagen del cierre:** el cierre muestra solo los textos.
- **Falta un clip:** aparece un aviso "Falta el clip" con su ruta, para que lo notes al revisar.

## Duración

La duración total se calcula sola:

```
4 s (intro) + clips + 5 s (cierre) − un fundido por cada unión
```

Por ejemplo, el episodio de ejemplo tiene un clip de 7 s: 4 + 7 + 5 − 2 × 0,5 = **15 s**.

Si una narración es más larga que su clip, se corta al terminar el clip. En ese caso, aumenta `duracionSegundos` o usa un clip más largo.

## Colores y letra

- **Colores del logo:** rosado `#FC69BD`, amarillo `#FEC136`, celeste `#20B9F8` y morado `#B669F1`. Se definen en `src/nini/tema.ts`.
- **Letra:** Fredoka (redondeada, licencia OFL), incluida en `public/fonts/`.

## Código (para quien quiera modificarlo)

| Archivo | Qué contiene |
| --- | --- |
| `src/nini/Episodios.tsx` | Registra automáticamente cada `episodios/*.json` en los dos formatos. |
| `src/nini/calcularEpisodio.ts` | Lee los clips y audios, calcula la duración y detecta los archivos que faltan. |
| `src/nini/Episodio.tsx` | Línea de tiempo: intro → clips con fundidos → cierre, más la música. |
| `src/nini/Intro.tsx`, `ClipEscena.tsx`, `Cierre.tsx` | Las escenas. |
| `src/nini/TextoClip.tsx`, `Educativo.tsx`, `Destellos.tsx`, `MusicaFondo.tsx` | Los elementos animados y la música. |
