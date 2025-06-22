'use client';
import { useEffect, useRef } from "react";

export default function ScrollIntoView({ trigger }: { trigger: unknown }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [trigger]);

  return <div ref={messagesEndRef} />;
}