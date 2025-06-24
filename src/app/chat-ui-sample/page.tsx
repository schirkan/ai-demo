'use client';

import ChatUI, { Message } from "@/components/ChatUI/ChatUI";
import { useState } from "react";
import styles from "./page.module.css"

export default function Page() {
  const [style, setStyle] = useState('default');
  const [input, setInput] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    { "id": "1", "sender": "User", isOwn: true, "text": "Hallo KI, ich überlege, eine Photovoltaikanlage auf meinem Dach zu installieren. Lohnt sich das überhaupt?" },
    { "id": "2", "sender": "AI", "text": "Hallo! Das kommt auf verschiedene Faktoren an, wie zum Beispiel die Ausrichtung deines Dachs, die Sonneneinstrahlung und deinen Stromverbrauch. In vielen Fällen lohnt sich eine Photovoltaikanlage aber finanziell und ökologisch." },
    { "id": "3", "sender": "User", isOwn: true, "text": "Wie viel Strom kann ich denn ungefähr selbst erzeugen?" },
    { "id": "4", "sender": "AI", "text": "Das hängt von der Größe der Anlage und der Sonneneinstrahlung ab. Im Durchschnitt erzeugt eine 10 kWp-Anlage in Deutschland etwa 9.000 bis 10.000 kWh Strom pro Jahr." },
    { "id": "5", "sender": "User", isOwn: true, "text": "Und was passiert, wenn ich mehr Strom erzeuge, als ich verbrauche?" },
    { "id": "6", "sender": "AI", "text": "Überschüssiger Strom kann ins öffentliche Netz eingespeist werden. Dafür erhältst du eine Einspeisevergütung, deren Höhe vom Zeitpunkt der Inbetriebnahme abhängt." },
    { "id": "7", "sender": "User", isOwn: true, "text": "Muss ich die Anlage regelmäßig warten lassen?" },
    { "id": "8", "sender": "AI", "text": "Photovoltaikanlagen sind relativ wartungsarm. Es empfiehlt sich aber, sie alle paar Jahre von einem Fachbetrieb überprüfen zu lassen, um die optimale Leistung zu gewährleisten." }
  ]);

  const handleSubmit = (text: string) => {
    messages.push({
      id: 'User' + Date.now().toString(),
      sender: 'User',
      isOwn: true,
      text: text
    });
    messages.push({
      id: 'AI' + Date.now().toString(),
      sender: 'AI',
      text: text.toUpperCase()
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