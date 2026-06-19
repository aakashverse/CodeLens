import {createContext, useState} from "react";

export const ArchitectureContext = createContext();


export const ArchitectureProvider = ({children}) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [architectureData, setArchitectureData] = useState('');
    const [logs, setLogs] = useState([]);

    return (
        <ArchitectureContext.Provider value = {{isAnalyzing, setIsAnalyzing, architectureData, setArchitectureData, logs, setLogs}}>
            {children}
        </ArchitectureContext.Provider>
    )
};