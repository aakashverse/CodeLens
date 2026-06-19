import { createContext, useState} from "react";

export const AnalyzerContext = createContext();

export const AnalyzerProvider = ({children}) => {
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectedResults, setDetectedResults] = useState('');
    const [logs, setLogs] = useState([]);

    return (
        <AnalyzerContext.Provider value={{isDetecting, setIsDetecting, detectedResults, setDetectedResults, logs, setLogs}}>
            {children}
        </AnalyzerContext.Provider>
    )
}