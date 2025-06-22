import React, { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import styles from "./Markdown.module.css";

type MemoizedMarkdownProps = {
  content: string;
  id: string;
};

export const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) =>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>,
  (prevProps, nextProps) => prevProps.content === nextProps.content,
);
MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

export const MemoizedMarkdown = memo(({ content, id }: MemoizedMarkdownProps) => {
  // In einfacheren Fällen reicht ein Block, komplexere Logik wäre möglich
  const blocks = useMemo(() => [content], [content]);
  return (
    <div className={styles.markdown}>
      {blocks.map((block, index) => (
        <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
      ))}
    </div>
  );
});
MemoizedMarkdown.displayName = 'MemoizedMarkdown';