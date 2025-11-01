'use client';

import { useState } from 'react';
import { BsPencil, BsPlus, BsTrash } from "react-icons/bs";

import buttonStyles from '../../css/buttonStyles.module.css';
import styles from './styles.module.css';
import type { ChatLogMeta } from "@/hooks/useChatLog";

export interface ChatLogUiProps {
  chatLogs: Array<ChatLogMeta>;
  selectedChatLogId: string | null;
  onAdd: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

export default function ChatLog({
  chatLogs,
  selectedChatLogId,
  onAdd,
  onSelect,
  onDelete,
  onRename,
}: ChatLogUiProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleEdit = (id: string, title: string) => {
    setEditId(id);
    setEditValue(title);
  };

  const handleEditSubmit = (id: string) => {
    if (editValue.trim()) {
      onRename(id, editValue.trim());
    }
    setEditId(null);
    setEditValue('');
  };

  return (
    <div className={styles.container}>
      <ul>
        <li className={styles.listItem + ' ' + styles.startItem}>
          <span className={styles.title}>
            Chat history
          </span>
          <span className={styles.actions}>
            <button type="button" onClick={() => onAdd()} className={buttonStyles.iconButton} title="Start new chat">
              <BsPlus />&nbsp;New
            </button>
          </span>
        </li>
        {chatLogs.map((entry) => (
          <li key={entry.id} onClick={() => onSelect(entry.id)}
            className={styles.listItem + (entry.id === selectedChatLogId ? ' ' + styles.selected : '')}
          >
            <span className={styles.title} title={entry.title}>
              {editId === entry.id ? (
                <input
                  className={styles.editInput}
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => handleEditSubmit(entry.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleEditSubmit(entry.id);
                    if (e.key === 'Escape') setEditId(null);
                  }}
                  autoFocus
                />
              ) : (
                entry.title === '' ? 'new chat' : entry.title
              )}
            </span>
            <span className={styles.actions}>
              <button type="button" className={buttonStyles.iconButton} title="Edit"
                onClick={e => {
                  e.stopPropagation();
                  handleEdit(entry.id, entry.title);
                }}>
                <BsPencil />
              </button>
              <button type="button" className={buttonStyles.iconButton} title="Delete"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(entry.id);
                }}>
                <BsTrash />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
