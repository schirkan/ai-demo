'use client';

export default function Index() {
  return (
    <div>
      <h1>AI Demo</h1>
      <ol style={{ listStyle: 'decimal', paddingLeft: 'revert' }}>
        <li><a href='chat-ui-sample'>Chat UI Sample</a></li>
        <li><a href='chat-basic'>AI Chat (Basic)</a></li>
        <li><a href='chat-tts'>AI Chat (Voice)</a></li>
        <li><a href='game/familienduell'>Game Familienduell</a></li>
      </ol>
    </div>
  );
}