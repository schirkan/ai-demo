## Kurz & Praktisch — Hinweise für KI-Coding-Agenten

Ziel: schnell produktiv werden im `ai-demo` Next.js-Repo (TypeScript, App Router). Die folgenden Punkte fassen die wichtigsten Architekturentscheidungen, Entwickler-Workflows und repository-spezifischen Konventionen zusammen.

- Projekt-Typ: Next.js (App Router), TypeScript, React 19. UI mit CSS Modules. Hauptcode in `src/app` und wiederverwendbare UI in `src/components`.

- Wichtige Start-/Build-Kommandos (siehe `package.json`):
  - Entwicklung: `npm run dev` (führt `next dev --turbopack` aus)
  - Build: `npm run build` (führt `next build` und Kopieren von `public` nach `.next/standalone` aus)
  - Hinweis: `start` in package.json ist `node server.js`; das Repo enthält kein `server.js`. Für Produktion typischerweise `next start` oder eine eigene `server.js` hinzufügen.

- Environment-Variablen (kritisch für Features):
  - AZURE_RESOURCE_NAME, AZURE_API_KEY — für Azure OpenAI
  - AZURE_RESOURCE_NAME_DALL_E_3, AZURE_API_KEY_DALL_E_3 — für DALL·E 3 via Azure
  - IMGBB_API_KEY — wird in `src/app/api/tools.ts` für Bild-Uploads verwendet

- Architektur & Integrationspunkte
  - AI SDK: Das Projekt verwendet `ai`, `@ai-sdk/azure` und `@ai-sdk/react`. Schau `src/app/api/tools.ts` für ein Beispiel eines Tools (`generateImageTool`) und wie Azure-Clients konfiguriert werden.
  - API: Next.js App Router API-Routen unter `src/app/api`. Beispiel: `src/app/api/socket/route.ts` startet (bei GET) einen Socket.IO-Server, der auf Port 8081 hört und den Pfad `/api/buzzer-socket` benutzt.
  - WebSocket/Buzzer: Die Moderator-Ansicht `src/app/buzzer/page.tsx` erzeugt eine Raum-ID, ruft `/api/socket` (initialisiert den Socket-Server) und verbindet dann per Socket.IO zu `:8081` mit `path: "/api/buzzer-socket"`.

- Projekt-spezifische Konventionen & Patterns
  - Komponenten mit client-side code nutzen "use client"; viele UI-Komponenten sind als CSS-Module (`*.module.css`).
  - Markdown-Dateien werden per `raw-loader`/asset/source geladen (siehe `next.config.ts`), deshalb `.md`-Dateien unter `src/app/api/custom-gpt` werden als Inhalte (z. B. prompt-Definitionen) direkt importiert.
  - Kleine In-Memory-Services: z. B. der Buzzer-Socket speichert Räume/Spieler im Prozess (kein DB). Änderungen daran müssen bedacht werden (nicht persistente Daten bei Deployments mit mehreren Instanzen).
  - Utilities und Hooks liegen unter `src/utils` und `src/hooks`. Schau `useChatMessagesPersistence.tsx` für client-seitige Persistenzmuster.

- Editing & Tests: Es gibt keine formalen Tests im Repo. Linting mit `npm run lint` (ESLint) ist verfügbar. Achte auf TypeScript-Typen (`tsconfig.json`) beim Ändern von API-Routen.

- Taktische Hinweise für PRs/Änderungen
  - Wenn du neue API-Routen erstellst, benutze die App Router-Konvention (`src/app/api/<name>/route.ts`) und exportiere GET/POST-Funktionen im Next.js-Format.
  - Beim Ändern des Socket-Servers beachte: `src/app/api/socket/route.ts` startet einen eigenständigen HTTP-Server auf Port 8081. Lokales Entwickeln erfordert freien Port oder Anpassung der Portwahl.
  - Für Änderungen an Azure-Integrationen: benutze `createAzure` wie in `src/app/api/tools.ts` und konsumiere die `process.env`-Variablen; vermeide harte Kodierungen von Keys.

- Konkrete Beispiele, die du referenzieren kannst
  - Buzzer-Moderator UI: `src/app/buzzer/page.tsx` — zeigt WebSocket-Handshake (`fetch('/api/socket')`) und Socket.IO-Client-Aufbau `io(':8081', { path: '/api/buzzer-socket' })`.
  - Socket-Server: `src/app/api/socket/route.ts` — complete Socket.IO lifecycle (join, buzz, input, leave, disconnect) und room-state broadcast.
  - Image tool: `src/app/api/tools.ts` — `generateImageTool` nutzt `experimental_generateImage`, lädt Base64 zu imgbb und returned eine URL.

- Was KI-Agenten vermeiden sollten
  - Secrets in Code einfügen (API-Keys) — benutze `process.env` und dokumentiere neue env-vars in README.
  - Annahmen über Persistenz: viele Features sind in-memory; wenn du persistence einführst, dokumentiere das und berücksichtige Multi-instance-Deployment.

Wenn etwas unklar ist oder du eine spezifische Aufgabe (z. B. neuen API-Endpoint, Änderung am Buzzer-Protokoll oder Hinzufügen eines Azure-Tool-Handlers) implementiert haben möchtest, sag kurz welches Ziel und ich passe die Instruktion/PR-Vorlage entsprechend an.
