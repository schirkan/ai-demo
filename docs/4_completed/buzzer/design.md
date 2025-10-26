# Design: Buzzer

## Architekturüberlegungen

- **Frontend:** Zwei Hauptseiten/Komponenten:
  - **Buzzer-Seite:** Übersicht, Statusanzeige, Chatverlauf, QR-Code-Generator.
  - **Buzzer Connect:** Mobile-optimiert, Namensfeld, großer Buzzer-Button.
- **Backend:** WebSocket-Server, der Räume verwaltet und Nachrichten (Buzzer, Text, Status) verteilt.
- **Raum-Management:** Jeder Raum hat eine eindeutige ID, die im QR-Code kodiert ist. Es gibt keine harte Begrenzung der Teilnehmerzahl pro Raum, in der Praxis werden aber meist maximal 10 Teilnehmer erwartet.
- **Synchronisation:** State-Management über WebSockets (z.B. Zustand: frei, gebuzzert, Texteingabe, freigeben).
- **Persistenz:** Es ist keine Persistenz gefordert; der Chatverlauf und Status leben ausschließlich auf der "Buzzer"-Seite und gehen bei Verbindungsabbruch/Reload verloren.
- **Timeout-Handling:** Nach dem Drücken des Buzzers bleibt der Buzzer für 60 Sekunden gesperrt, falls kein Text eingegeben wird (Timeout).
- **Namensmanagement:** Teilnehmer können jederzeit beitreten oder das Spiel verlassen. Es gibt keine echte Identifizierung, aber der Spielername muss eindeutig sein (keine Doppelnennungen) und ist auf maximal 30 Zeichen begrenzt.

## Komponenten-Interaktionen

- **Buzzer Connect** → sendet "buzz" an Server → Server sperrt Raum → Buzzer-Seite zeigt Gewinner an.
- Beim Empfang eines "buzz"-Events wird auf der "Buzzer"-Seite ein kurzer Buzzer-Sound abgespielt (nice to have).
- Gewinner erhält ChatInput → sendet Text (ohne Zeichen-/Zeilenbegrenzung) → Server verteilt Text an alle → Buzzer werden wieder freigegeben oder nach 60 Sekunden Timeout automatisch.
- Neue Teilnehmer können sich jederzeit per QR-Code verbinden und einen eindeutigen Namen wählen; sie können das Spiel auch jederzeit verlassen.

## Visuelle Skizze (als Markdown)

```
[Buzzer-Seite]
+-------------------------------+
| Raum: #1234                   |
| QR-Code zum Beitreten           |
| ------------------------------- |
| Spieler: Alice   [ ]            |
| Spieler: Bob     [ ]            |
| Spieler: Carol   [ ]            |
| ------------------------------- |
| Status: Bob hat gebuzzert!      |
| ------------------------------- |
| Chat:                           |
| Bob: "Antworttext"              |
+-------------------------------+

[Buzzer Connect]
+-------------------------------+
| Raum: #1234                   |
| Name: [__________]            |
|                               |
| [   BUZZER BUTTON   ]         |
|                               |
| (Nach Buzz: ChatInput)        |
+-------------------------------+
```

## Weitere Design-Überlegungen

- Nice to have: Wiedergabe eines kurzen "Buzzer"-Sounds auf der "Buzzer"-Seite, wenn jemand buzzert (z.B. per HTML5 Audio API, Sounddatei lokal eingebunden).
- **Fehlerfälle:** Verbindungsabbrüche werden toleriert, Teilnehmer können jederzeit neu beitreten oder das Spiel verlassen. Doppelte Namen werden nicht zugelassen, der Name muss eindeutig sein. Bei Zeitüberschreitung (60s) nach Buzzer-Drücken wird der Buzzer automatisch wieder freigegeben.
- **Sicherheit:** Raum-IDs sollten schwer zu erraten sein (UUID).
- **Skalierbarkeit:** Server muss viele parallele Räume und Teilnehmer unterstützen.
- **Barrierefreiheit:** Große Buttons, klare Statusanzeigen, mobile Optimierung.
- **UI-Vereinfachung:** Das UI bleibt bewusst einfach gehalten, auch bei vielen Teilnehmern werden keine Zusatzfunktionen wie Suche oder Gruppierung angeboten.
- **Zielgeräte:** Die Anwendung ist für aktuelle Versionen von Browsern und mobilen Endgeräten optimiert.
- **Internationalisierung:** Vorerst keine Mehrsprachigkeit vorgesehen.
- **ChatInput:** Keine Begrenzung der Zeichen- oder Zeilenanzahl bei der Texteingabe.
