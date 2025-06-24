'use client';

import ChatUI from "@/components/ChatUI/ChatUI";
import { useState } from "react";
import styles from "./page.module.css"
import { Message } from 'ai';

export default function Page() {
  const [style, setStyle] = useState('default');
  const [input, setInput] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "user", content: "Hallo KI, ich überlege, eine Photovoltaikanlage auf meinem Dach zu installieren. Lohnt sich das überhaupt?" },
    { id: "2", role: "assistant", content: "Hallo! Das kommt auf verschiedene Faktoren an, wie zum Beispiel die Ausrichtung deines Dachs, die Sonneneinstrahlung und deinen Stromverbrauch. In vielen Fällen lohnt sich eine Photovoltaikanlage aber finanziell und ökologisch." },
    { id: "3", role: "user", content: "Wie viel Strom kann ich denn ungefähr selbst erzeugen?" },
    { id: "4", role: "assistant", content: "Das hängt von der Größe der Anlage und der Sonneneinstrahlung ab. Im Durchschnitt erzeugt eine 10 kWp-Anlage in Deutschland etwa 9.000 bis 10.000 kWh Strom pro Jahr." },
    { id: "5", role: "user", content: "Und was passiert, wenn ich mehr Strom erzeuge, als ich verbrauche?" },
    { id: "6", role: "assistant", content: "Überschüssiger Strom kann ins öffentliche Netz eingespeist werden. Dafür erhältst du eine Einspeisevergütung, deren Höhe vom Zeitpunkt der Inbetriebnahme abhängt." },
    { id: "7", role: "user", content: "Muss ich die Anlage regelmäßig warten lassen?" },
    { id: "8", role: "assistant", content: "Photovoltaikanlagen sind relativ wartungsarm. Es empfiehlt sich aber, sie alle paar Jahre von einem Fachbetrieb überprüfen zu lassen, um die optimale Leistung zu gewährleisten." }
  ]);

  const handleSubmit = (text: string) => {
    messages.push({
      id: 'User' + Date.now().toString(),
      role: 'user',
      content: text
    });
    messages.push({
      id: 'AI' + Date.now().toString(),
      role: 'assistant',
      content: text.toUpperCase()
    });
    setMessages(messages);
    setInput('');
  };

  return (
    <>
      <div>
        <label>Style:
          <select value={style} onChange={e => setStyle(e.target.value)}>
            <option value="default">default</option>
            <option value="bubbles">bubbles</option>
          </select>
        </label>
      </div>
      <div className={styles.container}>
        <ChatUI
          onSubmit={handleSubmit}
          messages={messages}
          input={input}
          style={style}
          setInput={setInput}
          placeholder="Type your message..." />
      </div>
    </>
  );
}