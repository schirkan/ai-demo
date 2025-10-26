# Implementation Notes: Buzzer

Dieses Dokument dient zur Nachverfolgung des Implementierungsfortschritts, technischer Entscheidungen und Herausforderungen während der Umsetzung des Buzzer-Features.

## Fortschritt & ToDos

- Siehe [task_list.md](./task_list.md) für die Hauptaufgaben.
- Ergänzende Notizen und technische Details werden hier dokumentiert.

## Technische Entscheidungen

- **Frontend/Backend-Trennung:** Die Buzzer-Logik wird über WebSockets synchronisiert. Die Moderationsansicht ("Buzzer"-Seite) und die Teilnehmeransicht ("Buzzer Connect") sind als separate Seiten implementiert.
- **Raum-IDs:** Verwendung von UUIDs für schwer erratbare Raum-IDs.
- **State-Management:** Status (frei, gebuzzert, Texteingabe, freigeben) wird ausschließlich über WebSockets synchronisiert, keine Persistenz.
- **Namensvalidierung:** Spielernamen werden clientseitig und serverseitig auf Eindeutigkeit und Länge geprüft.
- **Timeout:** Nach 60 Sekunden ohne Texteingabe wird der Buzzer automatisch freigegeben.
- **Sound:** Ein kurzer Soundeffekt wird auf der "Buzzer"-Seite abgespielt, wenn jemand buzzert (optional).

## Herausforderungen

- Synchronisation von Status und Chatverlauf ohne Persistenz.
- Sicherstellung der Eindeutigkeit von Spielernamen bei gleichzeitigen Verbindungen.
- Mobile-Optimierung der "Buzzer Connect"-Seite.
- Fehlerbehandlung bei Verbindungsabbrüchen und Reconnects.

## Offene Fragen / ToDo

- Soll der Soundeffekt optional abschaltbar sein?
- Wie werden sehr viele Teilnehmer im UI gehandhabt?
- Weitere Optimierungen für Barrierefreiheit?

---

*Bitte dieses Dokument während der Implementierung fortlaufend ergänzen!*
