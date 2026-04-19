import basicSsl from "@vitejs/plugin-basic-ssl";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Если в `certs/` лежат файлы от mkcert (dev.pem / dev-key.pem), Safari на iPhone
 * не ругается — после одноразовой установки корневого CA mkcert на телефон.
 * Иначе подключается basicSsl (самоподписанный сертификат → предупреждение в браузере).
 */
function loadMkcertHttps():
  | { key: Buffer; cert: Buffer }
  | undefined {
  const certFile = path.resolve(__dirname, "certs/dev.pem");
  const keyFile = path.resolve(__dirname, "certs/dev-key.pem");
  if (!fs.existsSync(certFile) || !fs.existsSync(keyFile)) return undefined;
  return {
    cert: fs.readFileSync(certFile),
    key: fs.readFileSync(keyFile),
  };
}

const mkcertHttps = loadMkcertHttps();
const useMkcert = Boolean(mkcertHttps);

/** GitHub Pages (репозиторий `22`): приложение живёт в подпапке сайта. */
export default defineConfig({
  base: "/22/",
  plugins: [react(), ...(useMkcert ? [] : [basicSsl()])],
  resolve: {
    alias: {},
  },
  server: {
    /** Удобно открыть с телефона в одной Wi‑Fi сети при разработке. */
    host: true,
    port: 5173,
    ...(mkcertHttps ? { https: mkcertHttps } : {}),
  },
  preview: {
    host: true,
    port: 4173,
    ...(mkcertHttps ? { https: mkcertHttps } : {}),
  },
});
