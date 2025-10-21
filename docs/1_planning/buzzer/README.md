# Buzzer

## Goal

Eine Demo-Seite für ein Multiplayer Buzzer Input Control, bei der mehrere Personen über einen QR-Code und WebSockets einem Raum beitreten und per Buzzer interagieren können. Die Seite zeigt an, wer den Buzzer zuerst gedrückt hat, ermöglicht die Eingabe eines Textes und zeigt diesen zusammen mit dem Spielernamen an.

## Key Requirements

- Neue Seite "Buzzer" als Demo für Multiplayer Buzzer Input Control.
- QR-Code zur Verbindung weiterer Teilnehmer (WebSockets).
- Mehrere parallele Räume, identifiziert durch eine eindeutige ID.
- "Buzzer" Seite zeigt an, wer den Buzzer gedrückt hat und sperrt andere Buzzer.
- Nach Buzzer-Drücken: ChatInput für Texteingabe, Anzeige des Textes mit Spielernamen.
- Nach Senden des Textes: Buzzer werden wieder freigegeben.
- Neue Seite "Buzzer Connect" für Teilnehmer, die per QR-Code beitreten.
- Spielername kann beim Beitritt festgelegt werden (maximal 30 Zeichen, eindeutig).
- Keine harte Begrenzung der Teilnehmerzahl pro Raum, in der Praxis meist maximal 10 Teilnehmer.
- Keine Persistenz: Verlauf und Status leben nur auf der "Buzzer"-Seite.
- UI bleibt bewusst einfach, keine Zusatzfunktionen für viele Teilnehmer.
- Optimiert für aktuelle Browser und mobile Endgeräte.
- Keine Internationalisierung oder spezielle Barrierefreiheit vorgesehen.
- Nice to have: Wiedergabe eines kurzen "Buzzer"-Sounds auf der "Buzzer"-Seite, wenn jemand buzzert.

## Target Audience

- Endnutzer, die an Multiplayer-Quiz- oder Buzzer-Spielen teilnehmen möchten (primär auf aktuellen mobilen Endgeräten und Browsern).
- Entwickler, die eine Demo für WebSocket-basierte Interaktionen suchen.
- Moderatoren, die Live-Interaktionen mit mehreren Teilnehmern benötigen (bis ca. 10 Teilnehmer pro Raum).
