import { useRef, useEffect } from "react";
import { setupHorizontalScroll } from "@/lib/animations";
import ProgressBar from "./ProgressBar";

interface HorizontalScrollerProps {
  children: React.ReactNode;
  id?: string;
}

const HorizontalScroller = ({ children, id = "horizontal-scroller" }: HorizontalScrollerProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollTrigger = setupHorizontalScroll(sectionRef);
    
    return () => {
      // Cleanup animation on unmount
      scrollTrigger?.kill();
    };
  }, []);

  return (
    <>
      <ProgressBar sectionRef={sectionRef} progressBarRef={progressBarRef} />
      <section 
        ref={sectionRef} 
        id={id} 
        className="horizontal-section h-screen w-[500vw] flex flex-row relative"
      >
        {children}
      </section>
    </>
  );
};

export default HorizontalScroller;
