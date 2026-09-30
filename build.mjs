/**
 * Offline build used in environments without Vite.
 * Bundles src/main.tsx with esbuild and emits:
 *   dist/index.html          – multi-file build (assets/app.js, assets/app.css)
 *   dist/standalone.html     – everything inlined into one file
 *
 * With network access, prefer the normal Vite workflow: `npm run dev` / `npm run build`.
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const globalRoot = execSync("npm root -g").toString().trim();

let esbuild;
try {
  esbuild = require("esbuild");
} catch {
  esbuild = require(path.join(globalRoot, "tsx/node_modules/esbuild"));
}

const dev = process.argv.includes("--dev");
const out = "dist";
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "assets"), { recursive: true });

await esbuild.build({
  entryPoints: { app: "src/main.tsx" },
  bundle: true,
  outdir: path.join(out, "assets"),
  format: "esm",
  target: ["es2020", "chrome100", "safari15", "firefox100"],
  jsx: "automatic",
  minify: !dev,
  sourcemap: dev,
  define: { "process.env.NODE_ENV": JSON.stringify(dev ? "development" : "production") },
  nodePaths: [path.resolve("node_modules"), globalRoot],
  loader: { ".svg": "dataurl", ".woff2": "file" },
  logLevel: "info",
});

const html = fs.readFileSync("index.html", "utf8");
const favicon = fs.readFileSync("public/favicon.svg", "utf8");
const faviconData = `data:image/svg+xml,${encodeURIComponent(favicon)}`;

const multi = html
  .replace('href="/favicon.svg"', 'href="./favicon.svg"')
  .replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<link rel="stylesheet" href="./assets/app.css" />\n    <script type="module" src="./assets/app.js"></script>'
  );
fs.writeFileSync(path.join(out, "index.html"), multi);
fs.copyFileSync("public/favicon.svg", path.join(out, "favicon.svg"));

const js = fs.readFileSync(path.join(out, "assets/app.js"), "utf8").replace(/<\/script/gi, "<\\/script");
const css = fs.readFileSync(path.join(out, "assets/app.css"), "utf8");
const single = html
  .replace('href="/favicon.svg"', `href="${faviconData}"`)
  .replace("</head>", `  <style>\n${css}\n</style>\n  </head>`)
  .replace(
    '<script type="module" src="/src/main.tsx"></script>',
    `<script type="module">\n${js}\n</script>`
  );
fs.writeFileSync(path.join(out, "standalone.html"), single);

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(1) + " KB";
console.log("app.js", kb(path.join(out, "assets/app.js")), "· app.css", kb(path.join(out, "assets/app.css")));
console.log("standalone.html", kb(path.join(out, "standalone.html")));
