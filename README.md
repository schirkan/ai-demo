# AI Demo

Demo: https://my-ai-demo.azurewebsites.net

## Project Overview

This application demonstrates various AI-powered features such as chatbots, image generation, quiz games, and text-to-speech.

This project uses TanStack Start with Vite as the application framework and build tool. See https://tanstack.com/start for the official guide and migration notes.

## Features

- Multiple chat variants (Basic, Custom GPT, Persistent, Text-to-Speech)
- AI-based image generation
- Quiz show mode
- Markdown rendering
- Multiple API endpoints (Chat, Image, Quiz, Summarize, Custom GPT, etc.)
- Modern UI components (React, TypeScript, CSS Modules)
- Demo deployment on Azure

## Main AI Packages

- **ai**: Core AI utilities and abstractions for building AI-powered apps. ([AI-SDK](https://ai-sdk.dev/))
- **@ai-sdk/azure**: Integration for using Azure AI services.
- **@ai-sdk/react**: React bindings for AI SDK, enabling easy integration in React components.
- **react-speech-recognition**: Speech-to-text functionality for chat and voice features.
- **react-text-to-speech**: Text-to-speech synthesis for voice output in chat.

## Directory Structure (excerpt)

```
src/
  app/                # Next.js app router & pages
    api/              # API routes (chat, image, quizshow, summarize, custom-gpt)
    chat-basic/       # Basic chat UI
    chat-custom-gpt/  # Chat with custom GPT
    chat-persistence/ # Chat with persistence
    chat-tts/         # Chat with text-to-speech
    chat-ui-sample/   # Sample chat UI
    image/            # Image generation
    quizshow/         # Quiz show mode
  components/         # Reusable UI components
  hooks/              # React hooks
  utils/              # Utility functions
  css/                # Global and modular styles
public/               # Static files (images, JS, etc.)
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/schirkan/ai-demo.git
   cd ai-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Routes & Features

- `/chat-basic` – Basic chatbot
- `/chat-custom-gpt` – Chat with custom GPT
- `/chat-persistence` – Chat with persistent history
- `/chat-tts` – Chat with text-to-speech
- `/image` – Image generation
- `/quizshow` – Quiz show mode

## Deployment

This project can be deployed to Vercel, Azure, or any other platform supporting Next.js apps.

## Environment Variables

The following environment variables must be set for certain features to work:

| Variable                     | Description                          |
| ---------------------------- | ------------------------------------ |
| AZURE_RESOURCE_NAME          | Name of the Azure OpenAI resource    |
| AZURE_API_KEY                | API key for Azure OpenAI             |
| AZURE_RESOURCE_NAME_DALL_E_3 | Name of the Azure DALL·E 3 resource  |
| AZURE_API_KEY_DALL_E_3       | API key for Azure DALL·E 3           |
| IMGBB_API_KEY                | API key for imgbb.com (image upload) |

## License

[MIT](https://choosealicense.com/licenses/mit/)
