import {useContext} from "react";
import { generateArchitecture } from "../services/architecture.api";
import { ArchitectureContext } from "../context/architecture.context";
import { WorkspaceContext } from "../context/workspace.context";

export const useArchitecture = () => {
    const context = useContext(ArchitectureContext);

    const {setIsAnalyzing, setArchitectureData, setLogs} = context;

    const handleAnalyze = async() => {
        setIsAnalyzing(true);
        setArchitectureData('');
        setLogs(['> Scanning codes...', '> Mapping dependency graphs...', '> Identifying core architectural patterns...']);
    
        try{
            const data = await generateArchitecture();
            setLogs(prev => [...prev, '> AI Drafting architecture...', '> Finalizing system architecture...']);

            setArchitectureData(data.answer);
            console.log(data.answer);
        } catch(err){
            console.log(err);
            setArchitectureData('### Error\nFailed to generate Architecture. Make sure your repository is fully indexed.');
        } finally{
            setIsAnalyzing(false);
        }
    };

    
    return {
        handleAnalyze
    }
};

export const generateMermaidSyntax = (data) => {
  if (!data) return '';

  // Start a Top-Down graph
  let mermaidStr = 'graph TD\n';

  // 1. Define Nodes (Creating the boxes)
  // We use different shapes and IDs for visual clarity
  const frontendId = 'FE';
  const backendId = 'BE';
  const dbId = 'DB';
  const cloudId = 'CL';

  mermaidStr += `  ${frontendId}["📱 Client / Frontend<br/>${data.frontend?.join(', ') || 'None'}"]\n`;
  mermaidStr += `  ${backendId}["⚙️ Server / Backend<br/>${data.backend?.join(', ') || 'None'}"]\n`;
  
  if (data.database?.length) {
    // Database gets a cylindrical shape [( )]
    mermaidStr += `  ${dbId}[("🗄️ Database<br/>${data.database.join(', ')}")]\n`;
  }
  
  if (data.cloud?.length) {
    mermaidStr += `  ${cloudId}["☁️ Cloud & Infra<br/>${data.cloud.join(', ')}"]\n`;
  }

  // 2. Define Relationships (Drawing the arrows)
  mermaidStr += `\n  %% Data Flow Connections\n`;
  
  if (data.frontend?.length && data.backend?.length) {
    mermaidStr += `  ${frontendId} <-->|API Calls| ${backendId}\n`;
  }

  if (data.backend?.length && data.database?.length) {
    mermaidStr += `  ${backendId} <-->|Read/Write| ${dbId}\n`;
  }

  if (data.cloud?.length) {
    mermaidStr += `  ${cloudId} -.->|Hosts| ${frontendId}\n`;
    mermaidStr += `  ${cloudId} -.->|Hosts| ${backendId}\n`;
  }

  // 3. Optional: Add custom styling classes
  mermaidStr += `\n  classDef client fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#fff;\n`;
  mermaidStr += `  classDef server fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;\n`;
  mermaidStr += `  classDef db fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px,color:#fff;\n`;
  mermaidStr += `  classDef infra fill:#7c2d12,stroke:#f97316,stroke-width:2px,color:#fff;\n`;

  mermaidStr += `\n  class ${frontendId} client;\n`;
  mermaidStr += `  class ${backendId} server;\n`;
  if (data.database?.length) mermaidStr += `  class ${dbId} db;\n`;
  if (data.cloud?.length) mermaidStr += `  class ${cloudId} infra;\n`;

  return mermaidStr;
};