# Guiones de Nini Kids TV

| Episodio | Aprendizaje | JSON |
| --- | --- | --- |
| [Nini y los globos](globos.md) | Colores: rojo, azul y amarillo; contar hasta 3 | `episodios/globos.json` |
| [Nini cuenta patitos](patitos.md) | Números del 1 al 3; la palabra «pato» | `episodios/patitos.json` |
| [Nini y la lluvia](lluvia.md) | El clima; la palabra «agua»; el color amarillo | `episodios/lluvia.json` |
| [Nini ordena sus juguetes](juguetes.md) | Figuras: círculo, cuadrado y estrella; el hábito de ordenar | `episodios/juguetes.json` |
| [Nini se lava los dientes](dientes.md) | Hábitos de higiene; las palabras «agua» y «limpio» | `episodios/dientes.json` |

## Cómo producir un episodio

1. **Clip:** genera en Gemini un video de 10 s con la indicación del guion, adjuntando `public/nini/imagenes/nini.png` como referencia. Guárdalo como `public/nini/clips/<nombre>.mp4`.
2. **Ajustar los cortes:** el JSON asume escenas de 2,5 s. Si los cortes de Gemini caen en otros segundos, ajusta `inicioSegundos` y `duracionSegundos`, o pídele a Claude que los detecte. Si Nini queda a un lado, ajusta `encuadre`.
3. **Narraciones:** graba o genera con voz IA las 4 frases del guion y guárdalas como `public/audio/narracion/<nombre>-1.mp3` a `<nombre>-4.mp3`.
4. **Música (opcional):** `public/audio/musica/fondo.mp3`, compartida por todos los episodios.
5. **Render:** `npm run episodio -- <nombre>`.

Si falta algún archivo, el video se renderiza igual: la consola avisa qué falta y, si falta el clip, aparece el aviso «Falta el clip».
