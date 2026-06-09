

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  words: string[];
  className?: string;
  cursorClassName?: string;
  delay?: number;
  deleteDelay?: number;
  pause?: number;
}

export function Typewriter({
  words,
  className,
  cursorClassName,
  delay = 100,
  deleteDelay = 50,
  pause = 2000,
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length - 1));
        if (currentText.length <= 1) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }, deleteDelay);
    } else {
      timeout = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length + 1));
        if (currentText.length + 1 >= word.length) {
          // Wait before deleting
          setTimeout(() => setIsDeleting(true), pause);
        }
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [
    currentText,
    isDeleting,
    currentWordIndex,
    words,
    delay,
    deleteDelay,
    pause,
  ]);

  return (
    <span className={cn("inline-block font-sans", className)}>
      {currentText}
      <span
        className={cn(
          "animate-pulse ml-0.5 inline-block h-full w-0.5 align-middle bg-gold-500",
          cursorClassName,
        )}
      />
    </span>
  );
}
