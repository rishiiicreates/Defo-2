import { useEffect, useRef } from "react";
import { setupParallaxEffect } from "@/lib/animations";

interface ParallaxLayerProps {
  depth: number;
  className?: string;
  backgroundImage: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const ParallaxLayer = ({ 
  depth, 
  className = "", 
  backgroundImage,
  style = {},
  children
}: ParallaxLayerProps) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Find the parent horizontal section
    if (layerRef.current) {
      sectionRef.current = layerRef.current.closest('.horizontal-section') as HTMLElement;
      
      if (sectionRef.current && depth) {
        const animation = setupParallaxEffect(layerRef.current, depth, { current: sectionRef.current });
        
        return () => {
          animation?.kill();
        };
      }
    }
  }, [depth]);

  return (
    <div 
      ref={layerRef}
      className={`parallax-layer absolute inset-0 bg-center bg-cover ${className}`}
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        ...style
      }}
      data-depth={depth}
    >
      {children}
    </div>
  );
};

export default ParallaxLayer;
