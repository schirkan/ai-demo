'use client';

import { UIMessage } from 'ai';
import { useState, useCallback } from "react";

import ChatMessages from "@/components/ChatMessages/ChatMessages";
import ChatInput from "@/components/ChatInput/ChatInput";
import BackgroundPattern from "@/components/BackgroundPattern/BackgroundPattern";
import styles from "./styles.module.css"

const sampleMessages: UIMessage[] = [
  {
    id: "1", role: "user",
    parts: [{ type: 'text', text: "Hallo KI, ich überlege, eine Photovoltaikanlage auf meinem Dach zu installieren. Lohnt sich das überhaupt?" }]
  }, {
    id: "2", role: "assistant",
    parts: [{ type: 'text', text: "Hallo! Das kommt auf verschiedene Faktoren an, wie zum Beispiel die Ausrichtung deines Dachs, die Sonneneinstrahlung und deinen Stromverbrauch. In vielen Fällen lohnt sich eine Photovoltaikanlage aber finanziell und ökologisch." }]
  }, {
    id: "3", role: "user",
    parts: [{ type: 'text', text: "Wie viel Strom kann ich denn ungefähr selbst erzeugen?" }]
  }, {
    id: "4", role: "assistant",
    parts: [{ type: 'text', text: "Das hängt von der Größe der Anlage und der Sonneneinstrahlung ab. Im Durchschnitt erzeugt eine 10 kWp-Anlage in Deutschland etwa 9.000 bis 10.000 kWh Strom pro Jahr." }]
  }, {
    id: "5", role: "user",
    parts: [{ type: 'text', text: "Und was passiert, wenn ich mehr Strom erzeuge, als ich verbrauche?" }]
  }, {
    id: "6", role: "assistant",
    parts: [{ type: 'text', text: "Überschüssiger Strom kann ins öffentliche Netz eingespeist werden. Dafür erhältst du eine Einspeisevergütung, deren Höhe vom Zeitpunkt der Inbetriebnahme abhängt." }]
  }, {
    id: "7", role: "user",
    parts: [{ type: 'text', text: "Muss ich die Anlage regelmäßig warten lassen?" }]
  }, {
    id: "8", role: "assistant",
    parts: [{ type: 'text', text: "Photovoltaikanlagen sind relativ wartungsarm. Es empfiehlt sich aber, sie alle paar Jahre von einem Fachbetrieb überprüfen zu lassen, um die optimale Leistung zu gewährleisten." }]
  }
];

export default function Page() {
  const [messagesStyle, setMessagesStyle] = useState<'default' | 'whatsapp' | 'ios'>('default');
  const [inputStyle, setInputStyle] = useState<'default' | 'combined'>('default');
  const [typing, setTyping] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showSampleError, setShowSampleError] = useState(false);

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const demo = () => {
    setMessages([]);
    sampleMessages.forEach((msg, index) => {
      window.setTimeout(() => {
        setMessages(m => [...m, msg]);
        setTyping(false);
        if (index % 2 === 0) {
          window.setTimeout(() => {
            setTyping(true);
          }, 500);
        }
      }, index * 1500);
    });
  }

  const handleSubmit = useCallback((text: string) => {
    setMessages(m => [...m, {
      id: 'User' + Date.now().toString(),
      role: 'user',
      parts: [{ type: 'text', text }]
    }]);

    window.setTimeout(() => {
      setTyping(true);
    }, 500);

    window.setTimeout(() => {
      setMessages(m => [...m, {
        id: 'AI' + Date.now().toString(),
        role: 'assistant',
        parts: [{ type: 'text', text: text.toUpperCase() }]
      }]);
      setTyping(false);
    }, 1500);
  }, [setMessages, setTyping]);

  const sampleError = showSampleError ? new Error('This is a sample error.') : undefined;

  const regenerate = () => {
    setShowSampleError(false);
  };

  return (<>
    <BackgroundPattern styleName='blueprint' />
    <div className={styles.container}>
      <h1 className={styles.header}>Chat UI</h1>
      <div className={styles.chatUi}>
        <ChatMessages
          messages={messages}
          loading={typing}
          style={messagesStyle}
          error={sampleError}
          regenerate={regenerate}
        />
        <ChatInput
          style={inputStyle}
          onSubmit={handleSubmit}
          placeholder="Type your message..."
          showVoiceInput={showVoiceInput}
          loading={typing}
          stop={() => { }}
        />
      </div>
      <div className={styles.options}>
        <h2>Options</h2>
        <label>Messages Style:&nbsp;
          <select value={messagesStyle} onChange={e => setMessagesStyle(e.target.value as typeof messagesStyle)}>
            <option value="default">default</option>
            <option value="whatsapp">whatsapp</option>
            <option value="ios">ios</option>
          </select>
        </label>
        <label>Input Style:&nbsp;
          <select value={inputStyle} onChange={e => setInputStyle(e.target.value as typeof inputStyle)}>
            <option value="default">default</option>
            <option value="combined">combined</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={showVoiceInput} onChange={e => setShowVoiceInput(e.target.checked)} />
          &nbsp;Voice Input
        </label>
        <label>
          <input type="checkbox" checked={showSampleError} onChange={e => setShowSampleError(e.target.checked)} />
          &nbsp;Sample Error
        </label>
        <label>
          <input type="checkbox" checked={typing} onChange={e => setTyping(e.target.checked)} />
          &nbsp;Typing Indicator
        </label>
        <button onClick={demo}>Demo</button>
        <button onClick={() => setMessages([])}>Clear</button>
      </div>
    </div>
  </>
  );
}

