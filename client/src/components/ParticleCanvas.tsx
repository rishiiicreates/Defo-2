import { useEffect, useRef } from "react";
import { useParticleSystem } from "@/hooks/use-particle-system";

interface ParticleCanvasProps {
  count?: number;
  color?: string;
  size?: [number, number];
  speed?: [number, number];
  opacity?: [number, number];
}

const ParticleCanvas = ({
  count = 50,
  color = "#4CAF50",
  size = [1, 5],
  speed = [-1.5, 1.5],
  opacity = [0.1, 0.5]
}: ParticleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize and use the particle system
  const { init, animate, resize } = useParticleSystem();
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Initialize particle system
    init(canvas, ctx, {
      count,
      color,
      size,
      speed,
      opacity
    });
    
    // Start animation
    const animationId = animate();
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      resize(canvas);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [count, color, size, speed, opacity, init, animate, resize]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ParticleCanvas;
