import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const setupHorizontalScroll = (sectionRef: React.RefObject<HTMLElement>) => {
  if (!sectionRef.current) return;
  
  // Setup horizontal scrolling for desktop
  if (window.innerWidth > 768) {
    return gsap.to(sectionRef.current, {
      x: () => -(sectionRef.current!.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        end: () => `+=${sectionRef.current!.scrollWidth}`,
        invalidateOnRefresh: true,
      },
    });
  }
};

export const setupProgressBar = (sectionRef: React.RefObject<HTMLElement>, progressBarRef: React.RefObject<HTMLElement>) => {
  if (!sectionRef.current || !progressBarRef.current) return;
  
  return ScrollTrigger.create({
    trigger: sectionRef.current,
    start: "top top",
    end: () => `+=${sectionRef.current!.scrollWidth}`,
    onUpdate: (self) => {
      gsap.to(progressBarRef.current, { width: `${self.progress * 100}%`, duration: 0.3 });
    },
  });
};

export const setupParallaxEffect = (layer: HTMLElement, depth: number, sectionRef: React.RefObject<HTMLElement>) => {
  if (!sectionRef.current) return;
  
  return gsap.to(layer, {
    x: () => sectionRef.current!.scrollWidth * depth * -1,
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${sectionRef.current!.scrollWidth}`,
      scrub: true,
    },
  });
};

export const setupFadeInAnimation = (element: HTMLElement) => {
  return ScrollTrigger.create({
    trigger: element,
    start: "top 80%",
    toggleClass: "visible",
    once: true,
  });
};

export const setupChartAnimation = (bars: HTMLElement[], container: HTMLElement) => {
  bars.forEach((bar, i) => {
    gsap.from(bar, {
      height: 0,
      y: parseFloat(bar.getAttribute("y") || "0") + parseFloat(bar.getAttribute("height") || "0"),
      duration: 1.5,
      delay: i * 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
      },
    });
  });
};

export const animateValue = (
  element: HTMLElement, 
  start: number, 
  end: number, 
  duration: number,
  formatter: (value: number) => string = (value) => value.toString()
) => {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = Math.floor(progress * (end - start) + start);
    element.textContent = formatter(currentValue);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};
