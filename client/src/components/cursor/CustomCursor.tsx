import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.interactive-element')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.interactive-element')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Hide on mobile devices
  if (window.innerWidth <= 768) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          mixBlendMode: "difference",
        }}
        animate={{
          x: position.x,
          y: position.y,
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          backgroundColor: isHovering ? "rgba(76, 175, 80, 0.2)" : "transparent",
        }}
        transition={{
          x: { duration: 0.1, ease: "linear" },
          y: { duration: 0.1, ease: "linear" },
          width: { duration: 0.3, ease: "easeOut" },
          height: { duration: 0.3, ease: "easeOut" },
          backgroundColor: { duration: 0.3, ease: "easeOut" },
        }}
      >
        <div 
          className="w-full h-full rounded-full border-2 border-[#4CAF50]"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </motion.div>

      <motion.div
        className="fixed pointer-events-none z-[10000] bg-[#4CAF50] rounded-full w-2 h-2"
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          duration: 0.05,
          ease: "linear",
        }}
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
};

export default CustomCursor;
