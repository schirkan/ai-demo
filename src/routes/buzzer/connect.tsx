"use client";

import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { createFileRoute } from '@tanstack/react-router';
import ChatInput from "../../components/ChatInput/ChatInput";
import styles from "./connect.module.css";
import type { Socket } from "socket.io-client";
import PushButton from "@/components/PushButton/PushButton";

export const Route = createFileRoute('/buzzer/connect')({
  component: BuzzerConnectPage,
});

const getRoomIdFromQuery = () => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.has("roomId")) return params.get("roomId")!;
  }
  return "";
};

export default function BuzzerConnectPage() {
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRoomId(getRoomIdFromQuery());
    }
  }, []);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  // WebSocket-Status
  const [wsStatus, setWsStatus] = useState<"verbunden" | "getrennt" | "fehler">("getrennt");
  const [wsError, setWsError] = useState<string | null>(null);
  const [roomState, setRoomState] = useState<{
    state: string;
    winner?: string;
    players?: Array<string>;
    chat?: Array<{ name: string; text: string }>;
  } | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  useEffect(() => {
    // Clean up socket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 30) {
      setError("Name darf maximal 30 Zeichen lang sein.");
    } else {
      setError(null);
    }
    setName(value);
  };

  const handleJoin = () => {
    setWsError(null);
    setWsStatus("getrennt");
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    const socket = io({ path: "/api/buzzer-socket" });
    socketRef.current = socket;

    socket.on("connect", () => {
      setWsStatus("verbunden");
      setWsError(null);
      socket.emit("join", { roomId, name });
    });

    socket.on("error", (data: { message: string }) => {
      setWsStatus("fehler");
      setWsError(data.message);
      setJoined(false);
      setTimeout(() => setWsError(null), 4000); // Fehler nach 4s ausblenden
      socket.disconnect();
    });

    socket.on("connect_error", () => {
      setWsStatus("fehler");
      setWsError("Verbindung zum Server fehlgeschlagen.");
    });

    socket.on("room_state", (data) => {
      setJoined(true);
      setWsStatus("verbunden");
      setWsError(null);
      setRoomState({
        state: data.state,
        winner: data.winner,
        players: data.players,
        chat: data.chat,
      });
      if (data.state !== "buzzed" || data.winner !== name) {
        setChatInput("");
        setSendingChat(false);
      }
    });

    socket.on("disconnect", () => {
      setWsStatus("getrennt");
      setWsError("Verbindung geschlossen.");
      setJoined(false);
    });
  };

  const handleBuzz = () => {
    if (socketRef.current && joined) {
      socketRef.current.emit("buzz");
    }
  };

  // ChatInput-Komponente übernimmt die Texteingabe
  const handleSendChat = (text: string) => {
    if (socketRef.current && joined && text.trim()) {
      setSendingChat(true);
      socketRef.current.emit("input", { name, text });
      // Das Server-Event setzt das Input zurück
    }
  };

  const isWinner = roomState?.state === "buzzed" && roomState.winner === name;

  return (
    <main className={styles.main}>
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
      <h1 className={styles.heading}>Buzzer Connect</h1>
      <div className={styles.roomId}>
        Raum-ID:&nbsp;
        <input
          type="text"
          value={roomId}
          onChange={e => {
            const newRoomId = e.target.value;
            setRoomId(newRoomId);
            if (typeof window !== "undefined") {
              const params = new URLSearchParams(window.location.search);
              if (newRoomId) {
                params.set("roomId", newRoomId);
              } else {
                params.delete("roomId");
              }
              window.history.replaceState(
                {},
                "",
                `${window.location.pathname}?${params.toString()}`
              );
            }
          }}
          className={styles.nameInput}
          style={{ maxWidth: 200, display: "inline-block" }}
          disabled={joined}
        />
      </div>
      <div>
        <label>
          Name:&nbsp;
          <input
            className={styles.nameInput}
            type="text"
            value={name}
            onChange={handleNameChange}
            maxLength={30}
            placeholder="Dein Name"
            disabled={joined}
          />
        </label>
        {error && <div className={styles.status} style={{ color: "red" }}>{error}</div>}
        {wsError && <div className={styles.status} style={{ color: "red" }}>{wsError}</div>}
      </div>
      {!joined ? (
        <button
          className={`${styles.buzzerButton} ${styles.connectButton}`}
          disabled={!name || !!error}
          onClick={handleJoin}
        >
          Verbinden
        </button>
      ) : isWinner ? (
        <div className={styles.chatInputContainer}>
          <ChatInput
            onSubmit={handleSendChat}
            placeholder="Antwort eingeben..."
            loading={sendingChat}
            initialValue={chatInput}
          />
        </div>
      ) : (
        <>
          <button
            className={styles.buzzerButton}
            onClick={handleBuzz}
            disabled={roomState?.state !== "free"}
            style={{
              opacity: roomState?.state === "free" ? 1 : 0.5,
            }}
          >
            BUZZER
          </button>
          <PushButton
            className={styles.buzzerButton}
            onClick={handleBuzz}
            disabled={roomState?.state !== "free"}
            style={{ opacity: roomState?.state === "free" ? 1 : 0.5 }}
          >
            BUZZER
          </PushButton>
        </>
      )}
    </main>
  );
}
