import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { setupFadeInAnimation } from "@/lib/animations";
import ParallaxLayer from "./ParallaxLayer";
import DeforestationChart from "./visualizations/DeforestationChart";
import { useQuery } from "@tanstack/react-query";
import { SolutionAction } from "@shared/schema";

interface PanelProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Panel = ({ children, className = "", style }: PanelProps) => {
  return (
    <div className={`panel h-screen w-screen relative overflow-hidden ${className}`} style={style}>
      {children}
    </div>
  );
};

export const IntroPanel = () => {
  return (
    <Panel className="bg-gradient-to-r from-forest-dark to-black">
      <ParallaxLayer 
        depth={0.1} 
        className="z-0 opacity-10"
        backgroundImage="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      <div className="absolute inset-0 z-10 flex items-center justify-center px-8 md:px-16">
        <div className="max-w-3xl text-center">
          <motion.h1 
            className="text-5xl md:text-8xl font-display font-bold mb-8 tracking-tighter"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            The Forest <span className="text-forest-light">Breathes</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Every minute, we lose forest area equivalent to 40 football fields. This journey will show you the impact of deforestation and what we can do together.
          </motion.p>
          
          <motion.div 
            className="interactive-element inline-block transform hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <button 
              className="bg-forest-light text-bark px-10 py-5 rounded-full text-xl font-semibold focus:outline-none"
              onClick={() => {
                document.getElementById('rainforest-panel')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Begin The Journey
            </button>
          </motion.div>
          
          <motion.div 
            className="mt-16 animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <p className="text-sm uppercase tracking-widest">Scroll to explore</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </div>
    </Panel>
  );
};

export const RainforestPanel = () => {
  const fadeElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fadeElement.current) {
      const animation = setupFadeInAnimation(fadeElement.current);
      return () => {
        animation?.kill();
      };
    }
  }, []);

  return (
    <Panel id="rainforest-panel" className="overflow-hidden">
      <ParallaxLayer 
        depth={0.3} 
        className="z-0"
        backgroundImage="https://images.unsplash.com/photo-1516214104703-d870798883c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      <ParallaxLayer 
        depth={0.2} 
        className="z-1 forest-canopy"
        backgroundImage="https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        style={{ 
          top: "-50px", 
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" 
        }}
      />
      
      <div className="absolute inset-0 z-10 flex items-end justify-start p-16">
        <div 
          ref={fadeElement}
          className="max-w-lg mb-16 opacity-0 transition-opacity duration-1000"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Vibrant <span className="text-forest-light">Life</span>
          </h2>
          <p className="text-lg md:text-xl">
            Rainforests are Earth's most biodiverse ecosystems, housing over 50% of plant and animal species while covering just 6% of the surface. They're our planet's lungs, regulating our climate and air quality.
          </p>
        </div>
      </div>
      
      {/* Animated leaf */}
      <div className="absolute top-1/4 right-1/4 animate-[float_6s_ease-in-out_infinite]">
        <div className="w-20 h-20 rounded-full shadow-lg overflow-hidden transform-style-preserve-3d">
          <img 
            src="https://images.unsplash.com/photo-1550236520-7050f3582da0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
            alt="Green leaf" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Panel>
  );
};

export const DeforestationPanel = () => {
  const fadeElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fadeElement.current) {
      const animation = setupFadeInAnimation(fadeElement.current);
      return () => {
        animation?.kill();
      };
    }
  }, []);

  return (
    <Panel className="bg-earth-dark overflow-hidden">
      <ParallaxLayer 
        depth={0.1} 
        className="z-0 opacity-70"
        backgroundImage="https://images.unsplash.com/photo-1565098772267-60af42b81ef2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      <div className="absolute inset-0 z-10 flex items-center justify-end p-16">
        <div 
          ref={fadeElement}
          className="max-w-xl opacity-0 transition-opacity duration-1000"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-warning">
            Destruction <span className="font-accent">in Progress</span>
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Every year, we lose around 4.7 million hectares of forest - an area larger than Switzerland. Major drivers include agriculture expansion, logging, mining, and infrastructure development.
          </p>
          
          {/* Interactive visualization */}
          <div className="interactive-element bg-black bg-opacity-40 p-8 rounded-lg backdrop-filter backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">Global Forest Loss</h3>
            <DeforestationChart />
          </div>
        </div>
      </div>
    </Panel>
  );
};

export const ConsequencesPanel = () => {
  const fadeElement1 = useRef<HTMLDivElement>(null);
  const fadeElement2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fadeElement1.current && fadeElement2.current) {
      const animation1 = setupFadeInAnimation(fadeElement1.current);
      const animation2 = setupFadeInAnimation(fadeElement2.current);
      return () => {
        animation1?.kill();
        animation2?.kill();
      };
    }
  }, []);

  return (
    <Panel className="bg-gradient-to-br from-bark to-black overflow-hidden">
      <div className="absolute inset-0 z-10 flex items-center justify-center p-16">
        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            ref={fadeElement1}
            className="opacity-0 transition-opacity duration-1000"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              The <span className="text-warning">Consequences</span>
            </h2>
            <p className="text-lg md:text-xl mb-6">
              Deforestation has far-reaching effects that touch every aspect of our planet's health and humanity's future.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-warning rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Climate change acceleration with 15% of greenhouse emissions</span>
              </li>
              <li className="flex items-start">
                <div className="bg-warning rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Biodiversity loss with up to 28,000 species going extinct per year</span>
              </li>
              <li className="flex items-start">
                <div className="bg-warning rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Disrupted water cycles and increased flooding risks</span>
              </li>
              <li className="flex items-start">
                <div className="bg-warning rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Indigenous community displacement and cultural loss</span>
              </li>
            </ul>
          </div>
          
          <div className="narrative-panel flex items-center justify-center perspective-[1000px]">
            <div 
              ref={fadeElement2}
              className="bg-black bg-opacity-60 p-8 rounded-lg backdrop-filter backdrop-blur-sm transform rotate-3 interactive-element hover:rotate-0 transition-all duration-500 opacity-0 transition-opacity duration-1000"
            >
              <h3 className="text-xl font-accent mb-3 text-forest-light">Personal Story</h3>
              <blockquote className="italic text-lg">
                "The forest that once surrounded our village is now gone. With it went our medicine, our food security, and the spirits of our ancestors. We are the last generation to know what it was like to live in harmony with the forest."
                <footer className="text-sm mt-4 not-italic">
                  — Raoni Metuktire, Indigenous Leader
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export const SolutionsPanel = () => {
  const { data: solutions, isLoading } = useQuery<SolutionAction[]>({
    queryKey: ['/api/solutions'],
  });
  
  // Default solutions if API data isn't available yet
  const defaultSolutions: SolutionAction[] = [
    {
      id: 1,
      title: "Support Reforestation",
      description: "Fund tree planting initiatives and support organizations dedicated to forest restoration on a global scale.",
      icon: "plus",
      actionText: "Take action",
      actionLink: "#"
    },
    {
      id: 2,
      title: "Sustainable Consumption",
      description: "Choose products with sustainable forestry certifications and reduce your consumption of products linked to deforestation.",
      icon: "shopping-cart",
      actionText: "Learn how",
      actionLink: "#"
    },
    {
      id: 3,
      title: "Advocacy & Education",
      description: "Raise awareness about deforestation and support policies that protect forests and indigenous rights.",
      icon: "megaphone",
      actionText: "Spread the word",
      actionLink: "#"
    }
  ];

  const solutionActions = solutions || defaultSolutions;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'plus':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'shopping-cart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'megaphone':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <Panel className="bg-gradient-to-r from-forest-dark to-black overflow-hidden">
      <ParallaxLayer 
        depth={0.2} 
        className="z-0 opacity-30"
        backgroundImage="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          <motion.h2 
            className="text-4xl md:text-6xl font-display font-bold mb-10 text-center"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            What <span className="text-forest-light">We Can Do</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-black bg-opacity-40 p-6 rounded-xl backdrop-filter backdrop-blur-sm animate-pulse">
                  <div className="bg-forest-light bg-opacity-20 h-12 w-12 rounded-full mb-4"></div>
                  <div className="h-6 bg-white bg-opacity-20 rounded mb-2"></div>
                  <div className="h-20 bg-white bg-opacity-10 rounded mb-4"></div>
                  <div className="h-4 w-24 bg-forest-light bg-opacity-20 rounded"></div>
                </div>
              ))
            ) : (
              solutionActions.map((solution, index) => (
                <motion.div 
                  key={solution.id}
                  className="interactive-element bg-black bg-opacity-40 p-6 rounded-xl backdrop-filter backdrop-blur-sm"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="text-forest-light text-4xl mb-4">
                    {renderIcon(solution.icon)}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                  <p className="mb-4">{solution.description}</p>
                  <a href={solution.actionLink} className="text-forest-light hover:underline inline-flex items-center">
                    {solution.actionText}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </motion.div>
              ))
            )}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="interactive-element inline-block transform hover:scale-105 transition-transform duration-300">
              <a href="#" className="bg-forest-light text-bark px-10 py-5 rounded-full text-xl font-semibold inline-block focus:outline-none">
                Join Our Movement
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </Panel>
  );
};
