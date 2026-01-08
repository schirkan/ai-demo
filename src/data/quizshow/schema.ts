import { z } from 'zod/v3';

// Zod schema definition
export const quizShowSchema = z.object({
  speak: z.string().describe('Kompletter Text vom Moderator, der gesprochen wird. Enthält Handlungsausfforderungen. Quizfragen müssen immer gesprochen werden. Darf kein Markup enthalten.'),
  show: z.string().describe('Zentrale Hauptanzeige vom Spielgeschehen. Formatierung mit Markdown möglich. Enthält meist eine Überschrift und dann eine strukturierte Spielanzeige (Tabelle oder Liste)'),
  secret: z.string().describe('Internes Geheimnis. Wird dem Anwender nicht angezeigt. Enthält immer die Antwort / Lösung auf die aktuelle Frage etc.'),
  actions: z.array(z.string().describe('Aktionstext'),).describe('Optionale Liste von Aktionen / Antwortvorschlägen. Diese Aktionen werden dem Anweder als separate Buttons angezeigt um schnell zu antworten.'),
  imagePrompt: z.optional(z.string().describe('Optional, nur befüllen, wenn ein Bild angefordert wird. Detaillierter Prompt zur Bild-Generierung.')),
});

export type QuizShowType = z.infer<typeof quizShowSchema>;