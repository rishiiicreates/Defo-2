import { useRef, useEffect, useState } from "react";
import HorizontalScroller from "@/components/HorizontalScroller";
import { 
  IntroPanel, 
  RainforestPanel, 
  DeforestationPanel, 
  ConsequencesPanel, 
  SolutionsPanel 
} from "@/components/Panels";
import TreeCounter from "@/components/visualizations/TreeCounter";
import ParticleCanvas from "@/components/ParticleCanvas";
import SoundControl from "@/components/SoundControl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DeforestationJourney = () => {
  const forestJourneyRef = useRef<HTMLDivElement>(null);
  const [isSoundActive, setIsSoundActive] = useState(false);

  // Set up page title
  useEffect(() => {
    document.title = "Forest Guardian - Save Our Forests";
  }, []);

  return (
    <div ref={forestJourneyRef} className="min-h-screen overflow-hidden">
      {/* Particle canvas for background effects */}
      <ParticleCanvas 
        count={50}
        color="#4CAF50"
        size={[1, 5]}
        speed={[-1.5, 1.5]}
        opacity={[0.1, 0.5]}
      />
      
      {/* Tree counter */}
      <TreeCounter treesPerSecond={30} />
      
      {/* Sound control */}
      <SoundControl onToggle={(active) => setIsSoundActive(active)} />
      
      {/* Main horizontal scrolling experience */}
      <HorizontalScroller id="forest-journey">
        <IntroPanel />
        <RainforestPanel />
        <DeforestationPanel />
        <ConsequencesPanel />
        <SolutionsPanel />
      </HorizontalScroller>
      
      {/* Audio element (muted by default, activated by sound control) */}
      {isSoundActive && (
        <audio 
          src="https://cdn.pixabay.com/download/audio/2022/01/15/audio_bf115a6929.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3" 
          autoPlay 
          loop
        />
      )}
    </div>
  );
};

export default DeforestationJourney;
