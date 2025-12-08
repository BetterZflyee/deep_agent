import React, { useState, useEffect, useRef } from 'react';
import styles from './Typewriter.module.css';

export interface TypewriterProps {
  /**
   * Array of strings to type out
   */
  words: string[];
  /**
   * Typing speed in ms per character (default: 150)
   */
  typeSpeed?: number;
  /**
   * Deleting speed in ms per character (default: 100)
   */
  deleteSpeed?: number;
  /**
   * Delay before starting to delete (default: 2000ms)
   */
  delay?: number;
  /**
   * Whether to loop infinitely (default: true)
   */
  loop?: boolean;
  /**
   * Custom class name for the wrapper
   */
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  words = [],
  typeSpeed = 150,
  deleteSpeed = 100,
  delay = 2000,
  loop = true,
  className = '',
}) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(typeSpeed);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!words.length) return;

    const i = loopNum % words.length;
    const fullText = words[i];

    const handleTyping = () => {
      if (!isMounted.current) return;

      setText(current => {
        if (isDeleting) {
          return fullText.substring(0, current.length - 1);
        } else {
          return fullText.substring(0, current.length + 1);
        }
      });

      // Typing Speed Logic
      setTypingSpeed(isDeleting ? deleteSpeed : typeSpeed);

      // If finished typing
      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), delay);
      }
      // If finished deleting
      else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typeSpeed, deleteSpeed, delay]);

  return (
    <div className={`${styles.typewriterWrapper} ${className}`}>
      <p className={styles.text}>{text}</p>
      <span className={styles.cursor} aria-hidden="true"></span>
    </div>
  );
};

export default Typewriter;
