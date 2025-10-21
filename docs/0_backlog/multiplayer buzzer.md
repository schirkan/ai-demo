Erstelle eine neue Seite "Buzzer" und binde diese auf der Startseite ein.

Dies soll eine Demo-Seite für ein Multiplayer Buzzer Input Control sein.

Über einen QR Code sollen sich weitere Personen zusammen verbinden können (web sockets).

Die "Buzzer" Seite zeigt dabei an, wann eine Person einen Button (den Buzzer) drückt.

---

Erstelle eine neue Seite "Buzzer Connect".
Diese Seite wird aufgerufen, wenn der QR-Code gescannt wird.
Über den QR-Code wird eine eindeutige ID zum verbinden mit WebSockets übertragen.
Es sollen mehrere parallele "Räume" auf dem Server untersützt werden. 
Die ID identifiziert einen raum reindeutig.

Auf dieser Seite verbinden sich die Teilnehmer mit dem Raum.
Dabei können Sie einen Spielernamen festlegen, der später mit übertragen wird.

Auf der Seite gibt es einen großen Button - den Buzzer.
Betätigt ein spieler den Buzzer, sendet dies ein Signal (per WebSocket) an die verbundene "Buzzer" Seite.
Diese sperrt dann alle anderen Buzzer.
Bei der Person, die den Buzzer gedrückt hat erscheint dann ein ChatInput Control.
Dies dient zur Eingabe von Text.
Wenn Text gesendet wird, erscheint dieser auf der "Buzzer" Seite zusammen mit dem Spielernamen.

Danach werden alle Buzzer wieder freigegeben / angezeigt.
