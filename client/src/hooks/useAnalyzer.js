import {useContext} from "react";
import {AnalyzeCode} from "../services/analyzer.api"
import { AnalyzerContext } from "../context/analyzer.context";

export const useAnalyzer = () => {
    const context = useContext(AnalyzerContext);

    const {setIsDetecting, setDetectedResults, setLogs} = context;

    const handleAnalyzeCode = async() => {
        setIsDetecting(true);
        setDetectedResults('');
        setLogs(['> Scanning codes...', '> Mapping dependency graphs...', '> Identifying issues...']);
    
        try{
            const data = await AnalyzeCode();
            setLogs(prev => [...prev, '> AI Drafting Code Patterns...', '> Finalizing core issues...']);

            setDetectedResults(data.answer);
            console.log(data.answer);
        } catch(err){
            console.log(err);
            setDetectedResults('### Error\nFailed to generate Architecture. Make sure your repository is fully indexed.');
        } finally{
            setIsDetecting(false);
        }
    };

    
    return {
        handleAnalyzeCode
    }
};
