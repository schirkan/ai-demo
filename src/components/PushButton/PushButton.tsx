import styles from "./PushButton.module.css";

type PushButtonProps = {
  hslDeg?: number
}

// see https://www.joshwcomeau.com/animation/3d-button/
export default function PushButton({ children, hslDeg = 340, ...buttonProps }:
  PushButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button {...buttonProps} className={styles.pushable} style={{ '--hsl-deg': hslDeg } as React.CSSProperties}>
      <span className={styles.shadow}></span>
      <span className={styles.edge}></span>
      <span className={styles.front}>{children}</span>
    </button>
  );
}
