import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ForestConsciousness from "@/pages/ForestConsciousness";
import { useEffect } from "react";

function App() {
  // Set cursor to default since ForestConsciousness handles its own cursor effects
  useEffect(() => {
    document.body.style.cursor = "default";
    
    // Apply special styles for immersive experience
    document.documentElement.style.setProperty('--scroll-behavior', 'smooth');
    document.documentElement.style.setProperty('--overflow', 'hidden');
    
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#1a2e1a'; // Dark forest green
    document.head.appendChild(meta);
    
    return () => {
      document.documentElement.style.removeProperty('--scroll-behavior');
      document.documentElement.style.removeProperty('--overflow');
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <>
      <Switch>
        <Route path="/" component={ForestConsciousness} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
