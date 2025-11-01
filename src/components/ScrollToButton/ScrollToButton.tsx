'use client';

import { useEffect, useRef, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import buttonStyles from '../../css/buttonStyles.module.css';
import styles from './styles.module.css';

export default function ScrollToButton<T extends HTMLElement>({
  direction,
  scrollRef
}: {
  direction: 'up' | 'down',
  scrollRef: React.RefObject<T | null>
}) {
  const [visible, setVisible] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current !== null) {
        return; // Prevent multiple timeouts from being set
      }
      scrollTimeoutRef.current = setTimeout(() => {
        if (scrollRef.current) {
          const scrollHeight = scrollRef.current.scrollHeight;
          const clientHeight = scrollRef.current.clientHeight;
          const scrollTop = scrollRef.current.scrollTop;

          if (direction === 'up' && scrollTop > 0) {
            setVisible(true);
            // console.log('setVisible', true);
          } else if (direction === 'down' && scrollTop < scrollHeight - clientHeight) {
            setVisible(true);
            // console.log('setVisible', true);
          } else {
            setVisible(false);
            // console.log('setVisible', false);
          }
        }
        scrollTimeoutRef.current = null;
      }, 1000);
    };

    const currentRef = scrollRef.current;
    currentRef?.addEventListener('scroll', handleScroll);

    return () => {
      currentRef?.removeEventListener('scroll', handleScroll);
    };
  }, [direction, scrollRef]);

  const handleClick = () => {
    setVisible(false);
    const scrollTo = direction === 'up' ? 0 : scrollRef.current?.scrollHeight;
    scrollRef.current?.scrollTo({ top: scrollTo, behavior: 'auto' });
  };

  return (
    <button
      className={styles.button + " " + buttonStyles.iconButton}
      onClick={handleClick}
      data-show={visible}
    >
      {direction === 'up' ? <BsChevronUp /> : <BsChevronDown />}
    </button>
  );
}