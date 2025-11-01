import { Link, createFileRoute } from '@tanstack/react-router'
import BackgroundPattern from '@/components/BackgroundPattern/BackgroundPattern'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <BackgroundPattern styleName='grid-fade-sides' />
      <div style={{ width: 'fit-content', margin: '10rem auto 0' }}>
        <h1 style={{ textAlign: 'center', margin: '1rem' }}>AI Demo</h1>
        <ol style={{ listStyle: 'decimal', paddingLeft: 'revert' }}>
          <li><Link to="/chat-basic">AI Chat (Basic)</Link></li>
          <li><Link to="/chat-ui-sample">Chat UI Sample</Link></li>
          <li><Link to={'/chat-tts' as any}>AI Chat (Voice)</Link></li>
          <li><Link to={'/image' as any}>Image Generation</Link></li>
          <li><Link to={'/chat-custom-gpt' as any}>AI Chat (Custom GPTs)</Link></li>
          <li><Link to={'/chat-persistence' as any}>AI Chat (Persistence)</Link></li>
          <li><Link to={'/quizshow' as any}>Quizshow</Link></li>
          <li><Link to={'/buzzer' as any}>Buzzer (Multiplayer Demo)</Link></li>
        </ol>
      </div>
    </>
  )
}
