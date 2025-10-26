# Zusammenfassung: Buzzer

Die Buzzer-Funktionalität bietet eine einfache, mobile-optimierte Demo für Multiplayer-Buzzer-Interaktionen. Moderatoren nutzen die zentrale "Buzzer"-Seite zur Anzeige des Raum-Status, verbundener Spieler und des Chatverlaufs; Teilnehmer treten per QR-Code auf der mobil-optimierten "Buzzer Connect"-Seite bei, wählen einen eindeutigen Spielernamen und können mit einem großen Buzzer-Button buzzern.

Implementiert wurden Raum-IDs per UUID, ein WebSocket-basiertes Raum- und Statusmanagement, eine Sperr-Logik, die den ersten Buzzer-Anruf blockiert, ein Chat-Input für den Gewinner und ein automatischer Timeout (60s) zur Wiederfreigabe. Ein kurzer Buzzer-Sound auf der Moderationsseite rundet die UX ab. Die Lösung ist bewusst in-memory (keine Persistenz) und für einfache Demonstrationszwecke optimiert.

Wichtige Designentscheidungen: Trennung von Moderator- und Teilnehmeransicht, Verwendung von UUIDs für schwer erratbare Raum-IDs, client- und serverseitige Namensvalidierung (max. 30 Zeichen, eindeutig) und Timeout-Handling zur automatischen Freigabe.

---

Datum: 2025-10-26
