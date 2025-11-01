Task-Liste — Migration Next.js → TanStack Start (idiomatisch, PoC → vollständige Migration)

Ziel
---
Pragmatische, schrittweise Migration der Anwendung von Next.js (App Router) zu TanStack Start unter Beibehaltung der Funktionalität. Zuerst PoC (Root + Home), dann iterative Migration aller Seiten, API-Routen und CI/Deployment-Anpassungen.

Hauptaufgaben (High-Level Checklist)
---
- [ ] Branch erstellen: migration/migrate-to-tanstack-start
- [ ] Inventarisierung: Liste aller Next-spezifischen Elemente (next.config.*, postcss.*, pages/app Struktur, API-Routen, getServerSideProps/getStaticProps, next/image, next/font, next/link, Middleware, Tailwind-Abhängigkeiten)
- [ ] Abhängigkeiten anpassen:
  - [ ] Entfernen: next, @tailwindcss/postcss (falls vorhanden), next-spezifische libs
  - [ ] Hinzufügen: @tanstack/react-start, @tanstack/react-router, vite, @vitejs/plugin-react, vite-tsconfig-paths
  - [ ] Optional: @tanstack/react-query, @unpic/react, fontsource
- [ ] Package.json Scripts anpassen (dev/build/preview/start, lint, test)
- [ ] Vite-Konfiguration:
  - [ ] Erstelle vite.config.ts mit tanstackStart plugin (routesDirectory: "app"), react plugin und tsconfig-paths
  - [ ] Port / Dev-Server Grundeinstellungen
- [ ] Root-Layout & Home (PoC):
  - [ ] Erstelle / passe src/app/__root.tsx an (createRootRoute, HeadContent, Scripts)
  - [ ] Erstelle / passe src/app/index.tsx an (createFileRoute('/'))
  - [ ] Ersetze kritische Imports in PoC (next/link → @tanstack/react-router Link, next/image → <img> oder Unpic)
  - [ ] Erstelle src/router.tsx und routeTree.gen prüfen/erzeugen
  - [ ] Lokales Testen: npm run dev → Fehler beheben
- [ ] Routing-Migration:
  - [ ] Strategie: route-objects / nested routes konsequent anwenden
  - [ ] Migriere Seiten schrittweise in src/app als createFileRoute-Dateien
  - [ ] Handle dynamische & catch-all routes (convert Next patterns to $slug / $)
- [ ] Daten-Layer & API:
  - [ ] Inventory: alle occurrences von getServerSideProps/getStaticProps und 'use server'
  - [ ] Für einfache Endpunkte: migriere zu Start server.handlers / createServerFn
  - [ ] Für komplexe Backends: Entscheidung treffen und ggf. externen Service oder separaten API-Server planen
  - [ ] Datenfetching: Route.loader oder @tanstack/react-query Hooks einführen
- [ ] Assets & Styling:
  - [ ] Prüfe public/ und statische Assets; Pfade beibehalten
  - [ ] Entferne oder passe Tailwind-Abhängigkeiten / -Importe (kein Tailwind verwenden)
  - [ ] Fonts: next/font → fontsource oder lokale Fonts
- [ ] Tests, Linter, CI/CD:
  - [ ] Passe CI-Build-Skripte an (npm run build / npm run preview oder Node start)
  - [ ] Aktualisiere Lint- und Test-Scripts falls Pfade sich ändern
  - [ ] Führe Build in CI (branch) aus und behebe Probleme
- [ ] Cleanup:
  - [ ] Entferne next.config.*, postcss.config.*, weitere next-artefakte
  - [ ] Entferne next aus package.json und update lockfile (npm install / npm ci)
- [ ] Verifikation & Dokumentation:
  - [ ] Lokale Verifikation: npm run dev zeigt TanStack Start-Seite / PoC
  - [ ] Build & Preview: npm run build && npm run preview erfolgreich
  - [ ] Dokumentation aktualisieren (README, Migrationsschritte, offene Punkte)
  - [ ] Code-Review & Merge-Prozess
- [ ] Nacharbeit:
  - [ ] Monitoring & Observability prüfen (falls betroffen)
  - [ ] Performance-/UX-Feinheiten (Image-Optimierung, Preloading) evaluieren
  - [ ] Optional: Integration TanStack Query Devtools / Dev experience Verbesserungen

Priorisierte Minimal-Umsetzung für PoC (erste Tasks)
---
- [ ] Branch anlegen
- [ ] Dependencies (dev & prod) installieren
- [ ] vite.config.ts anlegen
- [ ] package.json scripts anpassen
- [ ] src/app/__root.tsx und src/app/index.tsx anlegen (PoC)
- [ ] src/router.tsx anlegen und dev starten
- [ ] Fehlerbehebung bis PoC läuft auf http://localhost:3000

Offene Entscheidungen (müssen vor bestimmten Schritten beantwortet werden)
---
- API-Strategie: server.handlers in Start (kleine Endpunkte) oder separates Backend?
- Deployment-Ziel: Vercel beibehalten oder wechseln? (beeinflusst start-Script)
- Bildoptimierung: Unpic vs. externer Image-Service
- Test-Strategie: Vitest/Playwright Defaults behalten oder anpassen?

Anmerkung
---
Diese Task-Liste ist als lebendes Plan-Artifact gedacht — während der Umsetzung können Tasks ergänzt, priorisiert oder in kleinere Tickets aufgespalten werden. Bei Bedarf kann ich auf Basis dieser Liste eine Reihe konkreter CLI-Befehle und Dateiinhalte (vite.config.ts, package.json diff, Beispiel-__root.tsx/index.tsx) erzeugen und direkt in einer neuen Branch anlegen.
