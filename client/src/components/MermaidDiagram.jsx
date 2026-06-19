import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with your preferred theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark', // 'default', 'forest', 'dark', 'neutral'
  securityLevel: 'loose',
});

function MermaidDiagram({ chart }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    const renderChart = async () => {
      if (!chart || !containerRef.current) return;

      try {
        // Generate a unique ID for the mermaid render instance
        const id = `mermaid-chart-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render the SVG string
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
      } catch (error) {
        console.error("Mermaid rendering failed:", error);
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div 
      className="flex justify-center w-full overflow-x-auto py-8"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
}

export default MermaidDiagram;