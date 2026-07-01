import {useContext} from "react";
import { generateReadme } from "../api/readme.api";
import {ReadmeContext} from "../context/readme.context";
import { AiSessionContext } from "../context/ai-session.context";
import useToast from "./useToast";

export const useReadme = () => {
    const context = useContext(ReadmeContext);
    const {setIsGenerating, setGeneratedMarkdown, setLogs} = context;
    const { repoUrl } = useContext(AiSessionContext);
    const {showError} = useToast();
    
    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedMarkdown('');
        setLogs(['> Initializing README generation sequence...', '> Analyzing repository structure...', '> Extracting core components and dependencies...']);

        try{
            const data = await generateReadme(repoUrl);
            setLogs(prev => [...prev, '> AI Drafting markdown...', '> Finalizing documentation...']);
            
            setGeneratedMarkdown(data.answer);
            // setReadme('readme');
        } catch(err){
            console.error(err);    
            setGeneratedMarkdown('### Error\nFailed to generate README. Make sure your repository is fully indexed.');
            showError("Please check your API KEY Validity");
        } finally {
            setIsGenerating(false);
        }
    };

    
    return {
        handleGenerate
    }
};