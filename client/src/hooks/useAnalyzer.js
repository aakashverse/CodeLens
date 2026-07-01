import {useContext} from "react";
import {AnalyzeCode} from "../api/analyzer.api"
import { AnalyzerContext } from "../context/analyzer.context";
import {AiSessionContext} from "../context/ai-session.context";
import useToast from "./useToast";

export const useAnalyzer = () => {
    const context = useContext(AnalyzerContext);
    const { repoUrl } = useContext(AiSessionContext);
    const {setIsDetecting, setDetectedResults, setLogs} = context;
    const {showError} = useToast();

    const handleAnalyzeCode = async() => {
        setIsDetecting(true);
        setDetectedResults('');
        setLogs(['> Scanning codes...', '> Mapping dependency graphs...', '> Identifying issues...']);
    
        try{
            const data = await AnalyzeCode(repoUrl);
            setLogs(prev => [...prev, '> AI Drafting Code Patterns...', '> Finalizing core issues...']);

            setDetectedResults(data.answer);
        } catch(err){
            setDetectedResults('# Error\nFailed to generate code Analysis. Make sure your repository is fully indexed.');
            showError("Please check your API KEY Validity");
        } finally{
            setIsDetecting(false);
        }
    };

    
    return {
        handleAnalyzeCode
    }
};
