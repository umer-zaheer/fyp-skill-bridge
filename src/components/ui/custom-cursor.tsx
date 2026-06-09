

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [cursorVariant, setCursorVariant] = useState("default");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 35, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for different interactive elements
      if (target.closest("[data-cursor='card']")) {
        setCursorVariant("card");
      } else if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-cursor='pointer']")
      ) {
        setCursorVariant("pointer");
      } else {
        setCursorVariant("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  const variants = {
    default: {
      height: 12,
      width: 12,
      backgroundColor: "#d4af37", // Gold
      x: "-50%",
      y: "-50%",
      opacity: 1,
    },
    pointer: {
      height: 48,
      width: 48,
      backgroundColor: "rgba(212, 175, 55, 0.1)", // Transparent Gold
      border: "1px solid #d4af37",
      x: "-50%",
      y: "-50%",
    },
    card: {
      height: 70,
      width: 70,
      backgroundColor: "#d4af37",
      borderRadius: "0%", // Becomes square
      mixBlendMode: "difference" as const,
      x: "-50%",
      y: "-50%",
    },
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-9999 pointer-events-none rounded-full flex items-center justify-center"
        style={{
          translateX: cursorX,
          translateY: cursorY,
        }}
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      ></motion.div>

      {/* Secondary Glow Dot that follows closely */}
      <motion.div
        className="fixed top-0 left-0 z-9998 pointer-events-none w-4 h-4 bg-orange-500/50 rounded-full blur-md"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          x: "-50%",
          y: "-50%",
        }}
      />
    </>
  );
};
