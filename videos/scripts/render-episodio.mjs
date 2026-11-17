/* global process, console */
// Uso: npm run episodio -- <nombre>
// Renderiza episodios/<nombre>.json en 16:9 y 9:16 dentro de out/.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const nombre = process.argv[2];
if (!nombre) {
  console.error("Indica el nombre del episodio. Ejemplo: npm run episodio -- ejemplo");
  process.exit(1);
}
if (!existsSync(`episodios/${nombre}.json`)) {
  console.error(`No existe episodios/${nombre}.json`);
  process.exit(1);
}

const slug = nombre
  .toLowerCase()
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const formatos = [
  ["horizontal", "16x9"],
  ["vertical", "9x16"],
];

for (const [formato, sufijo] of formatos) {
  const salida = `out/${slug}-${sufijo}.mp4`;
  console.log(`\n▶ Renderizando ${salida} ...`);
  const r = spawnSync(
    "npx",
    ["remotion", "render", `${slug}-${formato}`, salida],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}
console.log("\n✔ Listo. Videos en la carpeta out/");
