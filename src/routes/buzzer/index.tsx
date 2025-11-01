"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { FiCopy } from "react-icons/fi";
import { createFileRoute } from '@tanstack/react-router';
import styles from "./buzzer.module.css";
import type { Socket } from "socket.io-client";
import QRCodeComponent from "@/components/QRCode/QRCode";

export const Route = createFileRoute('/buzzer/')({
  component: BuzzerPage,
});

type Player = {
  name: string;
  isWinner?: boolean;
};

type ChatEntry = {
  name: string;
  text: string;
};

const BUZZER_SOUND_URL = "/buzzer.mp3"; // Sounddatei im public-Ordner

export default function BuzzerPage() {
  const [roomId, setRoomId] = useState<string>("");
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newRoomId = uuidv4();
      setRoomId(newRoomId);
      setQrUrl(`${window.location.origin}/buzzer-connect?roomId=${newRoomId}`);
    }
  }, []);

  const [players, setPlayers] = useState<Array<Player>>([]);
  const [status, setStatus] = useState<string>("frei");
  const [winner, setWinner] = useState<string | null>(null);
  const [chat, setChat] = useState<Array<ChatEntry>>([]);
  const socketRef = useRef<Socket | null>(null);
  const prevStatus = useRef<string>("frei");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // WebSocket-Status
  const [wsStatus, setWsStatus] = useState<"verbunden" | "getrennt" | "fehler">("getrennt");
  const [wsError, setWsError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // Vor dem Verbindungsaufbau die API-Route initialisieren
    let socket: Socket | null = null;
    let isMounted = true;

    const connectSocket = async () => {
      try {
        await fetch("/api/socket");
        socket = io(':8081', {
          path: "/api/buzzer-socket",
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          if (!isMounted) return;
          setWsStatus("verbunden");
          setWsError(null);
          socket!.emit("join", { roomId, name: "__MODERATOR__" });
        });

        socket.on("room_state", (data) => {
          if (!isMounted) return;
          setPlayers(
            (data.players || []).map((name: string) => ({
              name,
              isWinner: data.winner === name,
            }))
          );
          setStatus(data.state);
          setWinner(data.winner || null);
          setChat(data.chat || []);
        });

        socket.on("disconnect", () => {
          if (!isMounted) return;
          setWsStatus("getrennt");
        });

        socket.on("connect_error", (err) => {
          if (!isMounted) return;
          console.error(err);
          setWsStatus("fehler");
          setWsError("Verbindung zum Server fehlgeschlagen.");
        });

        socket.on("error", (err) => {
          if (!isMounted) return;
          setWsStatus("fehler");
          setWsError(typeof err === "string" ? err : "Unbekannter Fehler.");
        });
      } catch (e) {
        if (!isMounted) return;
        setWsStatus("fehler");
        setWsError("Fehler beim Initialisieren der Verbindung.");
      }
    };

    connectSocket();

    return () => {
      isMounted = false;
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomId]);

  // Soundeffekt abspielen, wenn Status von "free" auf "buzzed" wechselt
  useEffect(() => {
    if (prevStatus.current === "free" && status === "buzzed") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
    prevStatus.current = status;
  }, [status]);


  return (
    <main className={styles.main}>
      <audio ref={audioRef} src={BUZZER_SOUND_URL} preload="auto" />
      {/* WebSocket-Statusanzeige */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <span
          style={{
            display: "inline-block",
            padding: "0.3rem 1rem",
            borderRadius: "0.7rem",
            background:
              wsStatus === "verbunden"
                ? "#28a745"
                : wsStatus === "getrennt"
                  ? "#ffc107"
                  : "#dc3545",
            color: "#fff",
            fontWeight: 600,
            marginRight: "0.7rem",
          }}
        >
          {wsStatus === "verbunden" && "WebSocket verbunden"}
          {wsStatus === "getrennt" && "WebSocket getrennt"}
          {wsStatus === "fehler" && "WebSocket Fehler"}
        </span>
        {wsError && (
          <span style={{ color: "#dc3545", fontWeight: 500 }}>{wsError}</span>
        )}
      </div>
      <h1 className={styles.heading}>
        Buzzer (Moderator-/Anzeige-Ansicht)
      </h1>
      <p className={styles.description}>
        Diese Seite zeigt den aktuellen Status des Buzzer-Raums, die verbundenen Spieler, den Chatverlauf und einen QR-Code zum Beitreten.
      </p>
      <section className={styles.sectionCenter}>
        <h2 className={styles.sectionTitle}>Raum beitreten</h2>
        <QRCodeComponent value={qrUrl} size={180} />
        <div className={styles.qrRow}>
          <input
            type="text"
            value={qrUrl}
            readOnly
            className={styles.qrInput}
            aria-label="Beitrittslink"
            onFocus={e => e.target.select()}
          />
          <button
            type="button"
            className={styles.qrCopyButton}
            onClick={() => {
              navigator.clipboard.writeText(qrUrl);
            }}
            aria-label="Link kopieren"
            title="Link kopieren"
          >
            <FiCopy size={20} />
          </button>
        </div>
        <p className={styles.qrHint}>QR-Code scannen, um dem Raum beizutreten.</p>
        <p className={styles.roomIdText}>Raum-ID: <b>{roomId}</b></p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Spieler</h2>
        <ul className={styles.playerList}>
          {players.map((p) => (
            <li
              key={p.name}
              className={
                p.isWinner
                  ? `${styles.playerItem} ${styles.playerWinner}`
                  : styles.playerItem
              }
            >
              <span className={styles.playerName}>{p.name}</span>
              {p.isWinner && (
                <span className={styles.trophy}>🏆</span>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Status</h2>
        <div
          className={
            status === "buzzed"
              ? `${styles.statusBox} ${styles.statusBuzzed}`
              : `${styles.statusBox} ${styles.statusFree}`
          }
        >
          {status === "free" && "Buzzer frei"}
          {status === "buzzed" && winner && (
            <span>
              {winner} hat gebuzzert!
            </span>
          )}
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Chatverlauf</h2>
        <ul className={styles.chatList}>
          {chat.map((entry, idx) => (
            <li
              key={idx}
              className={styles.chatItem}
            >
              <b>{entry.name}:</b> {entry.text}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
