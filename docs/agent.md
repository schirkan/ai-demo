https://medium.com/@chrisdunlop_37984/cursor-ai-tip-my-folder-system-trick-that-cut-my-requests-down-by-50-7585c8c248dd

```
@feature.md @PRMOPT.md
Implement the instructions in the PROMPT
```

```
Implementiere die Befehle im PROMPT
 @docs/2_planning/PROMPT.md
 @docs/2_planning/buzzer
```


- inkrementell vorgehen und Tasks abhaken
- bei wichtigen Entscheidungen nachfragen (bspw. vor dem Installieren neuer Pakete Alternativen vorschlagen)
- bei der Integration neuer Pakete zuerst die offizielle Dokumentation lesen
- offene Punkte auflisten / auf die Task Liste packen

- der Timer (aktuell 60s) soll auf der buzzer Seite individuell einstellbar sein (Range: 5 bis 120)
- Raum ID soll mit uuid initialisiert werden
- der QR-Code enthält: <hostname> + <path_to_buzzer_connect> + <raum_id> (als get/query Parameter)
- buzzer server (buzzer-ws-server.ts) in nextjs api integrieren

