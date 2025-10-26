# Spezifikation: Buzzer

## Funktionalität & Technischer Scope

- Die "Buzzer"-Seite dient als zentrale Anzeige für einen Multiplayer-Buzzer-Raum.
- Teilnehmer verbinden sich per QR-Code (enthält Raum-ID) und WebSocket mit dem Raum.
- Jeder Teilnehmer kann einen Spielernamen festlegen (maximal 30 Zeichen, Name muss eindeutig sein).
- Ein großer Buzzer-Button steht jedem Teilnehmer zur Verfügung.
- Wer zuerst buzzert, sperrt alle anderen Buzzer.
- Die Person, die gebuzzert hat, erhält ein ChatInput-Feld zur Texteingabe.
- Nach Absenden des Textes wird dieser mit Spielernamen auf der "Buzzer"-Seite angezeigt.
- Danach werden alle Buzzer wieder freigegeben.
- Mehrere Räume können parallel existieren (Raum-ID).
- Es gibt keine harte Begrenzung der Teilnehmerzahl pro Raum, in der Praxis werden aber meist maximal 10 Teilnehmer erwartet.
- Es ist keine Persistenz gefordert: Der Chatverlauf und Status leben ausschließlich auf der "Buzzer"-Seite und gehen bei Verbindungsabbruch/Reload verloren.
- Nice to have: Wiedergabe eines kurzen "Buzzer"-Sounds auf der "Buzzer"-Seite, wenn jemand buzzert.

## UI-Layout

### Mobile-First für Teilnehmer

- Die "Buzzer Connect"-Seite ist speziell für die mobile Nutzung optimiert: Sie bietet einen großen, zentralen Buzzer-Button und ein einfaches Namensfeld, um Ablenkung zu minimieren und die Bedienung auf Smartphones zu erleichtern.
- Die "Buzzer"-Seite dient als zentrale Anzeige für den Moderator oder das Publikum auf einem Desktop/Tablet. Hier werden alle verbundenen Spieler, der aktuelle Status (wer hat gebuzzert), und der Chatverlauf angezeigt.
- Dieses Layout ermöglicht eine klare Trennung zwischen Teilnehmer- und Moderatorenansicht und sorgt für eine optimale User Experience auf allen Geräten.

## Trade-offs & Use Cases

- **Mobile-First:** Ideal für BYOD-Events ("Bring Your Own Device"), bei denen viele Teilnehmer per Smartphone beitreten. Die Bedienung ist intuitiv und schnell, die zentrale Anzeige bleibt übersichtlich für den Moderator. Es müssen jedoch zwei unterschiedliche Layouts gepflegt werden (mobile und Desktop).
