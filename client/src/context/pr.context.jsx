
import { createContext, useState} from "react";

export const PrAnalyzerContext = createContext();

export const PrAnalyzerProvider = ({children}) => {
    const [prUrl, setPrUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');

    return (
        <PrAnalyzerContext.Provider value={{prUrl, setPrUrl, loading, setLoading, analysis, 
            setAnalysis, error, setError
        }}>
            {children}
        </PrAnalyzerContext.Provider>
    )
}





