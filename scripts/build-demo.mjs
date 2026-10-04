// Static demo build: no server, API calls are mocked in the browser (lib/demo.ts).
import { execSync } from "node:child_process";
import { renameSync, existsSync, rmSync, cpSync, writeFileSync } from "node:fs";

const aside = ".api-aside";
if (existsSync(aside)) throw new Error("Leftover .api-aside: restore app/api first");
rmSync("out", { recursive: true, force: true });
renameSync("app/api", aside);
try {
  execSync("npx next build", { stdio: "inherit", env: { ...process.env, DEMO: "1", NEXT_PUBLIC_DEMO: "1" } });
} finally {
  renameSync(aside, "app/api");
}
cpSync("out-build", "out", { recursive: true });
rmSync("out-build", { recursive: true, force: true });
rmSync("out/media/story.webm", { force: true });
writeFileSync("out/index.html", '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=es/"><title>Fogo de Chão</title><a href="es/">Entrar / Enter</a>');
writeFileSync("out/LEER-ME.txt", "Fogo de Chao - demo local\n\n1) Abre una terminal en esta carpeta\n2) npx serve .     (o: python3 -m http.server 3000)\n3) Abre http://localhost:3000/es/\n\nNo abras index.html con doble clic: necesita un servidor local.\nEl asistente de IA aqui es una demo con respuestas de ejemplo.\n");
console.log("Demo ready in ./out");
