import { z } from 'zod';

// Zod schema definition

export const quizShowSchema = z.object({
  speak: z.string({ description: 'Kompletter Text vom Moderator, der gesprochen wird. Quizfragen müssen immer auch einmalig gesprochen werden. Darf kein Markup enthalten.' }),
  show: z.string({ description: 'Zentrale Hauptanzeige vom Spielgeschehen. Formatierung mit Markdown möglich.' }),
  callForAction: z.string({ description: 'Zusätzlicher Text, der dem Anweder angezeigt wird. Handlungsausfforderung - kann bspw. die Frage in einem Quiz sein. Formatierung mit Markdown möglich.' }),
  actions: z.array(z.string({ description: 'Aktionstext' }), { description: 'Optionale Liste von Aktionen / Antwortvorschlägen. Diese Aktionen werden dem Anweder als separate Buttons angezeigt um schnell zu antworten.' }),
});

export type QuizShowType = z.infer<typeof quizShowSchema>;