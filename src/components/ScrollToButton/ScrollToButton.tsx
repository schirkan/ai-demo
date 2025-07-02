'use client';
import { useEffect, useState } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import styles from './styles.module.css';
import buttonStyles from '../../css/buttonStyles.module.css';

export default function ScrollToButton<T extends HTMLElement>({
  direction,
  scrollRef
}: {
  direction: 'up' | 'down',
  scrollRef: React.RefObject<T | null>
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (scrollTimeout) {
        return; // Prevent multiple timeouts from being set
      }
      scrollTimeout = setTimeout(() => {
        if (scrollRef.current) {
          const scrollHeight = scrollRef.current.scrollHeight;
          const clientHeight = scrollRef.current.clientHeight;
          const scrollTop = scrollRef.current.scrollTop;

          if (direction === 'up' && scrollTop > 0) {
            setVisible(true);
          } else if (direction === 'down' && scrollTop < scrollHeight - clientHeight) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        }
        scrollTimeout = null;
      }, 1000);
    };

    const currentRef = scrollRef.current;
    currentRef?.addEventListener('scroll', handleScroll);

    return () => {
      currentRef?.removeEventListener('scroll', handleScroll);
    };
  }, [direction, scrollRef]);

  const handleClick = () => {
    const scrollTo = direction === 'up' ? 0 : scrollRef.current?.scrollHeight;
    scrollRef.current?.scrollTo({ top: scrollTo, behavior: 'smooth' });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <button
      className={styles.button + " " + buttonStyles.iconButton}
      onClick={handleClick}
    >
      {direction === 'up' ? <BsArrowUp /> : <BsArrowDown />}
    </button>
  );
}