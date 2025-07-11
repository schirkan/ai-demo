'use client';

import BackgroundPattern from "@/components/BackgroundPattern/BackgroundPattern";

export default function Index() {
  return (
    <>
      <BackgroundPattern styleName='grid-fade-sides' />
      <div style={{ width: 'fit-content', margin: '10rem auto 0' }}>
        <h1 style={{ textAlign: 'center', margin: '1rem' }}>AI Demo</h1>
        <ol style={{ listStyle: 'decimal', paddingLeft: 'revert' }}>
          <li><a href='chat-ui-sample'>Chat UI Sample</a></li>
          <li><a href='chat-basic'>AI Chat (Basic)</a></li>
          <li><a href='chat-tts'>AI Chat (Voice)</a></li>
          <li><a href='image'>Image Generation</a></li>
          <li><a href='quizshow'>Quizshow</a></li>
        </ol>
      </div>
    </>
  );
}