import { useEffect, RefObject } from "react";
import { setupProgressBar } from "@/lib/animations";

interface ProgressBarProps {
  sectionRef: RefObject<HTMLElement>;
  progressBarRef: RefObject<HTMLDivElement>;
}

const ProgressBar = ({ sectionRef, progressBarRef }: ProgressBarProps) => {
  useEffect(() => {
    const progressTrigger = setupProgressBar(sectionRef, progressBarRef);
    
    return () => {
      progressTrigger?.kill();
    };
  }, [sectionRef, progressBarRef]);

  return (
    <div 
      ref={progressBarRef}
      className="fixed bottom-0 left-0 h-[5px] bg-forest-light z-[100] opacity-70"
      style={{ width: "0%" }}
    />
  );
};

export default ProgressBar;
