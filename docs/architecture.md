# Architektur-Dokumentation

## HIGH LEVEL UNDERSTANDING

Dieses Projekt ist eine moderne, modulare Webanwendung, die auf Next.js und React basiert. Die Architektur folgt dem Prinzip der Trennung von Präsentation, Logik und Datenzugriff. Die wichtigsten Bereiche sind:

- **Frontend**: React-Komponenten, CSS-Module, Hooks für State- und Logikverwaltung.
- **Backend/API**: Next.js API-Routen für serverseitige Logik und KI-Integration.
- **Utilities**: Hilfsfunktionen und wiederverwendbare Logik in `utils` und `hooks`.
- **Assets**: Statische Dateien im `public`-Verzeichnis.

```mermaid
graph TD
    A[User] -->|UI Interaktion| B[React Components]
    B -->|Hooks & State| C[Hooks]
    B -->|Styles| D[CSS Modules]
    B -->|API Calls| E[Next.js API Routes]
    E -->|KI/Logik| F[AI SDKs & Utilities]
    F -->|Assets| G[Public]
```

## TECHNOLOGY STACK

- **Frameworks:** Next.js, React
- **Sprache:** TypeScript, JavaScript
- **Styling:** CSS Modules
- **KI & Speech:** @ai-sdk/azure, @ai-sdk/react, ai, react-speech-recognition, react-text-to-speech
- **Hilfsbibliotheken:** imgbb-uploader, react-markdown, react-icons, react-use, remark-gfm, siriwave, zod
- **Build & Tools:** ESLint, Typescript, raw-loader

## DESIGN DECISIONS

- **Next.js als Basis:** Ermöglicht SSR, API-Routen und schnelle Entwicklung.
- **Modulare Komponentenstruktur:** Wiederverwendbare UI-Komponenten in `src/components`.
- **Hooks für State-Management:** Eigene Hooks in `src/hooks` kapseln Logik und fördern Wiederverwendbarkeit.
- **API-Routen:** Serverseitige Logik und KI-Integration über Next.js API-Routen in `src/app/api`.
- **TypeScript:** Für Typensicherheit und bessere Wartbarkeit.
- **CSS Modules:** Kapselung von Styles pro Komponente.
- **KI-Integration:** Nutzung von AI SDKs für Sprach- und Bildverarbeitung.

## GETTING STARTED

1. **Repository klonen**
   ```bash
   git clone https://github.com/schirkan/ai-demo.git
   cd ai-demo
   ```
2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```
3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```
   Die Anwendung ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.
4. **Build für Produktion**
   ```bash
   npm run build
   npm start
   ```

## ENTRY POINTS

- **Frontend:** `src/app/page.tsx` – Hauptseite der Anwendung.
- **API:** `src/app/api/` – Enthält alle serverseitigen Endpunkte.
- **Komponenten:** `src/components/` – Wiederverwendbare UI-Bausteine.
- **Hooks:** `src/hooks/` – Eigene React-Hooks für Logik und State.
- **Utils:** `src/utils/` – Hilfsfunktionen für verschiedene Aufgaben.

## COMPONENTS

### App-Komponenten (`src/app/`)

- **Purpose:** Einstiegspunkt und Routing der Anwendung.
- **Strukturen:** Next.js Pages, API-Routen.
- **Design Patterns:** File-based Routing, SSR/SSG.
- **Regeln:** Jede Seite/Route als eigene Datei.

### UI-Komponenten (`src/components/`)

- **Purpose:** Wiederverwendbare UI-Bausteine (z.B. ChatInput, ChatLog, ImageDisplay).
- **Strukturen:** Funktionale React-Komponenten, CSS Modules.
- **Design Patterns:** Presentational/Container Pattern.
- **Regeln:** Keine Logik in UI-Komponenten, nur Darstellung.

### Hooks (`src/hooks/`)

- **Purpose:** Kapselung von State- und Logik (z.B. Chat-Verlauf, Bildgenerierung).
- **Strukturen:** Custom React Hooks.
- **Design Patterns:** Hook Pattern.
- **Regeln:** Hooks sind zustandslos und wiederverwendbar.

### Utilities (`src/utils/`)

- **Purpose:** Hilfsfunktionen für Bildverarbeitung, Nachrichtenhandling etc.
- **Strukturen:** Einfache Funktionen.
- **Design Patterns:** Utility Pattern.
- **Regeln:** Keine Seiteneffekte, reine Funktionen.

### API-Routen (`src/app/api/`)

- **Purpose:** Serverseitige Endpunkte für Chat, Bildgenerierung, Quizshow etc.
- **Strukturen:** Next.js API Route Handler.
- **Design Patterns:** RESTful, KI-Integration.
- **Regeln:** Trennung von Logik und Routing.

## CODE MAP

**Wichtige Verzeichnisse:**

- `src/app/` – Hauptanwendung, Seiten, API-Routen
- `src/components/` – UI-Komponenten
- `src/hooks/` – Eigene React-Hooks
- `src/utils/` – Hilfsfunktionen
- `src/css/` – Globale und modulare Styles
- `public/` – Statische Assets (Bilder, JS)

**API-Überblick:**

- `/api/chat` – Chat-Endpoint (KI-Integration)
- `/api/image` – Bildgenerierung
- `/api/quizshow` – Quizshow-Logik
- `/api/summarize` – Textzusammenfassung
- `/api/custom-gpt` – Custom GPT-Logik

**Wichtige Dateien:**

- `package.json` – Projektkonfiguration und Abhängigkeiten
- `tsconfig.json` – TypeScript-Konfiguration
- `next.config.ts` – Next.js-Konfiguration
- `README.md` – Projektübersicht
