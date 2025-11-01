import { createFileRoute } from '@tanstack/react-router'
import { azure } from '@ai-sdk/azure'
import { APICallError, generateText } from 'ai'

export const Route = createFileRoute('/api/summarize')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json()
          const { text } = body ?? {}

          const result = await generateText({
            model: azure('gpt-4.1'),
            prompt: `Erstelle eine sehr kurze Überschrift (maximal 8 Wörter) für nachfolgende Anfrage: """${text}"""`,
          })

          return Response.json({ text: result.text })
        } catch (error) {
          if (APICallError.isInstance(error)) {
            return Response.json({ error: error.message }, { status: error.statusCode })
          }
          return Response.json({ error: 'Unknown error' }, { status: 500 })
        }
      },
    },
  },
})
