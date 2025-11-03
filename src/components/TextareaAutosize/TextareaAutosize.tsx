import React, { useCallback, useEffect, useRef } from "react";

export default function TextareaAutosize(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: React.Ref<HTMLTextAreaElement> }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { ref, ...restProps } = props;

  // Kombiniert den forwarded ref mit dem internen ref
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(textareaRef.current);
    } else {
      (ref).current = textareaRef.current;
    }
  }, [ref]);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [props.value, resizeTextarea]);

  return (
    <textarea
      rows={1}
      {...restProps}
      ref={textareaRef}
      onInput={(e) => {
        resizeTextarea();
        props.onInput && props.onInput(e);
      }}
      style={{
        ...props.style,
        overflow: "hidden",
        resize: "none",
        outline: "none"
      }}
    />
  );
};
