import { useCallback, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  life: number;
  opacity: number;
  reset: () => void;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

interface ParticleOptions {
  count: number;
  color: string;
  size: [number, number];
  speed: [number, number];
  opacity: [number, number];
}

export const useParticleSystem = () => {
  const particlesRef = useRef<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const optionsRef = useRef<ParticleOptions>({
    count: 50,
    color: "#4CAF50",
    size: [1, 5],
    speed: [-1.5, 1.5],
    opacity: [0.1, 0.5]
  });
  const animationIdRef = useRef<number | null>(null);

  // Create a particle factory
  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const [minSize, maxSize] = optionsRef.current.size;
    const [minSpeed, maxSpeed] = optionsRef.current.speed;
    const [minOpacity, maxOpacity] = optionsRef.current.opacity;
    const baseColor = optionsRef.current.color;
    
    // Parse the hex color and create variations
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    const particle: Particle = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * (maxSize - minSize) + minSize,
      speedX: Math.random() * (maxSpeed - minSpeed) + minSpeed,
      speedY: Math.random() * (maxSpeed - minSpeed) + minSpeed,
      color: `rgba(${r + Math.random() * 50}, ${g + Math.random() * 30}, ${b + Math.random() * 30}, 1)`,
      life: Math.random() * 200 + 50,
      opacity: Math.random() * (maxOpacity - minOpacity) + minOpacity,
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (maxSize - minSize) + minSize;
        this.speedX = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        this.speedY = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        this.color = `rgba(${r + Math.random() * 50}, ${g + Math.random() * 30}, ${b + Math.random() * 30}, 1)`;
        this.life = Math.random() * 200 + 50;
        this.opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
      },
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        
        if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      },
      
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };
    
    return particle;
  }, []);

  // Initialize the particle system
  const init = useCallback((
    canvas: HTMLCanvasElement, 
    ctx: CanvasRenderingContext2D, 
    options: ParticleOptions
  ) => {
    canvasRef.current = canvas;
    ctxRef.current = ctx;
    optionsRef.current = options;
    
    particlesRef.current = [];
    
    // Create particles
    for (let i = 0; i < options.count; i++) {
      particlesRef.current.push(createParticle(canvas));
    }
  }, [createParticle]);

  // Animation loop
  const animate = useCallback(() => {
    if (!canvasRef.current || !ctxRef.current) return 0;
    
    const ctx = ctxRef.current;
    
    // Animation frame function
    const frame = () => {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      animationIdRef.current = requestAnimationFrame(frame);
    };
    
    // Start the animation
    animationIdRef.current = requestAnimationFrame(frame);
    
    return animationIdRef.current;
  }, []);

  // Handle canvas resize
  const resize = useCallback((canvas: HTMLCanvasElement) => {
    if (particlesRef.current.length === 0) return;
    
    // Update particles for new canvas dimensions
    particlesRef.current.forEach(particle => {
      if (particle.x > canvas.width) particle.x = Math.random() * canvas.width;
      if (particle.y > canvas.height) particle.y = Math.random() * canvas.height;
    });
  }, []);

  return { init, animate, resize };
};
