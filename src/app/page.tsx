'use client';

export default function Index() {
  return (
    <div style={{ width: 'fit-content', margin: '10rem auto 0' }}>
      <h1 style={{ textAlign: 'center', margin: '1rem' }}>AI Demo</h1>
      <ol style={{ listStyle: 'decimal', paddingLeft: 'revert' }}>
        <li><a href='chat-ui-sample'>Chat UI Sample</a></li>
        <li><a href='chat-basic'>AI Chat (Basic)</a></li>
        <li><a href='chat-tts'>AI Chat (Voice)</a></li>
        <li><a href='game/familienduell'>Game Familienduell</a></li>
      </ol>
    </div>
  );
}