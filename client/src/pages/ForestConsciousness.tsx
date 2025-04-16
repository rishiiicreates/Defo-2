import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "gsap";
import { DeforestationStat, SolutionAction } from "@shared/schema";

const ForestConsciousness = () => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const treeNetworkRef = useRef<HTMLDivElement>(null);
  const contentLayerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [branchesGrown, setBranchesGrown] = useState<string[]>([]);
  const [userPosition, setUserPosition] = useState({ x: 0, y: 0 });
  const [contentOpacity, setContentOpacity] = useState(0);
  const [guidanceVisible, setGuidanceVisible] = useState(true);
  const [growthLevel, setGrowthLevel] = useState(0);
  const [revealedContent, setRevealedContent] = useState<string[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Animations
  const treeAnimations = useAnimation();
  const contentAnimations = useAnimation();
  
  // Data fetching
  const { data: deforestationStats } = useQuery<DeforestationStat[]>({
    queryKey: ['/api/deforestation-stats'],
  });
  
  const { data: solutions } = useQuery<SolutionAction[]>({
    queryKey: ['/api/solutions'],
  });

  // Forest nodes structure (totally different from traditional navigation)
  const forestNodes = [
    { id: "consciousness", title: "Forest Consciousness", position: { x: 50, y: 50 }, connects: ["statistics", "stories"] },
    { id: "statistics", title: "Living Numbers", position: { x: 30, y: 30 }, connects: ["consequences"] },
    { id: "stories", title: "Forest Voices", position: { x: 70, y: 30 }, connects: ["solutions"] },
    { id: "consequences", title: "Broken Harmony", position: { x: 20, y: 70 }, connects: ["solutions"] },
    { id: "solutions", title: "Healing Actions", position: { x: 75, y: 70 }, connects: [] }
  ];
  
  // Initialize canvas and lifecycle
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas to full screen
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Forest living particles
    const particles: Particle[] = [];
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(76, 175, 80, ${Math.random() * 0.5 + 0.2})`;
        this.life = Math.random() * 100 + 50;
      }
      
      update(mouseX: number, mouseY: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // React to user mouse position - particles are attracted to it
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          this.speedX += dx * 0.001;
          this.speedY += dy * 0.001;
        }
        
        // Edge behavior - wrap around
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        this.life--;
        
        if (this.life <= 0) {
          this.reset();
        }
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.life = Math.random() * 100 + 50;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create initial particles
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }
    
    // Animation function
    let animationId: number | null = null;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw neural-like connections between particles that are close
      ctx.strokeStyle = 'rgba(76, 175, 80, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update(mouseX, mouseY);
        particle.draw(ctx);
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setUserPosition({ x: e.clientX, y: e.clientY });
    };
    
    // Touch support
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        setUserPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    // Start animation
    animate();
    
    // Auto-grow initial node after few seconds
    setTimeout(() => {
      growBranch("consciousness");
    }, 2000);
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);
  
  // Grow branch effect
  const growBranch = (nodeId: string) => {
    if (branchesGrown.includes(nodeId)) return;
    
    // Mark branch as grown
    setBranchesGrown(prev => [...prev, nodeId]);
    setActiveNode(nodeId);
    
    // Reveal content for this node
    if (!revealedContent.includes(nodeId)) {
      setRevealedContent(prev => [...prev, nodeId]);
    }
    
    // Increase growth level
    setGrowthLevel(prev => prev + 1);
    
    // Play growth sound if audio enabled
    if (audioEnabled) {
      const growthSound = new Audio('/growth-sound.mp3');
      growthSound.volume = 0.2;
      growthSound.play().catch(e => console.log("Audio play failed:", e));
    }
    
    // Hide guidance after first growth
    if (guidanceVisible) {
      setGuidanceVisible(false);
    }
  };
  
  // Handle node interaction
  const handleNodeInteraction = (nodeId: string) => {
    growBranch(nodeId);
    
    // Animate content layer
    contentAnimations.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    });
    
    // Find node connections and grow them after a delay
    const node = forestNodes.find(n => n.id === nodeId);
    if (node && node.connects.length > 0) {
      node.connects.forEach((connectedId, index) => {
        setTimeout(() => {
          growBranch(connectedId);
        }, 1500 * (index + 1));
      });
    }
  };
  
  // Toggle audio
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };
  
  // Custom styling for a natural look based on growth level
  const getNodeStyle = (nodeId: string) => {
    const isGrown = branchesGrown.includes(nodeId);
    const isActive = activeNode === nodeId;
    
    return {
      opacity: isGrown ? 1 : 0.2,
      scale: isActive ? 1.2 : 1,
      backgroundColor: isActive ? "rgba(139, 195, 74, 0.9)" : "rgba(76, 175, 80, 0.7)",
      boxShadow: isActive 
        ? "0 0 20px rgba(139, 195, 74, 0.8)" 
        : isGrown 
          ? "0 0 10px rgba(76, 175, 80, 0.5)" 
          : "none"
    };
  };
  
  // Get content for the active node
  const getNodeContent = (nodeId: string | null) => {
    if (!nodeId) return null;
    
    switch(nodeId) {
      case "consciousness":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-forest-light">
              The Forest is <span className="font-accent">Alive</span>
            </h1>
            <p className="text-lg md:text-xl mb-8">
              You have entered the forest consciousness. Here, you don't just view information - 
              you become part of a living system where your actions affect how knowledge is revealed.
            </p>
            <p className="text-md italic text-forest-accent">
              Move your cursor to awaken the forest particles. Click on glowing nodes to grow the network.
            </p>
          </motion.div>
        );
        
      case "statistics":
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-forest-light text-center">
              Living Numbers
            </h2>
            <div className="bg-black bg-opacity-50 p-6 rounded-xl backdrop-blur-sm">
              <div className="space-y-4">
                {deforestationStats?.map((stat, index) => (
                  <motion.div 
                    key={stat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    className="flex items-center"
                  >
                    <div className="w-full bg-gray-800 h-8 rounded-lg overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percentOfTotal}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
                        className="h-full bg-forest-light flex items-center px-3"
                      >
                        <span className="text-xs font-semibold text-black whitespace-nowrap">
                          {stat.region}: {(stat.hectaresLost / 1000000).toFixed(1)}M hectares
                        </span>
                      </motion.div>
                    </div>
                    <span className="ml-2 w-12 text-right text-sm">{stat.percentOfTotal}%</span>
                  </motion.div>
                ))}
              </div>
              <p className="mt-6 text-sm text-forest-accent">
                Every second, approximately 1 hectare of forest is lost - an area larger than a football field.
              </p>
            </div>
          </motion.div>
        );
        
      case "stories":
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-center">
              <span className="text-forest-light">Forest</span> Voices
            </h2>
            
            <div className="relative">
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-black bg-opacity-40 p-6 rounded-lg backdrop-blur-sm mb-6"
              >
                <blockquote className="italic text-lg relative">
                  <span className="font-accent text-5xl text-forest-light absolute -top-6 -left-4 opacity-50">"</span>
                  The forest that once surrounded our village is now gone. With it went our medicine, our food security, and the spirits of our ancestors. We are the last generation to know what it was like to live in harmony with the forest.
                  <footer className="text-sm mt-4 text-right">
                    — Raoni Metuktire, Indigenous Leader
                  </footer>
                </blockquote>
              </motion.div>
              
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="bg-black bg-opacity-40 p-6 rounded-lg backdrop-blur-sm transform -rotate-1"
              >
                <blockquote className="italic text-lg relative">
                  <span className="font-accent text-5xl text-forest-light absolute -top-6 -left-4 opacity-50">"</span>
                  When you enter an old-growth forest, you feel a presence that goes beyond the individual trees. There's a communication happening beneath your feet - a vast mycelial network connecting everything in a symphony of life that has been developing for centuries.
                  <footer className="text-sm mt-4 text-right">
                    — Dr. Suzanne Simard, Forest Ecologist
                  </footer>
                </blockquote>
              </motion.div>
            </div>
          </motion.div>
        );
        
      case "consequences":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-warning text-center">
              Broken Harmony
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="bg-black bg-opacity-40 p-4 rounded-lg backdrop-blur-sm"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-warning bg-opacity-20 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Climate Crisis</h3>
                <p className="text-sm">Deforestation is responsible for 15% of global carbon emissions, creating a feedback loop of warming that threatens all ecosystems.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="bg-black bg-opacity-40 p-4 rounded-lg backdrop-blur-sm"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-warning bg-opacity-20 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Biodiversity Loss</h3>
                <p className="text-sm">Up to 28,000 species are expected to become extinct in the coming decades due to deforestation of their habitats.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="bg-black bg-opacity-40 p-4 rounded-lg backdrop-blur-sm"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-warning bg-opacity-20 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Water Cycle Disruption</h3>
                <p className="text-sm">Forests regulate water cycles through transpiration and soil stabilization. Their loss leads to flooding, drought and erosion.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="bg-black bg-opacity-40 p-4 rounded-lg backdrop-blur-sm"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-warning bg-opacity-20 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Cultural Extinction</h3>
                <p className="text-sm">Indigenous communities who have lived sustainably with forests for millennia are being displaced, along with their invaluable knowledge.</p>
              </motion.div>
            </div>
          </motion.div>
        );
        
      case "solutions":
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-center">
              <span className="text-forest-light">Healing</span> Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {solutions?.map((solution, index) => (
                <motion.div
                  key={solution.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="bg-black bg-opacity-50 p-5 rounded-xl backdrop-blur-sm transform transition-transform duration-500 hover:scale-105"
                >
                  <div className="w-16 h-16 mx-auto flex items-center justify-center bg-forest-light bg-opacity-20 rounded-full mb-4 text-forest-light">
                    {solution.icon === "plus" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                    {solution.icon === "shopping-cart" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                    {solution.icon === "megaphone" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-center mb-2 text-forest-accent">{solution.title}</h3>
                  <p className="text-sm mb-4 text-center">{solution.description}</p>
                  
                  <motion.a
                    href={solution.actionLink}
                    className="block text-center py-2 bg-forest-light text-black rounded-full font-semibold text-sm hover:bg-forest-accent transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {solution.actionText}
                  </motion.a>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-10 text-center"
            >
              <p className="text-lg font-display mb-4">
                Forests don't need humans to survive, but humans need forests.
              </p>
              <motion.a
                href="#"
                className="inline-block px-8 py-3 bg-forest-light text-black rounded-full font-bold text-lg hover:bg-forest-accent transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join the Regrowth
              </motion.a>
            </motion.div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-black to-forest-dark"
    >
      {/* Living background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Tree network layer */}
      <div 
        ref={treeNetworkRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        {/* Connection lines between nodes */}
        <svg className="absolute inset-0 w-full h-full">
          {forestNodes.map(node => (
            node.connects.map(targetId => {
              const targetNode = forestNodes.find(n => n.id === targetId);
              if (!targetNode) return null;
              
              const isGrown = branchesGrown.includes(node.id) && branchesGrown.includes(targetId);
              
              return (
                <motion.line 
                  key={`${node.id}-${targetId}`}
                  x1={`${node.position.x}%`}
                  y1={`${node.position.y}%`}
                  x2={`${targetNode.position.x}%`}
                  y2={`${targetNode.position.y}%`}
                  stroke="#4CAF50"
                  strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isGrown ? { 
                    pathLength: 1, 
                    opacity: 0.6,
                    transition: { duration: 2, ease: "easeInOut" }
                  } : { pathLength: 0, opacity: 0 }}
                />
              );
            })
          ))}
        </svg>
        
        {/* Forest nodes */}
        {forestNodes.map(node => (
          <motion.div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto"
            style={{ 
              left: `${node.position.x}%`, 
              top: `${node.position.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={branchesGrown.includes("consciousness") ? {
              opacity: getNodeStyle(node.id).opacity,
              scale: getNodeStyle(node.id).scale,
              backgroundColor: getNodeStyle(node.id).backgroundColor,
              boxShadow: getNodeStyle(node.id).boxShadow,
              transition: { 
                duration: 0.8, 
                delay: node.id === "consciousness" ? 0 : 0.5
              }
            } : { opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => handleNodeInteraction(node.id)}
          >
            {node.id === "consciousness" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            )}
            {node.id === "statistics" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )}
            {node.id === "stories" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            )}
            {node.id === "consequences" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {node.id === "solutions" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* User cursor trail */}
      <motion.div
        className="absolute w-6 h-6 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,195,74,0.6) 0%, rgba(76,175,80,0) 70%)",
          left: userPosition.x,
          top: userPosition.y,
          transform: "translate(-50%, -50%)"
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 0.3, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Content display layer */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            ref={contentLayerRef}
            className="absolute inset-0 w-full h-full flex items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
          >
            <div className="pointer-events-auto">
              {getNodeContent(activeNode)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Guidance overlay */}
      <AnimatePresence>
        {guidanceVisible && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="text-center max-w-md p-6">
              <motion.h2 
                className="text-3xl font-display mb-4 text-forest-light"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Welcome to Forest Consciousness
              </motion.h2>
              <p className="mb-8">
                Move your cursor to influence the forest. The ecosystem will respond to your presence and reveal its secrets.
              </p>
              <motion.button
                className="px-6 py-3 bg-forest-light text-black rounded-full font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGuidanceVisible(false)}
              >
                Enter the Forest
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Audio toggle */}
      <motion.button
        className={`absolute top-6 right-6 p-3 rounded-full z-50 ${
          audioEnabled ? 'bg-forest-light bg-opacity-90' : 'bg-black bg-opacity-50'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAudio}
      >
        {audioEnabled ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zm7.07-4.243l3.536 3.536m0-7.072L12.657 10.7" />
          </svg>
        )}
      </motion.button>
      
      {/* Tree growth indicator */}
      <div className="absolute bottom-6 left-6 z-50">
        <div className="text-xs text-forest-accent mb-2">Forest Growth: {Math.round((growthLevel / 5) * 100)}%</div>
        <div className="w-32 h-2 bg-black bg-opacity-50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-forest-light"
            initial={{ width: 0 }}
            animate={{ width: `${(growthLevel / 5) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ForestConsciousness;