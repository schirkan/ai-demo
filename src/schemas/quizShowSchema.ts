import { z } from 'zod';

// Zod schema definition
export const quizShowSchema = z.object({
  speak: z.string({ description: 'Kompletter Text vom Moderator, der gesprochen wird. Enthält Handlungsausfforderungen. Quizfragen müssen immer gesprochen werden. Darf kein Markup enthalten.' }),
  show: z.string({ description: 'Zentrale Hauptanzeige vom Spielgeschehen. Formatierung mit Markdown möglich. Enthält meist eine Überschrift und dann eine strukturierte Spielanzeige (Tabelle oder Liste)' }),
  secret: z.string({ description: 'Internes Geheimnis. Wird dem Anwender nicht angezeigt. Kann bspw. die Antwort(en) auf eine Quizfrage enthalten.' }),
  actions: z.array(z.string({ description: 'Aktionstext' }), { description: 'Optionale Liste von Aktionen / Antwortvorschlägen. Diese Aktionen werden dem Anweder als separate Buttons angezeigt um schnell zu antworten.' }),
});

export type QuizShowType = z.infer<typeof quizShowSchema>;