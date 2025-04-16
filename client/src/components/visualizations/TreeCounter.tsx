import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface TreeCounterProps {
  treesPerSecond?: number;
}

const TreeCounter = ({ treesPerSecond = 30 }: TreeCounterProps) => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const updateCounter = () => {
      setCount(prevCount => prevCount + treesPerSecond / 10);
    };

    intervalRef.current = window.setInterval(updateCounter, 100);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [treesPerSecond]);

  return (
    <motion.div 
      className="fixed bottom-8 left-8 z-[100] mix-blend-difference font-display"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <div className="text-xs uppercase tracking-widest mb-1">
        Trees lost since you opened this page
      </div>
      <div className="text-4xl font-bold text-forest-light">
        {Math.floor(count).toLocaleString()}
      </div>
    </motion.div>
  );
};

export default TreeCounter;
