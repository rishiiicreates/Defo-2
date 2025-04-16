import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { setupChartAnimation } from "@/lib/animations";
import { DeforestationStat } from "@shared/schema";

const DeforestationChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<SVGRectElement[]>([]);

  const { data: deforestationStats, isLoading } = useQuery<DeforestationStat[]>({
    queryKey: ['/api/deforestation-stats'],
  });

  // Chart configuration
  const regions = ['South America', 'Africa', 'Asia', 'Other'];
  const colors = ['#FF5722', '#FF9800', '#FFC107', '#8BC34A'];
  
  // If data is available, replace regions with actual data
  const chartData = deforestationStats || regions.map((region, i) => ({
    id: i,
    region,
    year: 2023,
    hectaresLost: 1000000 + Math.random() * 2000000,
    percentOfTotal: 15 + Math.floor(Math.random() * 20)
  }));

  useEffect(() => {
    if (svgRef.current && containerRef.current && barRefs.current.length > 0) {
      setupChartAnimation(barRefs.current, containerRef.current);
    }
  }, [deforestationStats]);

  if (isLoading) {
    return (
      <div className="w-full h-48 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
        <div className="animate-pulse text-forest-light">Loading data...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-48 relative">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 500 200"
        className="overflow-visible"
      >
        {/* X and Y axes */}
        <line x1="40" y1="160" x2="460" y2="160" stroke="white" strokeWidth="2" />
        <line x1="40" y1="20" x2="40" y2="160" stroke="white" strokeWidth="2" />
        
        {/* Chart title */}
        <text x="40" y="15" fill="white" fontSize="14">
          Hectares Lost (in millions)
        </text>
        
        {/* Y-axis labels */}
        <text x="35" y="160" fill="white" fontSize="10" textAnchor="end">0</text>
        <text x="35" y="120" fill="white" fontSize="10" textAnchor="end">1M</text>
        <text x="35" y="80" fill="white" fontSize="10" textAnchor="end">2M</text>
        <text x="35" y="40" fill="white" fontSize="10" textAnchor="end">3M</text>
        
        {/* Bars and labels */}
        {chartData.map((stat, i) => {
          const value = typeof stat.hectaresLost === 'number' 
            ? Math.min(140, stat.hectaresLost / 25000) 
            : 70 + Math.random() * 60;
          
          return (
            <g key={i}>
              <rect
                ref={(el) => {
                  if (el) barRefs.current[i] = el;
                }}
                x={80 + i * 100}
                y={160 - value}
                width="40"
                height={value}
                fill={colors[i % colors.length]}
                className="interactive-element"
              />
              <text
                x={100 + i * 100}
                y="180"
                textAnchor="middle"
                fill="white"
                fontSize="12"
              >
                {stat.region}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DeforestationChart;
